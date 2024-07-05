const asyncHandler = require('express-async-handler')
const validator = require('email-validator')
const User = require('../models/userModel')
const bcrypt = require('bcryptjs');

const generateToken = require('../utilities/generateJWTtoken')


const searchAllUsers = asyncHandler(async (req,res) => {
    
})


const registerUser = asyncHandler(async (req,res) => {
    // console.log(req.body);

    const {name ,email, password} = req.body;

    if(!name || !password || !email){
        // res.status(400).send("Please enter all the fields.");
        res.status(400);
        throw new Error("Please enter all the fields.");
    }

    else if(validator.validate(email) === false){
        res.status(400);
        throw new Error("Please enter valid email");
    }   
    
    const foundUser = await User.findOne({email : email});

    if(foundUser){
        res.status(400);
        throw new Error("User already exists.");
    }

    // Hashing Password
    const hashedPassword = await bcrypt.hash(password,await bcrypt.genSalt(10));


    const user = await User.create({
        name : name,
        email : email,
        password : hashedPassword
    })

    await user.save();

    if(user){
        console.log(user,"created successfully!");

        const token =  generateToken(user._id);
        console.log("signup : ",token);

        res.status(200).json({
            name : user.name,
            email : user.email,
            token : token,
            _id : user._id
        });
    }
    else{
        res.status(500);
        throw new Error("Error in creating user");
    }
})

// -----------------login ----------------------

const loginUser = asyncHandler(async (req,res) => {
    // console.log(req.body);

    const {email, password} = req.body;

    if(!password || !email){
        // res.status(400).send("Please enter all the fields.");
        res.status(400);
        throw new Error("Please enter all the fields.");
    }

    else if(validator.validate(email) === false){
        res.status(400);
        throw new Error("Please enter valid email");
    }   
    
    const foundUser = await User.findOne({email : email});

    // console.log("user is ");
    // console.log(foundUser);

    if(foundUser && (await bcrypt.compare(password,foundUser.password))){
        // console.log(foundUser," fetched successfully!");
        
        const token = generateToken(foundUser._id);
        // console.log("login : ",token);

        res.status(200).send({
            name : foundUser.name,
            email : foundUser.email,
            token : token,
            _id : foundUser._id
        });
        
    }

    else if(!foundUser){
        res.status(400);
        throw new Error("User doesn't exists.");
    }
    else{
        res.status(400);
        throw new Error("Invalid password");   
    }
})


const fetchUserByName = asyncHandler(async(req,res)=>{
    console.log(req.query.search);
    const otherUserName = req.query.search;

    const keyword = otherUserName ?
    {
        $or : [
            {name : {$regex : otherUserName, $options : "i"} },
            {email : {$regex : otherUserName, $options : "i"} }
        ]
    } : {};

    const users = await User.find(keyword)
    .find({_id : {$ne : req.user._id}})
    .select("name email _id");
    
    res.status(200).json(users);

})

module.exports = {registerUser, loginUser,fetchUserByName}