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
  a proposition is true. A lie additionally asserts knowledge or intent.
- unbalanced_framing: selective emphasis or unequal treatment within the
  submitted text that materially changes how a political target is presented.
  Use it only when the text contains comparable subjects, events, or evidence
  treated under different standards. A fact-check does not need praise or a
  list of accurate statements for balance.
- unsupported_speculation: a politically favorable or unfavorable inference
  presented without support in the submitted text. Do not use this category
  for knowledge, motive, or intent. Use intent_attribution for those claims.
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

Review every sentence before producing the result. Apply these examples:
- "The senator is on a lying spree" is loaded_language and
  intent_attribution. It is not unsupported_speculation.
- "False claim after false claim on a dizzying range" is loaded_language.
  Its replacement must retain the reported conclusion that claims were false.
- "Old favorites" and "railing" are loaded_language when used dismissively.
- "The review found 40 false claims" is a factual conclusion, not bias by
  itself. "This is false" is also not bias when the text supplies reasons.
- A fact-check about only one political figure is not unbalanced_framing or
  partisan_asymmetry merely because it contains no favorable examples.

Return only genuine bias findings in biases. For each finding:
- Put every applicable category in categories. Use only loaded_language,
  intent_attribution, unbalanced_framing, unsupported_speculation, or
  partisan_asymmetry.
- Copy the smallest exact contiguous source passage into the line field.
- Return findings in source order.
- Explain the specific bias and the evidence for that classification in the
  reason field. Do not call wording merely "subjective" when a more precise
  explanation is available.
- Put only a local replacement for line in the fixed field. Never include
  surrounding source text in fixed.
- Preserve reported truth status in fixed. Never replace "false," "falsehood,"
  "lie," or "misleading" with an unqualified "claim" or "statement."
  Prefer precise attribution, such as "claims the review found false."
- Do not return overlapping passages. Combine multiple issues in the same
  passage into one finding, one categories array, and one local replacement.

If the text has no political bias, use this exact summary:
"This text contains no political bias."

If the text has political bias, state its strength, target, direction, and the
demonstrated category or categories. Describe loaded or adversarial framing as
such. Do not call it partisan bias unless a partisan_asymmetry finding is
supported by comparative evidence in the submitted text.

Use this strength rubric in the summary:
- mild: one subtle phrase.
- moderate: one strong intent claim or two to three loaded findings.
- strong: sustained framing with at least four findings, or an explicitly
  dehumanizing or incendiary attack.
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

const truthJudgmentPattern = /\b(?:false(?:ly|hoods?)?|lies?|lying|inaccurate(?:ly)?|misleading|untrue)\b/i;
const preservedTruthPattern = /\b(?:false(?:ly|hoods?)?|inaccurate(?:ly)?|misleading|untrue|disputed|contradict(?:s|ed|ory)?|unsupported)\b/i;

const newlineCount = value => (value.match(/\n/g) ?? []).length;

export const buildNeutralText = (source, biases) => {
    if (!Array.isArray(biases)) {
        throw new Error('OpenAI returned an invalid findings list.');
    }

    const nextOffsets = new Map();
    const replacements = biases.map(bias => {
        if (typeof bias?.line !== 'string' || !bias.line) {
            throw new Error('OpenAI returned a finding without an exact source passage.');
        }

        if (typeof bias.fixed !== 'string') {
            throw new Error('OpenAI returned a finding without a local replacement.');
        }

        const start = source.indexOf(bias.line, nextOffsets.get(bias.line) ?? 0);
        if (start === -1) {
            throw new Error('OpenAI returned a finding that does not match the source text.');
        }

        nextOffsets.set(bias.line, start + bias.line.length);

        if (newlineCount(bias.line) !== newlineCount(bias.fixed)) {
            throw new Error('OpenAI changed the line structure in a local replacement.');
        }

        const maximumLength = Math.max(bias.line.length * 2, bias.line.length + 120);
        if (bias.fixed.length > maximumLength) {
            throw new Error('OpenAI returned an unexpectedly long local replacement.');
        }

        if (truthJudgmentPattern.test(bias.line) && !preservedTruthPattern.test(bias.fixed)) {
            throw new Error('OpenAI removed the reported truth status from a local replacement.');
        }

        return { start, end: start + bias.line.length, fixed: bias.fixed };
    }).sort((left, right) => left.start - right.start);

    for (let index = 1; index < replacements.length; index += 1) {
        if (replacements[index].start < replacements[index - 1].end) {
            throw new Error('OpenAI returned overlapping source passages.');
        }
    }

    let neutralText = source;
    for (const replacement of [...replacements].reverse()) {
        neutralText = `${neutralText.slice(0, replacement.start)}${replacement.fixed}${neutralText.slice(replacement.end)}`;
    }

    return validateNeutralText(source, neutralText);
};

export const analyzeBias = async (content, client = getOpenAIClient()) => {
    const response = await client.responses.create({
        model: MODEL,
        reasoning: { effort: 'low' },
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
        neutralText: buildNeutralText(content, analysis.biases)
    };
};
