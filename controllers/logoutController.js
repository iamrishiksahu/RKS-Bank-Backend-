const User = require('../model/User')


const handleLogout = async (req, res) =>{


    //clear the cookie and set refreshToken to @null
    const cookies = req.cookies

    if(!cookies?.jwt){
        //no jwt cookie available
        return res.sendStatus(204)
    }

    const refreshToken = cookies.jwt

    // find user with this refresh token

    const foundUser = await User.findOne({refreshToken: refreshToken}).exec()

    if(!foundUser){
        //No user has this refresh token but it is present in the cokie

        //Simply clear the cookie and return
        res.clearCookie('jwt', {httpOnly: true})
        return res.sendStatus(204)
    }

    foundUser.refreshToken = ''

    const result = await foundUser.save()

    res.status(201).json({message: 'Logged out successfully!'})


}

module.exports = {handleLogout}