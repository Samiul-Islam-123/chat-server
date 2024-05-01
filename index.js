const express = require('express');
const dotenv = require('dotenv');
const EstablishConnection = require('./Database/Connection');
const POST_Routes = require('./Routes/POST_Routes');
const cors = require('cors');
const GET_Routes = require('./Routes/GET_Routes');
const http = require('http');
const socketIo = require('socket.io');
const { default: axios } = require('axios');

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

    socket.on('test', async(request)=>{
        const response = await axios.get(`${process.env.API_URL}/api/my-contacts`, {
            headers : {
                userid : request.userid
            }
        });
        console.log(response.data);
    })

    socket.on('disconnect', ()=>{
        console.log("User with ID : "+socket.id+" disconnected :(");
    })
})