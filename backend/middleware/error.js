const ErrorHandler = require("../utils/errorHandler")


module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    // MongoDB wrong ID error
    if(err.name== "CastError"){
        const msg = `Resource not found. Invalid: ${err.path}`
        err = new ErrorHandler(msg, 400)
    }

    // Mongoose duplicate key Error #regestering again with same email
    if(err.code == 11000){
        const msg = `Duplicate ${Object.keys(err.keyValue)} entered`
        err = new ErrorHandler(msg, 400)
    }

    // Wrong JWT error
    if(err.name== "jsonWebTokenError"){
        const msg = `JSON Web Token is Invalid, try again!`
        err = new ErrorHandler(msg, 400)
    }

    // JWT expired error
    if(err.name== "TokenExpiredError"){
        const msg = `JSON Web Token is Expired, try again!`
        err = new ErrorHandler(msg, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}

// This is a middleware function for error and it is called in app.js as "errorMiddelware"
// app.use(errorMiddleware) --- this will catch all the error that is thrown from any where
// in the app and diplay it accordingly