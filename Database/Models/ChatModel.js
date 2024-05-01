const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    Users : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "users"
        }
    ],
    Chats : [
        {
            from : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "users"
            },
            to : {
                type : mongoose.Schema.Types.ObjectId,
                ref : "users"
            },
            timestamp: {
                type: Date, // Use Date type to store timestamps
                default: Date.now // Set default value to current timestamp
            },
            content : String,
            seen : Boolean
        }
    ]
})

const ChatModel = new mongoose.model('chats', ChatSchema);
module.exports = ChatModel;