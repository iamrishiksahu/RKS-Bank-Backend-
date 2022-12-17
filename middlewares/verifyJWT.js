const jwt = require('jsonwebtoken')

const verifyJWT = async (req,res, next) => {


    const data = req.headers.authorization || req.headers.Authorization
    
    if(!data?.startsWith('Bearer')) return res.sendStatus(401) // Unauthorized

    const token = data.split(' ')[1]

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, decoded) => {

        if(err) return res.sendStatus(403) // Something went wrong
        req.username = decoded.userInfo.username,
        req.roles = decoded.userInfo.roles

        next()
    })

}

module.exports = verifyJWT