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
        font-size: 20px;
        margin-top: 12px;
        font-family: Rubik Mono One;
    }
    span {
        color: #999999;
        font-size: 12px;
        margin-left: 5px;
    }
`;

const Header = props => (
    <HeaderBlock>
        <h1>КАРАНТИН<span> в МИРЭА</span></h1>
    </HeaderBlock>
);

export default Header;