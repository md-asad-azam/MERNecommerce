const express = require("express")
const { newOrder, getSingleOrder, getOrders, getAllOrders, updateOrder, deleteOrder } = require("../controllers/orderController")
const { isAuthenticated, authorizeRoles } = require("../middleware/auth")

const router = express.Router()


router.post("/order/new", isAuthenticated, newOrder)
router.get("/order/:id", isAuthenticated, getSingleOrder)
router.get("/orders/me", isAuthenticated, getOrders)

router.get("/admin/orders", isAuthenticated, authorizeRoles("admin"), getAllOrders)
router.put("/admin/order/:id", isAuthenticated, authorizeRoles("admin"), updateOrder)
router.delete("/admin/order/:id", isAuthenticated, authorizeRoles("admin"), deleteOrder)


module.exports = router