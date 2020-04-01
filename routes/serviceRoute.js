const needle = require('needle');
const tress = require('tress');
const cheerio = require('cheerio');
const URL = 'https://www.mirea.ru/schedule/';

const universityList = [];

module.exports = app => {
    app.get('/api/service/', (req, res) => {

        var q = tress((url, callback) => {
            needle.get(url, (err, res) => {
                if (err) throw err;

                var $ = cheerio.load(res.body);

                /* $('.uk-link-toggle').each((i, e) => {
                    console.log(e.attribs.href);
                }); */

                $('ul[uk-tab] li a').each(function() {
                    if ($(this).text().trim() === 'Бакалавриат/специалитет') {
                        var tabNum = ($(this).attr('href').split('-'))[1];

                        $('.uk-switcher li:nth-child(' + tabNum + ') .uk-card').each(function() {
                            let sheduleLinks = [];

                            $(this).find('.uk-link-toggle').each(function() {
                                if ($(this).attr('href')) {
                                    sheduleLinks.push($(this).attr('href'));
                                }
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
                                    hrefs: sheduleLinks
                                });
                            }
                        });

                    }
                });

                callback();
            });
        });

        q.drain = () => {
            //require('fs').writeFileSync('./data.json', JSON.stringify(results, null, 4));
            console.log(universityList);
        }
        q.push(URL);

        res.status(200).send('OK');
    });
}