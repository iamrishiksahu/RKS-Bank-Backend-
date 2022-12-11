const mongoose = require('mongoose');

// const Schema = mongoose.Schema;
const User = new mongoose.Schema ({
    username: {
        type: String,
        required: true  
    },
    roles: {
        User: {
            type: Number,
            default: 1
        },
        Editor: Number,
        Admin: Number,

    },
    password: {
        type: String,
        required: true  
    },
    refreshToken: String
})

module.exports = mongoose.model('User', User)