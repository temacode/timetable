module.exports = app => {
    app.post(`/api/auth`, (req, res) => {
        console.log(req.body);
        res.status(200).send('OK');
    });
}