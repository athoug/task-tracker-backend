const connect = require('./connect');
const User = require('./models/user');

const connectionURL = 'mongodb://localhost:27017/test';
connect(connectionURL)
	.then(async (connection) => {
		console.log('app connected to database - ' + connection);

		const silence = new User({ name: 'silence' });
		await silence.save();
		silence.speak();

		// retrieve all kittens
		const kittens = await User.find({});
		console.log('kittens:', kittens);

		// find only kittens named silence
		const silent = await User.find({ name: /^sil/ });
		console.log('silent kittens:', silent);
	})
	.catch((err) => console.error(err));
