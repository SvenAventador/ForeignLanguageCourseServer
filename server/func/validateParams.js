const {body} = require('express-validator')
const validateRegistration = () => {
    return [
        body('userNickname').notEmpty().withMessage('Пожалуйста, введите Ваш никнейм!'),
        body('userEmail').isEmail().withMessage('Пожалуйста, введите корректную почту!'),
        body('userPassword').isLength({min: 8}).withMessage('Минимальная длина пароля 8 символов!')
    ]
}

const validateLogin = () => {
    return [
        body('userEmail').isEmail().withMessage('Пожалуйста, введите корректную почту!'),
        body('userPassword').isLength({min: 8}).withMessage('Минимальная длина пароля 8 символов!')
    ]
}

module.exports = {
    validateRegistration,
    validateLogin
}