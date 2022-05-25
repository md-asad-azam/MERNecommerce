const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErors = require("../middleware/catchAsyncError")
const User = require("../models/userModel")
const bcrypt = require("bcryptjs/dist/bcrypt")
const sendToken = require("../utils/JWT")
const catchAsyncError = require("../middleware/catchAsyncError")
const sendEmail = require("../utils/sendEmail")
const crypto = require("crypto")
const cloudinary = require("cloudinary")


// Regiter a user
exports.registerUser = catchAsyncErors(async (req, res, next) => {

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: "avatars",
        width: 150,
        crop: "scale"
    })

    const { name, email, password } = req.body

    const user = await User.create({
        name, email, password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    })

    sendToken(user, 201, res)
})

// LOGIN
exports.loginUser = catchAsyncErors(async (req, res, next) => {

    const { email, password } = req.body

    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email and Password", 400))
    }

    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        return next(new ErrorHandler("Invalid Email or Password", 401))
    }

    // Compairing Password
    bcrypt.compare(password, user.password, (err, isMatched) => {
        if (isMatched) {
            sendToken(user, 200, res)
        }
        else {
            return next(new ErrorHandler("Invalid Email or Password", 401))
        }
    })
})


// LOGOUT
exports.logout = catchAsyncErors(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully!!!"
    })
})

// Forget Password 
exports.forgetPassword = catchAsyncErors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user)
        return next(new ErrorHandler("User not found", 404))

    // get reset token
    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })//hash is stored in schema but not saved
    //therefore saving it

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`
    const message = `Your Password reset token is \n\n ${resetPasswordUrl}\n\nIf you have not requested this email then please ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce account password recovery`,
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent successfully!`
        })

    } catch (err) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined
        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(err.message, 500))
    }

})

// Reset Password
exports.resetPassword = catchAsyncErors(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    if (!user)
        return next(new ErrorHandler("Reset password token is invalid or has been expired", 404))

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Confirm password does not match password", 400))
    }
    user.password = req.body.password
    user.resetPasswordToken = undefined//once the password is changed the token must expire
    user.resetPasswordExpire = undefined
    await user.save()

    sendToken(user, 200, res)// this will log in the user after password reset
})

// Get user details (user)
exports.getUserDetails = catchAsyncErors(async (req, res, next) => {

    const user = await User.findById(req.user.id)   //after auth. the user is saved in req
    // this route will be accessible to a person who is already loged in to check his own details

    res.status(200).json({
        success: true,
        user
    })
})

// update user password (user)
exports.updatePassword = catchAsyncErors(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password")

    bcrypt.compare(req.body.oldPassword, user.password, (err, isMatched) => {
        if (!isMatched) {
            return next(new ErrorHandler("Old password is incorrect", 400))
        }
    })
    if (req.body.newPassword !== req.body.confirmPassword)
        return next(new ErrorHandler("New Password do not match Confirm Password", 400))

    user.password = req.body.newPassword
    await user.save()

    sendToken(user, 200, res)
})

// Update user Profile(user)
exports.updateProfile = catchAsyncErors(async (req, res, next) => {

    const newData = {
        name: req.body.name,
        email: req.body.email,
    }

    if(req.body.avatar !== ""){
        const user = await User.findById(req.user._id)
        const imageId = user.avatar.public_id

        await cloudinary.v2.uploader.destroy(imageId)

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: "avatars",
            width: 150,
            crop: "scale"
        })

        newData.avatar={
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    }

    const user = await User.findByIdAndUpdate(req.user._id, newData)

    res.status(200).json({
        success: true,
        message: "Updated Successfully!!!"
    })
})

// get all users(ADMIN)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find({})
    const userCount = await User.countDocuments()

    if (!users) {
        return next(new ErrorHandler("No Users registered yet!", 404))
    }

    res.status(200).json({
        success: true,
        userCount,
        users
    })
})

// get single user(ADMIN)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`No user exists with id: ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        user
    })
})

// Update user Role(ADMIN)
exports.updateUserRole = catchAsyncErors(async (req, res, next) => {

    const newData = {
        name: req.body.name,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newData)

    if (!user) {
        return next(new ErrorHandler(`No user exists with id: ${req.params.id}`, 404))
    }

    res.status(200).json({
        success: true,
        message: "Updated Successfully!!!"
    })
})

// Delete A User(ADMIN)
exports.deleteUser = catchAsyncErors(async (req, res, next) => {
    const user = await User.findByIdAndDelete(req.params.id)

    if (!user) {
        return next(new ErrorHandler(`No user exists with id: ${req.params.id}`, 404))
    }

    const imageId = user.avatar.public_id
    await cloudinary.v2.uploader.destroy(imageId)

    res.status(200).json({
        success: true,
        message: "User Deleted Successfully!"
    })
})
