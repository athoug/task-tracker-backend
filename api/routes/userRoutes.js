const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/upload');
const { authMiddleware } = require('../middleware/auth');

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

// upload profile image
router.patch(
	'/profile-image',
	authMiddleware,
	upload.single('profileImage'), // Multer middleware
	userController.uploadProfileImage
);

module.exports = router;
