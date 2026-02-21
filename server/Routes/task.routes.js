const express = require('express')
const {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
} = require('../Controllers/task.controller')
const { protect } = require('../middleware/protectAccess')
const { validateTask, handleValidationErrors } = require('../middleware/validation')
const router = express.Router()

router.use(protect) // All task routes are protected

router.route('/')
    .get(getTasks)
    .post(validateTask, handleValidationErrors, createTask)

router.route('/:id')
    .get(getTaskById)
    .put(updateTask)
    .delete(deleteTask)

module.exports = router