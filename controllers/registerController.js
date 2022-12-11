const bcrypt = require('bcrypt');
const User = require('../model/User');


const handleNewUser = async (req, res) => {

    const {username, password} = req.body

    if(!username || !password) return res.status(400).json({message: 'Username and password are required'})

    //check for conflict

    const foundUser = await User.findOne({username: username}).exec()

    if(foundUser) return res.status(409).json({message: 'Conflict: User already exists.'})

    const hashedPwd = await bcrypt.hash(password, 10)
    
    const newUser = await User.create({
        username: username,
        password: hashedPwd
    })

    console.log(newUser);

    res.status(201).json({message: `User ${username} created successfully!`})

}

module.exports = {handleNewUser}