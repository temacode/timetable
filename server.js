const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 80;

app.use(bodyParser.json());

require('./routes/timetableRoute')(app);

app.use(express.static('public'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('public'));

    const path = require('path');
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server successfully started on port ${port}`);
});