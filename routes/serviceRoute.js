const needle = require('needle');
const tress = require('tress');
const cheerio = require('cheerio');
const URL = 'https://www.mirea.ru/schedule/';
const download = require('download-file');

module.exports = app => {
    app.get('/api/service/', (req, res) => {

        var q = tress((url, callback) => {
            const universityList = [];
            needle.get(url, (err, res) => {
                if (err) throw err;

                var $ = cheerio.load(res.body);

                $('ul[uk-tab] li a').each(function() {
                    if ($(this).text().trim() === 'Бакалавриат/специалитет') {
                        var tabNum = ($(this).attr('href').split('-'))[1];

                        $('.uk-switcher li:nth-child(' + tabNum + ') .uk-card').each(function() {
                            const scheduleLinks = [];

                            $(this).find('.uk-link-toggle').each(function() {
                                let scheduleItem = {};
                                scheduleItem.link = $(this).attr('href');
                                scheduleItem.name = $(this).find('.uk-link-heading').text().trim();
                                scheduleLinks.push(scheduleItem);
                            });

                            if ($(this).find('.uk-text-bold').text().trim()) {
                                let nameArray = $(this).find('.uk-text-bold').text().trim().split(/\s|\-/);

                                let shortName = [];

                                nameArray.map((e) => {
                                    if (e === 'им.' || e === 'М.В.' || e === 'Ломоносова') {
                                        shortName.push(` ${e}`);
                                        return;
                                    }
                                    if (e.length > 1) {
                                        shortName.push(e[0].toUpperCase());
                                        return;
                                    }
                                    if (e.length === 1) {
                                        shortName.push(e[0].toLowerCase());
                                        return;
                                    }
                                });

                                shortName = shortName.join('');
                                universityList.push({
                                    name: $(this).find('.uk-text-bold').text(),
                                    shortName: shortName,
                                    links: scheduleLinks
                                });
                            }
                        });

                    }
                });

                callback(universityList);
            });
        });
        q.push(URL, (universityListx ) => {
            res.status(200).send(universityList);
        });
    });
}