import React from 'react';
import styled from 'styled-components';

const HeaderBlock = styled.div`
    width: 100%;
    height: 58px;
    background: #986161;
    overflow: hidden;
    h1 {
        color: white;
        text-align: center;
        font-size: 25px;
        margin-top: 12px;
    }
`;

const Header = props => (
    <HeaderBlock>
        <h1>Хедер</h1>
    </HeaderBlock>
);

export default Header;