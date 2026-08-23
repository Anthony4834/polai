import styled from '@emotion/styled';
import { forwardRef, type FC } from 'react';
import { calculateBiasPercent, type Highlight } from '../highlights';
import { MQ } from '../util';
import {
    Panel,
    PanelEyebrow,
    PanelHeader,
    PanelHeading,
    PanelMeta,
    PanelTitle
} from './panel';

interface AnalysisProps {
    highlights: Highlight[];
    text: string;
    summary: string;
}

const percentToColor = (percent: number) => {
    if (percent < 30) return '#26725f';
    if (percent < 50) return '#8a6a1b';
    if (percent < 75) return '#a65b2a';
    return '#a63d40';
};

export const Analysis = forwardRef<HTMLElement, AnalysisProps>((props, ref) => {
    const { highlights, summary } = props;
    const reportStatus = !summary
        ? 'Waiting for text'
        : highlights.length === 0
            ? 'No passages flagged'
            : `${highlights.length} ${highlights.length === 1 ? 'finding' : 'findings'}`;

    return (
        <AnalysisBase ref={ref} aria-label='Analysis report' aria-live='polite'>
            <PanelHeader>
                <PanelHeading>
                    <PanelEyebrow>02 / Report</PanelEyebrow>
                    <PanelTitle>Framing Analysis</PanelTitle>
                </PanelHeading>
                <PanelMeta>{reportStatus}</PanelMeta>
            </PanelHeader>
            <Content {...props} />
        </AnalysisBase>
    );
});

const Content: FC<AnalysisProps> = ({ highlights, summary, text }) => {
    if (!summary) {
        return (
            <EmptyState>
                <EmptyMark aria-hidden='true'>
                    <svg viewBox='0 0 48 48' focusable='false'>
                        <path d='M12 15.5h24M12 24h16M12 32.5h20' />
                        <circle cx='35' cy='24' r='7' />
                    </svg>
                </EmptyMark>
                <EmptyEyebrow>Ready when you are</EmptyEyebrow>
                <EmptyTitle>Your analysis will appear here.</EmptyTitle>
                <EmptyCopy>
                    PolAI will summarize the framing, mark exact passages, and suggest clearer language.
                </EmptyCopy>
            </EmptyState>
        );
    }

    const percent = Number(calculateBiasPercent(text, highlights));
    const scoreColor = percentToColor(percent);
    return (
        <ReportBody>
            <ScoreSection>
                <ScoreTopline>
                    <ScoreNumber $tone={scoreColor}>{percent.toFixed(2)}%</ScoreNumber>
                    <ScoreLabel>of the source text flagged</ScoreLabel>
                </ScoreTopline>
                <ScoreTrack aria-hidden='true'>
                    <ScoreFill $tone={scoreColor} $progress={Math.min(1, Math.max(0, percent / 100))} />
                </ScoreTrack>
            </ScoreSection>

            <SummarySection>
                <SectionLabel>Overview</SectionLabel>
                <Summary>{summary}</Summary>
            </SummarySection>

            {highlights.length === 0 ? (
                <NeutralNotice>
                    <CheckMark aria-hidden='true'>✓</CheckMark>
                    <span>No passages were flagged in this analysis.</span>
                </NeutralNotice>
            ) : (
                <FindingsSection>
                    <FindingsHeader>
                        <SectionLabel>Flagged passages</SectionLabel>
                        <FindingsCount>{highlights.length}</FindingsCount>
                    </FindingsHeader>
                    <FindingsList>
                        {highlights.map((highlight, index) => (
                            <Finding key={`${highlight.start}-${highlight.end}-${index}`} $tone={highlight.color}>
                                <FindingNumber>
                                    <ToneDot $tone={highlight.color} aria-hidden='true' />
                                    Passage {String(index + 1).padStart(2, '0')}
                                </FindingNumber>
                                <FindingQuote>“{highlight.line}”</FindingQuote>
                                <FindingReason>{highlight.reason}</FindingReason>
                                <Suggestion>
                                    <SuggestionLabel>Clearer alternative</SuggestionLabel>
                                    <span>{highlight.fixed}</span>
                                </Suggestion>
                            </Finding>
                        ))}
                    </FindingsList>
                </FindingsSection>
            )}
        </ReportBody>
    );
};

const AnalysisBase = styled(Panel)({
    backgroundColor: '#fcfbf7',

    [MQ.mobile]: {
        scrollMarginTop: '1rem'
    }
});

const EmptyState = styled.div({
    maxWidth: '390px',
    margin: 'auto',
    padding: '3rem 2rem',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    color: '#68716d',
    textAlign: 'center'
});

const EmptyMark = styled.div({
    width: '4rem',
    height: '4rem',
    marginBottom: '1.5rem',
    display: 'grid',
    placeItems: 'center',
    color: '#387565',
    border: '1px solid #cedbd5',
    borderRadius: '50%',
    backgroundColor: '#eef5f1',

    '& svg': {
        width: '2.1rem',
        height: '2.1rem',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: 1.6,
        strokeLinecap: 'round'
    }
});

const EmptyEyebrow = styled.p({
    margin: '0 0 0.6rem',
    color: '#387565',
    fontSize: '0.67rem',
    fontWeight: 760,
    letterSpacing: '0.13em',
    textTransform: 'uppercase'
});

const EmptyTitle = styled.h3({
    margin: 0,
    color: '#24302c',
    fontFamily: 'Iowan Old Style, Baskerville, Georgia, serif',
    fontSize: '1.65rem',
    fontWeight: 520,
    letterSpacing: '-0.03em',
    textWrap: 'balance'
});

