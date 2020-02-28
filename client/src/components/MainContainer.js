import { connect } from 'react-redux';
import Main from './Main';
import { getSheduleDataThunkCreator, setGroupCookieThunkCreator } from '../reducers/mainReducer';
import { translitToRus } from '../helpers/translitToRus';

let mapStateToProps = (state, ownProps) => {
    return({
        cookies: ownProps.cookies,
        groups: state.main.groups,
        selectedGroup: state.main.selectedGroup,
        selectedGroupRus: translitToRus(state.main.selectedGroup),
        isSelectingGroup: state.main.isSelectingGroup,
    });
}

let mapDispatchToProps = dispatch => {
    return({
        getShedule: (cookies) => {
            dispatch(getSheduleDataThunkCreator(cookies));
        },
        setGroupCookie: (cookies, value, ref) => {
            dispatch(setGroupCookieThunkCreator(cookies, value, ref));
        }
    });
}

let MainContainer = connect(mapStateToProps, mapDispatchToProps)(Main);

export default MainContainer;