const express = require('express')
const route = express.Router()
const path = require('path');
const verfyJWT = require('../middlewares/verifyJWT');
const accountRouter = require('./accountRoute');

const rootRouter = (app) => {


    /** Routing home */
    app.use('/',

        route.get('/', (req, res) => {
            return res.status(200).sendFile(path.join(__dirname, '..', 'public', 'home.html'))
        })
    )


    /** Routing non-home routes */ 

    app.use('/auth', require('./auth'))
    app.use('/register', require('./register'))
    app.use('/logout', require('./logout'))

    /** Verifying auth to serve the below protected routes */
    app.use('/account', verfyJWT)
    app.use('/account',require('./accountRoute'))



    /** Routing protected routes */

}


module.exports = rootRouter