import React from 'react';
import styled from 'styled-components';
import { Field } from 'redux-form';
import { PongSpinner } from "react-spinners-kit";

const StyledFieldButton = styled(Field)`
    position: relative;
    box-sizing: border-box;
    display: block;
    background: black;
    color: white;
    font-weight: 600;
    font-size: 12px;
    border: none;
    border-radius: 6px;
    width: 80%;
    height: 40px;
    margin: auto;
    margin-top: 20px;
`;

const StyledLoader = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    transition: 0.3s;
    background: ${props => props.isLoading ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0)'};
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    border-radius: 6px;
`;

const Spinner = styled.div`
    display: block;
    margin: auto;
    width: 50px;
    height: 20px;
    margin-top: 8px;
`;

const FieldButton = ({ name, component, type, placeholder, isLoading, ...props }) => {
    return (
        <StyledFieldButton name={name}
            component={component}
            type={type}
            placeholder={placeholder}>
            <StyledLoader isLoading={isLoading}><Spinner><PongSpinner size={40} color="#393939" loading={isLoading}></PongSpinner></Spinner></StyledLoader>
            {props.children ? props.children : ''}
        </StyledFieldButton>
    );
}

export default FieldButton;