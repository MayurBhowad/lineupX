const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job'
    },
    candidateId: {
        type: Schema.Types.ObjectId,
        ref: 'Candidate'
    },
    isReject: {
        type: Boolean,
        default: false
    },
    isAccept: {
        type: Boolean,
        default: false
    },
    message: {
        type: String
    }
})

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;