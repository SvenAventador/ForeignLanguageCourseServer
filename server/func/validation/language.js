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


module.exports = {
    validateLanguageParam
}