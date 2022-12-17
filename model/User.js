const mongoose = require('mongoose');


// const Schema = mongoose.Schema;
const User = new mongoose.Schema ({
    username: {
        type: String,
        required: true  
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: String,

    aadhaar: {
        type: Number,
    },
    customer_id: {
        type: Number,
        required: true        
    },
    roles: {
        type: [Number],
        default: 1006 // Customer
    },
    password: {
        type: String,
        required: true  
    },
    refreshToken: String,
    schema_version: {
        type: Number,
        default: 1
    }
})

module.exports = mongoose.model('User', User)