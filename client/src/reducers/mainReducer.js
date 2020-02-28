import axios from 'axios';
import { scrollTo } from '../helpers/scrollLeftAnimation';

const SHOW_SHEDULE = 'SHOW_SHEDULE';
const SET_GROUP_COOKIE = 'SET_GROUP_COOKIE';
const REMOVE_GROUP_COOKIE = 'REMOVE_GROUP_COOKIE';

let initialState = {
    groups: [],
    selectedGroup: 'bbbo-05-17',
}

let mainReducer = (state = initialState, action) => {
    switch (action.type) {
        case SHOW_SHEDULE:
            let sheduleState = { ...state };

            //console.log(action.data);
            sheduleState.groups = [...action.data];
            //console.log(sheduleState.groups);
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
    //console.log(data[4].shedule[2][3]);
    return({
        type: SHOW_SHEDULE,
        data: data,
    });
}

const setGroupCookieActionCreator = data => ({
    type: SET_GROUP_COOKIE,
    data: data,
});

const removeGroupCookieActionCreator = () => ({
    type: REMOVE_GROUP_COOKIE
});

export const getSheduleDataThunkCreator = cookies => dispatch => {
    const selectedGroup = cookies.get('selectedGroup');
    if (selectedGroup) {
        dispatch(setGroupCookieActionCreator(selectedGroup));
    }
    axios.get('/api/timetable/').then(res => {
        dispatch(showSheduleActionCreator(res.data));
    });
}

export const setGroupCookieThunkCreator = (cookies, value = null, ref) => dispatch => {
    //ref.scrollLeft = 0;
    scrollTo(ref, 0, 300);
    if (value) {
        cookies.set('selectedGroup', value, { path: '/' });
        dispatch(setGroupCookieActionCreator(value));
    } else {
        console.log('Ошибка получения значения');
    }
}

export const removeGroupCookieThunkCreator = cookies => dispatch => {
    cookies.remove('test', { path: '/' });
    dispatch(removeGroupCookieActionCreator());
}

export default mainReducer;