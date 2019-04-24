const express = require('express')
const router = express.Router()
const QREvent_controller = require('../controllers/QREvent.controller')
const Authentication_controller = require('../controllers/Authentication.controller')

router.use(Authentication_controller.isAuthenticated)
router.get('/', [QREvent_controller.index, QREvent_controller.create_response])
router.post('/new', QREvent_controller.new)
module.exports = router
