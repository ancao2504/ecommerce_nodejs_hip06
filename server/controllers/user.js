const userModel = require('../models/user')
const asyncHandler = require('express-async-handler')

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
        return res.status(200).json({
            success: true,
            message: 'Login successfully',
            userData
        })
    } else {
        throw new Error('Invalid credentials')
    }
})


module.exports = {
    register,
    login
}