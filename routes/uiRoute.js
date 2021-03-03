module.exports = app => {

    app.get(`/api/services/`, (req, res) => {
        const parts = [
            {
                name: 'schedule',
                displayName: '📅 Расписание',
                to: '/schedule'
            },
            {
                name: 'backlog',
                displayName: '🔜 Беклог',
                to: '/'
            },
        ]
        res.status(200).send(parts)
    });
}