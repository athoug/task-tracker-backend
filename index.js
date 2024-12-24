const connect = require('./connect');
const User = require('./models/user');

const connectionURL = 'mongodb://localhost:27017/tasko';
connect(connectionURL)
	.then(async (connection) => {
		console.log('app connected to database - ' + connection);

		const athoug = new User({ name: 'Laama', email: 'laama@gmail.com' });
		await athoug.save();

		console.log(athoug.name, athoug.email);
	})
	.catch((err) => console.error(err));
