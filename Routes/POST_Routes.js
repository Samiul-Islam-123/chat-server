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
            message: "User added successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred during adding user"
        });
    }
});


module.exports = POST_Routes;