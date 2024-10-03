// models/user.model.js
import mongoose from "mongoose";

const SubmissionSchema = new mongoose.Schema({
    content: { type: String, required: true }
});

export default mongoose.model('Submission', SubmissionSchema);