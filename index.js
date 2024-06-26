const express = require('express');
const dotenv = require('dotenv');
const EstablishConnection = require('./Database/Connection');
const POST_Routes = require('./Routes/POST_Routes');
const cors = require('cors');
const GET_Routes = require('./Routes/GET_Routes');
const http = require('http');
const socketIo = require('socket.io');
const { default: axios } = require('axios');
const userModel = require('./Database/Models/UserModel');
const ChatModel = require('./Database/Models/ChatModel');

const app = express();
const server = http.createServer(app);
const io = socketIo(server,{
    cors : {
        origin : "*",
        methods : ["GET", "POST"]
    }
});

app.use(express.json())
app.use(cors())
dotenv.config();

app.get('/', (req,res)=>{
    res.json({
        success : true,
        message : "Hellow World, Server is up and running :)"
    })
})

app.use('/api', POST_Routes);
app.use('/api', GET_Routes)

const PORT = process.env.PORT || 5500;

server.listen(PORT, async()=>{
    console.log("Server is initiating...");
    await EstablishConnection(process.env.DB_URL);
    console.log("Server is up and runnin on PORT : "+PORT)
})

io.on('connection', (socket)=>{
    console.log("New user connected :)");
    socket.broadcast.emit('online_status', true);
    socket.on('get-online-status', async(data)=>{
        //console.log(data)
        const OnlineUser = await userModel.findOne({
            _id : data.userID
        })
        if( OnlineUser.socket_id){
            if(OnlineUser.socket_id!="")
            {
                
                console.log(OnlineUser.username+" is online")
                socket.emit('online_status',true);
            }
        }

        else{
            socket.emit('online_status', false)
        }
    })

    socket.on('online',async data => {
        //save the socket.id to mongo db
        try {
            const currentUser = await userModel.findById(data.userid);
            if (currentUser) {
                currentUser.socket_id = socket.id;
                await currentUser.save();
                console.log(`Socket ID ${socket.id} saved for user ${currentUser.username}`);
            } else {
                console.log(`User with ID ${data.userid} not found.`);
            }
        } catch (error) {
            console.error("Error saving socket ID:", error);
        }
    })


    //event to send message (in real time)
    socket.on('send-message',async data=>{
        //console.log(data)
        //find the Target User socket id from database
        const TargetUser = await userModel.findOne({
            _id : data.targetUserID
        })
        if(TargetUser){
            const TargetUserSocketID = TargetUser.socket_id;

            
            
            const fromUser = data.fromUserID;
            const targetUser = data.targetUserID;
            
            //finding previous chatData
            const ChatData = await ChatModel.findOne({
                Users : {
                    $all : [fromUser, targetUser]
                }
            })
            
            if(ChatData){
                let MessageObject = {
                    from : fromUser,
                    to : targetUser,
                    content : data.content,
                    seen : false,
                    timestamp : new Date(),
                    chatID : ChatData.Chats[ChatData.Chats.length-1]._id
                }
                ChatData.Chats.push(MessageObject)
                await ChatData.save();
                io.to(TargetUserSocketID).emit('private-message', MessageObject)
                socket.emit('private-message-sent', MessageObject)
                
            }


        }

        
    })

    //Still under test
    socket.on('mark-seen',async chatID=>{
        const CurrentChat = await ChatModel.findOne({
            'Chats._id': chatID
        })
        if (CurrentChat) {
            if(CurrentChat.Chats.length > 0){
                CurrentChat.Chats[CurrentChat.Chats.length-1].seen = true;
                await CurrentChat.save()
                
            }
        } else {
            console.log('Chat not found.');
        }

    })


    socket.on('disconnect', async()=>{
        console.log("User with ID : "+socket.id+" disconnected :(");
        socket.broadcast.emit('offline', false);
        try {
            const userWithSocketId = await userModel.findOne({ socket_id: socket.id });
            if (userWithSocketId) {
                userWithSocketId.socket_id = "";
                await userWithSocketId.save();
                console.log(`Socket ID removed for user ${userWithSocketId.username}`);
            } else {
                console.log(`No user found with Socket ID ${socket.id}`);
            }
        } catch (error) {
            console.error("Error removing socket ID:", error);
        }

    })
})