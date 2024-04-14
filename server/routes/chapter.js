const Router = require('express')
const routes = new Router()
const ChapterController = require('../controllers/chapter')

routes.get('/', ChapterController.getOne)

module.exports = routes