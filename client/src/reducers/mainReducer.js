import axios from 'axios';

const SHOW_SHEDULE = 'SHOW_SHEDULE';

let initialState = {

}

let mainReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_SHEDULE:
            let sheduleState = { ...state };
            sheduleState.shedule = action.data;
            return sheduleState;
        default:
            return state;
    }
}

const showSheduleActionCreator = (data) => ({
    type: SHOW_SHEDULE,
    data: data
})

export const getSheduleDataThunkCreator = () => dispatch => {
    axios.get('/api/timetable/').then(res => {
        dispatch(showSheduleActionCreator(res));
    });
}

export default mainReducer;