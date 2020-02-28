import React from 'react';
import MainContainer from './components/MainContainer';
import { withCookies } from 'react-cookie';

const App = props => (
    <div>
        <MainContainer cookies={ props.cookies }></MainContainer>
    </div>
);

export default withCookies(App);