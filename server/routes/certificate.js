const Router = require('express')
const routes = new Router()
const CertificateController = require('../controllers/certificate')

routes.get('/user', CertificateController.getAllUser)
routes.get('/:id', CertificateController.getAll)
routes.post('/', CertificateController.create)

module.exports = routes