import OpenAI from 'openai';
import { biasResponseFormat } from './biasSchema.js';

export const MODEL = 'gpt-5.6-luna';

const SYSTEM_PROMPT = `
Analyze the user's text for political bias related to United States political
figures, parties, or ideologies.

Flag subjective language, unbalanced framing, or speculation that favors or
criticizes a political target. Do not flag bias about unrelated topics.

Return neutralText as one complete neutral rewrite of the user's full text.
Preserve the exact number and order of lines. Do not repeat, remove, or append
unrelated content. If there is no political bias, copy the user's text exactly.

For each biased passage:
- Copy the smallest exact contiguous source passage into the line field.
- Explain the political bias in the reason field.
- Put only a local replacement for line in the fixed field. Never include
  surrounding source text in fixed.
- Do not return overlapping passages. Combine multiple issues in the same
  passage into one finding and one local replacement.

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

const logicalLines = value => value
    .replace(/\r\n?/g, '\n')
    .replace(/\n+$/, '')
    .split('\n');

const meaningfulLineCounts = value => {
    const counts = new Map();

    for (const line of logicalLines(value)) {
        const normalized = line.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
        if (normalized.length < 20) continue;
        counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    }

    return counts;
};

export const validateNeutralText = (source, neutralText) => {
    if (typeof neutralText !== 'string' || !neutralText.trim()) {
        throw new Error('OpenAI returned an empty neutral rewrite.');
    }

    if (logicalLines(source).length !== logicalLines(neutralText).length) {
        throw new Error('OpenAI changed the source line structure.');
    }

    const maximumLength = Math.max(source.length * 2, source.length + 120);
    if (neutralText.length > maximumLength) {
        throw new Error('OpenAI returned an unexpectedly long neutral rewrite.');
    }

    const sourceCounts = meaningfulLineCounts(source);
    for (const [line, count] of meaningfulLineCounts(neutralText)) {
        if (count > 1 && count > (sourceCounts.get(line) ?? 0)) {
            throw new Error('OpenAI introduced duplicate lines in the neutral rewrite.');
        }
    }

    return neutralText;
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

    const analysis = parseAnalysisResponse(response);
    return {
        ...analysis,
        neutralText: validateNeutralText(content, analysis.neutralText)
    };
};
