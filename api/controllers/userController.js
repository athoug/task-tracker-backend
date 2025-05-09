const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../../models/user");
const { sendEmail } = require("../../utils/email");

exports.register = async (req, res) => {
	console.log("Register route started");
	try {
		// extract the data from the request
		const { name, email, password } = req.body;

		const caseClearEmail = email?.toLowerCase();
		// 1a. check if the user exists
		const existingUser = await User.findOne({ email: caseClearEmail });
		if (existingUser) {
			return res
				.status(400)
				.json({ error: "User already exists", field: "email" });
		}

		// Password strength check (optional if already validated by schema)
		const strongPasswordRegex =
			/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
		if (!strongPasswordRegex.test(password)) {
			return res.status(400).json({
				error:
					"Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
				field: "password",
			});
		}

		// 1b. Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		console.log("About to create user...");
		// 1c. create and save user
		const newUser = new User({
			name,
			email: caseClearEmail,
			password: hashedPassword,
			emailVerified: false,
		});

		// 1d. Generate an email verification token
		const emailToken = crypto.randomBytes(20).toString("hex");
		newUser.emailVerificationToken = emailToken;

		// 1e. Save user
		const savedUser = await newUser.save();

		// 1f. Send verification email
		const verifyLink = `${process.env.CLIENT_URL}/api/users/verify-email?token=${emailToken}`;
		// Example: http://localhost:3000/verify-email?token=xxx
		// You might have a dedicated endpoint on your frontend to handle email verification

		// TODO: make this work with real mailtrap later
		await sendEmail({
			to: savedUser.email,
			subject: "Please Verify Your Email",
			html: `
		    <h3>Welcome, ${savedUser.name}!</h3>
		    <p>Click the link below to verify your email:</p>
		    <a href="${verifyLink}">Verify Email</a>
		  `,
		});

		console.log("User created, returning response");

		// Generate JWT
		const token = jwt.sign(
			{ userId: savedUser._id },
			process.env.JWT_SECRET, // e.g., "mysecret" (store in .env)
			{ expiresIn: "1d" } // token valid for 1 day
		);
		// respond to request
		res.status(201).json({
			message: `hey ${name} you have register successfully. Please check your email to verify your account.`,
			user: {
				id: savedUser._id,
				name: savedUser.name,
				email: savedUser.email,
				profileIcon: savedUser.profileIcon,
			},
			token,
		});
	} catch (error) {
		console.error(error);
		// Handle Mongoose validation errors
		if (error.name === "ValidationError") {
			const field = Object.keys(error.errors)[0]; // Get first field that failed
			const message = error.errors[field].message;

			return res.status(400).json({
				error: message,
				field,
			});
		}

		// Handle duplicate email error (E11000 is duplicate key)
		if (error.code === 11000 && error.keyPattern?.email) {
			return res.status(400).json({
				error: "Email already exists",
				field: "email",
			});
		}

		res.status(500).json({ error: "Failed to register user" });
	}
};