const EmptyCopy = styled.p({
    margin: '0.85rem 0 0',
    fontSize: '0.88rem',
    lineHeight: 1.65,
    textWrap: 'pretty'
});

const ReportBody = styled.div({
    minHeight: 0,
    flex: 1,
    padding: 'clamp(1.5rem, 3vw, 2.25rem)',
    overflowY: 'auto'
});

const ScoreSection = styled.section({
    paddingBottom: '1.75rem',
    borderBottom: '1px solid #e5e3dc'
});

const ScoreTopline = styled.div({
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: '1rem'
});

const ScoreNumber = styled.p<{ $tone: string }>(({ $tone }) => ({
    margin: 0,
    color: $tone,
    fontFamily: 'Iowan Old Style, Baskerville, Georgia, serif',
    fontSize: 'clamp(2.75rem, 6vw, 4.5rem)',
    fontWeight: 500,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '-0.055em',
    lineHeight: 1
}));

const ScoreLabel = styled.span({
    maxWidth: '9rem',
    color: '#77807c',
    fontSize: '0.72rem',
    lineHeight: 1.4,
    textAlign: 'right'
});

const ScoreTrack = styled.div({
    height: '0.3rem',
    marginTop: '1.1rem',
    overflow: 'hidden',
    borderRadius: '1rem',
    backgroundColor: '#e7e6e0'
});

const ScoreFill = styled.div<{ $tone: string; $progress: number }>(({ $tone, $progress }) => ({
    width: '100%',
    height: '100%',
    borderRadius: 'inherit',
    backgroundColor: $tone,
    transform: `scaleX(${$progress})`,
    transformOrigin: 'left center',
    transition: 'transform 450ms cubic-bezier(0.2, 0.8, 0.2, 1)'
}));

const SummarySection = styled.section({
    padding: '1.65rem 0'
});

const SectionLabel = styled.h3({
    margin: 0,
    color: '#777f7b',
    fontSize: '0.67rem',
    fontWeight: 760,
    letterSpacing: '0.13em',
    textTransform: 'uppercase'
});

const Summary = styled.p({
    margin: '0.75rem 0 0',
    color: '#29342f',
    fontFamily: 'Iowan Old Style, Baskerville, Georgia, serif',
    fontSize: 'clamp(1.15rem, 2vw, 1.4rem)',
    lineHeight: 1.55,
    letterSpacing: '-0.02em',
    textWrap: 'pretty'
});

const NeutralNotice = styled.div({
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    color: '#2d5e51',
    border: '1px solid #d3e3dc',
    borderRadius: '0.75rem',
    backgroundColor: '#f0f6f3',
    fontSize: '0.82rem'
});

const CheckMark = styled.span({
    width: '1.5rem',
    height: '1.5rem',
    display: 'grid',
    flexShrink: 0,
    placeItems: 'center',
    color: '#fff',
    borderRadius: '50%',
    backgroundColor: '#2f7965',
    fontSize: '0.75rem',
    fontWeight: 800
});

const FindingsSection = styled.section({
    paddingTop: '0.2rem'
});

const FindingsHeader = styled.div({
    marginBottom: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
});

const FindingsCount = styled.span({
    color: '#65706b',
    fontSize: '0.72rem',
    fontVariantNumeric: 'tabular-nums'
});

const FindingsList = styled.ol({
    margin: 0,
    padding: 0,
    display: 'grid',
    gap: '0.75rem',
    listStyle: 'none'
});

const Finding = styled.li<{ $tone: string }>(({ $tone }) => ({
    padding: '1rem 1rem 1rem 1.15rem',
    border: '1px solid #e2e1da',
    borderRadius: '0.8rem',
    backgroundColor: '#fffefb',
    boxShadow: `inset 3px 0 0 ${$tone}`
}));

const FindingNumber = styled.p({
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '0.45rem',
    color: '#7b827e',
    fontSize: '0.64rem',
    fontWeight: 760,
    letterSpacing: '0.1em',
    textTransform: 'uppercase'
});

const ToneDot = styled.span<{ $tone: string }>(({ $tone }) => ({
    width: '0.48rem',
    height: '0.48rem',
    borderRadius: '50%',
    backgroundColor: $tone,
    boxShadow: 'inset 0 0 0 1px rgba(23, 33, 31, 0.08)'
}));

const FindingQuote = styled.blockquote({
    margin: '0.65rem 0 0',
    color: '#26322e',
    fontFamily: 'Iowan Old Style, Baskerville, Georgia, serif',
    fontSize: '1rem',
    fontWeight: 600,
    lineHeight: 1.45,
    overflowWrap: 'anywhere'
});

const FindingReason = styled.p({
    margin: '0.55rem 0 0',
    color: '#69716e',
    fontSize: '0.78rem',
    lineHeight: 1.55,
    overflowWrap: 'anywhere'
});

const Suggestion = styled.div({
    marginTop: '0.8rem',
    paddingTop: '0.75rem',
    display: 'grid',
    gap: '0.3rem',
    color: '#34413c',
    borderTop: '1px solid #ebe9e2',
    fontSize: '0.78rem',
    lineHeight: 1.5,
    overflowWrap: 'anywhere'
});

const SuggestionLabel = styled.span({
    color: '#397563',
    fontSize: '0.62rem',
    fontWeight: 760,
    letterSpacing: '0.09em',
    textTransform: 'uppercase'
});
