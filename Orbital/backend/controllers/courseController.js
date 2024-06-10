const Course = require("../models/courseModel");
const User = require("../models/userModel");
const Task = require("../models/tasksModel");
const { validationResult } = require("express-validator");
const { createTask } = require("./taskController");

const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];
// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({
                error: errors.array()[0].msg,
            });
        }

        const user = await User.findById(req.body.userid);
        const course = new Course({
            courseName: req.body.courseName,
            courseCode: req.body.courseCode,
            user: user,
        });
        const userCourses = user.courses;
        userCourses[userCourses.length] = course;
        const tasks = req.body.tasks;
        await course.save();
        await user.save();
        for (const task of tasks) {
            const refDate = new Date();
            refDate.setHours(0, 0, 0, 0);
            const dayOfWeek = days.indexOf(task.reminderDay);
            // console.log(refDate.getDate());
            refDate.setDate(
                refDate.getDate() + ((dayOfWeek + 7 - refDate.getDay()) % 7)
            );
            for (let i = 0; i < task.reminderNumberOfRepeats; i++) {
                console.log("Creating task...");
                await createTask({
                    body: {
                        taskName: task.recurringTaskName,
                        dueDate: refDate,
                        priority: task.recurringTaskPriorityLevel,
                        userid: req.body.userid,
                        courseid: course._id,
                    },
                });
                console.log("Task created...");
                // hardcoding 7 days for now
                refDate.setDate(refDate.getDate() + 7);
            }
        }
        console.log("Tasks created successfully");
        return res
            .status(201)
            .json({ message: "Course created successfully", data: course });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
    try {
        // Extract course ID from request parameters
        const courseId = req.params.id;

        // Find course by ID and delete it
        const deletedCourse = await Course.findByIdAndDelete(courseId);

        if (!deletedCourse) {
            // If course with given ID is not found, return error
            return res
                .status(404)
                .json({ success: false, error: "Course not found." });
        }

        // Remove course from user's array of courses
        const user = await User.findById(deletedCourse.user);
        user.courses = user.courses.filter((course) => course._id != courseId);
        await user.save();

        // Respond with success message
        res.status(200).json({
            success: true,
            message: "Course deleted successfully.",
            data: user.courses,
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

// Get all courses for a particular user
exports.getCourses = async (req, res) => {
    try {
        const user = await User.findById(req.body.userid);
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }
        await user.populate("courses");
        // console.log(user.courses);
        return res.json(user.courses);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
