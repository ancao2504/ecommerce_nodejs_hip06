const { notFound, errorHandler } = require('../middewares/errorHandler')
const userRouter = require('./user')


const initRoutes = (app) => {
    app.use('/api/user', userRouter)

    app.use(notFound)
    app.use(errorHandler)
}

module.exports = initRoutes