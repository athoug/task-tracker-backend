const mongoose = require("mongoose");

const weekSchema = new mongoose.Schema(
	{
		/* 
			Added a user field so each week belongs to a specific user.
			This is important if you want to ensure that user X cannot 
			see or modify user Y’s weeks.
		*/
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
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
		startDate: {
			type: Date,
			required: true,
		},
		endDate: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
			enum: ["active", "archived"],
			default: "active",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Week", weekSchema);
