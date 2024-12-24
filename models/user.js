const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
	createdAt: { type: Date, default: Date.now() },
});

module.exports = mongoose.model('User', userSchema);
