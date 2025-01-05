const Task = require('../../models/task');

exports.createTask = async (req, res) => {
	try {
		const { user, week, name, description, category, timesPerWeek, startDate } =
			req.body;

		const newTask = new Task({
			user,
			week,
			name,
			description,
			category,
			timesPerWeek,
			startDate,
		});

		const savedTask = await newTask.save();
		res.status(201).json(savedTask);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to create task' });
	}
};

// Get tasks, optionally filtered by user or week
exports.getAllTasks = async (req, res) => {
	try {
		// check the query string - ?user=xxx&week=yyy
		const { user, week } = req.query;
		// create a query object to pass to the orm
		const query = {};
		// check if i have a user or a week
		if (user) query.user = user;
		if (week) query.week = week;

		const tasks = await Task.find(query)
			.populate('user', 'name email')
			.populate('week');

		if (!tasks) {
			return res.status(404).json({ error: 'Tasks not found' });
		}

		res.status(200).json(tasks);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to fetch tasks' });
	}
};

// get task by ID
exports.getTaskById = async (req, res) => {
	try {
		const { id } = req.params;

		const task = await Task.findById(id)
			.populate('user', 'name email')
			.populate('week');

		if (!task) {
			return res.status(404).json({ error: 'Task not found' });
		}

		res.status(200).json(task);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to fetch task' });
	}
};

// update task
exports.updateTask = async (req, res) => {
	try {
		const { id } = req.params;
		const updates = req.body;

		const updatedTask = await Task.findByIdAndUpdate(id, updates, {
			new: true,
		})
			.populate('user', 'name email')
			.populate('week');

		if (!updatedTask) {
			return res.status(404).json({ error: 'Task not found' });
		}

		res.status(200).json(updatedTask);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to update task' });
	}
};

// delete task
exports.deleteTask = async (req, res) => {
	try {
		const { id } = req.params;

		const deletedTask = await Task.findByIdAndDelete(id);

		if (!deletedTask) {
			return res.status(404).json({ error: 'Task not found' });
		}

		res
			.status(200)
			.json({ message: 'Task deleted successfully', deleted: deletedTask });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to delete task' });
	}
};

// Add a log entry to track complete/incomplete
exports.updateTaskLog = async (req, res) => {
	try {
		const { id } = req.params;
		const { status } = req.body; // "complete" or "incomplete"

		if (!['complete', 'incomplete'].includes(status)) {
			return res.status(400).json({ error: 'Invalid status' });
		}

		const logEntry = { date: new Date(), status, updateAt: new Date() };

		const updatedTask = await Task.findByIdAndUpdate(
			id,
			{ $push: { logs: logEntry } },
			{ new: true }
		);

		if (!updatedTask) {
			return res.status(404).json({ error: 'Task not found' });
		}
		res.json(updatedTask);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to update task log' });
	}
};
