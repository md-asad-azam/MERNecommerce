const express = require("express")
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductDetails,
    createProductReview,
    getProductReviews,
    deleteProductReviews,
    getAllAdminProducts
} = require("../controllers/productController")
const { isAuthenticated, authorizeRoles } = require("../middleware/auth")

const router = express.Router()

router.get("/products", getAllProducts)
router.get("/product/:id", getProductDetails)
router.get("/admin/products", isAuthenticated, authorizeRoles("admin"), getAllAdminProducts)
router.post("/admin/product/new", isAuthenticated, authorizeRoles("admin"), createProduct)
router.put("/admin/product/:id", isAuthenticated, authorizeRoles("admin"), updateProduct)
router.delete("/admin/product/:id", isAuthenticated, authorizeRoles("admin"), deleteProduct)
router.put("/review", isAuthenticated, createProductReview)
router.get("/reviews", getProductReviews)
router.delete("/reviews", isAuthenticated, deleteProductReviews)

module.exports = router