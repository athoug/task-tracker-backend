require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// import route files
const userRoutes = require("./api/routes/userRoutes");
const weekRoutes = require("./api/routes/weekRoutes");
const taskRoutes = require("./api/routes/taskRoutes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// connect to MongoDB
const { MONGO_URI, PORT } = process.env;
mongoose
	.connect(MONGO_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log("MongoDB (Atlas) connected"))
	.catch((err) => {
		console.error("MongoDB connection error:", err);
	});

// Route registration
app.use("/api/users", userRoutes);
app.use("/api/weeks", weekRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) => {
	res.send("Backend is running");
});

const port = PORT || 3000;
app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});
