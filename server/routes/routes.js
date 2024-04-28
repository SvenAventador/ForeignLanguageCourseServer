const Router = require('express')
const router = new Router()

const userRoutes = require('./auth')
const courseRoutes = require('./course')
const languageRoutes = require('./language')
const chapterRoutes = require('./chapter')
const testRoutes = require('./test')
const userTestRoutes = require('./userTest')
const personalRoutes = require('./personal')
const certificateRoutes = require('./certificate')

router.use('/user', userRoutes)
router.use('/course', courseRoutes)
router.use('/language', languageRoutes)
router.use('/chapter', chapterRoutes)
router.use('/test', testRoutes)
router.use('/user-test', userTestRoutes)
router.use('/personal', personalRoutes)
router.use('/certificate', certificateRoutes)

module.exports = router

