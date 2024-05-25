const Task = require('../models/tasksModel');
const User = require('../models/userModel');
const Course = require('../models/courseModel');

// Create a task (Currently, the task is not tied to the course so these parts are commented out)
exports.createTask = async (req, res) => {
    try {
        // console.log(req.body);
        const task = new Task(req.body);
        const user = await User.findById(req.body.user._id);
        const course = await Course.findById(req.body.course._id);
        const userTasks = user.tasks;
        const courseTasks = course.tasks;
        userTasks[userTasks.length] = task;
        courseTasks[courseTasks.length] = task;
        await task.save();
        await user.save();
        await course.save();
        return res.status(201).json({ message: 'Task created successfully', data: task });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        // Extract task ID from request parameters
        const taskId = req.params.id;

        // Find course by ID and delete it
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            // If course with given ID is not found, return error
            return res.status(404).json({ success: false, error: 'Task not found.' });
        }

        // Respond with success message
        res.status(200).json({ success: true, message: 'Task deleted successfully.' });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
};

// Get all tasks for a particular user
exports.getTasksForUser = async (req, res) => {
    try {
        const user = await User.findById(req.body._id).populate('tasks');
        return res.json(user.tasks);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// Get all tasks for a particular course
exports.getTasksForCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.body._id).populate('tasks');
        return res.json(course.tasks);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// Complete a task
exports.completeTask = async (req, res) => {
    try {
        const task = await Task.findById(req.body.task._id);
        task.status = 'Done';
        await task.save();
        return res.status(200).json({ message: 'Task completed successfully' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}

// Reverse of complete a task
exports.reverseCompleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.body.task._id);
        task.status = 'Todo';
        await task.save();
        return res.status(200).json({ message: 'Completion of task reversed successfully' });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}