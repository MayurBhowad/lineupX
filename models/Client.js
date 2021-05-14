const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    skills: [{
        type: String
    }]
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;