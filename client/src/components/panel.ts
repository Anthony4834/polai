import styled from '@emotion/styled';
import { MQ } from '../util';

export const Panel = styled.div({
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
