require('./polyfills/polyfills');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const colors = require("./helpers/term-colors");

const app = express();
const port = process.env.PORT || 5000;
const connect = mongoose.connect(
    'mongodb://localhost:27017/timetable',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        console.log('\x1b[36m%s\x1b[0m', '\nБаза данныx успешно подключена\n');
        app.use(bodyParser.json());

        require('./routes/timetableRoute')(app);
        require('./routes/serviceRoute')(app);
        require('./routes/authRoute')(app, mongoose);
        require('./routes/uiRoute')(app);

        app.use(express.static('public'));

        if (process.env.NODE_ENV === 'production') {
            const path = require('path');
            console.log(path);
            app.get('*', (req, res) => {
                res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
            });
        }

        app.listen(port, () => {
            console.log(`Сервер успешно запущен по адресу ${colors.cyan}http://localhost:${port}\n\n${colors.reset}`);
        });
    })
    .catch(err => {
        console.error('\x1b[36m%s\x1b[0m', '\n\nНе удалось установить соединение с базой данных\n\n', err);
    });
