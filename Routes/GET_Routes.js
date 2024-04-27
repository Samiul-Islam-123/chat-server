const ContactsModel = require('../Database/Models/ContactsModel');
const RequestModel = require('../Database/Models/Requests');
const userModel = require('../Database/Models/UserModel');

const GET_Routes = require('express').Router();

GET_Routes.get('/my-contacts', async(req,res)=>{
    try{
        const userID  = req.headers.userid
        //console.log(userID)
        if(!userID){
            res.json({
                success : false,
                message : "userId should be provided"
            })
        }

        else{

            const Mycontacts = await ContactsModel.findOne({
                owner : userID
            }).populate('contacts')
            res.json({
                success : true,
                contacts : Mycontacts
            })
        }
    }
    catch(error){
        console.log(error)
        res.json({
            success : false,
            message : "Error occured"
        })
    }
})

GET_Routes.get('/requests-inbox', async(req,res)=>{
   try{
    const myID  = req.headers.userid
    const MyRequest = await RequestModel.find({
        to : myID
    }).populate('from')

    //console.log(MyRequest)

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
     //console.log(myID)
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

 GET_Routes.get('/search-user/:username', async(req,res)=>{
    const searchString = req.params.username; // Get the search string from request parameters
    
    try {
        // Use a regular expression with the 'i' flag for case insensitivity and partial matching
        const UserFound = await userModel.find({
            username: { $regex: new RegExp(searchString, "i") }
        });
    
        res.json({
            success: true,
            users: UserFound
        });
    } catch(error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server error :("
        });
    }
});


module.exports = GET_Routes;