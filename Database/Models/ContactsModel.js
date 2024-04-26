const mongoose = require('mongoose');
const ContactSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    contacts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    ]
})

const ContactsModel = new mongoose.model('contacts', ContactSchema);
module.exports = ContactsModel;