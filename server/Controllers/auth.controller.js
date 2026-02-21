const User = require('../Models/user.model')
const jwt = require('jsonwebtoken')

// Generating JWT Token for Authentication and authorisation
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '5d'
    })
}

// @desc    Login user
// @route   POST /auth
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { useremail, password } = req.body

        // Check for user
        const user = await User.findOne({ useremail })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            })
        }

        // Check password
        const isPasswordValid = await user.matchPassword(password)
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid username or password'
            })
        }

        // Success response
        res.json({
            success: true,
            data: {
                _id: user._id,
                username: user.username,
                useremail: user.useremail,
                token: generateToken(user._id)
            }
        })

    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({
            success: false,
            message: 'Server error'
        })
    }
}

module.exports = {
    loginUser
}