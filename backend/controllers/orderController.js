const Order = require("../models/orderModel")
const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const catchAsyncError = require("../middleware/catchAsyncError")


exports.newOrder = catchAsyncError(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body

    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })

    res.status(200).json({
        success: true,
        order
    })
})


// Get Single Order
exports.getSingleOrder = catchAsyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id).populate(
        "user",     //gives the user's id stored in order collection(ref:"User")
        "name email"    //all the fields that we want to populate from our User collection
    )

    if (!order)
        return next(new ErrorHandler("No order found with this id", 404))

    res.status(200).json({
        success: true,
        order
    })
})

// get logged in user orders
exports.getOrders = catchAsyncError(async (req, res, next) => {

    const orders = await Order.find({ user: req.user._id })

    if (!orders)
        return next(new ErrorHandler("No order found with this id", 404))

    res.status(200).json({
        success: true,
        orders
    })
})

// Get all Orders --ADMIN
exports.getAllOrders = catchAsyncError(async (req, res, next) => {
    const orders = await Order.find({})

    if (!orders)
        return next(new ErrorHandler("No orders to display", 404))

    let totalAmount = 0
    orders.forEach((order) => { totalAmount += order.totalPrice })

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    })
})

// Update Order Status --ADMIN
exports.updateOrder = catchAsyncError(async (req, res, next) => {

    const order = await Order.findById(req.params.id)
    if (!order)
        return next(new ErrorHandler("No order found with this id", 404))
    if (order.orderStatus == "Delivered")
        return next(new ErrorHandler("You have already delivered this order", 400))

    if (req.body.status === "Shipped") {
        order.orderItems.forEach(async order => {
            await updateStock(order.product, order.quantity)
        })
    }

    order.orderStatus = req.body.status
    if (req.body.status == "Delivered")
        order.deliveredAt = Date.now()

    await order.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        order
    })
})
async function updateStock(id, quantity) {
    const product = await Product.findById(id)
    product.Stock -= quantity;
    await product.save({ validateBeforeSave: false })
}


// Delete order --ADMIN
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await Order.findByIdAndDelete(req.params.id)

    if (!order)
        return next(new ErrorHandler("No order found with this id", 404))

    res.status(200).json({
        success: true,
        message: "Order deleted uccessfully"
    })
})