import { describe, expect, it } from 'vitest';
import {
    applyNeutralRewrite,
    calculateBiasPercent,
    createHighlights,
    type Highlight
} from './highlights';

describe('createHighlights', () => {
    it('matches repeated lines in source order', () => {
        const highlights = createHighlights('Bad.\nBad.', [
            { categories: ['loaded_language'], line: 'Bad.', reason: 'First', fixed: 'Neutral.' },
            { categories: ['loaded_language'], line: 'Bad.', reason: 'Second', fixed: 'Fair.' }
        ]);

        expect(highlights.map(({ start, end }) => ({ start, end }))).toEqual([
            { start: 0, end: 4 },
            { start: 5, end: 9 }
        ]);
        expect(highlights.map(({ color }) => color)).toEqual([
            '#E4E8EA',
            '#ECE7E2'
        ]);
    });

    it('skips a line that is not present in the source', () => {
        expect(createHighlights('Source text.', [
            { categories: ['loaded_language'], line: 'Different text.', reason: 'Missing', fixed: 'Fixed.' }
        ])).toEqual([]);
    });

    it('keeps distinct classification labels for a finding', () => {
        const [highlight] = createHighlights('Lying spree.', [{
            categories: ['loaded_language', 'intent_attribution', 'loaded_language'],
            line: 'Lying spree.',
            reason: 'Loaded wording that also attributes intent.',
            fixed: 'Repeated false statements.',
        }]);

        expect(highlight.categories).toEqual(['loaded_language', 'intent_attribution']);
    });
});

describe('applyNeutralRewrite', () => {
    it('applies one complete rewrite without stitching per-finding text', () => {
        const source = 'Biased first line.\nBiased second line.';
        const neutralText = 'Neutral first line.\nNeutral second line.';

        expect(applyNeutralRewrite(source, neutralText)).toBe(neutralText);
    });

    it('rejects a rewrite that adds lines', () => {
        expect(() => applyNeutralRewrite(
            'Biased first line.\nBiased second line.',
            'Neutral first line.\nNeutral second line.\nBiased second line.'
        )).toThrow(/line structure/);
    });

    it('rejects newly duplicated lines even when the line count is unchanged', () => {
        expect(() => applyNeutralRewrite(
            'Biased first sentence here.\nBiased second sentence here.',
            'The neutral replacement sentence.\nThe neutral replacement sentence.'
        )).toThrow(/duplicate lines/);
    });
});

describe('calculateBiasPercent', () => {
    it('does not count overlapping highlights twice', () => {
        const highlights: Highlight[] = [
            { categories: ['loaded_language'], start: 0, end: 6, line: '', reason: '', fixed: '', color: 'red' },
            { categories: ['intent_attribution'], start: 4, end: 8, line: '', reason: '', fixed: '', color: 'blue' }
        ];

        expect(calculateBiasPercent('0123456789', highlights)).toBe('80.00');
    });

    it('reports marked-source coverage rather than bias severity', () => {
        const highlights: Highlight[] = [
            { categories: ['loaded_language'], start: 0, end: 10, line: '', reason: '', fixed: '', color: 'red' }
        ];

        expect(calculateBiasPercent('0123456789', highlights)).toBe('100.00');
    });
});
