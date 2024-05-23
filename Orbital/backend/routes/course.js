const express = require('express');
const router = express.Router();
const { createCourse, getCourses, deleteCourse } = require('../controllers/courseController')

router.post("/createcourse", createCourse);
router.post("/getcourses", getCourses);
router.delete("/deletecourse/:id", deleteCourse); // Route for deleting a course

module.exports = router;
