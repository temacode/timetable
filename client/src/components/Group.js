import React from 'react';
import LessonListContainer from './LessonListContainer';

class Group extends React.Component {

    render() {
        let lessonList = this.props.group.shedule.map((e, i) => {

            let dayName = '';

            switch (i) {
                case 0:
                    dayName = 'Понедельник';
                    break;
                case 1:
                    dayName = 'Вторник';
                    break;
                case 2:
                    dayName = 'Среда';
                    break;
                case 3:
                    dayName = 'Четверг';
                    break;
                case 4:
                    dayName = 'Пятница';
                    break;
                case 5:
                    dayName = 'Суббота';
                    break;
                default:
                    dayName = i;
            }

            return(
                <LessonListContainer key={ i } lessonList={ e } dayName={ dayName }></LessonListContainer>
            );
        });
        return (
            <div>{lessonList}</div>
        );
    }
}

export default Group;