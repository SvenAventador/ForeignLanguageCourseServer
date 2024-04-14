const {
    body,
    query,
    param
} = require('express-validator')
const {
    Course,
    Language,
    Duration, User
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

const validateCreateCourse = () => {
    return [
        body('courseName')
            .notEmpty()
            .withMessage('Пожалуйста, введите название курса!')
            .custom(async (courseName) => {
                const candidate = await Course.findOne({where: {courseName}})
                if (candidate)
                    return Promise.reject(`Курс под названием ${courseName} уже существует!`)
            }),
        body('courseDescription')
            .notEmpty()
            .withMessage('Пожалуйста, введите описание курса!'),
        body('courseLevel')
            .custom(async (courseLevel) => {
                const level = ['Начинающий', 'Элементарный', 'Средний', 'Продвинутый']
                if (!level.includes(courseLevel))
                    return Promise.reject('Выберите корректный уровень курса!')
            }),
        body('languageId')
            .custom(async (languageId) => {
                const candidate = await Language.findByPk(languageId)
                if (!candidate)
                    return Promise.reject('Пожалуйста, выберите корректный язык!')
            }),
        body('durationId')
            .custom(async (durationId) => {
                const candidate = await Duration.findByPk(durationId)
                if (!candidate)
                    return Promise.reject('Пожалуйста, выберите корректную длительность курса!')
            })
    ]
}

const validateUpdateCourse = () => {
    return [
        query('id')
            .isInt()
            .withMessage('Пожалуйста, введите корректный идентификатор!')
            .custom(async (id) => {
                const course = await Course.findByPk(id)
                if (!course)
                    return Promise.reject(`Курса под номером ${id} не найдено!`)
            }),
        body('courseName')
            .notEmpty()
            .withMessage('Пожалуйста, введите название курса!')
            .custom(async (courseName) => {
                const candidate = await Course.findOne({where: {courseName}})
                if (candidate && courseName !== candidate.courseName && await Course.findOne({where: {courseName}}))
                    return Promise.reject(`Курс с названием ${courseName} уже существует!`)
            }),
        body('courseDescription')
            .notEmpty()
            .withMessage('Пожалуйста, введите описание курса!'),
        body('courseLevel')
            .custom(async (courseLevel) => {
                const level = ['Начинающий', 'Элементарный', 'Средний', 'Продвинутый']
                if (!level.includes(courseLevel))
                    return Promise.reject('Выберите корректный уровень курса!')
            }),
        body('languageId')
            .custom(async (languageId) => {
                const candidate = await Language.findByPk(languageId)
                if (!candidate)
                    return Promise.reject('Пожалуйста, выберите корректный язык!')
            }),
        body('durationId')
            .custom(async (durationId) => {
                const candidate = await Duration.findByPk(durationId)
                if (!candidate)
                    return Promise.reject('Пожалуйста, выберите корректную длительность курса!')
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
    validateCreateCourse,
    validateUpdateCourse,
    validateEnroll
}