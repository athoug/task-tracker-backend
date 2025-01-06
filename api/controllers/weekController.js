const { findByIdAndDelete } = require('../../models/user');
const Week = require('../../models/week');
const Task = require('../../models/task');

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
		res.status(500).json({ error: 'Failed to create week' });
	}
};

// get all weeks for specific user
exports.getAllWeeksForUser = async (req, res) => {
	try {
		const userId = req.user._id;

		// Find all weeks that belong to this user
		const weeks = await Week.find({ user: userId })
			.populate('user')
			.sort({ startDate: 1 });

		res.status(200).json(weeks);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to fetch weeks' });
	}
};

// get a single week by id
exports.getWeekById = async (req, res) => {
	try {
		const { id } = req.params;
		const week = await Week.findById(id);

		if (!week) {
			return res.status(404).json({ error: 'Week not found' });
		}

		res.status(200).json(week);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to fetch week' });
	}
};

// Update a week
exports.updateWeek = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		const updateWeek = await Week.findByIdAndUpdate(id, updates, { new: true });
		if (!updateWeek) {
			return res.status(404).json({ error: 'Week not found' });
		}

		res.status(200).json(updateWeek);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to update week' });
	}
};

// delete a week
exports.deleteWeek = async (req, res) => {
	try {
		const { id } = req.params;

		const deletedWeek = await Week.findByIdAndDelete(id);
		if (!deletedWeek) {
			return res.status(404).json({ error: 'Week not found' });
		}

		res.status(200).json({ message: 'Week deleted successfully' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to delete week' });
	}
};

// create the method to Generate a weekly review
exports.getWeeklyReview = async (req, res) => {
	try {
		const { id } = req.params;
		const week = await Week.findById(id);

		if (!week) {
			return res.status(404).json({ error: 'Week not found' });
		}
		// Find all tasks for this week
		const tasks = await Task.find({ week: id });

		if (!tasks) {
			return res.status(404).json({ error: 'No tasks found' });
		}

		// Example review data
		const reviewData = {
			week,
			totalTasks: tasks.length,
			tasksCompleted: tasks.filter((task) =>
				task.logs.some((log) => log.status === 'complete')
			).length,
			// Additional stats as needed
		};

		res.status(200).json(reviewData);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to generate weekly review' });
	}
};
