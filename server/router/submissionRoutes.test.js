import assert from 'node:assert/strict';
import test from 'node:test';
import { MAX_CONTENT_LENGTH, validateContent } from './submissionRoutes.js';

test('requires non-empty text content', () => {
    assert.match(validateContent(), /non-empty string/);
    assert.match(validateContent('   '), /non-empty string/);
    assert.equal(validateContent('Neutral text.'), null);
});

test('limits the submitted text length', () => {
    assert.match(validateContent('a'.repeat(MAX_CONTENT_LENGTH + 1)), /characters or fewer/);
});
