const express = require('express');
const router = express.Router();
const { createTask, getTasksForUser, getTasksForCourse, completeTask, reverseCompleteTask } = require('../controllers/taskController')

router.post("/createtask", createTask);
router.post("/gettasksforuser", getTasksForUser);
router.post("/gettasksforcourse", getTasksForCourse);
router.post("/completetask", completeTask);
router.post("/reversecompletetask", reverseCompleteTask);

module.exports = router;
