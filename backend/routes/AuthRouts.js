const express = require("express");
const passport = require('passport');
const { createToken } = require('../utils/JWTs');
const {
    signup,
    login,
    logout,
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
const router = express.Router();

// OAuth Handlers
const oAuthCallbackHandler = (req, res) => {
    const token = createToken(req.user.id);
    const frontendUrl = process.env.FRONTEND_URL;
    res.redirect(`${frontendUrl}/api/v1/auth/google-callback?token=${token}`);
};

// Google OAuth
router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get("/google/callback",
    passport.authenticate('google', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    oAuthCallbackHandler
);

// Facebook OAuth
router.get("/facebook", passport.authenticate('facebook', { scope: ['email'] }));
router.get("/facebook/callback",
    passport.authenticate('facebook', { session: false, failureRedirect: `${process.env.FRONTEND_URL}/login?error=oauth_failed` }),
    oAuthCallbackHandler
);

// Auth Routes
router.post("/signup", signupValidator, signup);
router.post("/login", loginValidator, login);

// --- Password Reset Routes ---
router.post("/forgetPassword", forgetPasswordValidator, forgetPassword);
router.post("/verifyResetCode", verifyResetCodeValidator, verifyResetCode);
router.patch("/resetPassword", resetPasswordValidator, resetPassword);


router.post("/logout", logout);

module.exports = router;