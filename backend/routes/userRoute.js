const express = require("express")
const {
    registerUser,
    loginUser,
    logout,
    getAllUsers,
    forgetPassword,
    resetPassword,
    getUserDetails,
    updatePassword,
    updateProfile,
    getSingleUser,
    deleteUser,
    updateUserRole
} = require("../controllers/userController")
const { isAuthenticated, authorizeRoles } = require("../middleware/auth")

const router = express.Router()


router.route("/register").post(registerUser)

router.post("/login", loginUser)

router.get("/logout", logout)

router.post("/password/forgot", forgetPassword)
router.put("/password/reset/:token", resetPassword)

router.get("/me", isAuthenticated, getUserDetails)  //a user already loggedIn can only get his details

router.put("/password/update", isAuthenticated, updatePassword)

router.put("/me/update", isAuthenticated, updateProfile)

router.get("/admin/users", isAuthenticated, authorizeRoles("admin"), getAllUsers)
router.get("/admin/user/:id", isAuthenticated, authorizeRoles("admin"), getSingleUser)
router.put("/admin/user/:id", isAuthenticated, authorizeRoles("admin"), updateUserRole)
router.delete("/admin/user/:id", isAuthenticated, authorizeRoles("admin"), deleteUser)

module.exports = router