const express = require('express');
const dotenv = require('dotenv');
const EstablishConnection = require('./Database/Connection');
const POST_Routes = require('./Routes/POST_Routes');
const cors = require('cors');

const app = express();

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

const PORT = process.env.PORT || 5500;

app.listen(PORT, async()=>{
    console.log("Server is initiating...");
    await EstablishConnection(process.env.DB_URL);
    console.log("Server is up and runnin on PORT : "+PORT)
})