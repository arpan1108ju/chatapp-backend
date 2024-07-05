const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    chat_name : {type : String},
    chat_id : {type : mongoose.Schema.Types.ObjectId},
    user_ids : [{type : mongoose.Schema.Types.ObjectId, ref : 'User'}],
    message_ids : [{type : mongoose.Schema.Types.ObjectId, ref : 'Message'}]
 
})

const Chat = mongoose.model('Chat',chatSchema);

module.exports = Chat;