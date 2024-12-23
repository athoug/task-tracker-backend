const mongoose = require('mongoose');

const connect = async (url) => {
	return await mongoose.connect(url);
};

module.exports = connect;
