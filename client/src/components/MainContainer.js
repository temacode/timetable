import { connect } from 'react-redux';
import Main from './Main';
import { getSheduleDataThunkCreator } from '../reducers/mainReducer';

let mapStateToProps = state => {
    return({
        shedule: state.main.shedule ? state.main.shedule : null
    });
}

let mapDispatchToProps = dispatch => {
    return({
        getShedule: () => {
            dispatch(getSheduleDataThunkCreator());
        }
    });
}

let MainContainer = connect(mapStateToProps, mapDispatchToProps)(Main);

export default MainContainer;