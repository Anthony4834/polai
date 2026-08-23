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
import {
    Panel,
    PanelEyebrow,
    PanelHeader,
    PanelHeading,
    PanelMeta,
    PanelTitle
} from './panel';
import { Spinner } from './spinner/spinner';

const MAX_CONTENT_LENGTH = 50_000;

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

const getHighlightedText = (text: string, highlights: Highlight[]) => {
    const mergedHighlights = mergeHighlights(highlights);
    const parts: ReactNode[] = [];
    let lastIndex = 0;

    mergedHighlights.forEach(({ start, end, color }) => {
        start = Math.max(0, start);
        end = Math.min(text.length, end);

        if (start > lastIndex) {
            parts.push(<span key={`text-${lastIndex}-${start}`}>{text.slice(lastIndex, start)}</span>);
        }

        if (end > start) {
            parts.push(
                <mark key={`highlight-${start}-${end}`} style={{ backgroundColor: color }}>
                    {text.slice(start, end)}
                </mark>
            );
            lastIndex = end;
        }
    });

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

    const resetAnalysis = () => {
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

    const handleFixBiases = () => {
        const { fixedText } = replaceBiases(text, highlights);
        setText(fixedText);
        setLastAnalyzed('');
        setHighlights([]);
        setSummary('Suggested neutral wording was applied.');
    };

    const isCurrentAnalysis = Boolean(text) && lastAnalyzed === text;
    const editorStatus = highlights.length > 0
        ? `${highlights.length} ${highlights.length === 1 ? 'passage' : 'passages'} flagged`
        : isCurrentAnalysis
            ? 'Analysis complete'
            : `${text.length.toLocaleString()} / ${MAX_CONTENT_LENGTH.toLocaleString()}`;

    return (
        <EditorPanel aria-label='Text editor'>
            <PanelHeader>
                <PanelHeading>
                    <PanelEyebrow>01 / Source</PanelEyebrow>
                    <PanelTitle>Writing Canvas</PanelTitle>
                </PanelHeading>
                <PanelMeta>{editorStatus}</PanelMeta>
            </PanelHeader>

            <EditorBody>
                <EditorLabel htmlFor='polai-source-text'>Text to analyze</EditorLabel>
                <EditorCanvas>
                    <Overlay ref={overlayRef} aria-hidden='true'>
                        {getHighlightedText(text, highlights)}
                    </Overlay>
                    <TextArea
                        id='polai-source-text'
                        name='source-text'
                        ref={textareaRef}
                        value={text}
                        maxLength={MAX_CONTENT_LENGTH}
                        autoComplete='off'
                        aria-describedby='editor-help'
                        aria-busy={isProcessing}
                        onChange={event => {
                            resetAnalysis();
                            setText(event.target.value);
                        }}
                        onScroll={() => {
                            if (overlayRef.current && textareaRef.current) {
                                overlayRef.current.scrollTop = textareaRef.current.scrollTop;
                            }
                        }}
                        placeholder='Paste a speech, article, post, or other passage…'
                        spellCheck={true}
                    />
                </EditorCanvas>

                <EditorFooter>
                    <HelperText id='editor-help'>
                        Flagged language appears directly in the text after analysis.
                    </HelperText>
                    {error ? <ErrorMessage role='alert'>{error}</ErrorMessage> : null}
                    <EditorActions>
                        <ActionButton
                            type='button'
                            variant='primary'
                            onClick={handleAnalyze}
                            disabled={isProcessing || !text.trim() || isCurrentAnalysis}>
                            {isProcessing ? (
                                <ButtonContent><Spinner />Analyzing…</ButtonContent>
                            ) : (
                                <ButtonContent>
                                    Analyze Text
                                    <Arrow aria-hidden='true'>↗</Arrow>
                                </ButtonContent>
                            )}
                        </ActionButton>
                        <ActionButton
                            type='button'
                            variant='secondary'
                            onClick={handleFixBiases}
                            disabled={isProcessing || highlights.length === 0}>
                            Apply Neutral Wording
                        </ActionButton>
                    </EditorActions>
                </EditorFooter>
            </EditorBody>
        </EditorPanel>
    );
};

const EditorPanel = styled(Panel)({
    backgroundColor: '#fffefb'
});

const EditorBody = styled.div({
    minHeight: 0,
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
});

const EditorLabel = styled.label({
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0
});

const editorTextStyles = {
    padding: 'clamp(1.5rem, 3vw, 2.25rem)',
    fontFamily: 'Inter, Avenir Next, Segoe UI, sans-serif',
    fontSize: 'clamp(1rem, 1.4vw, 1.12rem)',
    lineHeight: 1.85,
    letterSpacing: '-0.006em',
    whiteSpace: 'pre-wrap' as const,
    overflowWrap: 'break-word' as const
};

const EditorCanvas = styled.div({
    position: 'relative',
    minHeight: '410px',
    flex: 1,
    backgroundColor: '#fffefb',

    [MQ.mobile]: {
        minHeight: '360px'
    }
});

const Overlay = styled.div({
    ...editorTextStyles,
    position: 'absolute',
    inset: 0,
    zIndex: 1,
    overflowY: 'hidden',
    color: '#24302c',
    pointerEvents: 'none',

    '& mark': {
        padding: '0.12em 0',
        color: 'inherit',
        borderRadius: '0.16em',
        boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone'
    }
});

const TextArea = styled.textarea({
    ...editorTextStyles,
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    zIndex: 2,
    resize: 'none',
    overflowY: 'auto',
    border: 0,
    outline: 0,
    color: 'transparent',
    backgroundColor: 'transparent',
    caretColor: '#173d35',
    WebkitTextFillColor: 'transparent',

    '&::placeholder': {
        color: '#9a9f9c',
        WebkitTextFillColor: '#9a9f9c'
    },

    '&:focus-visible': {
        boxShadow: 'inset 0 0 0 3px rgba(39, 107, 90, 0.18)'
    },

    '&::selection': {
        color: 'transparent',
        backgroundColor: 'rgba(39, 107, 90, 0.2)'
    }
});

const EditorFooter = styled.footer({
    padding: '1.15rem clamp(1.25rem, 3vw, 2rem) 1.5rem',
    borderTop: '1px solid #ebe9e2',
    backgroundColor: '#faf9f5'
});

const HelperText = styled.p({
    margin: 0,
    color: '#7a817e',
    fontSize: '0.74rem',
    lineHeight: 1.5
});

const ErrorMessage = styled.p({
    margin: '0.7rem 0 0',
    padding: '0.7rem 0.8rem',
    color: '#8a3034',
    border: '1px solid #edccce',
    borderRadius: '0.55rem',
    backgroundColor: '#fff4f4',
    fontSize: '0.8rem'
});

const EditorActions = styled.div({
    marginTop: '1rem',
    display: 'flex',
    gap: '0.65rem',

    [MQ.mobile]: {
        flexDirection: 'column'
    }
});

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' }>(({ variant }) => ({
    minHeight: '2.85rem',
    padding: '0.75rem 1rem',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: variant === 'primary' ? '1px solid #173d35' : '1px solid #cbcfc9',
    borderRadius: '0.65rem',
    color: variant === 'primary' ? '#fffefb' : '#27332f',
    backgroundColor: variant === 'primary' ? '#173d35' : '#fffefb',
    boxShadow: variant === 'primary' ? '0 8px 20px rgba(23, 61, 53, 0.16)' : 'none',
    cursor: 'pointer',
    touchAction: 'manipulation',
    fontSize: '0.82rem',
    fontWeight: 720,
    transition: 'transform 160ms ease, background-color 160ms ease, border-color 160ms ease',

    '&:hover:not(:disabled)': {
        backgroundColor: variant === 'primary' ? '#215448' : '#f3f1eb',
        transform: 'translateY(-1px)'
    },

    '&:active:not(:disabled)': {
        transform: 'translateY(0)'
    },

    '&:focus-visible': {
        outline: '3px solid rgba(39, 107, 90, 0.24)',
        outlineOffset: '2px'
    },

    '&:disabled': {
        color: '#9a9f9c',
        borderColor: '#e0dfda',
        backgroundColor: '#eeede8',
        boxShadow: 'none',
        cursor: 'not-allowed'
    },

    [MQ.mobile]: {
        width: '100%',
        minHeight: '3rem'
    }
}));

const ButtonContent = styled.span({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.55rem'
});

const Arrow = styled.span({
    fontSize: '1rem',
    fontWeight: 500,
    lineHeight: 1
});
