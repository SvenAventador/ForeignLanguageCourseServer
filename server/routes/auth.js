const Router = require('express')
const routes = new Router()
const AuthController = require('../controllers/auth')
const authMiddleware = require('../middlewares/auth')
const {
    validateRegistration,
    validateLogin
} = require("../func/validation/user");

routes.post('/registration', validateRegistration(), AuthController.registration)
routes.post('/login', validateLogin(),AuthController.login)
routes.get('/auth', authMiddleware, AuthController.check)
routes.get('/logout', authMiddleware, AuthController.logout)

module.exports = routes
