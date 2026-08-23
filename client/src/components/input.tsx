import styled from '@emotion/styled';
import { useRef, useState, type FC, type ReactNode } from 'react';
import {
    createHighlights,
    mergeHighlights,
    replaceBiases,
    type AnalysisResponse,
    type Highlight
} from '../highlights';
import { MQ } from '../util';
import { Panel } from './panel';
import { Spinner } from './spinner/spinner';

const isAnalysisResponse = (value: unknown): value is AnalysisResponse => {
    if (!value || typeof value !== 'object') return false;

    const response = value as Partial<AnalysisResponse>;
    return typeof response.summary === 'string' && Array.isArray(response.biases);
};

const analyzeText = async (content: string) => {
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '');
    if (!apiBaseUrl) {
        throw new Error('VITE_API_BASE_URL is not configured.');
    }

    const response = await fetch(`${apiBaseUrl}/submission`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
    });
    const payload: unknown = await response.json().catch(() => null);

    if (!response.ok) {
        const message = payload && typeof payload === 'object' && 'error' in payload
            ? String(payload.error)
            : 'The text analysis failed.';
        throw new Error(message);
    }

    if (!isAnalysisResponse(payload)) {
        throw new Error('The API returned an invalid analysis.');
    }

    return {
        summary: payload.summary,
        highlights: createHighlights(content, payload.biases)
    };
};

// Function to generate the highlighted segments based on the `highlights` state
const getHighlightedText = (text: string, highlights: Highlight[]) => {
    const mergedHighlights = mergeHighlights(highlights);

    const parts: ReactNode[] = [];
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
    const [error, setError] = useState('');

    const reset = () => {
        setHighlights([]);
        setSummary('');
        setLastAnalyzed('');
        setError('');
    };

    const handleAnalyze = async () => {
        setIsProcessing(true);
        setError('');

        try {
            const result = await analyzeText(text);
            setHighlights(result.highlights);
            setSummary(result.summary);
            setLastAnalyzed(text);
        } catch (analysisError) {
            const message = analysisError instanceof Error
                ? analysisError.message
                : 'The text analysis failed.';
            setError(message);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Panel>
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
            {error ? <ErrorMessage role='alert'>{error}</ErrorMessage> : null}
            <ButtonsSection>
                <Button
                    onClick={handleAnalyze}
                    disabled={isProcessing || !text || lastAnalyzed === text}>
                    {isProcessing ? <Spinner /> : 'Analyze'}
                </Button>
                <Button
                    onClick={() => {
                        const { fixedText } = replaceBiases(text, highlights);
                        setText(fixedText);
                        setLastAnalyzed('');
                        setHighlights([]);
                        setSummary('Suggested neutral wording was applied.');
                    }}
                    disabled={highlights.length === 0}>
                    Fix Biases
                </Button>
            </ButtonsSection>
        </Panel>
    );
};

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

const ErrorMessage = styled.p({
    position: 'absolute',
    bottom: '6.5rem',
    margin: 0,
    color: '#b42318',
    fontSize: '0.95rem',
    textAlign: 'center'
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
