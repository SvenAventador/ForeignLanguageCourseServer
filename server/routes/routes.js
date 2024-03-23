const Router = require('express')
const router = new Router()

const userRoutes = require('./authRoutes')

router.use('/user', userRoutes)

module.exports = router