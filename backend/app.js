const express = require("express");
const cookieParser = require("cookie-parser")
const errorMiddleware = require("./middleware/error")
const fileUpload = require("express-fileupload")
const bodyParser = require("body-parser")
const path = require("path")


const app = express();
app.use(express.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(fileUpload())

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" })
}

// Route imports
const productRoute = require("./routes/productRoute");
const userRoute = require("./routes/userRoute")
const orderRoute = require("./routes/orderRoute")
const payment = require("./routes/paymentRoute")

app.use("/api/v1", productRoute);
app.use("/api/v1", userRoute)
app.use("/api/v1", orderRoute)
app.use("/api/v1", payment)

app.use(express.static(path.join(__dirname, "../frontend/build")))

app.get("*", (req, res) => {
    res.sendFile(path.resolve("../frontend/build/index.html"))
})

// Middleware for error
app.use(errorMiddleware)


module.exports = app