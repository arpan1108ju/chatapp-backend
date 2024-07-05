const jwt = require('jsonwebtoken')

const generateToken = (id)=>{
    const key = process.env.JWT_SECRET_KEY;
    // console.log("key : ",key);
    const token =  jwt.sign({
        user_id : id
    },key);
    return token;
}

module.exports = generateToken;