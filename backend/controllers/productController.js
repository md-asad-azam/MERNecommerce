const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncErrors = require("../middleware/catchAsyncError")
const ApiFeatures = require("../utils/ApiFeatures")
const cloudinary = require("cloudinary")


// Create Product in DB --Admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {

    let images = []
    if (typeof req.body.images === "string") {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    const imgLinks = []
    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: "products"
        })
        imgLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imgLinks

    // if we are having multiple admins then we must know who created which product
    req.body.productCreator = req.user.id //assigning the user id of product creator
    const product = await Product.create(req.body)//create an entry in the model/collection

    res.status(200).json({
        success: true,
        product
    })
})

// get all products --ADMIN
exports.getAllAdminProducts = catchAsyncErrors(async (req, res) => {

    const products = await Product.find()

    if (!products) {
        return next(new ErrorHandler("Products Not Found", 404))
    }

    res.status(200).json({
        success: true,
        products,
    })
})

// get all products from DB
exports.getAllProducts = catchAsyncErrors(async (req, res) => {

    const resultPerPage = 8
    const productsCount = await Product.countDocuments()

    const apiFeature1 = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
    const prods = await apiFeature1.query
    let filteredProductsCount = prods.length

    const apiFeature2 = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)
    const products = await apiFeature2.query

    if (!products) {
        return next(new ErrorHandler("Products Not Found", 404))
    }

    res.status(200).json({
        success: true,
        products,
        productsCount,
        resultPerPage,
        filteredProductsCount
    })
})

// Get Product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }
    res.status(200).json({
        success: true,
        product
    })

})



// update Product in Db
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    let images = []
    if (typeof req.body.images === "string") {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    if (images !== undefined) {
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }

        const imgLinks = []
        for (let i = 0; i < images.length; i++) {
            const result = await cloudinary.v2.uploader.upload(images[i], {
                folder: "products"
            })
            imgLinks.push({
                public_id: result.public_id,
                url: result.secure_url
            })
        }
        req.body.images = imgLinks
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })

    res.status(200).json({
        success: true,
        product
    })
})


// Delete product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product) {
        return next(new ErrorHandler("Product Not Found", 404))
    }

    // deleting images drom cloudinary
    for (let i = 0; i < product.images.length; i++) {
        await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    await product.remove()

    res.status(200).json({
        success: true,
        message: "Product has been deleted successfully!"
    })
})


// Create/Update Review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body

    const review = {
        userId: req.user._id,
        userProfileImg: req.user.avatar.url,
        name: req.user.name,
        rating: rating,
        comment
    }

    const product = await Product.findById(productId)
    //reviews is an array as defined in productModel
    const isReviewed = product.reviews.find(
        // if reviewed then userId must be present in the reviews
        (rev) => rev.userId.toString() === req.user._id.toString()
    )
    if (isReviewed) {
        product.reviews.forEach(rev => {
            // if already reviewed the overwrite the review of same user
            if (rev.userId.toString() === req.user._id.toString()) {
                rev.rating = rating
                rev.comment = comment
                rev.userProfileImg = req.user.avatar.url
            }
        })
    }
    else {
        // if not given any review then just add new review in reviews array acc. to model
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }
    let avg = 0
    product.reviews.forEach(rev => avg += rev.rating)
    product.ratings = avg / product.reviews.length

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        product
    })
})

// Get all reviews of a single product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)

    if (!product)
        return next(new ErrorHandler("Product not found", 404))

    res.status(200).json({
        success: true,
        numOfReviews: product.numOfReviews,
        reviews: product.reviews
    })
})

// Delete a review
exports.deleteProductReviews = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.query.productId)

    if (!product)
        return next(new ErrorHandler("Product not found", 404))

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id.toString())

    //new rating after removing the desired review
    let avg = 0
    reviews.forEach(rev => avg += rev.rating)

    let ratings = 0
    if (reviews.length === 0) {
        ratings = 0
    } else {
        ratings = avg / reviews.length
    }

    const numOfReviews = reviews.length

    //updating the changes
    await Product.findByIdAndUpdate(req.query.productId, {
        reviews,
        ratings,
        numOfReviews
    })

    res.status(200).json({
        success: true,
    })
})