const Router = require('express')
const routes = new Router()
const AuthController = require('../controllers/authController')
const authMiddleware = require('../middlewares/authMiddleware')
const {
    validateRegistration,
    validateLogin
} = require("../func/validateParams");

routes.post('/registration', validateRegistration(), AuthController.registration)
routes.post('/login', validateLogin(),AuthController.login)
routes.get('/auth', authMiddleware, AuthController.check)
routes.get('/logout', authMiddleware, AuthController.logout)

module.exports = routes
