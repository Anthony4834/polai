import styled from '@emotion/styled';
import { FC, useRef, useState } from 'react';
import { MQ } from '../util';
import { Highlight } from './main';
import { Spinner } from './spinner/spinner';

type ExpectedResponse = {
    summary: string;
    biases: { line: string; reason: string; fixed: string }[];
    error?: string;
};
const colors = [
    '#FF6F61', // Soft Red
    '#FFD97D', // Soft Yellow
    '#8BC34A', // Soft Green
    '#FFA726', // Soft Orange
    '#64B5F6', // Soft Blue
    '#BA68C8', // Soft Purple
    '#4DD0E1', // Soft Cyan
    '#FFB74D', // Soft Light Orange
    '#AED581', // Soft Light Green
    '#FF8A65', // Soft Coral
    '#90CAF9', // Soft Light Blue
    '#81D4FA', // Soft Sky Blue
    '#E57373', // Soft Light Red
    '#FFF176', // Soft Lemon Yellow
    '#DCE775', // Soft Lime
    '#4DB6AC', // Soft Teal
    '#9575CD', // Soft Lavender
    '#F06292', // Soft Pink
    '#FFCC80' // Soft Peach
];

const submitHandler = async (content: string, updateFn: (h: Highlight[], s: string) => void) => {
    try {
        const res: ExpectedResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/submission`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        }).then(res => res.json());

        if (!res || 'error' in res) {
            console.error(res?.error || 'Failed to parse response');
            return;
        }

        const { summary, biases } = res;

        updateFn(
            biases.map((item, index) => {
                const startsAt = content.indexOf(item.line);
                const color = index % colors.length;

                return {
                    start: startsAt,
                    end: startsAt + item.line.length,
                    // random color that isnt dark
                    color: colors[color],
                    reason: item.reason,
                    fixed: item.fixed
                };
            }),
            summary
        );
    } catch (error) {
        console.error('Error:', error);
    }
};

const replaceBiases = (text: string, highlights: Highlight[]) => {
    const fixedText = highlights.reduce((acc, highlight) => {
        return acc.replace(text.slice(highlight.start, highlight.end), highlight.fixed);
    }, text);

    const newHighlights = highlights.map(highlight => {
        return {
            ...highlight,
            start: fixedText.indexOf(highlight.fixed),
            end: fixedText.indexOf(highlight.fixed) + highlight.fixed.length
        };
    });

    return { fixedText, newHighlights };
};

// Function to merge overlapping and adjacent highlights
const mergeHighlights = (highlights: Highlight[]) => {
    if (!highlights.length) return [];

    // Sort highlights by start index
    const sorted = [...highlights].sort((a, b) => a.start - b.start);

    const merged: Highlight[] = [];
    let prev = sorted[0];

    for (let i = 1; i < sorted.length; i++) {
        const current = sorted[i];
        if (current.start <= prev.end) {
            // Overlapping or adjacent highlights, merge them
            prev = {
                start: prev.start,
                end: Math.max(prev.end, current.end),
                color: prev.color, // Assuming same color; adjust logic if colors differ,
                reason: prev.reason + '\n' + current.reason,
                fixed: prev.fixed + '\n' + current.fixed
            };
        } else {
            merged.push(prev);
            prev = current;
        }
    }
    merged.push(prev);
    return merged;
};

// Function to generate the highlighted segments based on the `highlights` state
const getHighlightedText = (text: string, highlights: Highlight[]) => {
    const mergedHighlights = mergeHighlights(highlights);

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    mergedHighlights.forEach(({ start, end, color }) => {
        // Ensure indices are within bounds
        start = Math.max(0, start);
        end = Math.min(text.length, end);

        if (start > lastIndex) {
            // Add unhighlighted text
            parts.push(<span key={`text-${lastIndex}-${start}`}>{text.slice(lastIndex, start)}</span>);
        }

        if (end > start) {
            // Add highlighted text
            parts.push(
                <span key={`highlight-${start}-${end}`} style={{ backgroundColor: color }}>
                    {text.slice(start, end)}
                </span>
            );
            lastIndex = end;
        }
    });

    // Add any remaining unhighlighted text
    if (lastIndex < text.length) {
        parts.push(<span key={`text-${lastIndex}-${text.length}`}>{text.slice(lastIndex)}</span>);
    }

    return parts;
};

interface InputProps {
    text: string;
    setText: (text: string) => void;
    highlights: Highlight[];
    setHighlights: (highlights: Highlight[]) => void;
    isProcessing: boolean;
    setIsProcessing: (isProcessing: boolean) => void;
    setSummary: (summary: string) => void;
}

export const Input: FC<InputProps> = ({
    text,
    setText,
    highlights,
    setHighlights,
    isProcessing,
    setIsProcessing,
    setSummary
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const [lastAnalyzed, setLastAnalyzed] = useState('');

    const reset = () => {
        setHighlights([]);
        setSummary('');
    };
    return (
        <Base>
            <Overlay ref={overlayRef}>{getHighlightedText(text, highlights)}</Overlay>
            <TextArea
                ref={textareaRef}
                value={text}
                onChange={e => {
                    reset();
                    setText(e.target.value);
                }}
                onScroll={() => {
                    if (overlayRef.current && textareaRef.current) {
                        overlayRef.current.scrollTop = textareaRef.current.scrollTop;
                    }
                }}
                placeholder='Enter text here...'
            />
            <ButtonsSection>
                <Button
                    onClick={() => {
                        setIsProcessing(true);
                        submitHandler(text, (h, s) => {
                            setHighlights(h);
                            setSummary(s);
                        }).finally(() => {
                            setIsProcessing(false);
                        });
                    }}
                    disabled={isProcessing || !text || lastAnalyzed === text}>
                    {isProcessing ? <Spinner /> : 'Analyze'}
                </Button>
                <Button
                    onClick={() => {
                        const { fixedText, newHighlights } = replaceBiases(text, highlights);
                        setText(fixedText);
                        setLastAnalyzed(fixedText);
                        setHighlights(newHighlights);
                    }}
                    disabled={highlights.length === 0}>
                    Fix Biases
                </Button>
            </ButtonsSection>
        </Base>
    );
};

export const Base = styled.div({
    margin: 'auto 0',
    padding: '2rem',
    position: 'relative',
    width: '45%',
    height: '80vh',
    flexDirection: 'column',
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: '1rem',
    alignItems: 'center',
    boxShadow: 'rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(0, 0, 0, 0.1) 0px 8px 16px 0px',

    [MQ.mobile]: {
        height: '80vh',
        width: '90%',
        marginTop: '2rem',
        padding: '2%'
    }
});

const TextArea = styled.textarea({
    position: 'absolute',
    width: '90%',
    height: '80%',
    border: '1px solid transparent',
    borderBottom: '1px solid #ddd',
    padding: '10px',
    fontSize: '1.2rem',
    lineHeight: '2rem',
    backgroundColor: 'transparent',
    color: 'transparent',
    caretColor: 'black',
    zIndex: 2,
    overflowY: 'auto',
    resize: 'none',
    outline: 'none',
    fontFamily: 'Arial, sans-serif',

    [MQ.mobile]: {
        height: '83%'
    }
});

const Overlay = styled.div({
    position: 'absolute',
    width: '90%',
    height: '80%',
    border: '1px solid transparent',
    borderBottom: '1px solid #ddd',
    padding: '10px',
    fontSize: '1.2rem',
    lineHeight: '2rem',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    color: 'black',
    zIndex: 1,
    pointerEvents: 'none',
    textAlign: 'left',
    overflowY: 'hidden', // Hide scrollbar on overlay
    fontFamily: 'Arial, sans-serif',

    [MQ.mobile]: {
        height: '83%'
    }
});

const ButtonsSection = styled.div({
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    width: '50%',
    position: 'absolute',
    bottom: '2rem',

    [MQ.mobile]: {
        width: '100%',
        bottom: '1rem'
    }
});

const Button = styled.button({
    padding: '0rem',
    height: '4rem',
    width: '10rem',
    transition: 'all 0.3s',
    overflow: 'hidden',
    left: 'calc(50% - 5rem)',
    borderRadius: '5px',
    backgroundImage: 'linear-gradient(135deg, #ff6b6b, #ff7979, #ff4d4d)',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
    fontSize: '16px',
    fontWeight: 'bold',
    filter: 'brightness(1)',

    '&:hover': {
        filter: 'brightness(1.1)'
    },

    '&:active': {
        filter: 'brightness(0.9)'
    },

    '&:disabled': {
        filter: 'brightness(0.8)',
        cursor: 'not-allowed'
    },

    [MQ.mobile]: {
        height: '3rem',
        width: '8rem'
    }
});
