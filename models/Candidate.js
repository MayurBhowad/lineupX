const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const candidateSchema = new Schema({
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

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;