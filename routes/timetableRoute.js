const path = require('path');
const XLSX = require('xlsx');

const groupPreg = new RegExp(/([а-я]{4})-(\d{2})-(\d{2})/gim);//Название группы
const cellPreg = new RegExp(/([a-z]+)(2{1})$/i);//Номер ячейки
const cellNamePreg = new RegExp(/^[a-z]+/i);//Номер ячейки (только буквы)
const cellNumPreg = new RegExp(/[0-9]+$/);//Номер ячейки (только цифры)
const fullLessonPreg = new RegExp(/[^a-zA-Zа-яА-Я0-9\s\n.,]/gim);//Полностью значение ячейки с парой
const lessonDataPreg = new RegExp(/((([0-9.,\sнкр]+)|)([A-Za-zА-Яа-я\s-.,]+)([0-9\s]+гр|))/gim);//Название предмета с его неделями
const weekPreg = new RegExp(/^((кр)|)([0-9.,н\s]+)/gim);//Недели предмета
const extraLetterInWeekPreg = new RegExp(/[.\sнкр]/gim);//Дополнительные символы, помимо дня в списке недель
const lessonNamePreg = new RegExp(/[а-яА-Я]{2,}(\s|)([а-яА-Я\s]*)[а-яА-Я]/gim);//Название предмета
const teachersNamePreg = new RegExp(/[а-яА-Я]+\s{0,2}[а-яА-Я.]+/gim);//Имя препода

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

//Сюда приходит пара с неделями
function getLessonObject(e, lessonData, debugCell = '') {

    let lesson = {}

    lesson.week = e.match(weekPreg) ?
        e.match(weekPreg)[0]
        : null;

    lesson.reverseWeek = RegExp('кр').test(lesson.week) ? true : false;

    if (lesson.week) {

        lesson.week = lesson.week
            .trim()
            .replace(extraLetterInWeekPreg, '')
            .split(',').map(e => (Number(e)))
    }

    lesson.name = e.match(lessonNamePreg) ? e.match(lessonNamePreg)[0] : '';

    lesson.teacher = lessonData.teacher;
    
    lesson.location = lessonData.location;
    
    lesson.type = lessonData.type;

    return lesson;
}

function getLessonArray(lessonArray, lessonData, debugCell = '') {
    let lesson = [];
    let initialTeacherName = '';
    let initialLocation = '';
    let initialType = '';

    lessonArray.forEach((e, i) => {
        if (typeof lessonData.teacher[i] === 'undefined') {
            lessonData.teacher[i] = initialTeacherName;
        } else {
            initialTeacherName = lessonData.teacher[i];
        }

        if (typeof lessonData.location[i] === 'undefined') {
            lessonData.location[i] = initialLocation;
        } else {
            initialLocation = lessonData.location[i];
        }

        if (typeof lessonData.type[i] === 'undefined') {
            lessonData.type[i] = initialType;
        } else {
            initialType = lessonData.type[i];
        }

        let initialLessonData = {
            teacher: lessonData.teacher[i],
            location: lessonData.location[i],
            type: lessonData.type[i],
        }

        lesson.push(getLessonObject(e, initialLessonData));
    });

    return lesson;
}

function eraseLesson(lesson) {
    //Нужно переписать алгоритм очистки
    delete lesson.lesson;
    delete lesson.reverseWeek;

    return lesson;
}

function checkParity(week, parity) {
    if (week % 2 === 0 && parity === true) {
        return true
    }
    if (week % 2 !== 0 && parity === false) {
        return true
    }

    return false;
}

Date.prototype.getWeek = function () {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
        - 3 + (week1.getDay() + 6) % 7) / 7);
}

