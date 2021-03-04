const path = require('path');
const XLSX = require('xlsx');

const groupPreg = new RegExp(/([а-я]{4})-(\d{2})-(\d{2})/gim); //Название группы
const cellPreg = new RegExp(/([a-z]+)(2{1})$/i); //Номер ячейки
const cellNamePreg = new RegExp(/^[a-z]+/i); //Номер ячейки (только буквы)
const cellNumPreg = new RegExp(/[0-9]+$/); //Номер ячейки (только цифры)
const allowedSymbolsPreg = new RegExp(/[^a-zA-Zа-яА-Я0-9\s\n\r.,]/gim); //Полностью значение ячейки с парой
const lessonDataPreg = new RegExp(/((((\d[группа\.]{2,})([\d\,\.]+)?( *(н\.?(ед)?\.?) *)?)\s*)+)?\s*(кр)?\s*([\d\,\. ]+)?\s*( *(н\.?(ед)?\.?) *)?\s*((((\d[группа\.]{2,})([\d\,\.]+)?( *(н\.?(ед)?\.?) *)?)\s*)+)?\s*(кр)?\s*([\d\,\. ]+)?\s*( *(н\.?(ед)?\.?) *)?\s*(( ?[а-яА-Я]{2}[а-яА-Яa-zA-Z\.\s]{1,} ?)+)\s*/gim); //Полное значение пары
//const lessonDataPreg = new RegExp(/((([0-9.,\sнедкр]+)|)([A-Za-zА-Яа-я\s-.,]+)([0-9\s]+гр|))(([0-9.,\sнедкр]+)|)/gim);
//Название предмета с его неделями
const weekPreg = new RegExp(/((кр |)[0-9][0-9.,нед ]{4,})/gim); //Недели предмета
const extraLetterInWeekPreg = new RegExp(/[.\sнедкр]+/gim); //Дополнительные символы, помимо дня в списке недель
const lessonNamePreg = new RegExp(/[а-яА-Я]{2,}(\s|)([а-яА-Я\s]*)[а-яА-Я]/gim); //Название предмета
const teachersNamePreg = new RegExp(/[а-яА-Я]+\s{0,2}[а-яА-Я.]+/gim); //Имя препода

let debugArray = [];
//Функция для создания массива со всеми возможными вариантами текста какой-либо ячейки
function debugInputVariants(value) {
    if (debugArray.indexOf(value) === -1) {
        debugArray.push(value);
    }
}

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
        e.match(weekPreg)[0] :
        null;

    lesson.reverseWeek = RegExp('кр').test(lesson.week) ? true : false;

    if (lesson.week) {
        lesson.week = lesson.week
            .trim()
            .replace('8.14', '8,14') //В одном месте неделя перечисляется через точку
            .replace(extraLetterInWeekPreg, '')
            .split(',')
            .map(e => Number(e))
            .filter(e => Number.isInteger(e));
    }

    lesson.name = e.replace(weekPreg, '');

    lesson.name = lesson.name.match(lessonNamePreg) ? lesson.name.match(lessonNamePreg)[0] : '';

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

        lesson.push(getLessonObject(e, initialLessonData, debugCell));
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

const handleLessonTime = lessonNum => {
    switch (lessonNum) {
        case 1:
            return {
                start: '9:00',
                    end: '10:30',
                    startMin: 540,
                    endMin: 630,
            };
        case 2:
            return {
                start: '10:40',
                    end: '12:10',
                    startMin: 640,
                    endMin: 730,
            };
        case 3:
            return {
                start: '12:40',
                    end: '14:10',
                    startMin: 760,
                    endMin: 850,
            };
        case 4:
            return {
                start: '14:20',
                    end: '15:50',
                    startMin: 860,
                    endMin: 950,
            };
        case 5:
            return {
                start: '16:20',
                    end: '17:50',
                    startMin: 980,
                    endMin: 1070,
            };
        case 6:
            return {
                start: '18:00',
                    end: '19:30',
                    startMin: 1080,
                    endMin: 1170,
            };
        default:
            return {
                start: 'Error',
                    end: 'Error',
                    startMin: 0,
                    endMin: 0,
            };
    }
}

