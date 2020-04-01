import React from 'react';
import { reduxForm, Field } from 'redux-form';
import styled from 'styled-components';
import FieldButton from '../design-kit/FieldButton';

const StyledForm = styled.form`
    width: 90%;
    margin: auto;
    margin-top: 20px;
`;

const FormHeader = styled.p`
    text-align: center;
    font-size: 25px;
    font-family: Rubik Mono One;
`;

const FieldBlock = styled.div`
    width: 100%;
    box-shadow: 0 1px 6px 1px rgba(0,0,0,0.09);
    border-radius: 12px;
    overflow: hidden;
    margin-top: 20px;
`;

const StyledField = styled(Field)`
    box-sizing: border-box;
    height: 50px;
    width: 100%;
    border: none;
    padding: 15px 20px;
    outline: none;
    transition: 0.3s;
    :focus {
        padding-left: 30px;
    }
`;

const LoginForm = reduxForm({
    form: 'login'
})(props => {
    const { handleSubmit } = props;

    return (
        <StyledForm onSubmit={handleSubmit}>
            <FormHeader>Вход</FormHeader>
            <FieldBlock>
                <StyledField name="login" component="input" type="text" placeholder="Логин"></StyledField>
                <StyledField name="password" component="input" type="password" placeholder="Пароль"></StyledField>
            </FieldBlock>
            <FieldButton isLoading={props.isLoading} name="sibmit" component="button" type="submit">Отправить</FieldButton>
        </StyledForm>
    );
});

export default LoginForm;