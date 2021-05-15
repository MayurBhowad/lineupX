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
    }],
    jobIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Job'
    }]
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;