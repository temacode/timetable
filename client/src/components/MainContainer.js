import { connect } from 'react-redux';
import Main from './Main';
import { getSheduleDataThunkCreator, showGroupsSelectActionCreator } from '../reducers/mainReducer';

let mapStateToProps = state => {
    return({
        groups: state.main.groups,
        isSelectingGroup: state.main.isSelectingGroup,
    });
}

let mapDispatchToProps = dispatch => {
    return({
        getShedule: () => {
            dispatch(getSheduleDataThunkCreator());
        },
        showGroupsSelect: () => {
            dispatch(showGroupsSelectActionCreator())
        }
    });
}

let MainContainer = connect(mapStateToProps, mapDispatchToProps)(Main);

export default MainContainer;