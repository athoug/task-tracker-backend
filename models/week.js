const mongoose = require('mongoose');

const weekSchema = new mongoose.Schema(
	{
		/* 
			Added a user field so each week belongs to a specific user.
			This is important if you want to ensure that user X cannot 
			see or modify user Y’s weeks.
		*/
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
