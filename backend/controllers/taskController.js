const Task = require('../models/Task');
const mongoose = require('mongoose');

const createTask = async (req, res) => {
    try {
        const { title, description, priority, status, dueDate } = req.body;

        if (!title || !dueDate) {
            return res.status(400).json({
                success: false,
                message: 'Title and due date are required',
            });
        }

        if (new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
            return res.status(400).json({
                success: false,
                message: 'Due date cannot be in the past',
            });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            status,
            dueDate,
            userId: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while creating task',
            error: error.message,
        });
    }
};

const getTasks = async (req, res) => {
    try {
        const { search, status, priority, sort, page = 1, limit = 10 } = req.query;

        const query = { userId: req.user._id, isDeleted: false };

        if (search) query.title = { $regex: search, $options: 'i' };
        if (status) query.status = status;
        if (priority) query.priority = priority;

        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        const isPrioritySort = sort === 'priority' || sort === '-priority';

        let tasks;
        let totalTasks;

        if (isPrioritySort) {
            const priorityOrder = sort === '-priority'
                ? { $switch: { branches: [
                        { case: { $eq: ['$priority', 'High'] }, then: 1 },
                        { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
                        { case: { $eq: ['$priority', 'Low'] }, then: 3 },
                    ], default: 4 } }
                : { $switch: { branches: [
                        { case: { $eq: ['$priority', 'Low'] }, then: 1 },
                        { case: { $eq: ['$priority', 'Medium'] }, then: 2 },
                        { case: { $eq: ['$priority', 'High'] }, then: 3 },
                    ], default: 4 } };

            const pipeline = [
                { $match: query },
                { $addFields: { priorityRank: priorityOrder } },
                { $sort: { priorityRank: 1 } },
                { $skip: skip },
                { $limit: limitNum },
            ];

            tasks = await Task.aggregate(pipeline);
            totalTasks = await Task.countDocuments(query);
        } else {
            let sortOption = { createdAt: -1 }; 
            if (sort) {
                const sortField = sort.startsWith('-') ? sort.substring(1) : sort;
                const sortOrder = sort.startsWith('-') ? -1 : 1;
                sortOption = { [sortField]: sortOrder };
            }

            tasks = await Task.find(query)
                .sort(sortOption)
                .skip(skip)
                .limit(limitNum);

            totalTasks = await Task.countDocuments(query);
        }

        res.status(200).json({
            success: true,
            data: tasks,
            pagination: {
                total: totalTasks,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalTasks / limitNum),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching tasks',
            error: error.message,
        });
    }
};

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID',
            });
        }

        const task = await Task.findOne({ _id: id, userId: req.user._id });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching task',
            error: error.message,
        });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID',
            });
        }

        const task = await Task.findOne({ _id: id, userId: req.user._id });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        const { title, description, priority, status, dueDate } = req.body;

        if (task.status === 'Completed') {
            const attemptingOtherChanges =
                title !== undefined ||
                description !== undefined ||
                priority !== undefined ||
                dueDate !== undefined;

            if (attemptingOtherChanges) {
                return res.status(400).json({
                    success: false,
                    message: 'Completed tasks can only have their status changed',
                });
            }
        }

        if (dueDate && new Date(dueDate) < new Date().setHours(0, 0, 0, 0)) {
            return res.status(400).json({
                success: false,
                message: 'Due date cannot be in the past',
            });
        }

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority !== undefined) task.priority = priority;
        if (status !== undefined) task.status = status;
        if (dueDate !== undefined) task.dueDate = dueDate;

        await task.save();

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while updating task',
            error: error.message,
        });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid task ID',
            });
        }

        const task = await Task.findOne({ _id: id, userId: req.user._id });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        task.isDeleted = true;
        task.deletedAt = new Date();
        await task.save();

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while deleting task',
            error: error.message,
        });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        const userId = req.user._id;

        const totalTasks = await Task.countDocuments({ userId, isDeleted: false });
        const pendingTasks = await Task.countDocuments({ userId, status: 'Pending', isDeleted: false });
        const inProgressTasks = await Task.countDocuments({ userId, status: 'In Progress', isDeleted: false });
        const completedTasks = await Task.countDocuments({ userId, status: 'Completed', isDeleted: false });

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const tasksDueToday = await Task.countDocuments({
            userId,
            dueDate: { $gte: startOfDay, $lte: endOfDay },
            isDeleted: false,
        });

        res.status(200).json({
            success: true,
            data: {
                totalTasks,
                pendingTasks,
                inProgressTasks,
                completedTasks,
                tasksDueToday,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error while fetching dashboard stats',
            error: error.message,
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask,
    getDashboardStats,
};