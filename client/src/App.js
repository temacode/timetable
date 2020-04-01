import React from 'react';
import MainContainer from './components/MainContainer';
import { Switch, Route } from 'react-router-dom';
import LoginContainer from './components/LoginContainer';

const App = props => (
    <div>
        <Switch>
            <Route path="/login">
                <LoginContainer></LoginContainer>
            </Route>
            <Route path="/">
                <MainContainer></MainContainer>
            </Route>
        </Switch>
    </div>
);

export default App;