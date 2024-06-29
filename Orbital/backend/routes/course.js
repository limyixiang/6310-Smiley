const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const {
    createCourse,
    getCourses,
    deleteCourse,
} = require("../controllers/courseController");

router.post(
    "/createcourse",
    [
        check("courseCode", "Course code is invalid.").matches(
            /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$/
        ),
        check("courseName", "Course Name is required.").isLength({ min: 1 }),
    ],
    createCourse
);
router.post("/getcourses", getCourses);
router.delete("/deletecourse/:id", deleteCourse); // Route for deleting a course

module.exports = router;
