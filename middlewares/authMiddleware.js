const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const asyncHandler = require('express-async-handler');

const authenticateUser = asyncHandler(async (req,res,next) => {
    
    // Get token from header
    const auth = req.headers.authorization;
    
    // console.log(auth);

    if(auth && auth.startsWith('Bearer')){

        try {
            const token = auth.split(" ")[1];
            // console.log("verifying : ",token);
            const decodedData = jwt.verify(token,process.env.JWT_SECRET_KEY);
            // console.log( "got user id : ", decodedData.user_id);
            req.user = await User.findOne({_id : (decodedData.user_id)});
            // console.log(req.user);
            next();
            return;
        } catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized,invalid token provided.');
        }
    }
    else{
        res.status(401);
        throw new Error('Not authorized,no token provided.');
    }
})

module.exports = authenticateUser