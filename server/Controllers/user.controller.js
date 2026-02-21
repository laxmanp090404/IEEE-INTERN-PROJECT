const User = require('../Models/user.model');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// Generating JWT Token for Authentication and authorisation
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '5d'
    })
}

// @desc    Registering user with details
// @route   POST /users
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { username, useremail, password } = req.body

        // Checking if user exists using email or the uname as both has to be unique
        const userExists = await User.findOne({ 
            $or: [{ useremail }, { username }] 
        })

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email or username'
            })
        }

        // Create user
        const user = await User.create({
            username,
            useremail,
            password
        })

        if (user) {
            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    username: user.username,
                    useremail: user.useremail,
                    token: generateToken(user._id)
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
}

// @desc    Get all users
// @route   GET /users
// @access  Private
const getUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password')
        res.json({
            success: true,
            count: users.length,
            data: users
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        })
    }
}

// @desc    Get single user
// @route   GET /users/:id
// @access  Private
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Check if ID is valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }
        
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this ID'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// @desc    Update user
// @route   PUT /users/:id
// @access  Private
const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Check if ID is valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format'
            });
        }
        
        const { username, useremail } = req.body;
        
        // Create update object with only allowed fields
        const updateData = {};
        if (username) updateData.username = username;
        if (useremail) updateData.useremail = useremail;
        
        // If no valid fields provided
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No valid fields to update provided'
            });
        }

        // Check if user exists
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this ID'
            });
        }

        // Check if email/username already exists for another user
        if (useremail || username) {
            const existingUser = await User.findOne({
                _id: { $ne: userId },
                $or: [
                    ...(useremail ? [{ useremail }] : []),
                    ...(username ? [{ username }] : [])
                ]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'Email or username already exists'
                });
            }
        }

        // Update user with only allowed fields
        user = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
            runValidators: true
        }).select('-password');

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

module.exports = {
    registerUser,
    getUsers,
    getUserById,
    updateUser
}