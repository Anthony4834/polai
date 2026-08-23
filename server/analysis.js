import OpenAI from 'openai';
import { biasResponseFormat } from './biasSchema.js';

export const MODEL = 'gpt-5.6-luna';

const SYSTEM_PROMPT = `
Analyze the user's text for political bias related to United States political
figures, parties, or ideologies.

Political bias is not the same as criticism, an unfavorable fact, or a firm
fact-check conclusion. Flag only passages that use politically relevant loaded
language, attribute unsupported intent, frame the submitted evidence
asymmetrically, make unsupported speculation, or demonstrate partisan
asymmetry.

Evaluate each candidate passage using these distinctions:
- loaded_language: emotive, sensational, mocking, dismissive, or rhetorically
  intensified wording that pushes the reader toward a political judgment.
- intent_attribution: a claim about a person's knowledge, motive, or intent
  that the submitted text does not support. A false statement concerns whether
  a proposition is true; a lie additionally asserts knowledge or intent.
- unbalanced_framing: selective emphasis or unequal treatment within the
  submitted text that materially changes how a political target is presented.
- unsupported_speculation: a politically favorable or unfavorable inference
  presented without support in the submitted text.
- partisan_asymmetry: demonstrably different standards for political parties,
  ideologies, or comparable political figures within the submitted text.

Fact-check judgments and terminology choices are assessment checkpoints, not
bias categories by themselves:
- Do not flag words such as "false," "inaccurate," or "misleading" merely
  because they are categorical or unfavorable. Assess whether the submitted
  text supplies reasons or attribution for the conclusion. You are evaluating
  writing, not independently fact-checking it with outside knowledge.
- Do not infer partisan bias from criticism of one politician or from the
  politician's party. Partisan bias requires comparative evidence in the
  submitted text.
- Distinguish the author's narration from direct quotations. Do not attribute
  a quoted speaker's terminology or rhetoric to the author unless the author's
  selection or surrounding framing creates a separate issue.
- A terminology difference, including different terms for immigration status,
  is not political bias without additional evaluative framing.
- Scope words such as "alone" are not loaded merely because they emphasize an
  accurate sample boundary.

Return only genuine bias findings in biases. For each finding:
- Put every applicable category in categories. Use only loaded_language,
  intent_attribution, unbalanced_framing, unsupported_speculation, or
  partisan_asymmetry.
- Copy the smallest exact contiguous source passage into the line field.
- Explain the specific bias and the evidence for that classification in the
  reason field. Do not call wording merely "subjective" when a more precise
  explanation is available.
- Put only a local replacement for line in the fixed field. Never include
  surrounding source text in fixed.
- Do not return overlapping passages. Combine multiple issues in the same
  passage into one finding, one categories array, and one local replacement.

Return neutralText as one complete neutral rewrite of the user's full text.
Preserve the exact number and order of lines. Do not repeat, remove, or append
unrelated content. Change only what is necessary to resolve returned bias
findings. Preserve factual conclusions, counts, qualifications, chronology,
scope, and direct quotations. Prefer precise attribution over deleting a
supported or reported truth judgment. If there is no political bias, copy the
user's text exactly.

If the text has no political bias, use this exact summary:
"This text contains no political bias."

If the text has political bias, state its strength, target, direction, and the
demonstrated category or categories. Describe loaded or adversarial framing as
such. Do not call it partisan bias unless a partisan_asymmetry finding is
supported by comparative evidence in the submitted text.
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
