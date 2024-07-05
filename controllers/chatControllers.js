const asyncHandler = require('express-async-handler')
const Chat = require('../models/chatModel')
const User = require('../models/userModel')
const Message = require('../models/messageModel')
const mongoose = require('mongoose')

const fetchChat = asyncHandler(async(req,res)=>{
        

    const data = {
        my_id : req.user._id,
        other_user_id : req.body.other_user_id
    }


    const foundChat = await Chat.findOne( { $or :[{user_ids : [data.my_id,data.other_user_id]},{user_ids : [data.other_user_id,data.my_id]}]});
    if(!foundChat){
        const newChat = await Chat.create({user_ids : [data.my_id,data.other_user_id]});
        console.log(`${newChat._id} chat created.`);

        await newChat.save();

        const chat = await newChat.populate("message_ids");

        console.log("New single chat created succesfully : ",chat);
        return res.status(201).json(chat);

    }
    else{

        const chat = await foundChat.populate("message_ids");

        console.log("found chat succesfully",foundChat);
        res.status(202).send(foundChat);
        return;
    }
})

const getChats = asyncHandler(async(req,res)=>{

    res.send("Got chats succesfully");
})

const createGroupChat = asyncHandler(async(req,res)=>{
    const data = {
        my_id : req.user._id,
        other_user_ids : req.body.other_user_ids,
        name : req.body.name
    }


    const newChat = await Chat.create({chat_name : data.name,user_ids : [data.my_id,...data.other_user_ids]});
    console.log(`${newChat._id} groupchat created.`);

    await newChat.save();

    // const chat = await newChat.populate("message_ids");
    const chat = newChat;

    console.log("New group chat created succesfully : ",chat);
    return res.status(201).json(chat);
        
})

const fetchGroupChat = asyncHandler(async(req,res)=>{
    const data = {
       chat_id : req.body.chat_id
    }


    const newChat = await Chat.findOne({_id : data.chat_id});
    console.log(`${newChat._id} groupchat found.`);

    await newChat.save();

    const chat = await newChat.populate("message_ids");

    console.log("New Group chat fetched succesfully : ",chat);
    return res.status(202).json(chat);
        
})

const fetchGroupChatByName = asyncHandler(async(req,res)=>{
    console.log(req.query.search);
    const chatname = req.query.search;

    const keyword = chatname ?
    {chat_name : {$regex : chatname, $options : "i"} }
    : {};

    const chats = await Chat.find(keyword).populate("message_ids");
    console.log("sending ",chats);
    res.status(200).json(chats);
})


module.exports = {fetchChat,getChats,createGroupChat,fetchGroupChat,fetchGroupChatByName}