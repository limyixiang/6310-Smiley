const express = require('express');
const router = express.Router();
const { createTask, getTasksForUser, getTasksForCourse, completeTask, reverseCompleteTask, deleteTask } = require('../controllers/taskController')

router.post("/createtask", createTask);
router.post("/gettasksforuser", getTasksForUser);
router.post("/gettasksforcourse", getTasksForCourse);
router.post("/completetask", completeTask);
router.post("/reversecompletetask", reverseCompleteTask);
router.delete("/deletetask/:id", deleteTask); // Route for deleting a task

module.exports = router;
