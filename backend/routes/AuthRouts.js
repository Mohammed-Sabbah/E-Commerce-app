const express = require("express");
const passport = require('passport');
const { createToken } = require('../utils/JWTs');
const {
    signup,
    login,
    forgetPassword,
    verifyResetCode,
    resetPassword
} = require("../controllers/AuthController");
const {
    signupValidator,
    loginValidator,
    forgetPasswordValidator,
    verifyResetCodeValidator,
    resetPasswordValidator
} = require("../utils/validators/authValidators");
const { parseDuration } = require("../utils/parseDuration");

const router = express.Router();

// OAuth Handlers
const oAuthCallbackHandler = (req, res) => {
    let token = createToken(req.user.id);
        let maxAge;
    
        try {
            maxAge = parseDuration(process.env.JWT_EXPIRES_IN);
        } catch (error) {
            console.error('Error parsing JWT_EXPIRES_IN:', error.message);
            maxAge = 7 * 24 * 60 * 60 * 1000; // fallback 7 days
        }
    
        let options = {
            httpOnly: true,
            sameSite: 'strict',
            maxAge
        };
    
    
        if (process.env.NODE_ENV === "production")
            options.secure = true;
    
        res.cookie("token", token, options);
    
        res.status(200).json({
            status: "success",
            user:req.user,
            token
        });
};

// Google OAuth
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get("/google/callback",
    passport.authenticate('google', { session: false, failureRedirect: '/' }),
    oAuthCallbackHandler
);

// Facebook OAuth
router.get("/facebook", passport.authenticate('facebook', { scope: ['email'] }));
router.get("/facebook/callback",
    passport.authenticate('facebook', { session: false, failureRedirect: '/' }),
    oAuthCallbackHandler
);

// Auth Routes
router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);

// --- Password Reset Routes ---
router.post("/forgetPassword", forgetPasswordValidator, forgetPassword);
router.post("/verifyResetCode", verifyResetCodeValidator, verifyResetCode);
router.patch("/resetPassword", resetPasswordValidator, resetPassword);

module.exports = router;