const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter product's name"],
        trim: true
    },
    description: {
        type: String,
        required: [true, "Please enter product's description"]
    },
    price: {
        type: Number,
        required: [true, "Please enter product's price"],
        maxLength: [8, "Price cannot exceed 8 digits"]
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please enter product's category"]
    },
    Stock: {
        type: Number,
        required: [true, "Please enter product's Stock"],
        maxLength: [4, "Stock cannot exceed 4 characters"],
        default: 1
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            userId: {
                type: mongoose.Schema.ObjectId,
                ref: "User",
                required: true
            },
            userProfileImg: {
                type: String,
                required: true
            },
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    productCreator: {
        type: mongoose.Schema.ObjectId,
        ref: "User",/* reffering to User so that we can later access it using the
        .populate("productCreator")  method  #linking one schema(product) to another(user)*/
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Product", productSchema)   // collection/model created
// now documents/rows will be added using .create(data to be added)