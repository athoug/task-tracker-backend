const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, taskController.createTask);

// Get tasks (optionally filter by ?user=xxx or ?week=xxx)
router.get('/', authMiddleware, taskController.getAllTasks);

router.get('/:id', authMiddleware, taskController.getTaskById);

router.patch('/:id', authMiddleware, taskController.updateTask);

router.delete('/:id', authMiddleware, taskController.deleteTask);

router.patch('/:id/logs', authMiddleware, taskController.updateTaskLog);

module.exports = router;
