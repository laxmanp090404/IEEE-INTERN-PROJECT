const express = require('express')
const {  loginUser } = require('../Controllers/auth.controller')
const { validateLogin, validateRegister, handleValidationErrors } = require('../middleware/validation')
const router = express.Router()


router.post('/', validateLogin, handleValidationErrors, loginUser)

module.exports = router