import assert from 'node:assert/strict';
import test from 'node:test';
import { analyzeBias, MODEL, parseAnalysisResponse } from './analysis.js';

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
                    output_text: JSON.stringify({ summary: 'Clear.', biases: [] })
                };
            }
        }
    };

    await analyzeBias('Source text.', client);

    assert.equal(request.model, 'gpt-5.6-luna');
    assert.deepEqual(request.reasoning, { effort: 'none' });
    assert.equal(request.text.format.type, 'json_schema');
    assert.equal(request.store, false);
});

test('parses a completed structured response', () => {
    const result = parseAnalysisResponse({
        status: 'completed',
        output: [],
        output_text: JSON.stringify({ summary: 'Clear.', biases: [] })
    });

    assert.deepEqual(result, { summary: 'Clear.', biases: [] });
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
