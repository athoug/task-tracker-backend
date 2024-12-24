const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	desc: {
		type: String,
		required: true,
	},
});
