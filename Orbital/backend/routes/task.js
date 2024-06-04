const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const {
    createTask,
    getTasksByDateForUser,
    getTasksByPriorityForUser,
    getTasksForCourse,
    completeTask,
    reverseCompleteTask,
    deleteTask,
} = require("../controllers/taskController");

router.post(
    "/createtask",
    [
        check("taskName", "Task Name is required.").notEmpty(),
        check("dueDate", "Task Deadline is required.").isDate({
            format: "YYYY-MM-DD",
        }),
        check("priority", "Task Course is required.").notEmpty(),
    ],
    createTask
);
router.post("/gettasksbydateforuser", getTasksByDateForUser);
router.post("/gettasksbypriorityforuser", getTasksByPriorityForUser);
router.post("/gettasksforcourse", getTasksForCourse);
router.post("/completetask", completeTask);
router.post("/reversecompletetask", reverseCompleteTask);
router.delete("/deletetask/:id", deleteTask); // Route for deleting a task

module.exports = router;
