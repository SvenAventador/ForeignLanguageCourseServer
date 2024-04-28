const Router = require('express')
const routes = new Router()
const LanguageController = require('../controllers/language')
const {
    validateLanguageParam
} = require("../func/validation/language");

routes.get('/one', validateLanguageParam(), LanguageController.getOne)
routes.get('/', LanguageController.getAll)
routes.post('/', LanguageController.create)
routes.put('/', LanguageController.edit)

module.exports = routes