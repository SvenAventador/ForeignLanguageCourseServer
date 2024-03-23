const ErrorHandler = require("../errors/errorHandler");
const {validationResult} = require("express-validator");
const {extname} = require("path");
const {hashSync, genSaltSync, compareSync} = require('bcrypt')
const {User} = require("../database");
const SecondaryFunction = require("../func/secondaryFunction");

class AuthController {

    async registration(req, res, next) {
        const {
            userNickname,
            userEmail,
            userPassword
        } = req.body
        const {userImage} = req?.files || {}
        const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            if (userImage !== undefined) {
                const fileExtension = extname(userImage.name).toLowerCase()
                if (!allowedImageExtensions.includes(fileExtension))
                    return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: jpg, jpeg, png или gif!'))
            }

            const candidateOnName = await User.findOne({where: {userNickname}})
            if (candidateOnName)
                return next(ErrorHandler.conflict(`Пользователь с именем ${userNickname} уже существует!`))
            const candidateOnEmail = await User.findOne({where: {userEmail}})
            if (candidateOnEmail)
                return next(ErrorHandler.conflict(`Пользователь с почтой ${userEmail} уже существует!`))

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
            if (!candidate)
                return next(ErrorHandler.notFound(`Пользователя с почтой ${userEmail} не найдено!`))

            if (!compareSync(userPassword, candidate.userPassword))
                return next(ErrorHandler.conflict('Введенный Вами пароль неверен!'))

            const token = SecondaryFunction.generate_jwt(
                candidate.id,
                candidate.userNickname,
                candidate.userEmail,
                candidate.userRole
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
            req.user.userRole
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

module.exports = new AuthController()