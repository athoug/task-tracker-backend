const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

		// Hash password
		const hashedPassword = await bcrypt.hash(password, 10);

		// create and save user
		const newUser = new User({
			name,
			email,
			password: hashedPassword,
		});
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
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ error: 'Invalid credentials' });
		}

		// Generate JWT
		const token = jwt.sign(
			{ userId: user._id },
			process.env.JWT_SECRET, // e.g., "mysecret" (store in .env)
			{ expiresIn: '1d' } // token valid for 1 day
		);

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
