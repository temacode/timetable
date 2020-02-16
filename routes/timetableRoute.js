const path = require('path');
const XLSX = require('xlsx');

const groupPreg = new RegExp(/([а-я]{4})-(\d{2})-(\d{2})/gim);
const cellPreg = new RegExp(/([a-z]+)(2{1})$/i);
const cellNamePreg = new RegExp(/^[a-z]+/i);
const cellNumPreg = new RegExp(/[0-9]+$/);
const fullLessonPreg = new RegExp(/[^a-zA-Zа-яА-Я0-9\s\n.,]/gim);
const lessonDataPreg = new RegExp(/((([0-9.,\sнкр]+)|)([A-Za-zА-Яа-я\s-]+))/gim);
const weekPreg = new RegExp(/^([0-9.,нкр\s]+)/gim);
const extraLetterInWeekPreg = new RegExp(/[.\sнкр]/gim);
const lessonNamePreg = new RegExp(/[а-яА-Я]{2,}(\s|)([а-яА-Я\s]*)[а-яА-Я]/gim);

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

function getLessonObject(e) {
    let lesson = {}

    lesson.week = e.match(weekPreg) ?
        e.match(weekPreg)[0]
        : null;
    if (lesson.week) {

        lesson.week = lesson.week
            .trim()
            .replace(extraLetterInWeekPreg, '')
            .split(',').map(e => (Number(e)))
    }

    lesson.name = e.match(lessonNamePreg) ? e.match(lessonNamePreg)[0] : '';

    return lesson;
}

module.exports = app => {
    app.get('/api/timetable/', (req, res) => {
        const shedule = XLSX.readFile(path.join(__dirname, '../public/shedule.xlsx'));
        
        let sheetName = shedule.SheetNames[0];
        let sheet = shedule.Sheets[sheetName];

        let groups = {};

        //Парсинг групп
        for (let cell in sheet) {
            if (cellPreg.test(cell) && groupPreg.test(sheet[cell].v)) {
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
                    lessonInfo.fullString = (typeof sheet[lessonInfo.cell] !== 'undefined' ? sheet[lessonInfo.cell].v : '').trim().replace(fullLessonPreg, '');

                    //Записывает данные о паре
                    let lessonData = lessonInfo.fullString.match(lessonDataPreg);
                    lessonData = lessonData ? lessonData : '';

                    if (lessonData.length >= 1) {

                        if (lessonData.length > 1) {
                            lessonInfo.lesson = [];

                            lessonData.forEach(e => {
                                lessonInfo.lesson.push(getLessonObject(e));
                            });
                        } else {
                            lessonInfo.lesson = getLessonObject(lessonData[0]);
                        }

                        lessonInfo.reverseWeek = RegExp('кр').test(lessonInfo.week) ? true : false;
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

        res.status(200).send(groups);
    });
}