const {
    body,
    query
} = require("express-validator")
const {
    CourseContent,
    Test
} = require("../../database")

const validateGetOneParam = () => {
    return [
        query('id')
            .isInt()
            .withMessage('Пожалуйста, введите корректный иентификатор!')
    ]
}

const validateCreate = () => {
    return [
        body('testName')
            .isString()
            .notEmpty()
            .withMessage('Пожалуйста, введите корректное название теста!')
            .custom(async (testName) => {
                const test = await Test.findOne({where: {testName}})
                if (test)
                    return Promise.reject(`Тест с названием ${testName} уже существует!`)
            }),
        body('courseContentId')
            .isInt()
            .withMessage('Пожалуйста, введите корректный идентификатор главы курса!')
            .custom(async (courseContentId) => {
                const courseContent = await CourseContent.findByPk(courseContentId)
                if (!courseContent)
                    return Promise.reject('Данной главы не найдено :/')

                const testCandidate = await Test.findOne({where: {courseContentId}})
                if (testCandidate)
                    return Promise.reject('У данной главы уже есть тест :/')
            }),
        body('questions')
            .isArray()
            .withMessage('Пожалуйста, передайте вопросы к тесту в правильном формате!'),
        body('answers')
            .isArray()
            .withMessage('Пожалуйста, передайте ответы к тесту в правильном формате!')
    ]
}

module.exports = {
    validateGetOneParam,
    validateCreate
}