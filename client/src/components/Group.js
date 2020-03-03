import React from 'react';
import LessonListContainer from './LessonListContainer';

class Group extends React.Component {

    render() {
        let lessonList = this.props.group.shedule.map((e, i, array) => {
            return e ? <LessonListContainer key={i} lessonList={e} dayName={e[0].dayName}></LessonListContainer> : null;
        });
        return (
            <div>{lessonList}</div>
        );
    }
}

export default Group;