import axios from 'axios';

const SHOW_SHEDULE = 'SHOW_SHEDULE';
const SHOW_GROUPS = 'SHOW_GROUPS';

let initialState = {
    groups: [],
    groupsNames: [],
    isSelectingGroup: false,
}

let mainReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_SHEDULE:
            let sheduleState = { ...state };

            //console.log(action.data);
            sheduleState.groups = [...action.data];
            //console.log(sheduleState.groups);
            return sheduleState;
        case SHOW_GROUPS:
            let showGroupsState = { ...state };
            showGroupsState.isSelectingGroup = !showGroupsState.isSelectingGroup;

            return showGroupsState;
        default:
            return state;
    }
}

const showSheduleActionCreator = (data) => {
    //console.log(data[4].shedule[2][3]);
    return({
        type: SHOW_SHEDULE,
        data: data,
    });
}

export const showGroupsSelectActionCreator = (data) => {
    return ({
        type: SHOW_GROUPS,
    });
}

export const getSheduleDataThunkCreator = () => dispatch => {
    axios.get('/api/timetable/').then(res => {
        dispatch(showSheduleActionCreator(res.data));
    });
}

export default mainReducer;