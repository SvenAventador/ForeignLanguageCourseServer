const ErrorHandler = require("../errors/errorHandler");
const {
    Course,
    CourseContent,
    Duration,
    Language, UserCourse, ChapterContent, ChapterGallery
} = require("../database")
const {
    extname,
    resolve
} = require("path")
const {v4} = require('uuid')
const {validationResult} = require("express-validator")
const {Op} = require("sequelize");

class Courses {

    async getOne(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            const {id} = req.params
            const course = await Course.findByPk(id, {
                include: {
                    model: CourseContent,
                },
                order: [[CourseContent, 'id', 'asc']]
            })
            return res.json({course})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async getAll(req, res, next) {
        let {
            languageId
        } = req.query

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            let courses

            let includeOptions = [
                {
                    model: Duration,
                },
                {
                    model: Language,
                    where: {
                        languageName: {
                            [Op.ne]: null
                        }
                    }
                }
            ]

            let queryOptions = {
                order: ['id'],
                include: includeOptions
            };

            if (!languageId) {
                courses = await Course.findAndCountAll(queryOptions)
            } else {
                queryOptions.where = {languageId}
                courses = await Course.findAndCountAll(queryOptions)
            }
            return res.json({courses})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {
            courseName,
            courseDescription,
            courseLevel,
            languageId,
            durationId
        } = req.body

        const {courseImage} = req.files || {}
        const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif']

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            if (courseImage === undefined)
                return next(ErrorHandler.badRequest('Пожалуйста, выберите изображение!'))
            const fileExtension = extname(courseImage.name).toLowerCase()
            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: jpg, jpeg, png или gif!'))

            let fileName = v4() + ".jpg"
            await courseImage.mv(resolve(__dirname, '..', 'static', 'img', fileName))

            const course = await Course.create({
                courseName,
                courseDescription,
                courseLevel,
                languageId,
                durationId,
                courseImage: fileName
            })
            return res.json({course})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async edit(req, res, next) {
        const {id} = req.query
        const {
            courseName,
            courseDescription,
            courseLevel,
            languageId,
            durationId
        } = req.body;

        let courseImageFileName = null;
        if (req.files && req.files.courseImage) {
            const courseImage = req.files.courseImage;
            const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
            const fileExtension = extname(courseImage.name).toLowerCase();

            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: jpg, jpeg, png или gif!'));

            courseImageFileName = v4() + fileExtension;

            try {
                await courseImage.mv(resolve(__dirname, '..', 'static', courseImageFileName));
            } catch (error) {
                return next(ErrorHandler.internal(`Ошибка при сохранении изображения: ${error}`));
            }
        }

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            const candidate = await Course.findByPk(id)
            const courseToUpdate = {
                courseName: courseName || candidate.courseName,
                courseDescription: courseDescription || candidate.courseDescription,
                courseLevel: courseLevel || candidate.courseLevel,
                languageId: languageId || candidate.languageId,
                durationId: durationId || candidate.durationId,
                courseImage: courseImageFileName ? courseImageFileName : candidate.courseImage
            }
            await candidate.update(courseToUpdate)
            return res.json({candidate})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.params

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            const candidate = await Course.findByPk(id)
            await candidate.destroy()

            return res.status(200).json({message: 'Курс успешно удален!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        try {
            const candidates = await Course.findAll()
            candidates.map(async (item) => {
                await item.destroy()
            })

            return res.status(200).json({message: 'Курсы успешно удалены!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async enrollACourse(req, res, next) {
        try {
            const {
                userId,
                courseId
            } = req.body

            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            const candidate = await UserCourse.create({
                userId,
                courseId
            })
            return res.json({candidate})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }
}

module.exports = new Courses()