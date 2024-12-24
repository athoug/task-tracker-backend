const connect = require('../connect');
const Kitten = require('./kitten');

const connectionURL = 'mongodb://localhost:27017/test';
connect(connectionURL)
	.then(async (connection) => {
		console.log('app connected to database - ' + connection);

		const silence = new Kitten({ name: 'silence' });
		await silence.save();
		silence.speak();

		// retrieve all kittens
		const kittens = await Kitten.find({});
		console.log('kittens:', kittens);

		// find only kittens named silence
		const silent = await Kitten.find({ name: /^sil/ });
		console.log('silent kittens:', silent);
	})
	.catch((err) => console.error(err));
