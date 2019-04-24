const express = require('express')
const router = express.Router()
const BeaconEvent_controller = require('../controllers/BeaconEvent.controller')
const Authentication_controller = require('../controllers/Authentication.controller')

router.use(Authentication_controller.isAuthenticated)
router.get('/', [BeaconEvent_controller.index, BeaconEvent_controller.create_response])
router.post('/new', BeaconEvent_controller.new)
module.exports = router
