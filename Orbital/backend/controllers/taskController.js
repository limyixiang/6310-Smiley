const Task = require("../models/tasksModel");
const User = require("../models/userModel");
const Course = require("../models/courseModel");
const { validationResult } = require("express-validator");
const {
    scheduleTaskDeadlineNotification,
    disableTaskDeadlineNotification,
    enableTaskDeadlineNotification,
    deleteTaskDeadlineNotification,
} = require("./notificationsController");

const insertTaskByDate = async (arr, newDeadline, task) => {
    const numTasks = arr.length;
    if (numTasks === 0) {
        arr[0] = task;
        return arr;
    }
    // Fetch tasks from the database
    const iTasksUnordered = await Task.find({ _id: { $in: arr } });
    // Create a map where the key is the task's id and the value is the task itself
    const iTasksMap = new Map(
        iTasksUnordered.map((iTask) => [iTask._id.toString(), iTask])
    );
    // Create a new array of tasks ordered according to the arr array
    const iTasks = arr.map((id) => iTasksMap.get(id.toString()));
    const newCourse = await Course.findById(task.course);
    for (let i = 0; i < numTasks; i++) {
        const iTask = iTasks[i];
        const iDeadline = new Date(iTask.dueDate).getTime();
        // If the new task's deadline is earlier than the current task's deadline, insert the new task before the current task
        // If the new task's deadline is later than the current task's deadline, insert the new task after the current task
        // If the new task's deadline is the same as the current task's deadline, insert by order of task priority
        if (newDeadline < iDeadline) {
            arr.splice(i, 0, task);
            break;
        } else if (newDeadline == iDeadline) {
            // If the new task's priority is higher than the current task's priority, insert the new task before the current task
            // If the new task's priority is lower than the current task's priority, insert the new task after the current task
            // If the new task's priority is the same as the current task's priority, insert by order of course priority
            if (task.priority === "High" && iTask.priority !== "High") {
                arr.splice(i, 0, task);
                break;
            } else if (task.priority === iTask.priority) {
                const iCourse = await Course.findById(iTask.course);
                // highest priority is 0, followed by 1, 2, 3, ...
                if (newCourse.priority < iCourse.priority) {
                    arr.splice(i, 0, task);
                    break;
                } else if (newCourse.priority === iCourse.priority) {
                    // If the new task's course priority is the same as the current task's course priority, insert by order of task name
                    if (task.taskName < iTask.taskName) {
                        arr.splice(i, 0, task);
                        break;
                    } else if (task.taskName === iTask.taskName) {
                        // If the current task position is the last in the array, insert the new task after the current task
                        if (i === numTasks - 1) {
                            arr.splice(i + 1, 0, task);
                            break;
                        } else {
                            const nextDeadline = new Date(
                                iTasks[i + 1].dueDate
                            ).getTime();
                            if (newDeadline < nextDeadline) {
                                arr.splice(i + 1, 0, task);
                                break;
                            } else if (newDeadline === nextDeadline) {
                                const nextTask = iTasks[i + 1];
                                const nextCourse = await Course.findById(
                                    nextTask.course
                                );
                                if (newCourse.priority < nextCourse.priority) {
                                    arr.splice(i + 1, 0, task);
                                    break;
                                } else if (
                                    newCourse.priority === nextCourse.priority
                                ) {
                                    if (task.taskName < nextTask.taskName) {
                                        arr.splice(i + 1, 0, task);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (i === numTasks - 1) {
            arr[numTasks] = task;
        }
    }
    return arr;
};

const insertTaskByPriority = async (arr, newDeadline, task) => {
    const numTasks = arr.length;
    if (numTasks === 0) {
        arr[0] = task;
        return arr;
    }
    // Fetch tasks from the database
    const iTasksUnordered = await Task.find({ _id: { $in: arr } });
    // Create a map where the key is the task's id and the value is the task itself
    const iTasksMap = new Map(
        iTasksUnordered.map((iTask) => [iTask._id.toString(), iTask])
    );
    // Create a new array of tasks ordered according to the arr array
    const iTasks = arr.map((id) => iTasksMap.get(id.toString()));
    const newCourse = await Course.findById(task.course);
    for (let i = 0; i < numTasks; i++) {
        const iTask = iTasks[i];
        // If the new task's priority is higher than the current task's priority, insert the new task before the current task
        if (task.priority === "High") {
            if (iTask.priority !== "High") {
                arr.splice(i, 0, task);
                break;
            } else {
                // If both the new task's priority and the current task's priority are high, insert by order of deadline
                const iDeadline = new Date(iTask.dueDate).getTime();
                if (newDeadline < iDeadline) {
                    arr.splice(i, 0, task);
                    break;
                } else if (newDeadline === iDeadline) {
                    // If the new task's deadline is the same as the current task's deadline, insert by order of course priority
                    const iCourse = await Course.findById(iTask.course);
                    if (newCourse.priority < iCourse.priority) {
                        arr.splice(i, 0, task);
                        break;
                    } else if (newCourse.priority === iCourse.priority) {
                        // If the new task's course priority is the same as the current task's course priority, insert by order of task name
                        if (task.taskName < iTask.taskName) {
                            arr.splice(i, 0, task);
                            break;
                        } else if (task.taskName === iTask.taskName) {
                            // If the current task position is the last in the array or the next task is not High priority, insert the new task after the current task
                            if (
                                i === numTasks - 1 ||
                                iTasks[i + 1].priority !== "High"
                            ) {
                                arr.splice(i + 1, 0, task);
                                break;
                            } else {
                                // If the new task's deadline is earlier than the next task's deadline, insert the new task before the next task
                                const nextDeadline = new Date(
                                    iTasks[i + 1].dueDate
                                ).getTime();
                                if (newDeadline < nextDeadline) {
                                    arr.splice(i + 1, 0, task);
                                    break;
                                } else if (newDeadline === nextDeadline) {
                                    // If the new task's deadline is the same as the next task's deadline, insert by order of course priority
                                    const nextTask = iTasks[i + 1];
                                    const nextCourse = await Course.findById(
                                        nextTask.course
                                    );
                                    if (
                                        newCourse.priority < nextCourse.priority
                                    ) {
                                        arr.splice(i + 1, 0, task);
                                        break;
                                    } else if (
                                        newCourse.priority ===
                                        nextCourse.priority
                                    ) {
                                        // If the new task's course priority is the same as the next task's course priority, insert by order of task name
                                        if (task.taskName < nextTask.taskName) {
                                            arr.splice(i + 1, 0, task);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        } else {
            // New Task is Low Priority
            if (iTask.priority === "Low") {
                const iDeadline = new Date(iTask.dueDate).getTime();
                // If the new task's deadline is earlier than the current task's deadline, insert the new task before the current task
                if (newDeadline < iDeadline) {
                    arr.splice(i, 0, task);
                    break;
                } else if (newDeadline === iDeadline) {
                    // If the new task's deadline is the same as the current task's deadline, insert by order of course priority
                    const iCourse = await Course.findById(iTask.course);
                    if (newCourse.priority < iCourse.priority) {
                        arr.splice(i, 0, task);
                        break;
                    } else if (newCourse.priority === iCourse.priority) {
                        // If the new task's course priority is the same as the current task's course priority, insert by order of task name
                        if (task.taskName < iTask.taskName) {
                            arr.splice(i, 0, task);
                            break;
                        } else if (task.taskName === iTask.taskName) {
                            // If the current task position is the last in the array, insert the new task after the current task
                            if (i === numTasks - 1) {
                                arr.splice(i + 1, 0, task);
                                break;
                            } else {
                                const nextDeadline = new Date(
                                    iTasks[i + 1].dueDate
                                ).getTime();
                                if (newDeadline < nextDeadline) {
                                    arr.splice(i + 1, 0, task);
                                    break;
                                } else if (newDeadline === nextDeadline) {
                                    const nextTask = iTasks[i + 1];
                                    const nextCourse = await Course.findById(
                                        nextTask.course
                                    );
                                    if (
                                        newCourse.priority < nextCourse.priority
                                    ) {
                                        arr.splice(i + 1, 0, task);
                                        break;
                                    } else if (
                                        newCourse.priority ===
                                        nextCourse.priority
                                    ) {
                                        if (task.taskName < nextTask.taskName) {
                                            arr.splice(i + 1, 0, task);
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (i === numTasks - 1) {
            arr[numTasks] = task;
        }
    }
    return arr;
};

exports.createTask = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array()[0].msg,
            });
        }
        // console.log(req);
        const user = await User.findById(req.body.userid);
        const course = await Course.findById(req.body.courseid);
        const dueDate = new Date(req.body.dueDate);
        dueDate.setUTCHours(-8, 0, 0, 0);
        // console.log(dueDate.toLocaleString());
        const task = new Task({
            taskName: req.body.taskName,
            dueDate: dueDate,
            priority: req.body.priority,
            user: user,
            course: course,
        });
        // console.log("reached here");
        var userTasksByDate = user.tasksByDate;
        var userTasksByPriority = user.tasksByPriority;
        var courseTasksByDate = course.tasksByDate;
        var courseTasksByPriority = course.tasksByPriority;

        // Insert new Task into user's array of tasks
        // Note that this only takes into acount the dueDate of the task and not the priority of the course yet
        // as priorities of courses are not implemented yet.
        const newDeadline = new Date(task.dueDate).getTime();
        let userTasksByDatePromise = insertTaskByDate(
            userTasksByDate,
            newDeadline,
            task
        );
        let userTasksByPriorityPromise = insertTaskByPriority(
            userTasksByPriority,
            newDeadline,
            task
        );
        let courseTasksByDatePromise = insertTaskByDate(
            courseTasksByDate,
            newDeadline,
            task
        );
        let courseTasksByPriorityPromise = insertTaskByPriority(
            courseTasksByPriority,
            newDeadline,
            task
        );

        try {
            userTasksByDate = await userTasksByDatePromise;
            userTasksByPriority = await userTasksByPriorityPromise;
            courseTasksByDate = await courseTasksByDatePromise;
            courseTasksByPriority = await courseTasksByPriorityPromise;

            user.set("tasksByDate", userTasksByDate);
            user.set("tasksByPriority", userTasksByPriority);
            await user.save({ $inc: { __v: 1 } });
            // console.log("User saved.");

            course.set("tasksByDate", courseTasksByDate);
            course.set("tasksByPriority", courseTasksByPriority);
            await course.save({ $inc: { __v: 1 } });
            // console.log("Course saved.");

            await task.save();
            // console.log("Task created and saved.");
        } catch (err) {
            console.log(err);
        }
        // const jobId = scheduleTaskDeadlineNotification({
        //     courseCode: course.courseCode,
        //     dueDate: newDeadline,
        //     user: user,
        //     taskName: task.taskName,
        // });
        // console.log(jobId);
        // task.set("notification", jobId);
        // await task.save();
        const jobs = await scheduleTaskDeadlineNotification({
            courseCode: course.courseCode,
            dueDate: newDeadline,
            userid: req.body.userid,
            taskName: task.taskName,
            taskPriority: task.priority,
        });
        // might want to append new jobs to already existing jobs next time instead of completely overwriting
        task.set("notifications", jobs);
        await task.save();
        if (res) {
            return res
                .status(201)
                .json({ message: "Task created successfully", data: task });
        } else {
            return { message: "Task created successfully", data: task };
        }
    } catch (error) {
        if (res) {
            return res.status(500).json({ error: error.message });
        } else {
            throw error;
        }
    }
};

// Delete a task
exports.deleteTask = async (req, res) => {
    try {
        // Extract task ID from request parameters
        const taskId = req.params.id;

        // Remove related notifications job orders
        await deleteTaskDeadlineNotification(taskId);

        // Find task by ID and delete it
        const deletedTask = await Task.findByIdAndDelete(taskId);

        if (!deletedTask) {
            // If task with given ID is not found, return error
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

        // Remove task from course's array of tasks
        const course = await Course.findById(deletedTask.course);
        course.tasksByDate = course.tasksByDate.filter(
            (task) => task._id != taskId
        );
        course.tasksByPriority = course.tasksByPriority.filter(
            (task) => task._id != taskId
        );
        await course.save();

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

// Get all tasks for a particular course (sorted by date)
exports.getTasksByDateForCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.body.courseid).populate(
            "tasksByDate"
        );
        return res.json(course.tasksByDate);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Get all tasks for a particular course (sorted by priority)
exports.getTasksByPriorityForCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.body.courseid).populate(
            "tasksByPriority"
        );
        return res.json(course.tasksByPriority);
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
        // await cancelTaskDeadlineNotification(task);
        await disableTaskDeadlineNotification(task);
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
        const user = await User.findById(task.user);
        if (
            (task.priority === "High" && user.notificationsHigh) ||
            (task.priority === "Low" && user.notificationsLow)
        ) {
            await enableTaskDeadlineNotification(task);
        }
        await task.save();
        return res
            .status(200)
            .json({ message: "Completion of task reversed successfully" });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.reorderTasksByDeadline = async (taskIds, courseOrder) => {
    // console.log(courseOrder);
    const tasksUnordered = await Task.find({ _id: { $in: taskIds } });
    // console.log("tasksUnordered", tasksUnordered);
    const tasksMap = new Map(
        tasksUnordered.map((task) => [task._id.toString(), task])
    );
    // console.log("tasksMap", tasksMap);
    const tasks = taskIds.map((taskId) => tasksMap.get(taskId.toString()));
    // const coursesUnordered = await Course.find({ _id: { $in: courseIds } });
    // const coursesMap = new Map(coursesUnordered.map((course) => [course._id, course]));
    // const courses = courseIds.map((courseId) => coursesMap.get(courseId));
    // console.log("tasks before sorting", tasks);
    tasks.sort((taskA, taskB) => {
        // Compare by nearest deadline
        // console.log(taskA.dueDate > taskB.dueDate);
        if (taskA.dueDate < taskB.dueDate) {
            // console.log("this actually works");
            return -1;
        } else if (taskA.dueDate > taskB.dueDate) {
            return 1;
        }
        // If deadlines are the same, compare by task priority
        if (taskA.priority === "Low" && taskB.priority === "High") {
            return 1;
        } else if (taskA.priority === "High" && taskB.priority === "Low") {
            return -1;
        }
        // console.log(
        //     taskA.taskName,
        //     courseOrder.indexOf(taskA.course.toString()),
        //     taskB.taskName,
        //     courseOrder.indexOf(taskB.course.toString())
        // );
        // if (courseOrder.indexOf(taskA.course.toString()) == -1) {
        //     const temp = Course.findById(taskA.course);
        //     console.log("index -1:", temp.courseCode);
        // }
        // if (courseOrder.indexOf(taskB.course.toString()) == -1) {
        //     const temp = Course.findById(taskB.course);
        //     console.log("index -1:", temp.courseCode);
        // }
        // If task priorities are the same, compare by course priority
        if (
            courseOrder.indexOf(taskA.course.toString()) <
            courseOrder.indexOf(taskB.course.toString())
        ) {
            return -1;
        } else if (
            courseOrder.indexOf(taskA.course.toString()) >
            courseOrder.indexOf(taskB.course.toString())
        ) {
            return 1;
        }
        // If course priorities are the same, compare by task name
        return taskA.taskName.localeCompare(taskB.taskName);
    });
    // console.log("tasks sorted by deadline");
    // console.log(tasks[0]);
    // return tasks;
    return tasks.map((task) => task._id);
};

exports.reorderTasksByPriority = async (taskIds, courseOrder) => {
    const tasksUnordered = await Task.find({ _id: { $in: taskIds } });
    const tasksMap = new Map(
        tasksUnordered.map((task) => [task._id.toString(), task])
    );
    const tasks = taskIds.map((taskId) => tasksMap.get(taskId.toString()));
    tasks.sort((taskA, taskB) => {
        // Compare by task priority
        if (taskA.priority === "Low" && taskB.priority === "High") {
            return 1;
        } else if (taskA.priority === "High" && taskB.priority === "Low") {
            return -1;
        }
        // If task priorities are the same, compare by nearest deadline
        if (taskA.dueDate < taskB.dueDate) {
            return -1;
        } else if (taskA.dueDate > taskB.dueDate) {
            return 1;
        }
        // If deadlines are the same, compare by course priority
        if (
            courseOrder.indexOf(taskA.course.toString()) <
            courseOrder.indexOf(taskB.course.toString())
        ) {
            return -1;
        } else if (
            courseOrder.indexOf(taskA.course.toString()) >
            courseOrder.indexOf(taskB.course.toString())
        ) {
            return 1;
        }
        // If course priorities are the same, compare by task name
        return taskA.taskName.localeCompare(taskB.taskName);
    });
    // console.log("tasks sorted by priority");
    // return tasks;
    return tasks.map((task) => task._id);
};

// Update user's task priorities
exports.updateUserTasksPriority = async (
    userid,
    tutorialPriorityChanged,
    lecturePriorityChanged,
    quizPriorityChanged
) => {
    try {
        const user = await User.findById(userid);
        if (!user) {
            return { success: false, error: "User not found." };
        }
        const userTasks = await Task.find({
            _id: { $in: user.tasksByPriority },
        });
        for (const task of userTasks) {
            if (tutorialPriorityChanged && task.taskName === "Tutorial") {
                task.priority = user.tutorialPriority;
            } else if (lecturePriorityChanged && task.taskName === "Lecture") {
                task.priority = user.lecturePriority;
            } else if (quizPriorityChanged && task.taskName === "Quiz") {
                task.priority = user.quizPriority;
            }
            await task.save();
        }
        user.tasksByDate = await this.reorderTasksByDeadline(
            user.tasksByDate,
            user.courses
        );
        user.tasksByPriority = await this.reorderTasksByPriority(
            user.tasksByPriority,
            user.courses
        );
        await user.save();
    } catch (error) {
        console.log(error);
    }
};
