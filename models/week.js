const mongoose = require('mongoose');

const weekSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		weekNumber: {
			type: Number,
			required: true,
		},
		year: {
			type: Number,
			required: true,
		},
		StartDate: {
			type: Date,
			required: true,
		},
		EndDate: {
			type: Date,
			required: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Week', weekSchema);
