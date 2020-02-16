import React from 'react';
import styled from 'styled-components';

const MainBlock = styled.div`
    width: 100%;
    min-height: 100%;
    padding: 20px;
    background: red;
    box-sizing: border-box;
`;

class Main extends React.Component {

    componentDidMount() {
        this.props.getShedule();
    }

    componentDidUpdate() {
        console.log(this.props.shedule);
    }

    render() {
        return(
            <MainBlock>
                <p>Боди</p>
                <div>
                    {this.props.shedule ? 'Чот есть' : 'Ничего нет' }
                </div>
            </MainBlock>
        );
    }
}

export default Main;