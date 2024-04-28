const Router = require('express')
const routes = new Router()
const PersonalController = require('../controllers/personal')
const {
    validateUpdateUser,
    validateParams
} = require("../func/validation/personal");

routes.get('/:id', validateParams(), PersonalController.getStatistic)
routes.put('/:id', PersonalController.edit)

module.exports = routes