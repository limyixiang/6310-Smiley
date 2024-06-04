const Task = require("../models/tasksModel");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const { validationResult } = require("express-validator");

exports.createTask = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array()[0].msg,
            });
        }

        const user = await User.findById(req.body.userid);
        const course = await Course.findById(req.body.courseid);
        const task = new Task({
            taskName: req.body.taskName,
            dueDate: req.body.dueDate,
            priority: req.body.priority,
            user: user,
            course: course,
        });
        const userTasksByDate = user.tasksByDate;
        const userTasksByPriority = user.tasksByPriority;
        const courseTasks = course.tasks;

        // Insert new Task into user's array of tasks
        // Note that this only takes into acount the dueDate of the task and not the priority of the course yet
        // as priorities of courses are not implemented yet.
        if (userTasksByDate.length === 0) {
            userTasksByDate[0] = task;
            userTasksByPriority[0] = task;
        } else {
            const numTasks = userTasksByDate.length;
            const newDeadline = new Date(task.dueDate).getTime();
            // Insert new Task into user's array of tasks that is sorted by date
            for (let i = 0; i < numTasks; i++) {
                const iTask = await Task.findById(userTasksByDate[i]);
                const iDeadline = new Date(iTask.dueDate).getTime();
                if (newDeadline < iDeadline) {
                    userTasksByDate.splice(i, 0, task);
                    break;
                } else if (newDeadline == iDeadline) {
                    if (i === numTasks - 1) {
                        userTasksByDate.splice(i + 1, 0, task);
                        break;
                    } else {
                        const nextDeadline = new Date(
                            (
                                await Task.findById(userTasksByDate[i + 1])
                            ).dueDate
                        ).getTime();
                        if (newDeadline < nextDeadline) {
                            userTasksByDate.splice(i + 1, 0, task);
                            break;
                        }
                    }
                } else if (i === numTasks - 1) {
                    userTasksByDate[numTasks] = task;
                }
            }
            // Insert new Task into user's array of tasks that is sorted by priority
            for (let i = 0; i < numTasks; i++) {
                const iTask = await Task.findById(userTasksByPriority[i]);
                if (task.priority === "High") {
                    if (iTask.priority !== "High") {
                        userTasksByPriority.splice(i, 0, task);
                        break;
                    } else {
                        const iDeadline = new Date(iTask.dueDate).getTime();
                        if (newDeadline < iDeadline) {
                            userTasksByPriority.splice(i, 0, task);
                            break;
                        } else if (newDeadline == iDeadline) {
                            if (i === numTasks - 1) {
                                userTasksByPriority.splice(i + 1, 0, task);
                                break;
                            } else {
                                const nextDeadline = new Date(
                                    (
                                        await Task.findById(
                                            userTasksByPriority[i + 1]
                                        )
                                    ).dueDate
                                ).getTime();
                                if (newDeadline < nextDeadline) {
                                    userTasksByPriority.splice(i + 1, 0, task);
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    if (iTask.priority === "Low") {
                        const iDeadline = new Date(iTask.dueDate).getTime();
                        if (newDeadline < iDeadline) {
                            userTasksByPriority.splice(i, 0, task);
                            break;
                        } else if (newDeadline == iDeadline) {
                            userTasksByPriority.splice(i + 1, 0, task);
                            break;
                        }
                    }
                }
                if (i === numTasks - 1) {
                    userTasksByPriority[numTasks] = task;
                }
            }
        }

        courseTasks[courseTasks.length] = task;
        await task.save();
        await user.save();
        await course.save();
        return res
            .status(201)
            .json({ message: "Task created successfully", data: task });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        // Extract task ID from request parameters
        const taskId = req.params.id;

        // Find course by ID and delete it
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            // If course with given ID is not found, return error
            return res
                .status(404)
                .json({ success: false, error: "Task not found." });
        }

        // Remove task from user's array of tasks
        const user = await User.findById(deletedTask.user);
        user.tasksByDate = user.tasksByDate.filter(
            (task) => task._id != taskId
        );
        user.tasksByPriority = user.tasksByPriority.filter(
            (task) => task._id != taskId
        );
        await user.save();

        // Respond with success message
        res.status(200).json({
            success: true,
            message: "Task deleted successfully.",
            data: user.tasks,
        });
    } catch (error) {
        // Handle errors
        // console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal server error.",
        });
    }
};

// Get all tasks for a particular user (sorted by date)
exports.getTasksByDateForUser = async (req, res) => {
    try {
        const user = await User.findById(req.body.userid).populate(
            "tasksByDate"
        );
        return res.json(user.tasksByDate);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get all tasks for a particular user (sorted by priority)
exports.getTasksByPriorityForUser = async (req, res) => {
    try {
        const user = await User.findById(req.body.userid).populate(
            "tasksByPriority"
        );
        return res.json(user.tasksByPriority);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get all tasks for a particular course
exports.getTasksForCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.body.courseid).populate(
            "tasks"
        );
        return res.json(course.tasks);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Complete a task
exports.completeTask = async (req, res) => {
    try {
        const task = await Task.findById(req.body.taskid);
        if (task.status === "Done") {
            return res.status(200).json({ message: "Task already completed" });
        }
        task.status = "Done";
        await task.save();
        return res.status(200).json({ message: "Task completed successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Reverse of complete a task
exports.reverseCompleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.body.taskid);
        if (task.status === "Todo") {
            return res
                .status(200)
                .json({ message: "Task already not completed" });
        }
        task.status = "Todo";
        await task.save();
        return res
            .status(200)
            .json({ message: "Completion of task reversed successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
