const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
			trim: true,
			match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
		},
		avatar: {
			type: String,
			default: null,
		},
		password: {
			type: String,
			required: true,
			validate: {
				validator: function (v) {
					return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(v);
				},
				message:
					"Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.",
			},
		},
		emailVerified: {
			type: Boolean,
			default: false,
		},
		emailVerificationToken: { type: String },
		passwordResetToken: { type: String },
		passwordResetExpires: { type: Date },
	},
	{ timestamps: true } // adds createdAt and updatedAt automatically.
);

module.exports = mongoose.model("User", userSchema);
