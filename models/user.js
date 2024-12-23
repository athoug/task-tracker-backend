const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	name: {
		typeof: String,
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
});

module.exports = mongoose.model('User', userSchema);
