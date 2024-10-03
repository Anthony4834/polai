/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import React, { useRef, useState } from 'react';
import { MQ } from '../util';
import { Analysis } from './analysis';
import { Input } from './input';

const Container = styled.div({
    position: 'relative',
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: '2rem',
    backgroundColor: '#f5f5f5',

    [MQ.mobile]: {
        height: 'unset',
        flexDirection: 'column',
        rowGap: '0rem',
        overflowY: 'scroll',
        paddingBottom: '1vh'
    }
});

export type Highlight = { start: number; end: number; color: string; reason: string; fixed: string };

export const Main: React.FC = () => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const analysisRef = useRef<HTMLDivElement>(null);

    const processingMiddleware = (val: boolean) => {
        setIsProcessing(val);
        if (!val && analysisRef.current) {
            analysisRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <Container>
            <Input
                text={text}
                setText={setText}
                highlights={highlights}
                setHighlights={setHighlights}
                isProcessing={isProcessing}
                setIsProcessing={processingMiddleware}
                setSummary={val => setSummary(val)}
            />
            <Analysis ref={analysisRef} highlights={highlights} text={text} summary={summary} />
        </Container>
    );
};
