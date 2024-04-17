const {
    body,
    query,
    param
} = require('express-validator')
const {
    CourseContent, Course
} = require("../../database");

const validateGetOneChapter = () => {
    return [
        query('id')
            .isInt()
            .withMessage('Пожалуйста, введите корректный идентификатор!')
            .custom(async (id) => {
                const courseContent = await CourseContent.findByPk(id)
                if (!courseContent)
                    return Promise.reject(`Курса под номером ${id} не найдено!`)
            })
    ]
}

const validateCreateChapter = () => {
    return [
        body('chapterName')
            .notEmpty()
            .withMessage('Пожалуйста, введите название главы курса!')
            .custom(async (chapterName, {req}) => {
                const courseId = req.body.courseId
                const courseContent = await CourseContent.findOne({where: {chapterName, courseId}})
                if (courseContent)
                    return Promise.reject(`Глава с названием ${chapterName} уже существует!`)
            }),
        body('chapterDescription')
            .notEmpty()
            .withMessage('Пожалуйста, введите описание главыЙ'),
        body('courseId')
            .isInt()
            .withMessage('Пожалуйста, введите корректный идентификатор курса!')
            .custom(async (courseId) => {
                const course = await Course.findByPk(courseId)
                if (!course)
                    return Promise.reject(`Курса под номером ${courseId} не найден!`)
            }),
        body('chapterContent')
            .isString()
            .withMessage('Пожалуйста, передайте контент глав в корректном формате!')
    ]
}

module.exports = {
    validateGetOneChapter,
    validateCreateChapter
}