exports.login = async (req, res) => {
	try {
		// extract the values from the body
		const { email, password } = req.body;
		const caseClearEmail = email?.toLowerCase();

		// Check for missing fields
		if (!email || !password) {
			const missingField = !email ? "email" : "password";
			return res.status(400).json({
				error: `${
					missingField.charAt(0).toUpperCase() + missingField.slice(1)
				} is required`,
				field: missingField,
			});
		}

		// find the user by email
		const user = await User.findOne({ email: caseClearEmail });
		if (!user) {
			return res.status(400).json({
				error: "Invalid email or password",
				field: "email",
			});
		}

		// compare the password
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({
				error: "Invalid email or password",
				field: "password",
			});
		}

		// OPTIONAL: If you want to enforce email verification before login:
		// if (!user.emailVerified) {
		//   return res.status(403).json({ error: 'Email not verified. Please verify your email first.' });
		// }

		// Generate JWT
		const token = jwt.sign(
			{ userId: user._id },
			process.env.JWT_SECRET, // e.g., "mysecret" (store in .env)
			{ expiresIn: "1d" } // token valid for 1 day
		);
		res.status(202).json({
			message: "Login successful",
			token,
			user: {
				_id: user._id,
				name: user.name.split(" ")[0],
				email: user.email,
				emailVerified: user.emailVerified,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to login" });
	}
};

exports.resendVerificationEmail = async (req, res) => {
	try {
		const { email } = req.body;

		const caseClearEmail = email?.toLowerCase();
		const user = await User.findOne({ email: caseClearEmail });
		if (!user) {
			return res.status(400).json({ error: "No user found with that email" });
		}

		if (user.emailVerified) {
			return res.status(400).json({ error: "Email already verified" });
		}

		// Generate a new verification token
		const emailToken = crypto.randomBytes(20).toString("hex");
		user.emailVerificationToken = emailToken;
		await user.save();

		const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${emailToken}`;
		await sendEmail({
			to: user.email,
			subject: "Verify Your Email",
			html: `
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verifyLink}">Verify Email</a>
      `,
		});

		return res.status(200).json({
			message: "Verification email resent. Please check your inbox.",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Error resending verification email" });
	}
};

exports.verifyEmail = async (req, res) => {
	try {
		const { token } = req.query; // e.g. /verify-email?token=xyz
		if (!token) {
			return res.status(400).json({ error: "No token provided" });
		}

		// find user by token
		const user = await User.findOne({ emailVerificationToken: token });
		if (!user) {
			return res.status(400).json({ error: "invalid or expired token" });
		}

		// mark as verified
		user.emailVerified = true;
		user.emailVerificationToken = undefined; // remove the token
		await user.save();

		return res.status(200).json({
			message: "Email verified successfully. You can now log in.",
		});
	} catch (error) {}
};

exports.requestPasswordReset = async (req, res) => {
	try {
		const { email } = req.body;
		const caseClearEmail = email?.toLowerCase();

		// Check for missing fields
		if (!email) {
			const missingField = "email";
			return res.status(400).json({
				error: `${
					missingField.charAt(0).toUpperCase() + missingField.slice(1)
				} is required`,
				field: missingField,
			});
		}

		const user = await User.findOne({ email: caseClearEmail });
		if (!user) {
			return res.status(400).json({
				error: "Invalid email",
				field: "email",
			});
		}

		// Generate reset token + expiration (1 hour from now)
		const resetToken = crypto.randomBytes(20).toString("hex");
		user.passwordResetToken = resetToken;
		user.passwordResetExpires = Date.now() + 3600000; // 1 hour in ms
		await user.save();

		// Send email with reset link
		// const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
		const resetLink = `tasko://reset-password?token=${resetToken}`;
		await sendEmail({
			to: user.email,
			subject: "Password Reset Request",
			html: `
				 <p>You requested a password reset. Click the link below to set a new password:</p>
				 <a href="${resetLink}">Reset Password</a>
				 <br>
				 <p>If you did not request a password reset, please ignore this email.</p>
			 `,
		});

		return res.status(200).json({
			message: "Password reset email sent. Please check your inbox.",
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to request password reset" });
	}
};

exports.resetPassword = async (req, res) => {
	try {
		const { token, newPassword } = req.body;

		if (!token) {
			return res.status(400).json({ error: "Missing token" });
		}

		// Check for missing fields
		if (!newPassword) {
			const missingField = "password";
			return res.status(400).json({
				error: `${
					missingField.charAt(0).toUpperCase() + missingField.slice(1)
				} is required`,
				field: missingField,
			});
		}

		// find user by reset token
		const user = await User.findOne({
			passwordResetToken: token,
			passwordResetExpires: { $gt: Date.now() }, // check token hasn't expired
		});

		if (!user) {
			return res.status(400).json({
				error: "Invalid or expired reset token",
				field: "email",
			});
		}

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		user.password = hashedPassword;
		user.passwordResetToken = undefined;
		user.passwordResetExpires = undefined;
		await user.save();

		return res
			.status(200)
			.json({ message: "Password has been reset successfully." });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to reset password" });
	}
};

exports.uploadProfileImage = async (req, res) => {
	try {
		const userId = req.user._id;

		// Multer places the file info in req.file
		if (!req.file) {
			return res
				.status(400)
				.json({ error: "No file uploaded or invalid file type" });
		}

		// For a local approach, the file path might be something like "uploads/avatar-123.png"
		const profileImagePath = req.file.path;

		// find the user in the database and update
		const user = await User.findByIdAndUpdate(
			userId,
			{ avatar: profileImagePath },
			{ new: true }
		);

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		// Respond with user info (excluding sensitive data)
		return res.status(200).json({
			message: "Profile image uploaded successfully",
			user: {
				name: user.name,
				profileImage: user.profileImage,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to upload profile image" });
	}
};

exports.updateEmail = async (req, res) => {
	try {
		const userId = req.user._id;
		const { newEmail } = req.body;

		if (!newEmail)
			return res.status(400).json({ error: "New email is required" });

		const userExists = await User.findOne({ email: newEmail.toLowerCase() });
		if (userExists)
			return res.status(400).json({ error: "Email already in use" });

		const updatedUser = await User.findByIdAndUpdate(
			userId,
			{ email: newEmail.toLowerCase(), emailVerified: false },
			{ new: true }
		);

		res.status(200).json({ message: "Email updated", user: updatedUser });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to update email" });
	}
};

exports.updatePassword = async (req, res) => {
	try {
		const userId = req.user._id;
		const { currentPassword, newPassword } = req.body;

		const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const isMatch = await bcrypt.compare(currentPassword, user.password);
		if (!isMatch)
			return res.status(400).json({ error: "Incorrect current password" });

		const hashedPassword = await bcrypt.hash(newPassword, 10);
		user.password = hashedPassword;
		await user.save();

		res.status(200).json({ message: "Password updated successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to update password" });
	}
};

exports.deleteAccount = async (req, res) => {
	try {
		const userId = req.user._id;
		await User.findByIdAndDelete(userId);
		res.status(200).json({ message: "Account deleted successfully" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Failed to delete account" });
	}
};
