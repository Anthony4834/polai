import { describe, expect, it } from 'vitest';
import {
    calculateBiasPercent,
    createHighlights,
    replaceBiases,
    type Highlight
} from './highlights';

describe('createHighlights', () => {
    it('matches repeated lines in source order', () => {
        const highlights = createHighlights('Bad.\nBad.', [
            { line: 'Bad.', reason: 'First', fixed: 'Neutral.' },
            { line: 'Bad.', reason: 'Second', fixed: 'Fair.' }
        ]);

        expect(highlights.map(({ start, end }) => ({ start, end }))).toEqual([
            { start: 0, end: 4 },
            { start: 5, end: 9 }
        ]);
    });

    it('skips a line that is not present in the source', () => {
        expect(createHighlights('Source text.', [
            { line: 'Different text.', reason: 'Missing', fixed: 'Fixed.' }
        ])).toEqual([]);
    });
});

describe('replaceBiases', () => {
    it('replaces repeated passages by their exact positions', () => {
        const highlights: Highlight[] = [
            { start: 0, end: 3, line: 'bad', reason: 'First', fixed: 'neutral', color: 'red' },
            { start: 7, end: 10, line: 'bad', reason: 'Second', fixed: 'fair', color: 'blue' }
        ];

        expect(replaceBiases('bad xx bad', highlights).fixedText).toBe('neutral xx fair');
    });
});

describe('calculateBiasPercent', () => {
    it('does not count overlapping highlights twice', () => {
        const highlights: Highlight[] = [
            { start: 0, end: 6, line: '', reason: '', fixed: '', color: 'red' },
            { start: 4, end: 8, line: '', reason: '', fixed: '', color: 'blue' }
        ];

        expect(calculateBiasPercent('0123456789', highlights)).toBe('80.00');
    });
});
