const Task = require('../Models/task.model')
const User = require('../Models/user.model')
const mongoose = require('mongoose')

// @desc    Get all tasks (only id and title)
// @route   GET /tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        // Only fetch id and title fields
        const tasks = await Task.find({}, '_id title')
        
        res.json({
            success: true,
            count: tasks.length,
            data: tasks
        })
    } catch (error) {
        console.error('Get tasks error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
}

// @desc    Get single task
// @route   GET /tasks/:id
// @access  Private
const getTaskById = async (req, res) => {
    try {
        const taskId = req.params.id
        
        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID format'
            })
        }
        
        const task = await Task.findById(taskId).populate('assignedUser', 'username useremail')
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found with this ID'
            })
        }

        res.json({
            success: true,
            data: task
        })
    } catch (error) {
        console.error('Get task error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
}

// @desc    Create task
// @route   POST /tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const { title, description, dueDate, assignedUser } = req.body

        // Validate required fields
        if (!title || !description || !dueDate || !assignedUser) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required: title, description, dueDate, assignedUser'
            })
        }

        // Check if assigned user exists
        if (!mongoose.Types.ObjectId.isValid(assignedUser)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid assigned user ID format'
            })
        }

        const userExists = await User.findById(assignedUser)
        if (!userExists) {
            return res.status(404).json({
                success: false,
                message: 'Assigned user not found'
            })
        }

        const task = await Task.create({
            title,
            description,
            dueDate,
            assignedUser
        })

        res.status(201).json({
            success: true,
            data: task
        })
    } catch (error) {
        console.error('Create task error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
}

// @desc    Update task (only title, description, status, dueDate)
// @route   PUT /tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        const taskId = req.params.id
        
        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID format'
            })
        }
        
        // Check if task exists
        const task = await Task.findById(taskId)
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found with this ID'
            })
        }

        // Extract only allowed fields for update
        const { title, description, status, dueDate } = req.body
        const updateData = {}
        
        if (title) updateData.title = title
        if (description) updateData.description = description
        if (status && ['pending', 'in-progress', 'completed'].includes(status)) {
            updateData.status = status
        } else if (status) {
            return res.status(400).json({
                success: false,
                message: "Status must be one of: 'pending', 'in-progress', 'completed'"
            })
        }
        if (dueDate) updateData.dueDate = dueDate

        // If no valid fields provided
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update provided'
            })
        }

        // Update task with only allowed fields
        const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
            new: true,
            runValidators: true
        }).populate('assignedUser', 'username useremail')

        res.json({
            success: true,
            data: updatedTask
        })
    } catch (error) {
        console.error('Update task error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
}

// @desc    Delete task
// @route   DELETE /tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const taskId = req.params.id
        
        // Validate MongoDB ObjectId format
        if (!mongoose.Types.ObjectId.isValid(taskId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID format'
            })
        }
        
        const task = await Task.findById(taskId)
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found with this ID'
            })
        }

        await task.deleteOne()

        res.json({
            success: true,
            message: 'Task deleted successfully'
        })
    } catch (error) {
        console.error('Delete task error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
}

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask
}