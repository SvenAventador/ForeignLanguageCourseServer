const Router = require('express')
const routes = new Router()
const ChapterController = require('../controllers/chapter')
const {
    validateGetOneChapter,
    validateCreateChapter
} = require("../func/validation/chapter");

routes.get('/', validateGetOneChapter(), ChapterController.getOne)
routes.post('/', validateCreateChapter(), ChapterController.create)
routes.delete('/one', validateGetOneChapter(), ChapterController.deleteOne)
routes.delete('/', ChapterController.deleteAll)

module.exports = routes