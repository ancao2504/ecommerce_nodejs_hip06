const express = require('express')
require('dotenv').config()

const dbConnect = require("./config/dbConnect")
const initRoutes = require('./router')
const cookieParser = require('cookie-parser')

const app = express()
const port = process.env.PORT || 3305
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))
dbConnect()
initRoutes(app)

app.use('/', (req, res) => {
    res.send("SERVER ON")
})

app.listen(port, () => {
    console.log(`Server running on the port ${port}`)
})