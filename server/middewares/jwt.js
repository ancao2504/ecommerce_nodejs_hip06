const jwt = require('jsonwebtoken')

const generateAccessToken = (uid, role) => {
    let objectFirst = {
        _id: uid,
        role
    }
    return jwt.sign(objectFirst, process.env.JWT_SECRET, {expiresIn: '2d'})
}

const generateRefreshToken = (uid) => {
    let objectFirst = {
        _id: uid,
    }
    return jwt.sign(objectFirst, process.env.JWT_SECRET, {expiresIn: '7d'})
}

module.exports = {
    generateAccessToken,
    generateRefreshToken
}