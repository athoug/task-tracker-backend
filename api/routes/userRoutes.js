const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// register a user
router.post('/register', userController.register);

// login a user
router.post('/login', userController.login);

// resend verification
router.post('/resend-verification', userController.resendVerificationEmail);

// verify email
router.get('/verify-email', userController.verifyEmail);

// request password reset
router.post('/password-reset', userController.requestPasswordReset);

// reset password
router.post('/reset-password', userController.resetPassword);

module.exports = router;
