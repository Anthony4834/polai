// models/user.model.js
const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
    content: { type: String, required: true }
});

module.exports = mongoose.model('Submission', SubmissionSchema);