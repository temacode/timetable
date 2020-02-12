const express = require('express');
const bodyParsser = require('body-parser');

const app = express();

const port = 80;

app.listen(port, () => {
    console.log(`Server successfully started on port ${port}`);
});