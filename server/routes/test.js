const Router = require('express')
const routes = new Router()
const TestsController = require('../controllers/test')
const {
    validateGetOneParam,
    validateCreate
} = require("../func/validation/test");

routes.get('/', validateGetOneParam(), TestsController.getOne)
routes.post('/', validateCreate(), TestsController.create)
routes.delete('/', TestsController.deleteOne)

module.exports = routes