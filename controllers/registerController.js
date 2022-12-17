const bcrypt = require('bcrypt');
const User = require('../model/User');


const handleNewUser = async (req, res) => {

    const {username, password, firstname, lastname, aadhaar, roles} = req.body

    if(!username || !password ) return res.status(400).json({message: 'Username and password are required'})

    //check for conflict

    const foundUser = await User.findOne({username: username}).exec()

    if(foundUser) return res.status(409).json({message: 'Conflict: User already exists.'})

    // Create a customer ID
    const customer_id = Date.now()

    const hashedPwd = await bcrypt.hash(password, 10)
    
    const newUser = await User.create({
        username: username,
        firstname: firstname,
        lastname: lastname,
        aadhaar: aadhaar,
        roles: roles,
        password: hashedPwd,
        customer_id: customer_id
    }).catch(err => {
        // log the error
        console.log(err.name, err.message)
        res.sendStatus(400) // Bad Request
    })
    console.log(newUser);

    return res.status(201).json({message: `User ${username} created successfully!`})

}

module.exports = {handleNewUser}