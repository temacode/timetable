function raw(string) {
    console.log(string.raw[0]);
}

//Обычный предмет: 
const lesson = /( ?[а-яА-Я\s]{1,} ?)+/;

//Обычный предмет с неделями: 
const lessonWithWeeks = /([\d\,\.]+)(( *(н\.?(ед)?\.?) *))?(( ?[а-яА-Я\s]{1,} ?)+)/;

//Предмет с инвертированной неделей:
const envertedLesson = /(кр ?)([\d\,\.]+)(( *(н(ед)?) *))( ?[а-яА-Я\s]{1,} ?)+/;

//Несколько обычных предметов с неделями:
const manyLessons = /(([\d,]+)(( *(н(ед)?) *))( ?[а-яА-Я\s]{1,} ?)+)+/;

//Предмет с группой:
const lessonWithGroup = /(\d{1}[группа\.]{2,}) *([\d,]+)( *(н?\.?(ед)?\.?) *)(\d{1}[группа\.]{2,}) *([\d,]+)( *(н\.?(ед)?\.?) *)(( ?[а-яА-Я\s]{1,} ?)+)/

//Несколько предметов с группой:
const manyLessonsWithGroup = /((\d[а-яА-Я\.]{2,3}) ?([\d,]+)(\b( *(н\.?(ед)?\.?) *))(( ?[а-яА-Я\s]{1,} ?)+))+/

const groupPreg = String.raw`((((\d[группа\.]{2,})([\d\,\.]+)?( *(н\.?(ед)?\.?) *)?)\s*)+)?\s*`;
const invertedWeekPreg = String.raw`(кр)?\s*`;
const weeksPreg = String.raw`([\d\,\. ]+)?\s*`;
const weekSymbolPreg = String.raw`( *(н\.?(ед)?\.?) *)?\s*`;
const lessonNamePreg = String.raw`(( ?[а-яА-Я]{2}[а-яА-Яa-zA-Z\.\s]{1,} ?)+)\s*`;

const pregArray = [groupPreg, invertedWeekPreg, weeksPreg, weekSymbolPreg, groupPreg, invertedWeekPreg, weeksPreg, weekSymbolPreg, lessonNamePreg];
console.log(pregArray);
const stringRegEx = pregArray.join('');
console.log(stringRegEx);
console.log('Длиа регулярки: ', stringRegEx.length);
const mainLessonPreg = new RegExp(pregArray.join());

console.log(mainLessonPreg.test(`1гр.4,8,12н. 2гр.6,10,14н. Разработка и эксплуатация защищенных автоматизированных систем 1гр.2,6,10,14н. 2гр4,8,12,16н.Инфраструктура открытых ключей в СЗИ`));