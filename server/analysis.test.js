import assert from 'node:assert/strict';
import test from 'node:test';
import {
    analyzeBias,
    buildNeutralText,
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
                        biases: []
                    })
                };
            }
        }
    };

    await analyzeBias('Source text.', client);

    assert.equal(request.model, 'gpt-5.6-luna');
    assert.deepEqual(request.reasoning, { effort: 'low' });
    assert.equal(request.text.format.type, 'json_schema');
    assert.ok(!request.text.format.schema.required.includes('neutralText'));
    assert.ok(!('neutralText' in request.text.format.schema.properties));
    const findingSchema = request.text.format.schema.properties.biases.items;
    assert.ok(findingSchema.required.includes('categories'));
    assert.deepEqual(findingSchema.properties.categories.items.enum, [
        'loaded_language',
        'intent_attribution',
        'unbalanced_framing',
        'unsupported_speculation',
        'partisan_asymmetry'
    ]);
    assert.match(request.input[0].content, /Never include\s+surrounding source text in fixed/i);
    assert.match(request.input[0].content, /Political bias is not the same as criticism/i);
    assert.match(request.input[0].content, /A false statement concerns whether[\s\S]*a lie additionally asserts knowledge or intent/i);
    assert.match(request.input[0].content, /Do not flag words such as "false," "inaccurate," or "misleading" merely/i);
    assert.match(request.input[0].content, /Distinguish the author's narration from direct quotations/i);
    assert.match(request.input[0].content, /Do not infer partisan bias from criticism of one politician/i);
    assert.match(request.input[0].content, /does not need praise or a\s+list of accurate statements for balance/i);
    assert.match(request.input[0].content, /Do not use this category\s+for knowledge, motive, or intent/i);
    assert.match(request.input[0].content, /Never replace "false," "falsehood,"\s+"lie," or "misleading" with an unqualified "claim"/i);
    assert.match(request.input[0].content, /Do not call[\s\S]*the passage "political bias", "bias against", "bias toward", or "partisan"/i);
    assert.match(request.input[0].content, /This text alone does not establish a partisan double standard/i);
    assert.match(request.input[0].content, /moderate: one strong intent claim or two to three loaded findings/i);
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
            biases
        })
    });

    assert.deepEqual(result, {
        summary: 'Clear.',
        biases
    });
});

test('builds a neutral rewrite only from displayed findings', () => {
    const source = 'A lying spree. This is false for two documented reasons.';
    const biases = [{
        categories: ['loaded_language', 'intent_attribution'],
        reason: 'It assigns intent.',
        line: 'lying spree',
        fixed: 'series of claims the review found false'
    }];

    assert.equal(
        buildNeutralText(source, biases),
        'A series of claims the review found false. This is false for two documented reasons.'
    );
});

test('replaces repeated passages in source order', () => {
    const source = 'The old favorite returned. Another old favorite returned.';
    const biases = [
        { line: 'old favorite', fixed: 'recurring claim' },
        { line: 'old favorite', fixed: 'previous claim' }
    ];

    assert.equal(
        buildNeutralText(source, biases),
        'The recurring claim returned. Another previous claim returned.'
    );
});

test('rejects findings that do not exactly match the source', () => {
    assert.throws(
        () => buildNeutralText('Exact source.', [{ line: 'Different source', fixed: 'Neutral text' }]),
        /does not match the source text/
    );
});

test('rejects overlapping findings', () => {
    assert.throws(
        () => buildNeutralText('false claim after false claim', [
            { line: 'false claim after false claim', fixed: 'repeated claims found false' },
            { line: 'false claim', fixed: 'claim found false' }
        ]),
        /overlapping source passages/
    );
});

test('rejects local replacements that change line structure', () => {
    assert.throws(
        () => buildNeutralText('loaded wording', [{ line: 'loaded wording', fixed: 'neutral\nwording' }]),
        /line structure in a local replacement/
    );
});

test('rejects local replacements that remove reported truth status', () => {
    assert.throws(
        () => buildNeutralText('a dizzying series of false claims', [{
            line: 'dizzying series of false claims',
            fixed: 'a series of claims'
        }]),
        /removed the reported truth status/
    );
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
