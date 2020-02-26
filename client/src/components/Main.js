import React from 'react';
import styled from 'styled-components';
import GroupContainer from './GroupContainer';

const MainBlock = styled.div`
    width: 100%;
    min-height: 100%;
    padding: 20px;
    box-sizing: border-box;
`;

const GroupSelect = styled.div`
    display: inline-block;
    padding: 8px 16px;
    border-radius: 6px;
    box-shadow: 0 1px 6px 1px rgba(0,0,0,0.15);
    margin-bottom: 20px;
    cursor: pointer;
    height: ${props => props.isSelecting ? props.itemsNum*45+'px' : '20px'};
    transition: 0.1s;
    user-select: none;
    overflow: hidden;
`;

const GroupSelectObj = styled.div`
    margin: 5px;
    text-align: center;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: red;
`;

class Main extends React.Component {

    componentDidMount() {
        this.props.getShedule();
    }

    componentDidUpdate() {
        console.log(this.props.groups);
    }

    render() {
        let groupSelectList = this.props.groups.map((e, i) => {
            return (
                <GroupSelectObj key={ i }>{e.groupName}</GroupSelectObj>
            );
        });

        let groups = this.props.groups.map((e, i) => {
            return (<GroupContainer key={i} group={e}></GroupContainer>);
        });
        return (
            <MainBlock>
                <GroupSelect onClick={this.props.showGroupsSelect} itemsNum={ groupSelectList.length } isSelecting={this.props.isSelectingGroup}>{this.props.isSelectingGroup ? groupSelectList : 'Выбор группы'}</GroupSelect>
                <div>
                    {this.props.groups ? groups : 'Ничего нет'}
                </div>
            </MainBlock>
        );
    }
}

export default Main;