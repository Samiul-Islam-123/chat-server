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
            mongo_user_id: newUser._id
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred during adding user"
        });
    }
});


//route to send request
POST_Routes.post('/send-request', async (req, res) => {
    try {
        const CurrentRequest = new RequestModel({
            from: req.body.fromID,
            to: req.body.toID,
            request_content: "Requesting to chat"
        })

        await CurrentRequest.save();

        //sending response
        res.json({
            success : true,
            message : "Request send Successfully"
        })
    }
    catch (error) {
        console.log(error);
        res.json({
            success: false,
            message: "Error occured during request"
        })
    }
})

POST_Routes.post('/accept-request', async (req, res) => {
    try {
        const CurrentRequest = await RequestModel.findOne({
            from: req.body.fromID,
            to: req.body.toID
        });

        if (CurrentRequest) {
            // Add users to their contacts

            // For sender's contact
            const FromContact = await ContactsModel.findOne({
                owner: req.body.fromID
            });

            if (FromContact) {
                if (FromContact.contacts.includes(req.body.toID)) {
                    return res.json({
                        success: false,
                        message: "Contact already exists"
                    });
                } else {
                    FromContact.contacts.push(req.body.toID);
                    await FromContact.save();
                }
            } else {
                const newFromContact = new ContactsModel({
                    owner: req.body.fromID
                });
                newFromContact.contacts.push(req.body.toID);
                await newFromContact.save();
            }

            // For receiver's contact
            const ToContact = await ContactsModel.findOne({
                owner: req.body.toID
            });

            if (ToContact) {
                if (ToContact.contacts.includes(req.body.fromID)) {
                    return res.json({
                        success: false,
                        message: "Contact already exists"
                    });
                } else {
                    ToContact.contacts.push(req.body.fromID);
                    await ToContact.save();
                }
            } else {
                const newToContact = new ContactsModel({
                    owner: req.body.toID
                });
                newToContact.contacts.push(req.body.fromID);
                await newToContact.save();
            }

            // If everything is successful, delete the CurrentRequest
            await CurrentRequest.deleteOne();

            return res.json({
                success: true,
                message: "Request accepted"
            });
        } else {
            return res.json({
                success: false,
                message: "Request not found :("
            });
        }
    } catch (error) {
        console.error('Error accepting request:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while accepting the request"
        });
    }
});



module.exports = POST_Routes;