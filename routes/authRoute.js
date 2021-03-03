const bcrypt = require('bcrypt');
const saltRounds = 10;

const required = value => value ? undefined : 'Обязательное поле';
const length = value => value.length >= 5 ? undefined : 'Не менее 5 символов';
const length3 = value => value.length >= 3 ? undefined : 'Не менее 3 символов';
const lengthMax = value => value.length <= 25 ? undefined : 'Не более 25 символов';
const chars = value => /^[a-zA-Z0-9]{5,25}$/giu.test(value) ? undefined : 'Только латинские буквы и  цифры';
const charsRus = value => /^[a-zA-Zа-яА-Я]{5,25}$/giu.test(value) ? undefined : 'Только русские и латинские буквы';
const email = value => /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(value) ? undefined : 'Неверный формат почты';

const passwordValidation = [required, length, lengthMax, chars];
const emailValidation = [required, email];

module.exports = (app, mongoose) => {
    const userSchema = mongoose.Schema({
        email: {
            type: String,
            required: [true, 'Нет почты :('],
            lowercase: true,
            unique: true,
            match: [
                /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i,
                'Это не почта',
            ],
        },
        password: {
            required: [true, 'Нет пароля :('],
            type: String,
        }
    }, {
        timestamps: true
    });

    const userModel = mongoose.model('user', userSchema);

    app.post(`/api/auth`, (req, res) => {

        if (!req.body.reg) {
            res.status(200).send({
                message: 'Ошибка получения данных',
            });

            return;
        }
        if (!req.body.reg.email || !req.body.reg.password || !req.body.reg.rep_password) {
            res.status(200).send({
                message: ' Одно или несколько полей не введены',
            });

            return;
        }

        const regForm = {
            email: {
                value: req.body.reg.email,
                error: emailValidation.map(validation => {
                    if (validation(req.body.reg.email)) {
                        return `Почта: ${validation(req.body.reg.email)}`;
                    }

                    return validation(req.body.reg.email);
                }),
            },
            password: {
                value: req.body.reg.password,
                error: passwordValidation.map(validation => {
                    if (validation(req.body.reg.password)) {
                        return `Пароль: ${validation(req.body.reg.password)}`;
                    }
                    return validation(req.body.reg.password);
                }),
            },
            rep_password: {
                value: req.body.reg.rep_password,
                error: [req.body.reg.password === req.body.reg.rep_password ? undefined : 'Пароли не совпадают'],
            },
        }

        /*
        bcrypt.compare(password, hash, (err, result) => {
            if (err) console.log(err);
            console.log('Результат:', result);
        }); */

        for (let key of Object.keys(regForm)) {
            for (let i = 0; i < regForm[key].error.length; i++) {
                if (regForm[key].error[i]) {
                    res.status(200).send({
                        message: regForm[key].error[i],
                    });

                    return;
                }
            }
        }

        const User = new userModel({
            email: regForm.email.value,
            password: bcrypt.hashSync(regForm.password.value, saltRounds, (err, hash) => {
                console.log('Хеш: ', hash);
                return hash;
            }),
        });

        userModel.findOne({email: regForm.email.value}, (err, result) => {
            if (err) {
                console.log(err);
                res.status(200).send({
                    message: 'Ошибка подключения к базе данных',
                });

                return;
            }

            if (result) {
                res.status(200).send({
                    message: 'Такой пользователь уже существует',
                });

                return;
            }

            User.save(err => {
                if (err) {
                    console.log(err);
                    res.status(200).send({
                        message: 'Ошибка подключения к базе данных',
                    });

                    return;
                }

                res.status(200).send({
                    message: `На почту ${regForm.email.value} отправлено письмо`,
                });

            });
        });
    });
}