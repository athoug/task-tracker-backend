const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.post('/', taskController.createTask);

// Get tasks (optionally filter by ?user=xxx or ?week=xxx)
router.get('/', taskController.getAllTasks);

router.get('/:id', taskController.getTaskById);

router.patch('/:id', taskController.updateTask);

router.delete('/:id', taskController.deleteTask);

router.patch('/:id/logs', taskController.updateTaskLog);

module.exports = router;