module.exports = app => {
    app.get('/api/timetable/', (req, res) => {
        const workbook = XLSX.readFile(path.join(__dirname, '../public/shedule.xlsx'));

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        let weekNum = new Date();
        weekNum = weekNum.getWeek();
        weekNum = weekNum < 21 ? (weekNum - 6) : (weekNum - 32);

        let dayNum = new Date().getDay() - 1;

        let groups = [];

        let sheetKeys = [];

        for (let i = 0; i < 26; i++) {
            sheetKeys.push(String.fromCharCode(97 + i).toUpperCase());
        }

        for (let i = 0; i < 26; i++) {
            for (let j = 0; j < 26; j++) {
                sheetKeys.push(sheetKeys[i] + '' + String.fromCharCode(97 + j).toUpperCase());
            }
        }

        //Парсинг групп
        for (let cell in sheet) {
            if (cellPreg.test(cell) && groupPreg.test(sheet[cell].v)) {
                let groupNameRus = sheet[cell].v.match(groupPreg)[0];
                let groupName = rus2translit(groupNameRus);
                let cellName = cell.toString().match(cellNamePreg)[0];
                let cellNum = cell.toString().match(cellNumPreg)[0];
                let cellTeacher = (sheetKeys[sheetKeys.indexOf(cellName) + 2]);
                let cellLocation = (sheetKeys[sheetKeys.indexOf(cellName) + 3]);
                let cellLessonType = (sheetKeys[sheetKeys.indexOf(cellName) + 1]);

                let groupDataObject = {
                    cell: cell,
                    cellName: cellName,
                    cellNum: cellNum,
                    cellTeacher: cellTeacher,
                    cellLocation: cellLocation,
                    cellLessonType: cellLessonType,
                    groupNameRus: groupNameRus,
                    groupName: groupName,
                }

                groups.push(groupDataObject);
            }
        }

        let teachersList = [];

        groups.map(group => {

            let shedule = [];

            //Идем по расписанию и парсим предметы
            for (let weekCounter = 0; weekCounter < 3; weekCounter++) {

                let week = weekNum + weekCounter;

                for (let i = 0; i < 6; i++) {

                    let even = 1;
                    let odd = 1;

                    var sheduleList = [];

                    for (let j = (i * 12); j < ((i * 12) + 12); j++) {
                        var lessonInfo = {}

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
                                dayName = 'Ошибка сканирования';
                                break;
                        }

                        lessonInfo.dayName = dayName;

                        //Здесь хранится номер пары
                        lessonInfo.num = (j % 2 === 0) ? even++ : odd++;

                        //Здесь хранится четность пары
                        lessonInfo.parity = (j % 2) === 1 ? true : false;

                        //Получаем номер ячейки
                        lessonInfo.cell = (group.cellName + '' + (j + 4));

                        //Номер ячейки с преподавателем
                        lessonInfo.teacherCell = (group.cellTeacher + '' + (j + 4));
                        lessonInfo.locationCell = (group.cellLocation + '' + (j + 4));
                        lessonInfo.lessonTypeCell = (group.cellLessonType + '' + (j + 4));

                        //Записываем строку без форматирования
                        lessonInfo.fullString = (typeof sheet[lessonInfo.cell] !== 'undefined' ? sheet[lessonInfo.cell].v : '').trim().replace(fullLessonPreg, '');

                        //Записывает данные о паре
                        lessonListAfterPreg = lessonInfo.fullString.match(lessonDataPreg);
                        lessonListAfterPreg = lessonListAfterPreg ? lessonListAfterPreg : '';
                        lessonInfo.debug = lessonListAfterPreg;

                        let lessonTeacher = typeof sheet[lessonInfo.teacherCell] !== 'undefined' ?
                            sheet[lessonInfo.teacherCell].v
                                .trim()
                                .match(teachersNamePreg)
                            : '';

                        let lessonLocation = typeof sheet[lessonInfo.locationCell] !== 'undefined' ?
                            sheet[lessonInfo.locationCell].v.toString().trim().split(/[\n]|\s{4,}/gim)
                            : '';

                        let lesssonType = typeof sheet[lessonInfo.lessonTypeCell] !== 'undefined' ?
                            sheet[lessonInfo.lessonTypeCell].v.toString().trim().split(/[\n]|\s{4,}/gim)
                            : '';

                        let lessonData = {
                            teacher: lessonTeacher,
                            location: lessonLocation,
                            type: lesssonType,
                        }

                        //Тут было строго больше 1, я сделал больше или равно, не уверен, тчо это хороший ход
                        if (lessonListAfterPreg.length >= 1) {
                            lessonInfo.lesson = lessonListAfterPreg.length > 1 ?
                                getLessonArray(lessonListAfterPreg, lessonData)
                                : getLessonObject(lessonListAfterPreg[0], lessonData);
                        }

                        //Сервер отдает готовое расписание
                        //Фильтр по дню
                        //Нужно доработать фильрацию и сделать ее более логичной
                        //Баги при определении локации
                        //Экономическая безопасность хозяйствующего субъекта
                        if (checkParity(week, lessonInfo.parity)) {
                            //Если предмет не пустой
                            if (lessonInfo.lesson) {
                                if (Array.isArray(lessonInfo.lesson)) {
                                    //Множественные предметы

                                    //Перебираем предметы
                                    let flag = true;
                                    lessonInfo.lesson.forEach(e => {
                                        if (Array.isArray(e.week)) {
                                            //Если есть недели и они соответствуют текущей
                                            if (e.reverseWeek) {
                                                if (e.week.indexOf(week) === -1) {
                                                    let newLessonInfo = { ...lessonInfo }
                                                    newLessonInfo.lesson = e;
                                                    sheduleList.push(newLessonInfo);
                                                    flag = false;
                                                }
                                            } else {
                                                if (e.week.indexOf(week) !== -1) {
                                                    let newLessonInfo = { ...lessonInfo }
                                                    newLessonInfo.lesson = e;
                                                    sheduleList.push(newLessonInfo);
                                                    flag = false;
                                                }
                                            }
                                        } else {
                                            sheduleList.push(lessonInfo);
                                        }
                                    });
                                    if (flag) {
                                        sheduleList.push(eraseLesson(lessonInfo));
                                    }
                                } else {
                                    //Единичные предметы

                                    //Если есть недели
                                    if (lessonInfo.lesson.week) {
                                        if (lessonInfo.lesson.reverseWeek) {
                                            if (lessonInfo.lesson.week.indexOf(week) === -1) {
                                                sheduleList.push(lessonInfo);
                                            } else {
                                                sheduleList.push(eraseLesson(lessonInfo));
                                            }
                                        } else {
                                            if (lessonInfo.lesson.week.indexOf(week) !== -1) {
                                                sheduleList.push(lessonInfo);
                                            } else {
                                                sheduleList.push(eraseLesson(lessonInfo));
                                            }
                                        }
                                    } else {
                                        sheduleList.push(lessonInfo);
                                    }
                                }
                            } else {
                                //Пустые пары, записываем, соблюдая четность
                                sheduleList.push(lessonInfo);
                            }
                        }
                        //sheduleList.push(lessonInfo);
                    }

                    shedule.push(sheduleList);
                }
            }

            shedule = shedule.filter((e,i) => {
                return i < dayNum ? false : true;
            });

            group.shedule = [...shedule];
        })

        res.status(200).send(groups);
    });
}