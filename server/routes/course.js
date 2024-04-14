const Router = require('express')
const routes = new Router()
const CourseController = require('../controllers/course')
const {
    validateCourseParam,
    validateCreateCourse,
    validateUpdateCourse, validateEnroll,
} = require("../func/validation/course");

routes.get('/:id', validateCourseParam(), CourseController.getOne)
routes.get('/',CourseController.getAll)
routes.post('/', validateCreateCourse(), CourseController.create)
routes.post('/enroll', validateEnroll(), CourseController.enrollACourse)
routes.put('/', validateUpdateCourse(), CourseController.edit)
routes.delete('/:id', validateCourseParam(), CourseController.deleteOne)
routes.delete('/', CourseController.deleteAll)

module.exports = routes