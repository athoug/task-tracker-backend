const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');

// register a user
router.post('/register', userController.register);

module.exports = router;
