const { findByIdAndDelete } = require("../../models/user");
const Week = require("../../models/week");
const Task = require("../../models/task");

// creating a new week for the user
exports.createWeek = async (req, res) => {
	try {
		// userId might come from the authenticated user token
		// or from req.body (not recommended). Usually you'd do something like:
		// const userId = req.user._id;
		// but for simplicity, let's assume it comes from req.body:
		// user is set by authMiddleware, e.g. { _id: "64f512..." }
		const userId = req.user._id;
		const { weekNumber, year, startDate, endDate } = req.body;

		const newWeek = new Week({
			user: userId,
			weekNumber,
			year,
			startDate,
			endDate,
		});

		// save the week to the database
		const savedWeek = await newWeek.save();

		// return the saved week
		res.status(201).json(savedWeek);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to create week" });
	}
};

// get all weeks for specific user
exports.getAllWeeksForUser = async (req, res) => {
	try {
		const userId = req.user._id;

		// Find all weeks that belong to this user
		const weeks = await Week.find({ user: userId })
			.populate("user")
			.sort({ startDate: 1 });

		res.status(200).json(weeks);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to fetch weeks" });
	}
};

// get a single week by id
exports.getWeekById = async (req, res) => {
	try {
		const { id } = req.params;
		const week = await Week.findById(id);

		if (!week) {
			return res.status(404).json({ error: "Week not found" });
		}

		res.status(200).json(week);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to fetch week" });
	}
};

// Update a week
exports.updateWeek = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		const updateWeek = await Week.findByIdAndUpdate(id, updates, { new: true });
		if (!updateWeek) {
			return res.status(404).json({ error: "Week not found" });
		}

		res.status(200).json(updateWeek);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to update week" });
	}
};

// delete a week
exports.deleteWeek = async (req, res) => {
	try {
		const { id } = req.params;

		const deletedWeek = await Week.findByIdAndDelete(id);
		if (!deletedWeek) {
			return res.status(404).json({ error: "Week not found" });
		}

		res.status(200).json({ message: "Week deleted successfully" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to delete week" });
	}
};

// create the method to Generate a weekly review
exports.getWeeklyReview = async (req, res) => {
	try {
		const { id } = req.params;
		const week = await Week.findById(id);

		if (!week) {
			return res.status(404).json({ error: "Week not found" });
		}
		// Find all tasks for this week
		const tasks = await Task.find({ week: id });

		if (!tasks) {
			return res.status(404).json({ error: "No tasks found" });
		}

		// Example review data
		const reviewData = {
			week,
			totalTasks: tasks.length,
			tasksCompleted: tasks.filter((task) =>
				task.logs.some((log) => log.status === "complete")
			).length,
			// Additional stats as needed
		};

		res.status(200).json(reviewData);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: "Failed to generate weekly review" });
	}
};

// Get the most recent active week for the user
exports.getCurrentWeek = async (req, res) => {
	try {
		const userId = req.user._id;

		// Get the latest "active" week
		let currentWeek = await Week.findOne({
			user: userId,
			status: "active",
		}).sort({
			startDate: -1,
		});

		const today = new Date();

		if (currentWeek) {
			const endDate = new Date(currentWeek.endDate);

			if (today >= endDate) {
				// Archive the finished week
				currentWeek.status = "archived";
				await currentWeek.save();

				// Optionally: return archived flag
				return res.status(200).json({
					message: "Week has been archived",
					archived: true,
					archivedWeek: currentWeek,
					currentWeek: null,
				});
			} else {
				return res.status(200).json({
					currentWeek,
					archived: false,
				});
			}
		} else {
			// No active week
			return res.status(200).json({
				currentWeek: null,
				archived: false,
			});
		}
	} catch (error) {
		console.error("Error getting current week:", error);
		res.status(500).json({ error: "Failed to get current week" });
	}
};

exports.archiveFinishedWeek = async (req, res) => {
	try {
		const userId = req.user._id;

		const currentWeek = await Week.findOne({
			user: userId,
			status: "active",
		}).sort({ startDate: -1 });

		if (!currentWeek) {
			return res
				.status(404)
				.json({ message: "No active week found", archived: false });
		}

		const today = new Date();
		const endDate = new Date(currentWeek.endDate);

		if (today >= endDate) {
			// Archive the week
			currentWeek.status = "archived";
			await currentWeek.save();

			return res.status(200).json({
				message: "Week archived successfully",
				archived: true,
				archivedWeek: currentWeek,
			});
		} else {
			return res.status(200).json({
				message: "Week still active",
				archived: false,
			});
		}
	} catch (error) {
		console.error("Error archiving week:", error);
		res.status(500).json({ error: "Failed to archive week", archived: false });
	}
};
