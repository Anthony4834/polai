/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useRef, useState } from 'react';
import type { Highlight } from '../highlights';
import { MQ } from '../util';
import { Analysis } from './analysis';
import { Input } from './input';

export const Main = () => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const analysisRef = useRef<HTMLElement>(null);

    const handleProcessingChange = (isActive: boolean) => {
        setIsProcessing(isActive);

        if (!isActive && analysisRef.current && window.matchMedia('(max-width: 900px)').matches) {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            analysisRef.current.scrollIntoView({
                behavior: prefersReducedMotion ? 'auto' : 'smooth',
                block: 'start'
            });
        }
    };

    return (
        <Page>
            <SkipLink href='#workspace'>Skip to analysis workspace</SkipLink>
            <TopBar>
                <Brand href='#workspace' aria-label='PolAI home'>
                    <BrandMark aria-hidden='true'>P</BrandMark>
                    <BrandText translate='no'>
                        <BrandName>PolAI</BrandName>
                        <BrandDescriptor>Language intelligence</BrandDescriptor>
                    </BrandText>
                </Brand>
                <ModelLabel translate='no'>
                    <ModelDot aria-hidden='true' />
                    GPT-5.6 Luna
                </ModelLabel>
            </TopBar>

            <Intro>
                <Eyebrow>Political bias analyzer</Eyebrow>
                <Title>See the framing beneath the words.</Title>
                <Description>
                    Paste any passage. PolAI maps political framing, explains why it matters,
                    and helps you rewrite with a clearer hand.
                </Description>
            </Intro>

            <Workspace id='workspace' aria-label='Bias analysis workspace'>
                <Input
                    text={text}
                    setText={setText}
                    highlights={highlights}
                    setHighlights={setHighlights}
                    isProcessing={isProcessing}
                    setIsProcessing={handleProcessingChange}
                    setSummary={setSummary}
                />
                <Analysis ref={analysisRef} highlights={highlights} text={text} summary={summary} />
            </Workspace>

            <PageFooter>
                <span>PolAI</span>
                <span>Analysis is a reading aid, not an automated verdict.</span>
            </PageFooter>
        </Page>
    );
};

const Page = styled.main({
    width: '100%',
    minHeight: '100dvh',
    padding: '1.5rem clamp(1rem, 4vw, 4rem) 2rem',
    color: '#17211f',
    backgroundColor: '#f3f1eb',

    [MQ.mobile]: {
        padding: '1rem 0.875rem 1.5rem'
    }
});

const SkipLink = styled.a({
    position: 'fixed',
    top: '0.75rem',
    left: '0.75rem',
    zIndex: 10,
    padding: '0.7rem 0.9rem',
    color: '#fffefb',
    borderRadius: '0.55rem',
    backgroundColor: '#173d35',
    boxShadow: '0 8px 24px rgba(23, 61, 53, 0.24)',
    textDecoration: 'none',
    transform: 'translateY(calc(-100% - 1rem))',
    transition: 'transform 160ms ease',

    '&:focus-visible': {
        outline: '3px solid rgba(39, 107, 90, 0.3)',
        outlineOffset: '2px',
        transform: 'translateY(0)'
    }
});

const TopBar = styled.header({
    width: 'min(100%, 1440px)',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem'
});

const Brand = styled.a({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: 'inherit',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    transition: 'opacity 160ms ease',

    '&:hover': {
        opacity: 0.72
    },

    '&:focus-visible': {
        outline: '3px solid rgba(31, 111, 91, 0.28)',
        outlineOffset: '4px'
    }
});

const BrandMark = styled.span({
    width: '2.25rem',
    height: '2.25rem',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '0.65rem',
    color: '#f8f6f0',
    backgroundColor: '#173d35',
    fontFamily: 'Georgia, serif',
    fontSize: '1.15rem',
    fontWeight: 700
});

const BrandText = styled.span({
    display: 'flex',
    flexDirection: 'column',
    lineHeight: 1.1
});

const BrandName = styled.span({
    fontSize: '0.95rem',
    fontWeight: 760,
    letterSpacing: '-0.01em'
});

const BrandDescriptor = styled.span({
    marginTop: '0.2rem',
    color: '#6f7773',
    fontSize: '0.7rem',
    letterSpacing: '0.08em',
    textTransform: 'uppercase'
});

const ModelLabel = styled.span({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    color: '#5c6661',
    fontSize: '0.78rem',
    fontWeight: 650,
    letterSpacing: '0.02em'
});

const ModelDot = styled.span({
    width: '0.45rem',
    height: '0.45rem',
    borderRadius: '50%',
    backgroundColor: '#2d876f',
    boxShadow: '0 0 0 4px rgba(45, 135, 111, 0.12)'
});

const Intro = styled.section({
    width: 'min(100%, 1440px)',
    margin: 'clamp(3rem, 7vh, 5.5rem) auto clamp(2rem, 4vh, 3.25rem)'
});

const Eyebrow = styled.p({
    margin: '0 0 0.9rem',
    color: '#276b5a',
    fontSize: '0.72rem',
    fontWeight: 760,
    letterSpacing: '0.16em',
    textTransform: 'uppercase'
});

const Title = styled.h1({
    maxWidth: '850px',
    margin: 0,
    color: '#17211f',
    fontFamily: 'Iowan Old Style, Baskerville, Georgia, serif',
    fontSize: 'clamp(2.75rem, 6.2vw, 5.5rem)',
    fontWeight: 500,
    letterSpacing: '-0.055em',
    lineHeight: 0.98,
    textWrap: 'balance',

    [MQ.mobile]: {
        fontSize: 'clamp(2.65rem, 14vw, 4rem)',
        lineHeight: 0.96
    }
});

const Description = styled.p({
    maxWidth: '670px',
    margin: '1.5rem 0 0',
    color: '#5d6762',
    fontSize: 'clamp(1rem, 1.5vw, 1.18rem)',
    lineHeight: 1.65,
    textWrap: 'pretty'
});

const Workspace = styled.div({
    width: 'min(100%, 1440px)',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.08fr) minmax(340px, 0.92fr)',
    overflow: 'hidden',
    border: '1px solid #d8d6cf',
    borderRadius: '1.25rem',
    backgroundColor: '#fffefb',
    boxShadow: '0 22px 70px rgba(26, 39, 35, 0.08)',
    scrollMarginTop: '1rem',

    '& > section + section': {
        borderLeft: '1px solid #dfddd6'
    },

    [MQ.tablet]: {
        gridTemplateColumns: '1fr',

        '& > section + section': {
            borderTop: '1px solid #dfddd6',
            borderLeft: 0
        }
    }
});

const PageFooter = styled.footer({
    width: 'min(100%, 1440px)',
    margin: '1.25rem auto 0',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1rem',
    color: '#7b827e',
    fontSize: '0.74rem',

    '& > span:first-of-type': {
        color: '#34423d',
        fontWeight: 720
    },

    [MQ.mobile]: {
        alignItems: 'flex-start',
        flexDirection: 'column'
    }
});
