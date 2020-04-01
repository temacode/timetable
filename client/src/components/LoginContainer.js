import { connect } from "react-redux";
import Login from "./Login";
import { loginThunkCreator } from "../reducers/loginReducer";

let mapStateToProps = state => ({
    isLoading: state.login.isLoading,
})

let mapDispatchToProps = dispatch => ({
    submit: (values) => {
        dispatch(loginThunkCreator(values));
    },
})

const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(Login);

export default LoginContainer;