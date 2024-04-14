const ErrorHandler = require("../errors/errorHandler");
const {
    CourseContent,
    ChapterGallery,
    ChapterContent
} = require("../database");

class ChapterController {
    async getOne(req, res, next) {
        const {id} = req.query

        try {
            const chapter = await CourseContent.findByPk(id, {
                include: [
                    {
                        model: ChapterContent,
                        include: [
                            {
                                model: ChapterGallery,
                                order: [['id', 'asc']]
                            }
                        ],
                        order: [['id', 'asc']]
                    }
                ],
                order: [['id', 'asc']]
            });

            return res.json({chapter})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }
}

module.exports = new ChapterController()