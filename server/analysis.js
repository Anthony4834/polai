import OpenAI from 'openai';
import { biasResponseFormat } from './biasSchema.js';

export const MODEL = 'gpt-5.6-luna';

const SYSTEM_PROMPT = `
Analyze the user's text for political bias related to United States political
figures, parties, or ideologies.

Flag subjective language, unbalanced framing, or speculation that favors or
criticizes a political target. Do not flag bias about unrelated topics.

For each biased passage:
- Copy the source line exactly into the line field.
- Explain the political bias in the reason field.
- Put a neutral rewrite in the fixed field.

If the text has no political bias, use this exact summary:
"This text contains no political bias."

If the text has political bias, state its strength, target, and whether the
text favors or criticizes that target in the summary.
`.trim();

let openaiClient;

const getOpenAIClient = () => {
    openaiClient ??= new OpenAI();
    return openaiClient;
};

export const parseAnalysisResponse = response => {
    if (response.status !== 'completed') {
        const reason = response.incomplete_details?.reason ?? 'unknown';
        throw new Error(`OpenAI response was incomplete: ${reason}`);
    }

    const refusal = response.output
        ?.filter(item => item.type === 'message')
        .flatMap(item => item.content ?? [])
        .find(item => item.type === 'refusal');

    if (refusal) {
        throw new Error(`OpenAI refused the analysis: ${refusal.refusal}`);
    }

    if (!response.output_text) {
        throw new Error('OpenAI returned no analysis text.');
    }

    return JSON.parse(response.output_text);
};

export const analyzeBias = async (content, client = getOpenAIClient()) => {
    const response = await client.responses.create({
        model: MODEL,
        reasoning: { effort: 'none' },
        input: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'user', content }
        ],
        text: { format: biasResponseFormat },
        store: false
    });

    return parseAnalysisResponse(response);
};
