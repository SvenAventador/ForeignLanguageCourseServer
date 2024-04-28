const {
    param,
    body
} = require("express-validator");
const {
    User
} = require("../../database");
const validateParams = () => {
    return [
        param('id')
            .isInt()
            .withMessage('Пожалуйста, введите корректный идентификатор пользователя!')
            .custom(async (id) => {
                const user = await User.findByPk(id)
                if (!user)
                    return Promise.reject(`Пользователя с номером ${id} не найдено!`)
            })
    ]
}

module.exports = {
    validateParams
}