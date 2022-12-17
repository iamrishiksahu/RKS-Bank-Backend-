const mongoose = require('mongoose')

const customerSchema = mongoose.Schema({


    firstname: {
        type: String,
        required: true
    },
    customer_id: Number,
    aadhaar: Number,
    lastname: String,
    address: String,
    mobile: Number,
    email: String,
    schema_version: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model('Customer', customerSchema)