const { format } = require('date-fns');
const { ALLOWED_FOR_ACCOUNT_CREATION, ALLOWED_FOR_ACCOUNT_DELETION } = require('../../config/allowedRoles');
const Account = require('../../model/Account');
const User = require('../../model/User');
const Customer = require('../../model/Customer');

const getAccountBalance = async (req, res) => {
    
    const {account_number} = req.body

    if(!account_number){
        return res.sendStatus(400) // Bad request
    }

    const accountDetails = await Account.findOne({ account_number: account_number })
    .catch((err) => {
        return res.status(500).json({ message: 'Something went wrong!', err })
    })

    return res.status(201).json({balance: accountDetails.financial_info.account_balance}) 
}

const getAccountInfo = async (req, res) => {

    const {account_number} = req.body

    if(!account_number){
        return res.sendStatus(400) // Bad request
    }

    const accountDetails = await Account.findOne({ account_number: account_number })
    .catch((err) => {
        return res.status(500).json({ message: 'Something went wrong!', err })
    })

    return res.status(201).json({accountDetails})
}


const updateAccountInfo = async (req, res) => {

    const { account_number, accountHolders, accType, currency, homeBranch, cifn, nominees } = req.body

    const accountDetails = await Account.findOne({ account_number: account_number })
        .catch((err) => {
            return res.status(500).json({ message: 'Something went wrong!', err })
        })

  



    res.send(`Date created: ${creationDate}`)
}

const createNewAccount = async (req, res) => {


    // Verify the user role first that the user should be a bank admin

    if (!req?.roles) {
        return res.sendStatus(403) // Forbidden
    }

    let isAuthorized = false
    req.roles.map((item) => {
        if (ALLOWED_FOR_ACCOUNT_CREATION.includes(item)) {
            isAuthorized = true
        }
    })

    if (!isAuthorized) return res.sendStatus(401) // Unauthorized


    /** Extract parameters from request */

    const { accountHolders, accType, homeBranch, nominees, currency, accAddress } = req.body

    if (!accountHolders || !accType || !homeBranch) res.sendStatus(400)

    /** Check if account already exists */

    for (let i = 0; i < accountHolders.length; i++) {
        let person = accountHolders[i]
        const aadhaar = person.aadhaar

        const foundAccount = await Account.findOne({ account_holders: aadhaar }).exec()
        if (foundAccount) {

            return res.status(409).json({ message: `Account already exists for aadhaar: ${aadhaar} having account number - ${foundAccount.account_number}` })
        }
    }


    /** If reached here, means the proposed holders doesnot have any account */

    /** Create customers first */

    accountHolders.map(async (person) => {

        const createdUser = await Customer.create({
            firstname: person.firstname,
            lastname: person.lastname,
            address: person.address,
            customer_id: Date.now(),
            aadhaar: person.aadhaar,
            mobile: person.mobile,
            email: person.email,
        }).then((data) => {

        }).catch((err) => {
            return res.status(500).json({ message: 'something went wrong!', err })
        })
    })

    /** once the customers are created, create an account */

    // Generate Account Number
    //Temporarily
    const accNmbr = Date.now()

    const accoundHoldersAadhaar = accountHolders.map(person => person.aadhaar)

    const result = await Account.create({

        account_holders: accoundHoldersAadhaar,
        account_type: accType,
        account_number: accNmbr,
        currency: currency,
        home_branch: homeBranch,
        address: accAddress,
        nominees: nominees,
        cif_number: parseInt(Date.now().toString().substring(0, 5)),
        creation_date: Date.now(),
        updation_date: Date.now()


    }).catch(err => {
        return res.status(500).json({ error_name: err.name, message: err.message })
    }).then((data) => {

        return res.json({ message: `Account created successfully!`, account_details: data })

    })

}


const deleteAccount = async (req, res) => {


    /** check for request */

    if (!req?.roles) {
        return res.sendStatus(401) // Unauthorized
    }

    /** Current user is authorized to delete the account */

    let isAuthorized = false

    req.roles.map(item => {
        if (ALLOWED_FOR_ACCOUNT_DELETION.includes(item)) {
            isAuthorized = true
        }
    })

    if (!isAuthorized) {
        return res.sendStatus(401) // Unauthorized
    }

    /** Extract account number to be deleted from request */
    const { account_number } = req.body

    if (!account_number) {
        return res.sendStatus(400) // Bad request
    }

    /** Start the deletion process */

    await Account.deleteOne({ account_number: account_number }).catch((err) => {
        return res.status(500).json({ message: 'Something went wrong!', err })
    }).then((data) => {
        return res.status(201).json({ message: `Account with account number - ${account_number} deleted successfully!` })
    })
}

module.exports = { getAccountBalance, getAccountInfo, updateAccountInfo, createNewAccount, deleteAccount }