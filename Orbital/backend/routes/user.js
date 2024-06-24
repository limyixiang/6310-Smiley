var express = require("express");
const router = express.Router();
const {
    getUserById,
    getUser,
    updateSubscriptions,
} = require("../controllers/userController");
const {
    isSignedIn,
    isAuthenticated,
} = require("../controllers/authController");

router.param("userId", getUserById);
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.post("/updateSubscriptions", updateSubscriptions);

module.exports = router;
