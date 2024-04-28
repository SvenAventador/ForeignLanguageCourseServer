const {
    body,
    query,
    param
} = require('express-validator')
const {
    Course,
    Language,
    Duration,
    User
} = require("../../database");

const validateCourseParam = () => {
    return [
        param('id')
            .isInt()
            .withMessage('Пожалуйста, введите корректный идентификатор!')
            .custom(async (id) => {
                const course = await Course.findByPk(id)
                if (!course)
                    return Promise.reject(`Курса под номером ${id} не найдено!`)
            })
    ]
}

const validateEnroll = () => {
    return [
        body('userId')
            .isInt()
            .withMessage("Пожалуйста, введите корректный идентификатор пользователя!")
            .custom(async (userId) => {
                const candidate = await User.findByPk(userId)
                if (!candidate)
                    return Promise.reject('Данного пользователя не существует!')
            }),
        body('courseId')
            .isInt()
            .withMessage("Пожалуйста, введите корректный идентификатор курса!")
            .custom(async (courseId) => {
                const candidate = await Course.findByPk(courseId)
                if (!candidate)
                    return Promise.reject('Данного курса не существует!')
            })
    ]
}

module.exports = {
    validateCourseParam,
    validateEnroll
}