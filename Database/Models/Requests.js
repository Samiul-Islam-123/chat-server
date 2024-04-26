const { Timestamp } = require('firebase/firestore');
const mongoose = require('mongoose');
const RequestSchema = new mongoose.Schema({
    from : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    to : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    request_content : {
        type : String
    }
    ,
    Timestamp : Date
})

const RequestModel = new mongoose.model('requests', RequestSchema);
module.exports = RequestModel;