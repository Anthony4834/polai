import styled from '@emotion/styled';
import { MQ } from '../util';

export const Panel = styled.section({
    minWidth: 0,
    minHeight: '650px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fffefb',

    [MQ.mobile]: {
        minHeight: 0
    }
});

export const PanelHeader = styled.header({
    minHeight: '6rem',
    padding: '1.4rem clamp(1.25rem, 3vw, 2rem) 1.15rem',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '1rem',
    borderBottom: '1px solid #ebe9e2'
});

export const PanelHeading = styled.div({
    minWidth: 0
});

export const PanelEyebrow = styled.p({
    margin: '0 0 0.35rem',
    color: '#7b827e',
    fontSize: '0.66rem',
    fontWeight: 720,
    letterSpacing: '0.13em',
    textTransform: 'uppercase'
});

export const PanelTitle = styled.h2({
    margin: 0,
    color: '#1d2925',
    fontSize: '1.05rem',
    fontWeight: 720,
    letterSpacing: '-0.015em',
    textWrap: 'balance'
});

export const PanelMeta = styled.span({
    flexShrink: 0,
    color: '#7a837f',
    fontSize: '0.72rem',
    fontVariantNumeric: 'tabular-nums'
});
