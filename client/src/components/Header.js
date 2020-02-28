import React from 'react';
import styled from 'styled-components';

const HeaderBlock = styled.div`
    width: 100%;
    box-sizing: border-box;
    height: 58px;
    background: #fff;
    border-bottom: 1px solid #eaeaea;
    overflow: hidden;
    padding: 5px 20px;
    h1 {
        color: #393939;
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