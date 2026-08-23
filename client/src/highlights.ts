export interface Bias {
    line: string;
    reason: string;
    fixed: string;
}

export interface Highlight extends Bias {
    start: number;
    end: number;
    color: string;
}

export interface AnalysisResponse {
    summary: string;
    biases: Bias[];
}

const HIGHLIGHT_COLORS = [
    '#FF6F61',
    '#FFD97D',
    '#8BC34A',
    '#FFA726',
    '#64B5F6',
    '#BA68C8',
    '#4DD0E1',
    '#FFB74D',
    '#AED581',
    '#FF8A65',
    '#90CAF9',
    '#81D4FA',
    '#E57373',
    '#FFF176',
    '#DCE775',
    '#4DB6AC',
    '#9575CD',
    '#F06292',
    '#FFCC80'
];

const sortValidHighlights = (highlights: Highlight[]) => {
    return highlights
        .filter(({ start, end }) => Number.isInteger(start) && Number.isInteger(end) && start >= 0 && end > start)
        .toSorted((left, right) => left.start - right.start);
};

export const createHighlights = (text: string, biases: Bias[]) => {
    const nextOffsets = new Map<string, number>();

    return biases.flatMap((bias, index): Highlight[] => {
        if (!bias.line) return [];

        const start = text.indexOf(bias.line, nextOffsets.get(bias.line) ?? 0);
        if (start < 0) return [];

        nextOffsets.set(bias.line, start + bias.line.length);

        return [{
            ...bias,
            start,
            end: start + bias.line.length,
            color: HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length]
        }];
    });
};

export const mergeHighlights = (highlights: Highlight[]) => {
    const sorted = sortValidHighlights(highlights);
    if (sorted.length === 0) return [];

    const merged: Highlight[] = [];
    let previous = sorted[0];

    for (const current of sorted.slice(1)) {
        if (current.start <= previous.end) {
            previous = {
                ...previous,
                end: Math.max(previous.end, current.end),
                reason: `${previous.reason}\n${current.reason}`,
                fixed: `${previous.fixed}\n${current.fixed}`
            };
            continue;
        }

        merged.push(previous);
        previous = current;
    }

    merged.push(previous);
    return merged;
};

export const replaceBiases = (text: string, highlights: Highlight[]) => {
    const replacements: Highlight[] = [];
    let lastEnd = 0;

    for (const highlight of sortValidHighlights(highlights)) {
        if (highlight.end > text.length || highlight.start < lastEnd) continue;
        replacements.push(highlight);
        lastEnd = highlight.end;
    }

    let cursor = 0;
    let fixedText = '';
    const newHighlights: Highlight[] = [];

    for (const highlight of replacements) {
        fixedText += text.slice(cursor, highlight.start);
        const start = fixedText.length;
        fixedText += highlight.fixed;

        newHighlights.push({
            ...highlight,
            start,
            end: fixedText.length
        });
        cursor = highlight.end;
    }

    fixedText += text.slice(cursor);
    return { fixedText, newHighlights };
};

export const calculateBiasPercent = (text: string, highlights: Highlight[]) => {
    if (!text.length) return '0.00';

    const biasedLength = mergeHighlights(highlights).reduce((total, highlight) => {
        const start = Math.min(highlight.start, text.length);
        const end = Math.min(highlight.end, text.length);
        return total + Math.max(0, end - start);
    }, 0);

    return ((biasedLength / text.length) * 100).toFixed(2);
};
