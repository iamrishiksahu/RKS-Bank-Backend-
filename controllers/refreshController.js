const jwt = require('jsonwebtoken');
const User = require('../model/User');


const handleRefresh = async (req, res) => {

    const cookie = req.cookies

    if(!cookie?.jwt) {
        // refresh token not available on cookie
        
        return res.sendStatus(401)

    }

    const refreshToken = cookie.jwt

    const foundUser = await User.findOne({refreshToken: refreshToken}).exec()

    if(!foundUser){
        return res.status(403).json({message: 'User not found!'})
    }


    // Now validate the refresh token

    jwt.verify(
        refreshToken, 
        process.env.JWT_REFRESH_TOKEN_SECRET, 
        (err, decoded) =>{
            if(err || decoded.username !== foundUser.username) return res.sendStatus(403)

            const accessToken = jwt.sign({
                username: decoded.username,
                roles: decoded.roles
            }, process.env.JWT_ACCESS_TOKEN_SECRET, {expiresIn: '500s'})

            res.json({accessToken: accessToken})


        })


}

module.exports = {handleRefresh}