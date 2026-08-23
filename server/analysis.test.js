import assert from 'node:assert/strict';
import test from 'node:test';
import {
    analyzeBias,
    MODEL,
    parseAnalysisResponse,
    validateNeutralText
} from './analysis.js';

test('uses GPT-5.6 Luna', () => {
    assert.equal(MODEL, 'gpt-5.6-luna');
});

test('uses Responses with the Luna classification settings', async () => {
    let request;
    const client = {
        responses: {
            create: async value => {
                request = value;
                return {
                    status: 'completed',
                    output: [],
                    output_text: JSON.stringify({
                        summary: 'Clear.',
                        neutralText: 'Source text.',
                        biases: []
                    })
                };
            }
        }
    };

    await analyzeBias('Source text.', client);

    assert.equal(request.model, 'gpt-5.6-luna');
    assert.deepEqual(request.reasoning, { effort: 'none' });
    assert.equal(request.text.format.type, 'json_schema');
    assert.ok(request.text.format.schema.required.includes('neutralText'));
    const findingSchema = request.text.format.schema.properties.biases.items;
    assert.ok(findingSchema.required.includes('categories'));
    assert.deepEqual(findingSchema.properties.categories.items.enum, [
        'loaded_language',
        'intent_attribution',
        'unbalanced_framing',
        'unsupported_speculation',
        'partisan_asymmetry'
    ]);
    assert.match(request.input[0].content, /one complete neutral rewrite/i);
    assert.match(request.input[0].content, /Never include\s+surrounding source text in fixed/i);
    assert.match(request.input[0].content, /Political bias is not the same as criticism/i);
    assert.match(request.input[0].content, /A false statement concerns whether[\s\S]*a lie additionally asserts knowledge or intent/i);
    assert.match(request.input[0].content, /Do not flag words such as "false," "inaccurate," or "misleading" merely/i);
    assert.match(request.input[0].content, /Distinguish the author's narration from direct quotations/i);
    assert.match(request.input[0].content, /Do not infer partisan bias from criticism of one politician/i);
    assert.match(request.input[0].content, /Preserve factual conclusions, counts, qualifications/i);
    assert.equal(request.store, false);
});

test('parses a completed structured response', () => {
    const biases = [{
        categories: ['loaded_language', 'intent_attribution'],
        reason: 'The wording is loaded and asserts deceptive intent.',
        line: 'lying spree',
        fixed: 'series of statements that the review found false'
    }];
    const result = parseAnalysisResponse({
        status: 'completed',
        output: [],
        output_text: JSON.stringify({
            summary: 'Clear.',
            neutralText: 'Source text.',
            biases
        })
    });

    assert.deepEqual(result, {
        summary: 'Clear.',
        neutralText: 'Source text.',
        biases
    });
});

test('rejects a neutral rewrite that adds source lines', () => {
    assert.throws(
        () => validateNeutralText(
            'Biased first line.\nBiased second line.',
            'Neutral first line.\nNeutral second line.\nBiased second line.'
        ),
        /line structure/
    );
});

test('rejects newly duplicated lines', () => {
    assert.throws(
        () => validateNeutralText(
            'Biased first sentence here.\nBiased second sentence here.',
            'The neutral replacement sentence.\nThe neutral replacement sentence.'
        ),
        /duplicate lines/
    );
});

test('rejects incomplete responses', () => {
    assert.throws(
        () => parseAnalysisResponse({
            status: 'incomplete',
            incomplete_details: { reason: 'max_output_tokens' }
        }),
        /max_output_tokens/
    );
});

test('rejects refusals', () => {
    assert.throws(
        () => parseAnalysisResponse({
            status: 'completed',
            output: [{
                type: 'message',
                content: [{ type: 'refusal', refusal: 'Cannot analyze.' }]
            }],
            output_text: ''
        }),
        /Cannot analyze/
    );
});
