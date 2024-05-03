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

    socket.on('disconnect', async()=>{
        console.log("User with ID : "+socket.id+" disconnected :(");
        socket.broadcast.emit('offline', { data : 'your data' });
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