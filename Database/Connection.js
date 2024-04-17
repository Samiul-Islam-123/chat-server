const mongoose = require('mongoose');

const EstablishConnection =async (url) =>{
    try{
        console.log("Establishing Connection with Mongo DB...");
        await mongoose.connect(url);
        console.log("Connection Established successfully ")
    }
    catch(error){
        console.log("Error occured during Connecting with Database : "+error)
    }
}

module.exports = EstablishConnection;