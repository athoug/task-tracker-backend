const User = require('../../models/user');

exports.register = async (req, res) => {
	try {
		const { name, email, password } = req.body;

		res
			.status(200)
			.json({ message: `hey ${name} you have register successfully` });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to register user' });
	}
};

exports.login = async (req, res) => {
	try {
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to login' });
	}
};
