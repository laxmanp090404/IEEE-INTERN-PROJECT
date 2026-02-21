const express = require('express')
const { registerUser, getUsers, getUserById, updateUser } = require('../Controllers/user.controller')
const { validateUser, handleValidationErrors } = require('../middleware/validation')
const { protect } = require('../middleware/protectAccess')
const router = express.Router()

// Public route
router.post('/', validateUser, handleValidationErrors, registerUser)

// Protected routes
router.get('/', protect, getUsers)
router.get('/:id', protect, getUserById)
router.put('/:id', protect, updateUser)

module.exports = router