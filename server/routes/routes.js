const Router = require('express')
const router = new Router()

const userRoutes = require('./auth')
const courseRoutes = require('./course')
const languageRoutes = require('./language')
const chapterRoutes = require('./chapter')

router.use('/user', userRoutes)
router.use('/course', courseRoutes)
router.use('/language', languageRoutes)
router.use('/chapter', chapterRoutes)

module.exports = router