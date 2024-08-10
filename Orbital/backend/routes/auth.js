const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
    signin,
    signup,
    signout,
    isSignedIn,
    forgetPassword,
    resetPassword,
} = require("../controllers/authController");

router.post(
    "/signup",
    [
        check("name", "Name is required.").isLength({ min: 1 }),
        check("email", "Email is required.").isEmail(),
        // By default, a strong password is defined as having at least 8 characters, with at least 1 uppercase, 1 lowercase, 1 number and 1 symbol.
        // We are not enforcing the symbol requirement here.
        check(
            "password",
            "Password does not meet the requirements. Please try again."
        ).isStrongPassword({ minSymbols: 0 }),
    ],
    signup
);

router.post(
    "/signin",
    [
        check("email", "Email is required.").isEmail(),
        check("password", "Password is required.").isLength({ min: 1 }),
    ],
    signin
);

router.post(
    "/forgetpassword",
    [check("email", "Email is required.").isEmail()],
    forgetPassword
);

// Password requirements are handled on the frontend
router.post(
    "/resetpassword/:token",
    [
        check(
            "password",
            "Password does not meet the requirements. Please try again."
        ).isStrongPassword({ minSymbols: 0 }),
    ],
    resetPassword
);

router.get("/signout", signout);

module.exports = router;
