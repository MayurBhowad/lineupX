const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobsSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    company: {
        type: String,
    },
    location: {
        type: String,
    },
    skills: [{
        type: String,
        required: true
    }],
    description: {
        type: String
    },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    candidatesId: [{
        type: Schema.Types.ObjectId,
        ref: 'Candidate'
    }],
    date: {
        type: Date,
        default: Date.now
    }
});

const Job = mongoose.model('Job', jobsSchema);

module.exports = Job;