const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middleware/upload");
const { authMiddleware } = require("../middleware/auth");

// register a user
router.post("/register", userController.register);

// login a user
router.post("/login", userController.login);

// resend verification
router.post("/resend-verification", userController.resendVerificationEmail);

// verify email
router.get("/verify-email", userController.verifyEmail);

// request password reset
router.post("/password-reset", userController.requestPasswordReset);

// reset password
router.post("/reset-password", userController.resetPassword);

// upload profile image
router.patch(
	"/profile-image",
	authMiddleware,
	upload.single("profileImage"), // Multer middleware
	userController.uploadProfileImage
);

// request update email
router.patch("/update-email", authMiddleware, userController.updateEmail);

// request update password
router.patch("/update-password", authMiddleware, userController.updatePassword);

// request delete account
router.delete("/delete-account", authMiddleware, userController.deleteAccount);

module.exports = router;
