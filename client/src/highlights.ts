export const BIAS_CATEGORY_LABELS = {
    loaded_language: 'Loaded language',
    intent_attribution: 'Intent attribution',
    unbalanced_framing: 'Unbalanced framing',
    unsupported_speculation: 'Unsupported speculation',
    partisan_asymmetry: 'Partisan asymmetry'
} as const;

export type BiasCategory = keyof typeof BIAS_CATEGORY_LABELS;

export const isBiasCategory = (value: unknown): value is BiasCategory => {
    return typeof value === 'string'
        && Object.prototype.hasOwnProperty.call(BIAS_CATEGORY_LABELS, value);
};

export interface Bias {
    categories: BiasCategory[];
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
    neutralText: string;
}

const HIGHLIGHT_COLORS = [
    '#E4EEE5',
    '#FDF2DF'
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
            categories: [...new Set(bias.categories)],
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
                categories: [...new Set([...previous.categories, ...current.categories])],
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

const logicalLines = (value: string) => {
    return value
        .replace(/\r\n?/g, '\n')
        .replace(/\n+$/, '')
        .split('\n');
};

const meaningfulLineCounts = (value: string) => {
    const counts = new Map<string, number>();

    for (const line of logicalLines(value)) {
        const normalized = line.trim().replace(/\s+/g, ' ').toLocaleLowerCase();
        if (normalized.length < 20) continue;
        counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
    }

    return counts;
};

export const applyNeutralRewrite = (text: string, neutralText: string) => {
    if (!neutralText.trim()) {
        throw new Error('The neutral rewrite was empty.');
    }

    if (logicalLines(text).length !== logicalLines(neutralText).length) {
        throw new Error('The neutral rewrite changed the source line structure.');
    }

    const maximumLength = Math.max(text.length * 2, text.length + 120);
    if (neutralText.length > maximumLength) {
        throw new Error('The neutral rewrite was unexpectedly long.');
    }

    const sourceCounts = meaningfulLineCounts(text);
    for (const [line, count] of meaningfulLineCounts(neutralText)) {
        if (count > 1 && count > (sourceCounts.get(line) ?? 0)) {
            throw new Error('The neutral rewrite introduced duplicate lines.');
        }
    }

    return neutralText;
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
