const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const crypto = require("crypto") //inbuilt JS package for cryptography features

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        minlength: [3, 'Must be greater than 3 characters'],
        maxlength: [25, 'Too long for a name!']
    },
    email: {
        type: String,
        required: [true, 'Please enter your Email'],
        unique: true,
        validate: [validator.isEmail, "Please Enter a valid Email"]
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Password"],
        minlength: [6, "Password must be longer than 5 characters"],
        select: false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date
})

// encrypting the password using bcrypt
userSchema.pre("save", async function (next) {//not using arrow func. because we cant use "this" inside it
    if (!this.isModified("password")) {
        next(); //if the passwod is not modified then it is obviously hashed, & if it is
        // hashed then we do not need to hash it again
    }
    this.password = await bcrypt.hash(this.password, 10)//hashing the password
})


// creating JWT
userSchema.methods.getJWT = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_CODE, {
        expiresIn: process.env.JWT_EXPIRE + "d" //"d" represents days
    })
}

// Generating password reset token
userSchema.methods.getResetPasswordToken = function () {
    // Generating token
    const resetToken = crypto.randomBytes(20).toString("hex")

    // hashing and adding to userSchema (resetPasswordToken)
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;//10 min

    return resetToken
}

module.exports = mongoose.model("User", userSchema)