const express = require("express")
const { processPayment, sendStripeApiKey } = require("../controllers/paymentController")
const { isAuthenticated } = require("../middleware/auth")


const router = express.Router()

router.post("/payment/process", isAuthenticated, processPayment)
router.get("/stripeApiKey", isAuthenticated, sendStripeApiKey)


module.exports = router