const mongoose = require('mongoose')


const userSchema = mongoose.Schema(
    {
    user_id : {type : mongoose.Schema.Types.ObjectId},
    name : { type : String, required : true},
    email : { type : String, required : true, unique : true},
    password : { type : String, required : true},
    chat_ids : [{type : mongoose.Schema.Types.ObjectId, ref : 'Chat'}]
});


const User = mongoose.model("User",userSchema);

module.exports = User;