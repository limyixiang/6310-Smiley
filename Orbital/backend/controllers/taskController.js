const Task = require('../models/tasksModel');

// Create a task
exports.createTask = async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json({ message: 'Task created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

// Delete a task

    