const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            default: "INDIA"
        },
        pinCode: {
            type: Number,
            required: true
        },
        phoneNo: {
            type: Number,
            required: true,
            maxlength: [14, "Phone number cannot exceed 14 characters"]
        }
    },
    orderItems: [//Array of products
        {//each orderItem reffering to their respective product via _id
            name: { 
                type: String, 
                required: true 
            },
            price: { 
                type: Number, 
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true 
            },
            image: { 
                public_id: {
                    type: String,
                    required: true
                },
                url: {
                    type: String,
                    required: true
                }
            },
            product: {
                type: mongoose.Schema.ObjectId, //we will reffer to Product via its _id
                ref: "Product", //we are reffering to Product so that we could access them from Order
                required: true
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true
    },
    paymentInfo: {
        id: { type: String, requied: true },
        status: { type: String, required: true }
    },
    paidAt: {
        type: Date,
        required: true
    },
    itemsPrice: {
        type: Number,
        default: 0,
        required: true
    },
    taxPrice: {
        type: Number,
        default: 0,
        required: true
    },
    shippingPrice: {
        type: Number,
        default: 0,
        required: true
    },
    totalPrice: {
        type: Number,
        default: 0,
        required: true
    },

    orderStatus: {
        type: String,
        requied: true,
        default: "Processing"
    },
    deliveredAt: Date,
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Orders", orderSchema)