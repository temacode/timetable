import { connect } from 'react-redux';
import LessonList from './LessonList';
let mapStateToProps = state => {
    return ({
    });
}

let mapDispatchToProps = dispatch => {
    return ({});
}

const LessonListContainer = connect(mapStateToProps, mapDispatchToProps)(LessonList);

export default LessonListContainer;