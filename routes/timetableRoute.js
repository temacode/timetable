const path = require('path');
XLSX = require('xlsx');

module.exports = app => {
    app.get('/api/timetable/', (req, res) => {
        var shedule = XLSX.readFile(path.join(__dirname, '../public/shedule.xlsx'));
            res.status(200).send(shedule);
    });
}