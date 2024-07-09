var express = require("express");
const router = express.Router();
const {
    getUserById,
    getUser,
    getUserName,
    updateSubscriptions,
    profileChange,
    getColorTheme,
} = require("../controllers/userController");
const {
    isSignedIn,
    isAuthenticated,
} = require("../controllers/authController");

router.param("userId", getUserById);
router.get("/user/:userId", isSignedIn, isAuthenticated, getUser);
router.post("/getUserName", getUserName);
router.post("/updateSubscriptions", updateSubscriptions);
router.post("/profilechange", profileChange);
router.post("/getcolortheme", getColorTheme);

module.exports = router;
