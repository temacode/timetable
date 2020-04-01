import { connect } from 'react-redux';
import Main from './Main';
import { getSheduleDataThunkCreator, setGroupCookieThunkCreator } from '../reducers/mainReducer';
import { translitToRus } from '../helpers/translitToRus';

let mapStateToProps = (state) => {
    return({
        groups: state.main.groups,
        selectedGroup: state.main.selectedGroup,
        selectedGroupRus: translitToRus(state.main.selectedGroup),
        isSelectingGroup: state.main.isSelectingGroup,
    });
}

let mapDispatchToProps = dispatch => {
    return({
        getShedule: () => {
            dispatch(getSheduleDataThunkCreator());
        },
        setGroupCookie: (value, ref) => {
            dispatch(setGroupCookieThunkCreator(value, ref));
        }
    });
}

let MainContainer = connect(mapStateToProps, mapDispatchToProps)(Main);

export default MainContainer;