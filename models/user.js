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
		// TO DO: You’d normally hash the password before saving (via bcrypt or similar).
		password: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true } // adds createdAt and updatedAt automatically.
);

module.exports = mongoose.model('User', userSchema);
