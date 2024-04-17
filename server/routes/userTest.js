const Router = require('express')
const routes = new Router()
const UserTestController = require('../controllers/userTest')

routes.post('/', UserTestController.createOrUpdateResult)

module.exports = routes