const excellAvailableCellsNameGenerator = () => {
    let keys = [];

    for (let i = 0; i < 26; i++) {
        keys.push(String.fromCharCode(97 + i).toUpperCase());
    }
    for (let i = 0; i < 26; i++) {
        for (let j = 0; j < 26; j++) {
            keys.push(keys[i] + '' + String.fromCharCode(97 + j).toUpperCase());
        }
    }

    return keys;
}

const debugSchedule = (schedule) => {
    const fs = require('fs');

    fs.writeFile('./debug.txt', schedule.join('@\n\n\n\n\n@'), 'utf8')
}

const getDayNameByNumber = (number) => {
    switch (i) {
        case 0:
            return 'Понедельник';
        case 1:
            return 'Вторник';
        case 2:
            return 'Среда';
        case 3:
            return 'Четверг';
        case 4:
            return 'Пятница';
        case 5:
            return 'Суббота';
        default:
            return 'Ошибка сканирования';
    }
}

module.exports = app => {
    app.get('/api/timetable/', (req, res) => {
        const workbook = XLSX.readFile(path.join(__dirname, '../public/schedule.xlsx'));
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        const week = new Date().getWeek();
        const universityWeek = week < 21 ? (week - 6) : (week - 35);

        const day = new Date().getDay() - 1;

        let sheetKeys = excellAvailableCellsNameGenerator();

        const groups = [];
        //Парсинг групп
        for (let cell in sheet) {
            //Находим ячейку с названием группы
            if (cellPreg.test(cell) && groupPreg.test(sheet[cell].v)) {
                //Номер ячейки
                let cellName = cell.toString().match(cellNamePreg)[0];

                let group = {
                    cell: cell,
                    cellName: cellName,
                    cellNum: cell.toString().match(cellNumPreg)[0],
                    cellLessonType: sheetKeys[sheetKeys.indexOf(cellName) + 1],
                    cellTeacher: sheetKeys[sheetKeys.indexOf(cellName) + 2],
                    cellLocation: sheetKeys[sheetKeys.indexOf(cellName) + 3],
                    groupNameRus: sheet[cell].v.match(groupPreg)[0],
                    groupName: rus2translit(sheet[cell].v.match(groupPreg)[0]),
                }

                groups.push(group);
            }
        }

        groups.map(group => {

            let schedule = [];

            //Три раза проходим сверху вниз
            for (let weekCounter = 0; weekCounter < 3; weekCounter++) {

                let week = universityWeek + weekCounter;

                for (let i = 0; i < 6; i++) {

                    let even = 1;
                    let odd = 1;

                    var scheduleList = [];

                    for (let j = (i * 12); j < ((i * 12) + 12); j++) {
                        const lessonInfo = {}
                        lessonInfo.dayName = getDayNameByNumber(i);

                        const lessonNum = (j % 2 === 0) ? even++ : odd++;
                        //Здесь хранится номер пары
                        lessonInfo.num = lessonNum;
                        lessonInfo.timeStart = handleLessonTime(lessonNum).start;
                        lessonInfo.timeEnd = handleLessonTime(lessonNum).end;
                        lessonInfo.startMin = handleLessonTime(lessonNum).startMin;
                        lessonInfo.endMin = handleLessonTime(lessonNum).endMin;

                        //Здесь хранится четность пары
                        lessonInfo.parity = (j % 2) === 1 ? true : false;

                        //Получаем номер ячейки с предметом
                        lessonInfo.cell = (group.cellName + '' + (j + 4));

                        //Номер ячейки с преподавателем
                        lessonInfo.teacherCell = (group.cellTeacher + '' + (j + 4));
                        //Номер ячейки с аудиторией
                        lessonInfo.locationCell = (group.cellLocation + '' + (j + 4));
                        //Номер ячейки с типом пары
                        lessonInfo.lessonTypeCell = (group.cellLessonType + '' + (j + 4));

                        //Записываем строку без форматирования
                        lessonInfo.fullString = (typeof sheet[lessonInfo.cell] !== 'undefined' ? sheet[lessonInfo.cell].v : '').replace(allowedSymbolsPreg, '').replace(/\s+/gim, ' ').trim();

                        //Записывает данные о паре
                        debugInputVariants(lessonInfo.fullString);
                        lessonListAfterPreg = lessonInfo.fullString.match(lessonDataPreg);
                        lessonListAfterPreg = lessonListAfterPreg ? lessonListAfterPreg.map(e => e.trim()) : '';
                        lessonInfo.debug = lessonListAfterPreg;

                        let lessonTeacher = typeof sheet[lessonInfo.teacherCell] !== 'undefined' ?
                            sheet[lessonInfo.teacherCell].v
                            .trim()
                            .match(teachersNamePreg) :
                            '';

                        let lessonLocation = typeof sheet[lessonInfo.locationCell] !== 'undefined' ?
                            sheet[lessonInfo.locationCell].v.toString().trim().split(/[\n]|\s{4,}/gim) :
                            '';

                        let lessonType = typeof sheet[lessonInfo.lessonTypeCell] !== 'undefined' ?
                            sheet[lessonInfo.lessonTypeCell].v.toString().trim().match(/[а-яА-Я]+/gi) :
                            '';
                        let lessonData = {
                            teacher: lessonTeacher,
                            location: lessonLocation,
                            type: lessonType,
                        }

                        if (lessonListAfterPreg.length >= 1) {
                            lessonInfo.lesson = lessonListAfterPreg.length > 1 ?
                                getLessonArray(lessonListAfterPreg, lessonData, lessonInfo) :
                                getLessonObject(lessonListAfterPreg[0], lessonData, lessonInfo);
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
                                            if (e.reverseWeek && e.week.indexOf(week) === -1) {
                                                let newLessonInfo = {
                                                    ...lessonInfo
                                                }

                                                newLessonInfo.lesson = e;
                                                scheduleList.push(newLessonInfo);
                                                flag = false;

                                            } else {
                                                let newLessonInfo = {
                                                    ...lessonInfo
                                                }

                                                newLessonInfo.lesson = e;
                                                scheduleList.push(newLessonInfo);
                                                flag = false;

                                            }
                                        } else {
                                            scheduleList.push(lessonInfo);
                                        }
                                    });
                                    if (flag) {
                                        scheduleList.push(eraseLesson(lessonInfo));
                                    }
                                } else {
                                    //Единичные предметы

                                    //Если есть недели
                                    if (lessonInfo.lesson.week) {
                                        if (lessonInfo.lesson.reverseWeek) {
                                            if (lessonInfo.lesson.week.indexOf(week) === -1) {
                                                scheduleList.push(lessonInfo);
                                            } else {
                                                scheduleList.push(eraseLesson(lessonInfo));
                                            }
                                        } else {
                                            if (lessonInfo.lesson.week.indexOf(week) !== -1) {
                                                scheduleList.push(lessonInfo);
                                            } else {
                                                scheduleList.push(eraseLesson(lessonInfo));
                                            }
                                        }
                                    } else {
                                        scheduleList.push(lessonInfo);
                                    }
                                }
                            } else {
                                //Пустые пары, записываем, соблюдая четность
                                scheduleList.push(lessonInfo);
                            }
                        }
                        //scheduleList.push(lessonInfo);
                    }

                    schedule.push(scheduleList);
                }
            }

            //Фильтруем дни, которые больше или равны текущему
            schedule = schedule.filter((_e, i) => {
                return i >= day;
            });

            group.schedule = [...schedule];
        })

        debugSchedule(debugArray);

        res.status(200).send(groups);
    });
}