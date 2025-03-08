// db.js
const mongoose = require("mongoose");

let cached = global.mongoose;
if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
	if (cached.conn) {
		// Already connected in a previous invocation
		return cached.conn;
	}
	if (!cached.promise) {
		// Create a new connection promise
		cached.promise = mongoose.connect(process.env.MONGO_URI).then((m) => m);
	}
	cached.conn = await cached.promise;
	return cached.conn;
}

module.exports = { connectDB };
