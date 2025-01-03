const Week = require('../../models/week');
// TODO - import the task model

// creating a new week for the user
exports.createWeek = async (req, res) => {
	try {
		// userId might come from the authenticated user token
		// or from req.body (not recommended). Usually you'd do something like:
		// const userId = req.user._id;
		// but for simplicity, let's assume it comes from req.body:
		const { user, weekNumber, year, startDate, endDate } = req.body;

		const newWeek = new Week({
			user,
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
