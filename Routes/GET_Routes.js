const ChatModel = require('../Database/Models/ChatModel');
const ContactsModel = require('../Database/Models/ContactsModel');
const RequestModel = require('../Database/Models/Requests');
const userModel = require('../Database/Models/UserModel');

const GET_Routes = require('express').Router();

GET_Routes.get('/my-contacts', async (req, res) => {
    try {
        const userID = req.headers.userid
        //console.log(userID)
        if (!userID) {
            res.json({
                success: false,
                message: "userId should be provided"
            })
        }

        else {

            const Mycontacts = await ContactsModel.findOne({
                owner: userID
            }).populate('contacts')
            res.json({
                success: true,
                contacts: Mycontacts
            })
        }
    }
    catch (error) {
        console.log(error)
        res.json({
            success: false,
            message: "Error occured"
        })
    }
});

GET_Routes.get('/requests-inbox', async (req, res) => {
    try {
        const myID = req.headers.userid
        const MyRequest = await RequestModel.find({
            to: myID
        }).populate('from')

        //console.log(MyRequest)

        res.json({
            success: true,
            requests: MyRequest
        })
    }
    catch (error) {
        res.json({
            success: false,
            message: "Error occrued"
        })
    }
})

GET_Routes.get('/requests-sent', async (req, res) => {
    try {
        const myID = req.headers.userid
        //console.log(myID)
        const MyRequest = await RequestModel.find({
            from: myID
        }).populate('to')
        res.json({
            success: true,
            requests: MyRequest
        })
    }
    catch (error) {
        res.json({
            success: false,
            message: "Error occrued"
        })
    }
})

GET_Routes.get('/search-user/:username', async (req, res) => {
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
    } catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Server error :("
        });
    }
});


//route for fetching previous chat data
GET_Routes.get('/get-chats', async (req, res) => {
    try {
        const user1ID = req.headers.user1id;
        const user2ID = req.headers.user2id;
        
        const ChatData = await ChatModel.findOne({
            Users: {
                $all: [user1ID, user2ID]
            }
        })
        if (ChatData) {
            res.json({
                success: true,
                chatData: ChatData
            })
        }

        else {
            res.json({
                success: false,
                message: "Chat Data not found"
            })
        }
    }
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error occured while fetching Chat Data"
        })
    }
})

// GET_Routes.get('/user-data/:ID',async (req,res)=>{
//     try{
//         const UserData = await userModel.findOne({
//             _id : req.params.ID
//         });
//         if(UserData){
//             res.json({
//                 success : true
//             })
//         }
//     }
// } )


module.exports = GET_Routes;