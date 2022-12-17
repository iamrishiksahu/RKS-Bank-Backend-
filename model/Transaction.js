const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema({

    transaction_id: String,
    transaction_status: String, // SUCCESS | FAILURE | PENGING
    transaction_amt: Number,
    reference_no: String, // Cheque No, UTR, etc
    transaction_from_acc: Number, // Debit Account
    transaction_to: Number, // A/c no 
    transaction_provider: String, 
    // UPI | CHQ | CSHWDRL | CRDT | DEBITCARD | ATM | NEFT | RTGS | OTHERS
    transaction_purpose: String,
    transaction_by: Number, // Customer ID
    balance_after_transaction: Number,
    transaction_date: Date,
    transaction_notes: String,
    schema_version: {
        type: Number,
        default: 1
    }


})

module.exports = mongoose.model('Transaction', transactionSchema)