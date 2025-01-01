require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// import route files
const userRoutes = require('./routes/userRoutes');

const app = express();

// middleware
app.use(cors());
app.use(express.json());
