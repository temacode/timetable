import { connect } from 'react-redux';
import Group from './Group';

let mapStateToProps = state => {
    return ({
    });
}

let mapDispatchToProps = dispatch => {
    return ({});
}

const GroupContainer = connect(mapStateToProps, mapDispatchToProps)(Group);

export default GroupContainer;