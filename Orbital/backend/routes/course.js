const express = require('express');
const router = express.Router();
const { createCourse, getCourses } = require('../controllers/courseController')

router.post("/createcourse", createCourse);
router.post("/getcourses", getCourses);

module.exports = router;
