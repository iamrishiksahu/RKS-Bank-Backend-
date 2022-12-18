const Account = require('../../model/Account');
const Customer = require('../../model/Customer');
const Transaction = require('../../model/Transaction')


const performTransaction = async (req, res) => {


    const { tr_from, tr_to, tr_notes, tr_ref, tr_type, tr_amt, tr_provider, tr_purpose } = req.body

    if (!tr_from || !tr_to || !tr_provider || !tr_amt) {
        return res.sendStatus(400) // Bad Request
    }

    if (tr_amt <= 0) {
        return res.json({ message: `Amount should be greater that 0.` })
    }

    //Debit Balance

    const senderAccountDetails = await Account.findOne({ account_number: tr_from })
        .catch((err) => {
            return res.status(500).json({ message: 'Something went wrong!', err })
        })

    //Get sender name

    const customer = await Customer.findOne({ aadhaar: senderAccountDetails.account_holders[0] }).catch(err => {
        return res.status(500).json({ message: `Something went wrong!`, err })
    })
    const customerID = customer.customer_id
    const acc_balance = senderAccountDetails.financial_info.account_balance

    if (acc_balance < tr_amt) {
        return res.json({ message: `Insufficient funds in the account ${senderAccountDetails.account_number}` })
    }

    const afterTransactionBalance = acc_balance - tr_amt
    senderAccountDetails.financial_info.account_balance = afterTransactionBalance
    await senderAccountDetails.save().catch(err => {
        return res.status(500).json({ message: 'Something went wrong!', err })
    })



    // Credit Balance

    const recieverAccountDetails = await Account.findOne({ account_number: tr_to })
        .catch(async (err) => {
            /** Reverse transaction */
            const args = {
                amount: tr_amt,
                reverse_debit: true,
                reverse_credit: false
            }
            await reverseTransaction(args, senderAccountDetails, null)
            return res.status(500).json({ message: 'Something went wrong!', err })
        })

    const rec_bal = recieverAccountDetails.financial_info.account_balance
    const aftrTrBal = rec_bal + tr_amt

    recieverAccountDetails.financial_info.account_balance = aftrTrBal
    await recieverAccountDetails.save().catch(async (err) => {
        /** Reverse transaction */
        const args = {
            amount: tr_amt,
            reverse_debit: true,
            reverse_credit: false
        }
        await reverseTransaction(args, senderAccountDetails, null)
        return res.status(500).json({ message: 'Something went wrong!', err })

    })


    /** Record a transaction */

    Transaction.create({
        transaction_id: Date.now().toString(16),
        transaction_status: 'SUCCESS', // SUCCESS | FAILURE | PENGING
        transaction_amt: tr_amt,
        reference_no: tr_ref, // Cheque No, UTR, etc
        transaction_from_acc: tr_from, // Debit Account
        transaction_to: tr_to, // A/c no / UPI / anything
        transaction_provider: tr_provider,
        // UPI | CHQ | CSHWDRL | CRDT | DEBITCARD | ATM | NEFT | RTGS | OTHERS
        transaction_purpose: tr_purpose,
        transaction_by: customerID, // Customer ID
        balance_after_transaction: afterTransactionBalance,
        transaction_date: Date.now(),
        transaction_notes: tr_notes,

    }).catch(async (err) => {
        /** Reverse transaction */
        const args = {
            amount: tr_amt,
            reverse_debit: true,
            reverse_credit: tr_to.isInteger
        }
        await reverseTransaction(args, senderAccountDetails, recieverAccountDetails)
        return res.status(500).json({ message: 'Something went wrong!', err })
    }).then((data) => {

        return res.status(301).json({ message: 'Transaction recorded succefully!', data })

    })


    const reverseTransaction = async (arg, sender, receiver) => {

        // Reversing debit
        sender.financial_info.account_balance = sender.financial_info.account_balance + arg.amount

        await sender.save().catch(err => {
            return res.status(500).json({ message: 'Transaction has failed! If your amount has been debited, kindly contact customer care immediatedly', err })

        })

        // Reversing the credit
        if (arg.reverse_credit) {

            receiver.financial_info.account_balanace = receiver.financial_info.account_balanace - arg.amount

            await receiver.save().catch(err => {
                return res.status(500).json({ message: 'Transaction has failed! If your amount has been debited, kindly contact customer care immediatedly', err })

            })
        }


    }
}

module.exports = { performTransaction }