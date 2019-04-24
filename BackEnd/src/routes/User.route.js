const express = require('express')
const router = express.Router()
const User_controller = require('../controllers/User.controller')
const Authentication_controller = require('../controllers/Authentication.controller')

router.post('/sign-up', User_controller.signup)
router.post('/log-in', User_controller.login)
router.get('/refresh', Authentication_controller.refreshToken)

module.exports = router
