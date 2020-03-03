import axios from 'axios';
import { scrollTo } from '../helpers/scrollLeftAnimation';

const SHOW_SHEDULE = 'SHOW_SHEDULE';
const SET_GROUP_COOKIE = 'SET_GROUP_COOKIE';

let initialState = {
    groups: [],
    selectedGroup: 'bbbo-05-17',
}

let mainReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_SHEDULE:
            let sheduleState = { ...state };

            sheduleState.groups = [...action.data];

            return sheduleState;
        case SET_GROUP_COOKIE:
            let setGroupCookieState = { ...state };
            setGroupCookieState.selectedGroup = action.data;

            return setGroupCookieState;
        default:
            return state;
    }
}

const showSheduleActionCreator = (data) => {
    return({
        type: SHOW_SHEDULE,
        data: data,
    });
}

const setGroupCookieActionCreator = data => ({
    type: SET_GROUP_COOKIE,
    data: data,
});

export const getSheduleDataThunkCreator = () => dispatch => {
    const selectedGroup = localStorage.getItem('selectedGroup');
    if (selectedGroup) {
        dispatch(setGroupCookieActionCreator(selectedGroup));
    }
    axios.get('/api/timetable/').then(res => {
        dispatch(showSheduleActionCreator(res.data));
    });
}

export const setGroupCookieThunkCreator = (value = null, ref) => dispatch => {
    scrollTo(ref, 0, 300);
    if (value) {
        localStorage.setItem('selectedGroup', value);
        dispatch(setGroupCookieActionCreator(value));
    } else {
        console.log('Ошибка получения значения');
    }
}

export default mainReducer;