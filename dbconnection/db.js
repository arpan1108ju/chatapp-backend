const mongoose = require('mongoose')

const connectDB = async () => {

    try {
        const connection = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser : true,
            useUnifiedTopology : true
        })
        console.log("---------------------------")
        console.log("Succesfully connected to DB : ",connection.connection.host);
        console.log("---------------------------")

    } catch (err) {
        console.log(`Error in connecting to the database: ${err}`);
        process.exit(1);
    }
}

module.exports = connectDB;