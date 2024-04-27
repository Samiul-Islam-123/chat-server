const ContactsModel = require('../Database/Models/ContactsModel');
const RequestModel = require('../Database/Models/Requests');
const userModel = require('../Database/Models/UserModel');

const POST_Routes = require('express').Router();

POST_Routes.post('/add-user', async (req, res) => {
    try {
        const existingUser = await userModel.findOne({ id: req.body.id });

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already exists"
            });
        }

        const newUser = new userModel({
            username: req.body.username,
            id: req.body.id,
            profileImage: req.body.profileImage
        });

        await newUser.save();

        return res.json({
            success: true,
            message: "User added successfully",
            mongo_user_id : newUser._id
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred during adding user"
        });
    }
});

POST_Routes.post('/add-contact', async (req, res) => {
    try {
        if (req.body.ownerID && req.body.contactID) {
            const currentContact = await ContactsModel.findOne({
                owner: req.body.ownerID
            });
            if (currentContact) {

                //logic for existing contact
                if (currentContact.contacts.includes(req.body.contactID)) {
                    res.json({
                        success: false,
                        message: "Contact already exists"
                    })
                }

                else {


                    //add new contact
                    currentContact.contacts.push(req.body.contactID);
                    await currentContact.save();
                   
                    //sending request to targetContact
                    const ReuqestObject = new RequestModel({
                        from : req.body.ownerID,
                        to : req.body.contactID,
                        request_content : "Requesting to start a conversation"
                    })
                    await ReuqestObject.save();
                    
                    res.json({
                        success: true,
                        message: "new contact appended"
                    })
                }
            }
            else {
                //create new contact
                const newContact = new ContactsModel({
                    owner: req.body.ownerID,
                })
                newContact.contacts.push(req.body.contactID)
                await newContact.save();

                //sending request to targetContact
                const ReuqestObject = new RequestModel({
                    from : req.body.ownerID,
                    to : req.body.contactID,
                    request_content : "Requesting to start a conversation"
                })
                await ReuqestObject.save();

                res.json({
                    success: true,
                    message: "New contact field created and contact appended"
                })
            }
        }

        else {
            res.json({
                success: false,
                message: "Invalid data"
            })
        }
    }
    catch (error) {
        res.json({
            success: false,
            message: "Error occured whil creating new contact"
        })
    }
})

POST_Routes.post('/accept-request', async(req,res)=>{
    
})


module.exports = POST_Routes;