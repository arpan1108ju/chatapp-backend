const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')
const Message = require('../models/messageModel')
const mongoose = require('mongoose')

const saveMessage = asyncHandler(async(req,res)=>{
    
    const data = req.body;
    console.log(data);
    // res.json(req.body);
    // return;

    const foundChat = await Chat.findOne({_id  : data.chat_id});
    if(foundChat){
        console.log("found chat <send-m>");
        const message = await Message.create({content : data.message,sender : data.userId,chat_id : foundChat._id});
        const chat = await Chat.updateOne({_id : data.chat_id},{$push : {message_ids : message._id }});
        console.log(chat);
        console.log("message got  ",data.message);
        console.log("message from  ",data.userId);
        console.log("chat id ",data.chat_id);
        // socket.join(data.chat_id);

        res.send(message);
    }
    else{
        res.status(400);
        throw new Error("Error in finding chat");
    }

})



module.exports = {saveMessage}