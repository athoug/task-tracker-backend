const mongoose = require('mongoose');

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
		},
		profileIcon: {
			type: String,
			default: '../assets/images/avatar-w.jpg',
		},
		password: {
			type: String,
			required: true,
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

module.exports = mongoose.model('User', userSchema);
