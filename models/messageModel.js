const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
    message_id : mongoose.Schema.Types.ObjectId,
    content : String,
    sender : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
    chat_id : {type : mongoose.Schema.Types.ObjectId, ref : 'Chat'},
},{
    timestamps : true
  }
)

const Message = mongoose.model("Message",messageSchema);

module.exports = Message;
