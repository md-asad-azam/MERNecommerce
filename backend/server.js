const app = require("./app")
const connectDatabase = require("./config/database")
const cloudinary = require("cloudinary")

// Handeling uncaught Exception
process.on("uncaughtException", err => {
    console.log(`Error: ${err}`)
    console.log("Shutting down the server due to Uncaught Exception")
    process.exit(1)
})

// config
if(process.env.NODE_ENV !== "PRODUCTION"){
    require("dotenv").dotenv.config({path: "backend/config/config.env"})
}

// Connecting to Database
connectDatabase()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running at http://localhost:${process.env.PORT}`);
})


// Unhandled Promise Rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err}`)
    console.log("Shutting down the server due to unhandled promise rejection")

    server.close(_ => {
        process.exit(1)
    })
})