const LOGIN = 'LOGIN';

let initialState = {
    isLoading: false,
}

let loginReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            let loginState = {...state};
            loginState.isLoading = !loginState.isLoading;
            return loginState;
        default:
            return state;
    }
}

const loginActionCreator = data => {
    return ({
        type: LOGIN
    })
}

export const loginThunkCreator = values => dispatch => {
    console.log(values);
    dispatch(loginActionCreator());
    setTimeout(() => {
        dispatch(loginActionCreator());
    }, 2000);
    
}

export default loginReducer;