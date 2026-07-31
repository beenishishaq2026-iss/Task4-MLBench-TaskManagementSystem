const express = require('express');
const router = express.Router();
const protect = require('../middleware/auth');
const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getDashboardStats,
} = require('../controllers/taskController');

router.use(protect);

router.get('/dashboard/stats', getDashboardStats);

router.post('/', createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;