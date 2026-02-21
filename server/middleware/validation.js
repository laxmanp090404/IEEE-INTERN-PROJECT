const { body, validationResult } = require('express-validator')

const validateUser = [
    body('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters')
        .trim(),
    body('useremail')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
]

const validateLogin = [
    body('useremail')
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please enter a valid email')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
]

const validateTask = [
    body('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters')
        .trim(),
    body('description')
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters')
        .trim(),
    body('dueDate')
        .isISO8601()
        .withMessage('Please enter a valid date')
        .custom((value) => {
            if (new Date(value) <= new Date()) {
                throw new Error('Due date must be in the future')
            }
            return true
        }),
    body('assignedUser')
        .isMongoId()
        .withMessage('Please enter a valid user ID')
]

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation errors',
            errors: errors.array()
        })
    }
    next()
}

module.exports = {
    validateUser,
    validateLogin,
    validateTask,
    handleValidationErrors
}