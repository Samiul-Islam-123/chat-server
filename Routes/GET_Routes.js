const RequestModel = require('../Database/Models/Requests');

const GET_Routes = require('express').Router();

GET_Routes.get('/my-contacts', async(req,res)=>{
    const userID  = req.headers.userid
    //TODO make somekind of contacts Schema and fetch it from there
})

GET_Routes.get('/requests-inbox', async(req,res)=>{
   try{
    const myID  = req.headers.userid
    const MyRequest = await RequestModel.find({
        to : myID
    })
    res.json({
        success : true,
        requests : MyRequest
    })
   }
   catch(error){
    res.json({
        success : false,
        message : "Error occrued"
    })
   }
})

GET_Routes.get('/requests-sent', async(req,res)=>{
    try{
     const myID  = req.headers.userid
     console.log(myID)
     const MyRequest = await RequestModel.find({
         from : myID
     })
     res.json({
         success : true,
         requests : MyRequest
     })
    }
    catch(error){
     res.json({
         success : false,
         message : "Error occrued"
     })
    }
 })

module.exports = GET_Routes;