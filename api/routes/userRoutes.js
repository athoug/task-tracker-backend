const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// register a user
router.post('/register', userController.register);

// login a user
router.post('/login', userController.login);

module.exports = router;
