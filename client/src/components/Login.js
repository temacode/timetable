import React from 'react';
import LoginForm from './LoginForm';
import Header from './Header';

class Login extends React.Component {
    render() {
        return (
            <div>
                <Header></Header>
                <LoginForm isLoading={this.props.isLoading} onSubmit={this.props.submit}></LoginForm>
            </div>
        );
    }
}

export default Login;