const User = require('../../models/user');

exports.register = async (req, res) => {
	try {
		// extract the data from the request
		const { name, email, password } = req.body;

		// check if the user exists
		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(400).json({ error: 'User already exists' });
		}

		// TODO: Hash password

		// create and save user
		const newUser = new User({ name, email, password });
		const savedUser = await newUser.save();

		// respond to request
		res.status(201).json({
			message: `hey ${name} you have register successfully`,
			user: {
				id: savedUser._id,
				name: savedUser.name,
				email: savedUser.email,
				profileIcon: savedUser.profileIcon,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to register user' });
	}
};

exports.login = async (req, res) => {
	try {
		// extract the values from the body
		const { email, password } = req.body;

		// find the user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ error: 'Invalid credentials' });
		}

		// compare the password
		// TODO: add bcrypt part - for now it's simple conditional check
		const isMatch = password == user.password;
		if (!isMatch) {
			return res.status(400).json({ error: 'Invalid credentials' });
		}

		// TODO: Generate JWT
		const token = 'feoisjnwseflj';

		res.status(202).json({
			message: 'Login successful',
			token,
			user: {
				_id: user._id,
				name: user.name,
				email: user.email,
			},
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Failed to login' });
	}
};
