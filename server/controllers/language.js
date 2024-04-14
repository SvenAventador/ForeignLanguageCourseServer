const ErrorHandler = require("../errors/errorHandler");
const {
    Language
} = require("../database")
const {validationResult} = require("express-validator");

class Languages {
    async getOne(req, res, next) {
        const {id} = req.query
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            const language = await Language.findByPk(id)
            return res.json({language})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async getAll(req, res, next) {
        try {
            const languages = await Language.findAll()
            return res.json({languages})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async create(req, res, next) {
        const {languageName} = req.body
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            const language = await Language.create({
                languageName
            })
            return res.json({language})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async edit(req, res, next) {
        const {id} = req.query
        const {languageName} = req.body

        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ErrorHandler.badRequest({
                    errors: errors.array()
                }))
            }

            const candidate = await Language.findByPk(id)
            const candidateToUpdate = {
                languageName: languageName || candidate.languageName
            }
            await candidate.update(candidateToUpdate)
            return res.json({candidate})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async deleteOne(req, res, next) {
        const {id} = req.query

        try {
            const language = await Language.findByPk(id)
            await language.destroy()
            return res.status(200).json({message: 'Данный иностранный язык успешно удален!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }

    async deleteAll(req, res, next) {
        try {
            const language = await Language.findAll()
            language.map(async (item) => {
                await item.destroy()
            })
            return res.status(200).json({message: 'Все иностранные языки успешно удалены!'})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }
}

module.exports = new Languages()