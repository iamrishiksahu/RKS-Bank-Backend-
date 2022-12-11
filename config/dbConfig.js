const mongoose = require('mongoose')

const connectDB = async () => {

    try{
        mongoose.set('strictQuery', true).connect(process.env.DATABASE_URL)
    }catch (err){
        console.error(err)
    }
}

module.exports = connectDB