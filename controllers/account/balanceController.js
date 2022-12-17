const Account = require('../../model/Account');

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

const updateAccountBalance = (req, res) => {


    res.send('Account balanace updated!')
}





module.exports = {getAccountBalance, updateAccountBalance}