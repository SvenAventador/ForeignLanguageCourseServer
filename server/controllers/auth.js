const ErrorHandler = require("../errors/errorHandler");
const {validationResult} = require("express-validator");
const {
    hashSync,
    genSaltSync
} = require('bcrypt')
const {User} = require("../database");
const SecondaryFunction = require("../func/secondary");

class Auth {

    async registration(req, res, next) {
        const {
            userNickname,
            userEmail,
            userPassword
        } = req.body

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            const user = await User.create({
                userNickname,
                userEmail,
                userPassword: await hashSync(userPassword, genSaltSync(5)),
                userRole: 'USER'
            })

            const token = SecondaryFunction.generate_jwt(
                user.id,
                user.userNickname,
                user.userEmail,
                user.userRole
            )
            return res.json({token})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async login(req, res, next) {
        const {
            userEmail,
            userPassword
        } = req.body

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            const candidate = await User.findOne({where: {userEmail}})
            const token = SecondaryFunction.generate_jwt(
                candidate.id,
                candidate.userNickname,
                candidate.userEmail,
                candidate.userRole,
                candidate.userSurname,
                candidate.userName,
                candidate.userPatronymic,
                candidate.userPhone
            )

            return res.json({token})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async check(req, res, next) {
        const token = SecondaryFunction.generate_jwt(
            req.user.id,
            req.user.userNickname,
            req.user.userEmail,
            req.user.userRole,
            req.user.userSurname,
            req.user.userName,
            req.user.userPatronymic,
            req.user.userPhone
        )
        return res.json({token})
    }

    async logout(req, res, next) {
        const token = req.headers.authorization
        if (!token)
            return next(ErrorHandler.unauthorized("Пользователь не авторизован!"))

        try {
            return res.json({message: "Вы успешно вышли из системы!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }
}

module.exports = new Auth()