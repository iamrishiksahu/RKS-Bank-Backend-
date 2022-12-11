const bcrypt = require('bcrypt');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {

    const username = req.body.username
    const password = req.body.password

    if (!username || !password) return res.status(400).json({ message: 'Username and password are required!' })


    // Check for minimum characters when necessary, skipping now!


    // Check if the user exists in the DB

    const foundUser = await User.findOne({ username: username }).exec()

    if (!foundUser) {
        return res.status(401).json({ message: `No user found with username: ${username}` })
    }

    // Check that whether the password of the user matches.

    try {

        const match = await bcrypt.compare(password, foundUser.password);

        if (match) {
            //give access and generate access token using jwt
            const accessToken = jwt.sign({
                username: username,
                roles: foundUser.roles,
            }, process.env.JWT_ACCESS_TOKEN_SECRET,
                { expiresIn: '500s' })

            const refreshToken = jwt.sign({
                username: username,
                roles: foundUser.roles,
            }, process.env.JWT_ACCESS_TOKEN_SECRET,
                { expiresIn: '500s' })

            foundUser.refreshToken = refreshToken;
            const result = await foundUser.save();

            //Issuing cookie
            //HTTP-Only cookie is not available to JS. So cannot be stolen by hackers
            res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 }); //1day


            console.log(result);
            res.status(201).json({
                message: `Welcome ${username}! Logged in successfuly!`,
                accessToken: accessToken

            })

        } else {
            return res.status(401).json({ message: `Password for ${username} is incorrect!` })
        }
    } catch (err) {
        console.error(err)
        res.status(500).json({ message: err })
    }


}

module.exports = { handleLogin }