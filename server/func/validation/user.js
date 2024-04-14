const {body} = require("express-validator");
const {User} = require("../../database");
const {compareSync} = require("bcrypt");
const validateRegistration = () => {
    return [
        body('userNickname')
            .notEmpty()
            .withMessage('Пожалуйста, введите Ваш никнейм!')
            .custom(async (userNickname) => {
                const candidateOnName = await User.findOne({where: {userNickname}})
                if (candidateOnName)
                    return Promise.reject(`Пользователь с именем ${userNickname} уже существует!`)
            }),
        body('userEmail')
            .isEmail()
            .withMessage('Пожалуйста, введите корректную почту!')
            .custom(async (userEmail) => {
                const candidateOnEmail = await User.findOne({where: {userEmail}})
                if (candidateOnEmail)
                    return Promise.reject(`Пользователь с почтой ${userEmail} уже существует!`)
            }),
        body('userPassword')
            .isLength({min: 8})
            .withMessage('Минимальная длина пароля 8 символов!')
    ]
}

const validateLogin = () => {
    return [
        body('userEmail')
            .isEmail()
            .withMessage('Пожалуйста, введите корректную почту!')
            .custom(async (userEmail) => {
                const candidateOnEmail = await User.findOne({where: {userEmail}})
                if (!candidateOnEmail)
                    return Promise.reject(`Пользователя с почтой ${userEmail} не найдено!`)
            }),
        body('userPassword')
            .isLength({min: 8})
            .withMessage('Минимальная длина пароля 8 символов!')
            .custom(async (userPassword, {req}) => {
                const {userEmail} = req.body
                const candidateOnEmail = await User.findOne({where: {userEmail}})
                if (!compareSync(userPassword, candidateOnEmail.userPassword))
                    return Promise.reject('Введенные Вами пароли не верны!')
            })
    ]
}

module.exports = {
    validateRegistration,
    validateLogin
}

