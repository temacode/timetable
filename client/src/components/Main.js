import React from 'react';
import styled from 'styled-components';
import GroupContainer from './GroupContainer';

const MainBlock = styled.div`
    width: 100%;
    min-height: 100%;
    padding: 20px;
    box-sizing: border-box;
`;

class Main extends React.Component {

    componentDidMount() {
        this.props.getShedule();
    }

    componentDidUpdate() {
        console.log(this.props.groups);
    }

    render() {
        let groups = this.props.groups.map((e, i) => {
            return (<GroupContainer key={i} group={e}></GroupContainer>);
        });
        return (
            <MainBlock>
                <div>
                    {this.props.groups ? groups : 'Ничего нет'}
                </div>
            </MainBlock>
        );
    }
}

export default Main;