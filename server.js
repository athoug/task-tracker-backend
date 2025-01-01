require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// import route files
const userRoutes = require('./api/routes/userRoutes');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// connect to MongoDB
const { MONGO_URI, PORT } = process.env;
mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB connected'))
	.catch((err) => {
		console.error('MongoDB connection error:', err);
	});

// Route registration
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
	res.send('Backend is running');
});

const port = PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
