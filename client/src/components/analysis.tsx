import styled from '@emotion/styled';
import { forwardRef, type FC } from 'react';
import clipboard from '../assets/clipboard.png';
import { calculateBiasPercent, type Highlight } from '../highlights';
import { MQ } from '../util';
import { Panel } from './panel';

interface AnalysisProps {
    highlights: Highlight[];
    text: string;
    summary: string;
}

const percentToColor = (percent: number) => {
    if (percent < 30) return '#8BC34A';
    if (percent < 50) return '#debc6d';
    if (percent < 75) return '#FFA726';
    return '#FF6F61';
};

export const Analysis = forwardRef<HTMLDivElement, AnalysisProps>((props, ref) => {
    const { highlights } = props;

    return (
        <AnalysisBase isEmpty={highlights.length === 0} ref={ref}>
            <Content {...props} />
        </AnalysisBase>
    );
});

const Content: FC<AnalysisProps> = props => {
    const { highlights, summary } = props;
    const percent = calculateBiasPercent(props.text, highlights);

    if (!summary)
        return (
            <EmptyState>
                <p>Enter some text to get started</p>
            </EmptyState>
        );

    if (highlights.length === 0)
        return (
            <EmptyState>
                <img src={clipboard} alt='clipboard' />
                <Summary>{summary}</Summary>
                <PercentBiased color={percentToColor(Number(percent))}>{percent}%</PercentBiased>
            </EmptyState>
        );

    return (
        <>
            <PercentBiased color={percentToColor(Number(percent))}>{percent}%</PercentBiased>
            <Summary>{summary}</Summary>
            <HighlightEntryContainer>
                {highlights.map((highlight, index) => (
                    <HighlightEntry key={index} backgroundColor={highlight.color}>
                        {highlight.reason}
                    </HighlightEntry>
                ))}
            </HighlightEntryContainer>
        </>
    );
};

const AnalysisBase = styled(Panel)<{ isEmpty: boolean }>(({ isEmpty }) => ({
    rowGap: '1rem',
    justifyContent: isEmpty ? 'center' : 'flex-start',

    '& > h2': {
        marginTop: '1rem'
    },

    [MQ.mobile]: {
        width: '90%',
        height: '80vh',
        marginTop: '2rem',
        padding: '2%'
    }
}));

const PercentBiased = styled('h2')<{ color: string }>(({ color }) => ({
    fontSize: '2rem',
    position: 'relative',
    color,
    margin: '0',
    padding: '0'
}));

const Summary = styled('p')({
    fontSize: '1.2rem',
    margin: '0',
    padding: '0',

    [MQ.mobile]: {
        color: 'black',
        fontSize: '1rem',
        padding: '0 0.5rem'
    }
});

const HighlightEntryContainer = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '1rem',
    overflowY: 'auto'
});

const HighlightEntry = styled('div')<{ backgroundColor: string }>(({ backgroundColor }) => ({
    padding: '1rem',
    backgroundColor,
    borderRadius: '0.5rem',
    fontSize: '1.2rem',

    [MQ.mobile]: {
        fontSize: '1rem'
    }
}));

const EmptyState = styled('div')({
    position: 'relative',
    color: 'gray',
    margin: 'auto',
    textAlign: 'center',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    rowGap: '1.5rem',

    '& > img': {
        position: 'relative',
        left: '-3%',
        width: '35%'
    },

    '& > p': {
        position: 'relative',
        fontSize: '1.5rem'
    }
});
