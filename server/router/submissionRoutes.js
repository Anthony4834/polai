import express from 'express';
import { analyzeBias } from '../analysis.js';
import { connectToDatabase } from '../database.js';
import Submission from '../model/submission.js';

export const MAX_CONTENT_LENGTH = 50_000;

export const validateContent = content => {
    if (typeof content !== 'string' || !content.trim()) {
        return 'content must be a non-empty string.';
    }

    if (content.length > MAX_CONTENT_LENGTH) {
        return `content must contain ${MAX_CONTENT_LENGTH} characters or fewer.`;
    }

    return null;
};

const router = express.Router();

router.post('/', async (req, res) => {
    const content = req.body?.content;
    const validationError = validateContent(content);

    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    try {
        await connectToDatabase();
        await Submission.create({ content });

        const analysis = await analyzeBias(content);
        return res.json(analysis);
    } catch (error) {
        console.error('Submission analysis failed:', error);
        return res.status(500).json({ error: 'The text analysis failed.' });
    }
});

export default router;
