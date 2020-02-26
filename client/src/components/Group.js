import React from 'react';
import LessonListContainer from './LessonListContainer';

class Group extends React.Component {

    render() {
        let lessonList = this.props.group.shedule.map((e, i) => {

            return(
                <LessonListContainer key={ i } lessonList={ e } dayName={ e[0].dayName }></LessonListContainer>
            );
        });
        return (
            <div>{lessonList}</div>
        );
    }
}

export default Group;