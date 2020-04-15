const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const port = process.env.PORT || 5000;

app.use(bodyParser.json());

require('./routes/timetableRoute')(app);
require('./routes/serviceRoute')(app);
require('./routes/authRoute')(app);

app.use(express.static('public'));

if (process.env.NODE_ENV === 'production') {
    const path = require('path');
    console.log(path);
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server successfully started on port ${port}`);
});