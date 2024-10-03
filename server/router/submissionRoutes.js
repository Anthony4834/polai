// routes/user.routes.js
import express from 'express';
import { OpenAI } from 'openai';
import Submission from '../model/submission.js';
const router = express.Router();

import { zodResponseFormat } from '../zrf.js';

const getOpenAIResponse = async (content) => {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
        model: 'gpt-4o', // Changed from gpt-4o to gpt-4
        messages: [
            {
                role: 'system',
                content: `
                    Your task is to review a text for political bias.

                    Analyze the provided text to identify any lines that exhibit political bias. For each line containing political bias, extract the necessary information.

                    Definitions and Guidelines are as follows

                    Political Bias: A line shows political bias if it contains subjective language, unbalanced viewpoints, or speculative statements that favor or criticize a political figure, party, or ideology.

                    Subjective Language: Words or phrases that express personal opinions, judgments, or emotions rather than objective facts (e.g., "substantial triumph," "vindicated").

                    Speculative Statements: Assertions about future events or outcomes that are conjectural and favor a particular political perspective.

                    Edge Cases to Consider:

                    Implicit Bias: Even if a line doesn't use overtly biased language, consider whether the framing or context implies a bias.
                    Mixed Content: If a line contains both factual information and biased language, focus on the biased portion but include the entire line in your indices.
                    Multiple Biases in One Line: If a single line contains more than one instance of bias, include all biases in one explanation or separate them if they refer to different biases.
                    Instructions:

                    Read the text carefully and identify all lines that meet the criteria for political bias.
                    Provide clear and specific explanations for why each line is considered biased.
                    Ensure that every potential instance of bias is considered, covering all edge cases.
                    The fixed field should contain the line with the bias removed, to the best of your ability.

                    Biases that are not in favor of or against a political figure, political party, or political ideology should not be considered.
                    If the tone of the text is not political, just state that there is no political bias present.
                    ONLY consider biases that are related to politics and can be categorized with a US political party. Do not consider biases related to other topics such as neutral government agencies or religion.

                    If the text is politically biased, determine the strength of the bias (weak or strong): BIAS_TYPE
                    If the bias is targetting a political figure, political party, or political ideology, specify which one: BIAS_TARGET
                    If the bias is in favor of or against the target, specify which sentiment: BIAS_SENTIMENT
                    
                    if the text is not politically biased, the summary should be "This text contains no political bias."

                    The summary field should follow this structure: This text contains BIAS_TYPE political bias in favor of BIAS_TARGET.
                    Always follow the strucure of the summary.
                    `
            },
            {
                role: 'user',
                content
            }
        ],
        response_format: zodResponseFormat
    });

    // Assuming the OpenAI API response contains the biases in completion.choices[0].message.content
    const res = completion.choices[0].message.content;

    let parsed;
    try {
        parsed = JSON.parse(res);
    } catch (err) {
        console.error(err);
        return { error: 'Failed to parse response' };
    }

    return parsed;
}

router.post('/', async (req, res) => {
    const submission = new Submission({
        content: req.body.content
    });

    try {
        await submission.save();
    } catch (err) {
        res.status(400).json({ message: err.message });
    }

    getOpenAIResponse(req.body.content)
    .then((response) => {
        res.send(response);
    })
    .catch((_err) => {
        console.log(_err);
        res.status(200).send({ summary: 'Internal server error', biases: [] });
    });
});

// POST a new user
router.post('/', async (req, res) => {
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age
    });
    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

export default router;
