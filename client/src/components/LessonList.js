import React from 'react';
import styled from 'styled-components';
import { lessonNumToTime } from '../helpers/lessonNumToTime';

const MainBody = styled.div`
    width: calc(100% - 30px);
    margin: 20px 15px;
    min-height: 200px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 1px 6px 1px rgba(0,0,0,0.15);
    padding-bottom: 1px;
    margin-bottom: 20px;
`;

const DayHeader = styled.div`
    width: 100%;
    padding: 15px 0;
    text-align: center;
    font-family: Rubik Mono One;
`;
const Lesson = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
    * {
        font-size: 12px;
    }
    :last-shild {
        margin-bottom: 0;
    }
`;
const Num = styled.div`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    font-weight: 600;
    color: #999999;
    min-width: 25px;
`;
const Time = styled.div`
    border-right: 2px solid #eaeaea;
    font-weight: 600;
    padding: 0 8px 0 0;
    div {
        width: 100%;
        text-align: right;
    }
`;
const Name = styled.div`
    width: 40%;
    padding: 0 4px 4px 4px;
`;

const LessonLocation = styled.div`

`;

const Teacher = styled.div`
    width: 30%;
    padding: 0 8px 4px 4px;
    font-weight: 600;
    color: #999999;
`;

class LessonList extends React.Component {
    render() {
        let lessons = this.props.lessonList.map((e, i) => {
            let lessonTime = lessonNumToTime(i);
            return (
                <Lesson key={i}>
                    <Num>{i + 1}</Num>
                    <Time>
                        <div>{lessonTime[0]}</div>
                        <div>{lessonTime[1]}</div>
                    </Time>
                    <Name>
                        {e.lesson ? e.lesson.name : ''}
                        <LessonLocation>{e.lesson ? e.lesson.location + ", " + e.lesson.type : ''}</LessonLocation>
                    </Name>
                    <Teacher>{e.lesson ? e.lesson.teacher : ''}</Teacher>
                </Lesson>
            );
        });
        return (
            <MainBody>
                <DayHeader>{this.props.dayName}</DayHeader>
                {lessons}
            </MainBody>
        );
    }
}

export default LessonList;