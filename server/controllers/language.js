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
            const candidate = await Language.findOne({where: {languageName}})
            if (candidate)
                return next(ErrorHandler.conflict(`Иностранный язык под названием ${languageName} уже существует!`))

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
            const candidate = await Language.findByPk(id)
            if (candidate && languageName !== candidate.languageName && await Language.findOne({where: {languageName}}))
                return next(ErrorHandler.conflict(`Иностранный язык под названием ${languageName} уже существует!`))
            const candidateToUpdate = {
                languageName: languageName || candidate.languageName
            }
            await candidate.update(candidateToUpdate)
            return res.json({candidate})
        } catch (error) {
            return next(ErrorHandler.internal(`Во время работы сервера произошла следующая ошибка: ${error}`))
        }
    }
}

module.exports = new Languages()