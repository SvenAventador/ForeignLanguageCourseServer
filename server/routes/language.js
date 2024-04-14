const Router = require('express')
const routes = new Router()
const LanguageController = require('../controllers/language')
const {
    validateLanguageParam,
    validateCreateLanguage,
    validateUpdateLanguage
} = require("../func/validation/language");

routes.get('/one', validateLanguageParam(), LanguageController.getOne)
routes.get('/', LanguageController.getAll)
routes.post('/', validateCreateLanguage(), LanguageController.create)
routes.put('/', validateUpdateLanguage(), LanguageController.edit)
routes.delete('/one', validateLanguageParam(), LanguageController.deleteOne)
routes.delete('/', LanguageController.deleteAll)

module.exports = routes