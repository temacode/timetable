import React from 'react';
import styled from 'styled-components';

const MainBlock = styled.div`
    width: 100%;
    min-height: 100%;
    padding: 20px;
    background: red;
    box-sizing: border-box;
`;

class Main extends React.Component {

    componentDidMount() {
        this.props.getShedule();
    }

    componentDidUpdate() {
        //console.log(this.props.shedule.data);
        let workbook = this.props.shedule.data;
        let sheetName = workbook.SheetNames[0];
        let sheet = workbook.Sheets[sheetName];

        function rus2translit(string) {
            let converter = {
                'а': 'a', 
                'б': 'b', 
                'в': 'v',
                'г': 'g',
                'д': 'd',
                'е': 'e',
                'ё': 'e', 
                'ж': 'zh', 
                'з': 'z',
                'и': 'i', 
                'й': 'y', 
                'к': 'k',
                'л': 'l', 
                'м': 'm', 
                'н': 'n',
                'о': 'o', 
                'п': 'p', 
                'р': 'r',
                'с': 's', 
                'т': 't', 
                'у': 'u',
                'ф': 'f', 
                'х': 'h', 
                'ц': 'c',
                'ч': 'ch', 
                'ш': 'sh', 
                'щ': 'sch',
                'ь': '', 
                'ы': 'y', 
                'ъ': '',
                'э': 'e', 
                'ю': 'yu', 
                'я': 'ya',
            };

            let result = string.toLowerCase().split('');

            string.toLowerCase().split('').forEach((e, index) => {
                if (typeof converter[e] !== 'undefined') {
                    result[index] = converter[e];
                }
            });
            
            return result.join('');
        }

        const groupPreg = new RegExp(/([а-я]{4})-(\d{2})-(\d{2})/gim);
        const cellWithGroupName = new RegExp(/([a-z]+)(2{1})$/i);
        const cellNamePreg = new RegExp(/^[a-z]+/i);
        const cellNumPreg = new RegExp(/[0-9]+$/);

        let groups = {};

        //Парсинг групп
        for (let cell in sheet) {
            if (cellWithGroupName.test(cell) && groupPreg.test(sheet[cell].v)) {
                let groupName = rus2translit(sheet[cell].v.match(groupPreg)[0]);
                let cellName = cell.toString().match(cellNamePreg)[0];
                let cellNum = cell.toString().match(cellNumPreg)[0]

                let groupDataObject = {
                    cell: cell,
                    cellName: cellName,
                    cellNum: cellNum
                }

                groups[groupName] = groupDataObject;
            }
        }

        let lessonNamesList = [];

        for (let group in groups) {

            let shedule = [];

            //Идем по расписанию и парсим предметы
            for (let i = 0; i < 6; i++) {

                shedule[i] = [];

                for (let j = (i * 12); j < ((i * 12) + 12); j++) {
                    let lessonInfo = {}

                    //Получаем номер ячейки
                    lessonInfo.cell = (groups[group].cellName + '' + (j + 4));

                    //Записываем строку без форматирования
                    lessonInfo.fullString = (typeof sheet[lessonInfo.cell] !== 'undefined' ? sheet[lessonInfo.cell].v : '').trim().replace(/[^a-zA-Zа-яА-Я0-9\s\n.,]/gim, '');

                    //Записывает данные о паре
                    let lessonData = lessonInfo.fullString.match(/((([0-9.,\sнкр]+)|)([A-Za-zА-Яа-я\s-]+))/gim);
                    lessonData = lessonData ? lessonData : '';

                    lessonInfo.reverseWeek = false;

                    function getLessonObject(e) {
                        let lesson = {}

                        lesson.week = e.match(/^([0-9.,нкр\s]+)/gim) ?
                                        e.match(/^([0-9.,нкр\s]+)/gim)[0]
                                        : null;
                        if (lesson.week) {
                            lessonInfo.reverseWeek = RegExp('кр').test(lesson.week) ? true : false;

                            lesson.week = lesson.week
                                            .trim()
                                            .replace(/[.\sнкр]/gim, '')
                                            .split(',').map(e => (Number(e)))
                        }
                        
                        lesson.name = e.match(/[а-яА-Я]{2,}(\s|)([а-яА-Я\s]*)[а-яА-Я]/gim) ?
                                        e.match(/[а-яА-Я]{2,}(\s|)([а-яА-Я\s]*)[а-яА-Я]/gim)[0] 
                                        : '';
                        
                        return lesson;
                    }

                    if (lessonData.length >= 1) {

                        if (lessonData.length > 1) {
                            lessonInfo.lesson = [];

                            lessonData.forEach(e => {
                                lessonInfo.lesson.push(getLessonObject(e));
                            });
                        } else {
                            lessonInfo.lesson = getLessonObject(lessonData[0]);
                        }
                    }


                    shedule[i].push(lessonInfo);

                    if (lessonNamesList.indexOf(lessonInfo.fullString) === -1) {
                        lessonNamesList.push(lessonInfo.cell);
                        lessonNamesList.push(lessonData);
                        lessonNamesList.push(lessonInfo.cell);
                    }
                }
            }

            groups[group].shedule = shedule;
        }

        console.log(groups);

        //console.log(lessonNamesList);
    }

    render() {
        return(
            <MainBlock>
                <p>Боди</p>
                <div>
                    {this.props.shedule ? 'Чот есть' : 'Ничего нет' }
                </div>
            </MainBlock>
        );
    }
}

export default Main;