const ErrorHandler = require("../errors/errorHandler");
const {
    CourseContent,
    ChapterGallery,
    ChapterContent
} = require("../database");
const {
    extname,
    resolve
} = require("path");
const {v4} = require("uuid");
const {validationResult} = require("express-validator");

class ChapterController {
    async getOne(req, res, next) {
        const {id} = req.query

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            const chapter = await CourseContent.findByPk(id, {
                include: [
                    {
                        model: ChapterContent,
                    },
                    {
                        model: ChapterGallery
                    }
                ],
                order: [
                    [ChapterContent, 'id', 'asc'],
                    [ChapterGallery, 'id', 'asc']
                ]
            })

            return res.json({chapter})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {
            chapterName,
            chapterDescription,
            courseId
        } = req.body
        let {chapterContent} = req.body
        const {chapterImage} = req.files || {}
        const {chapterGalleryContent} = req.files || {}
        const allowedImageExtensions = ['.jpg', '.jpeg', '.png', '.gif']
        const allowedVideoExtensions = ['.mp4', '.avi', '.mov']

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            if (chapterImage === undefined)
                return next(ErrorHandler.badRequest('Пожалуйста, выберите изображение!'))
            const fileExtension = extname(chapterImage.name).toLowerCase()
            if (!allowedImageExtensions.includes(fileExtension))
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите файл в формате изображения: jpg, jpeg, png или gif!'))
            let fileName = v4() + ".jpg"
            await chapterImage.mv(resolve(__dirname, '..', 'static', 'img', fileName))

            const courseContent = await CourseContent.create({
                chapterName,
                chapterDescription,
                chapterImage: fileName,
                courseId
            })

            chapterContent = JSON.parse(chapterContent)
            await ChapterContent.bulkCreate(chapterContent.map((item) => ({
                chapterContent: item.chapterContent,
                courseContentId: courseContent.id
            })))

            if (chapterGalleryContent === undefined) {
                return next(ErrorHandler.badRequest('Пожалуйста, выберите галерею видео!'))
            }

            const validVideoFiles = chapterGalleryContent.filter(item => {
                const fileExtension = extname(item.name).toLowerCase()
                return allowedVideoExtensions.includes(fileExtension)
            })

            if (validVideoFiles.length !== chapterGalleryContent.length) {
                return next(ErrorHandler.badRequest('Пожалуйста, загрузите видеофайлы в формате: mp4, avi, mov!'))
            }

            const videoFilesPromises = validVideoFiles.map(async (videoItem) => {
                const fileExtension = extname(videoItem.name).toLowerCase()
                const fileName = v4() + fileExtension
                await videoItem.mv(resolve(__dirname, '..', 'static', 'vid', fileName))

                return fileName
            })

            const videoFileNames = await Promise.all(videoFilesPromises)
            await ChapterGallery.bulkCreate(videoFileNames.map(fileName => ({
                chapterGalleryContent: fileName,
                courseContentId: courseContent.id
            })))

            return res.json({message: 'ВАУ'})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.query

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            const courseContent = await CourseContent.findByPk(id)
            const chapterContent = await ChapterContent.findAll({
                where: {
                    courseContentId: courseContent.id
                }
            })
            const galleryContent = await ChapterGallery.findAll({
                where: {
                    courseContentId: courseContent.id
                }
            })

            galleryContent.map(async (item) => {
                await item.destroy()
            })
            chapterContent.map(async (item) => {
                await item.destroy()
            })
            await courseContent.destroy()

            return res.status(200).json({message: "Глава успешно удалена!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        try {
            const contents = await CourseContent.findAll()
            contents.map(async (item) => {
                await item.destroy()
            })

            return res.status(200).json({message: "Все главы успешно удалены!"})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }
}

module.exports = new ChapterController()