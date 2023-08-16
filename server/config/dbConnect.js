const  {
    default : mongoose
} = require('mongoose')

const dbConnect = async () => {
    try {
        
        const connect = await mongoose.connect(process.env.MONGOOSE_DB_URI)
        if(connect.connection.readyState == 1) {
            console.log("Db connection is successfully")
        } else {
            console.log("Db connecting")
        }
        

    } catch (error) {
        console.log(`Db connection is failed and message error: ${error}`)
    }
}

module.exports = dbConnect