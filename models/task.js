const mongoose = require("mongoose");

const allowedCategories = [
	"health",
	"financial",
	"spiritual",
	"relationships",
	"career",
	"hobbies",
];

const logSchema = new mongoose.Schema(
	{
		date: {
			type: Date,
			required: true,
		},
		status: {
			type: String,
			enum: ["complete", "incomplete"],
			required: true,
		},
		updatedAt: {
			type: Date,
			default: Date.now,
		},
	},
	{ _id: false }
);

const taskSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		week: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Week",
			required: true,
		},
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			default: "",
		},
		category: {
			type: String,
			enum: allowedCategories,
			required: true,
		},
		timesPerWeek: {
			type: Number,
			required: true,
		},
		startDate: {
			type: Date,
			required: true,
		},
		logs: {
			type: [logSchema],
			default: [],
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);
