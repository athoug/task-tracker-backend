const express = require('express');
const router = express.Router();
const weekController = require('../controllers/weekController');

// create a new week
router.post('/', weekController.createWeek);

module.exports = router;
