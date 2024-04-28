const Router = require('express')
const routes = new Router()
const CourseController = require('../controllers/course')
const {
    validateCourseParam,
    validateEnroll,
} = require("../func/validation/course");

routes.get('/admin', CourseController.getAdminGetAll)
routes.get('/:id', validateCourseParam(), CourseController.getOne)
routes.get('/', CourseController.getAll)
routes.post('/', CourseController.create)
routes.post('/enroll', validateEnroll(), CourseController.enrollACourse)
routes.put('/', CourseController.edit)
routes.delete('/:id', validateCourseParam(), CourseController.deleteOne)
routes.delete('/', CourseController.deleteAll)

module.exports = routes