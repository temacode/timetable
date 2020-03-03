import React from 'react';
import styled from 'styled-components';
import GroupContainer from './GroupContainer';
import Header from './Header';

const MainBlock = styled.div`
    width: 100%;
    min-height: 100%;
    box-sizing: border-box;
`;

const GroupSelect = styled.div`
    overflow-x: scroll;
    display: flex;
    align-items: flex-start;
    padding: 10px 15px 20px 15px;

`;

const GroupSelectObj = styled.div`
    display: flex;
    flex-shrink: 0;
    align-items: center;
    padding: 8px 16px;
    border-radius: 6px;
    box-shadow: 0 7px 19px -1px hsla(240,4%,69%,.3);
    margin: 5px 10px;
    :first-child {
        margin-left: 0;
    }
    height: 40px;
    background: ${props => props.selected ? '#66AC7E' : ''};
    color: ${props => props.selected ? 'white' : ''};
`;

class Main extends React.Component {
    componentDidMount() {
        const { cookies } = this.props;
        this.props.getShedule(cookies);
    }

    componentDidUpdate() {
        console.log(this.props.groups);
        if (this.props.isSelectingGroup) {
            console.log(this.refs);
            this.refs.groupSelect.scrollLeft = 0;
        }
    }

    render() {
        let groupSelectList = this.props.groups.map((e, i) => {
            if (e.groupName !== this.props.selectedGroup) {
                return (
                    <GroupSelectObj key={i} onClick={() => { this.props.setGroupCookie(e.groupName, this.refs.groupSelect) }}>{e.groupNameRus}</GroupSelectObj>
                );
            }
            return null;
        });

        let groups = this.props.groups.map((e, i) => {
            if (e.groupName === this.props.selectedGroup) {
                return (<GroupContainer key={i} group={e}></GroupContainer>);
            }
            return null;
        });
        return (
            <div>
                <Header></Header>
                <MainBlock>
                    <GroupSelect ref="groupSelect">
                        <GroupSelectObj selected>{this.props.selectedGroupRus}</GroupSelectObj>
                        {groupSelectList}
                    </GroupSelect>
                    {this.props.groups.length > 0 ? groups : 'Загрузка'}
                </MainBlock>
            </div>
        );
    }
}

export default Main;