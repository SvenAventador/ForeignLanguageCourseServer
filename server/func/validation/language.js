const {
    body,
    query,
} = require('express-validator')
const {
    Language,
} = require("../../database");


const validateLanguageParam = () => {
    return [
        query('id')
            .isInt()
            .withMessage('Пожалуйста, введите корректный идентификатор!')
            .custom(async (id) => {
                const language = await Language.findByPk(id)
                if (!language)
                    return Promise.reject(`Иностранного языка под номером ${id} не найдено!`)
            })
    ]
}

const validateCreateLanguage = () => {
    return [
        body('languageName')
            .notEmpty()
            .withMessage('Пожалуйста, введите название иностранного языка!')
            .custom(async (languageName) => {
                const candidate = await Language.findOne({where: {languageName}})
                if (candidate)
                    return Promise.reject(`Иностранный язык с названием ${languageName} уже существует!`)
            })
    ]
}

const validateUpdateLanguage = () => {
    return [
        query('id')
            .isInt()
            .withMessage('Пожалуйста, введите корректный идентификатор!')
            .custom(async (id) => {
                const language = await Language.findByPk(id)
                if (!language)
                    return Promise.reject(`Иностранного языка под номером ${id} не найдено!`)
            }),
        body('languageName')
            .notEmpty()
            .withMessage('Пожалуйста, введите название иностранного языка!')
            .custom(async (languageName, {req}) => {
                const {id} = req.query;
                const candidate = await Language.findByPk(id);
                if (candidate && languageName !== candidate.languageName) {
                    throw new Error(`Иностранный язык с названием ${languageName} уже существует!`);
                }
            })
    ]
}


module.exports = {
    validateLanguageParam,
    validateCreateLanguage,
    validateUpdateLanguage
}