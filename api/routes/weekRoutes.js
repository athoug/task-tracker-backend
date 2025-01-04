const express = require('express');
const router = express.Router();
const weekController = require('../controllers/weekController');

// create a new week
router.post('/', weekController.createWeek);

router.get('/user/:userId', weekController.getAllWeeksForUser);

router.get('/:id', weekController.getWeekById);

router.patch('/:id', weekController.updateWeek);

router.delete('/:id', weekController.deleteWeek);

module.exports = router;
