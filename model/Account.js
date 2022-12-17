const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({

    financial_info: {
        account_balance: {
            type: Number,
            default: 0
        },
        lien_amount: {
            type: Number,
            default: 0
        },
        credit_limit: {
            type: Number,
            default: 0
        },
        interest_rate: {
            type: Number,
            default: 0
        },
        min_balance: {
            type: Number,
            default: 0
        }
    },

    account_number: {
        type: Number,
    },
    account_type: String,
    currency: {
        type: String,
        default: 'INR'
    },
    account_holders: [Number], //customer ids
    address: String,
    home_branch: String,
    nominees: [String],
    creation_date: Date,
    updation_date: Date,
    schema_version: {
        type: Number,
        default: 1
    }

})

module.exports = mongoose.model('Account', accountSchema)