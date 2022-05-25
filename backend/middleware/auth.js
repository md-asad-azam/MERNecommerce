const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies

    if(!token){
        return next(new ErrorHandler("Please login to access this resource", 401))
    }

    // if there will be any change in token then this will immediately throw an error 
    // #invalidsignature
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_CODE)

    req.user = await User.findById(decodedData.id)//saving it in req.user so that we know 
    // the user who had logged in

    next()  //this is a middleware function and the routes will only be accessible 
    // if next is called from here
})

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandler(`Role:${req.user.role} is not allowed to access this resource`, 403)
            )
        }
        next()
    }
}