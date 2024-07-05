
const express = require("express");
const http = require('http')
const connectDB = require('./dbconnection/db') 
const dotenv = require('dotenv')
const userRoutes = require('./routes/userRoutes')
const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const {errorHandler , notFound} = require('./middlewares/errorMiddleware')
const authenticateUser = require('./middlewares/authMiddleware')
const cors = require('cors')
const { Server }  = require('socket.io')
const Chat = require('./models/chatModel')
const Message = require('./models/messageModel')


const PORT = process.env.PORT || 5000;
const app = express()
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin:process.env.FRONTEND_URL, // Origin of the frontend.
        methods:["GET","POST"],
    },
})

dotenv.config()
connectDB()

app.use(cors())
app.use(express.json())



app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);


app.use(notFound);
app.use(errorHandler);

var user_id_to_socket = {}
var socket_id_to_user_id = {}
var user_id_to_chat_ids = {}


function addToMapping(mapping,key,data){
    if(mapping[key]===undefined){
        mapping[key] = []
    }
    mapping[key].push(data);
}

io.on('connection',async (socket)=>{
    
    console.log('New connection : ',socket.id);

    socket.on('i-am-online',async(data)=>{
        console.log(`S : ${data.userId} [name ${data.name}] is online now`);
        socket.broadcast.emit('someone-joined',data);
    })

    socket.on('join-chat',async(data)=>{
        console.log(`[join chat] data got `,data);

        // perform operation in db
        var chat = 12;
        const foundChat = await Chat.findOne( { $or :[{user_ids : [data.my_id,data.other_user_id]},{user_ids : [data.other_user_id,data.my_id]}]});
        if(!foundChat){
            const newChat = await Chat.create({user_ids : [data.my_id,data.other_user_id]});
            console.log(`${newChat._id} chat created.`);
            chat = newChat;
        }
        else{
            chat = foundChat;
        }
        
        console.log("Fetched chat : ",chat);

        const chat_id = chat._id.toString();
        // console.log("Chat id ",chat_id);
        // console.log("Type ",typeof chat_id);
        socket.join(chat_id);
        socket.emit('receive-message',{content : 'You have joined the room successfully',chat_id : chat_id,sender : "-1"});
    })

    socket.on('send-message',async (data)=>{
        console.log(`Got messsage via [send-message] : `,data);

        const foundMessage = await Message.findOne({_id  : data._id});
        if(foundMessage){
            // console.log("found chat <send-m>");
            // const message = await Message.create({content : data.message,sender : data.userId});
            // const chat = await Chat.updateOne({_id : data.chat_id},{$push : {message_ids : message._id }});
            // console.log(chat);
            // console.log("message got  ",data.message);
            // console.log("message from  ",data.userId);
            // console.log("chat id ",data.chat_id);
            // socket.join(data.chat_id);
            socket.to(data.chat_id).emit('receive-message',foundMessage);
            console.log("sent");
        }
        else{
            // console.log("not found");
            // console.log("chat id ",data.chat_id);
            // socket.join(data.chat_id);
            socket.to(data.chat_id).emit('receive-message',data);
            console.log("err sent");
        }

        // io.to(data.chat_id).emit('receive-message',{message : data.message,chat_id : data.chat_id,userId : data.userId});
    })


    socket.on('send-broadcast-message',(data)=>{
        socket.broadcast.emit('receive-broadcast-message',data);
    })


    socket.on('join-group-chat',async(data)=>{
        console.log(`[join group chat] data got `,data);

        // perform operation in db
        const chat = data;
        // const foundChat = await Chat.findOne({_id : data._id});
        // if(!foundChat){
        //     const newChat = await Chat.create({user_ids : [data.my_id,data.other_user_id]});
        //     console.log(`${newChat._id} chat created.`);
        //     chat = newChat;
        // }
        // else{
        //     chat = foundChat;
        // }
        
        // console.log("Fetched chat : ",chat);

        const chat_id = chat._id.toString();
        // console.log("Chat id ",chat_id);
        // console.log("Type ",typeof chat_id);
        socket.join(chat_id);
        socket.emit('receive-message',{content : 'You have joined the room[group] successfully',chat_id : chat_id,sender : "-1"});
    })



    socket.on("disconnect", ()=>{ 
        console.log(`${socket.id} disconnected.`);  
    })
    // socket.on('i')
})


server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});