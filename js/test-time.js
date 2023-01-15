const timeBDStart = Date.parse('2023-01-09T17:42:35.112Z'); // сюда передать timeStamp
console.log(timeBDStart);
//const timeUserStart = Date.parse(new Date()); // здесь получить текущую дату
const timeUserStart = Date.parse('2023-01-09T17:42:40.112Z'); // здесь получить текущую дату
console.log(timeUserStart);

const diff = timeBDStart - timeUserStart;
console.log(diff);


console.log('******');
const now = new Date().toISOString(); // вернет в формате ISO
console.log(now); //2023-01-10T20:03:11.148Z

const now2 = Date.parse(new Date());
console.log(now2); // 1673381009000


console.log('******');
const date1 = new Date('August 19, 1975 23:15:30 GMT+07:00');
const date2 = new Date('August 19, 1975 23:15:30 GMT-02:00');

console.log(date1.getTimezoneOffset());
// expected output: your local timezone offset in minutes
// (e.g., -120). NOT the timezone offset of the date object.

console.log(date1.getTimezoneOffset() === date2.getTimezoneOffset());
// expected output: true
