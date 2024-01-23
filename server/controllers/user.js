const { generateAccessToken, generateRefreshToken } = require('../middewares/jwt')
const userModel = require('../models/user')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

const register = asyncHandler(async(req, res) => {
    const {
        firstname,
        lastname,
        email,
        password
    } = req.body

    console.log(firstname)

    if(!email || !password || !lastname || !firstname) {
        return res.status(400).json({
            success: false,
            message: 'Missing inputs'
        })
    }

    const user = await userModel.findOne({
        email
    })
    if(user) {
        throw new Error(`User has existed`)
    } else {
        const response = await userModel.create(req.body)

        return res.status(200).json({
            success: response ? true : false,
            message: response ? 'Register is successfully. Please go login' : 'Something went wrong'
        })
    }
    
})

const login = asyncHandler(async (req, res) => {
    const {
        email,
        password
    } = req.body

    if(!email) {
        return res.status(400).json({
            success: false,
            message: 'Missing input email'
        })
    }

    if(!password) {
        return res.status(400).json({
            success: false,
            message: 'Missing input password'
        })
    }

    const response = await userModel.findOne({
        email
    })
    if(response && await response.isCorrectPassword(password)) {
        const {
            password,
            role,
            ...userData
        } = response.toObject()

        const accessToken = generateAccessToken(response._id, role)
        const refreshToken = generateRefreshToken(response._id)

        // save refresh token use database return data after update
        await userModel.findByIdAndUpdate(response._id, {
            refreshToken
        }, {
            new: true
        })
        // save refresh toekn to cookie
        res.cookie(
            'refreshToken',
            refreshToken,
            {
                httpOnly: true, 
                maxAge: 7 * 24 * 60 * 60 * 1000
            }
        )

        return res.status(200).json({
            success: true,
            message: 'Login successfully',
            accessToken: accessToken,
            refreshToken: refreshToken,
            userData
        })
    } else {
        throw new Error('Invalid credentials')
    }
})


// get information of user
const getCurrent = asyncHandler(async(req, res) => {
    const {
        _id,
    } = req.user

    if(!_id) {
        return res.status(400).json({
            success: false,
            message: 'Missing inputs'
        })
    }
    const user = await userModel.findById(_id).select('-refreshToken -role -password')
    if(!user) {
        throw new Error(`User not found`)
    } else {
        return res.status(200).json({
            success: user ? true : false,
            message: user ? user : 'User not found'
        })
    }
})

// refresh access token
const refreshAccessToken = asyncHandler(async(req, res) => {
    const cookie = req.cookies
    if(!cookie && !cookie.refreshToken) {
        throw new Error('No refresh token in cookies')
    }

    // check token validate
    const results = jwt.verify(
        cookie.refreshToken,
        process.env.JWT_SECRET
    )
    const response = await userModel.findOne({
        _id: results._id,
        refreshToken: cookie.refreshToken
    })
    return res.status(200).json({
        success: response ? true : false,
        newAccessToken: response ? generateAccessToken(
            response._id,
            response.role
        ) : 'Refresh token not matched'
    })
    
})

const logout = asyncHandler(async(req, res) => {
    const cookie = req.cookies
    if(!cookie || !cookie.refreshToken) {
        throw new Error('No refresh token in cookies')
    }

    // delete refresh token in database
    await userModel.findOneAndUpdate({
        refreshToken: cookie.refreshToken
    }, {
        refreshToken: ''
    }, {
        new: true
    })
    // delete refresh token on cookies browser
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })

    return res.status(200).json({
        success: true,
        message: "Logout successfully"
    })
})

module.exports = {
    register,
    login,
    getCurrent,
    refreshAccessToken,
    logout
}