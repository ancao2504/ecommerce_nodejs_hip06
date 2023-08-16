const { notFound, errorHandler } = require('../middewares/errorHandler')
const userRouter = require('./user')
const productsRouter = require('./products')

const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/product', productsRouter)


    app.use(notFound)
    app.use(errorHandler)
}

module.exports = initRoutes