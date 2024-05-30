const Course = require("../models/courseModel");
const User = require("../models/userModel");

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        // const course = new Course(req.body);
        const user = await User.findById(req.body.userid);
        const course = new Course({
            courseName: req.body.courseName,
            courseCode: req.body.courseCode,
            user: user,
        });
        const userCourses = user.courses;
        userCourses[userCourses.length] = course;
        // console.log(user);
        await course.save();
        await user.save();
        return res
            .status(201)
            .json({ message: "Course created successfully", data: course });
    } catch (error) {
        return res.status(400).json({ error: error.message });
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
        console.error(error);
        res.status(500).json({
            success: false,
            error: "Internal server error.",
        });
    }
};

// Get all courses for a particular user
exports.getCourses = async (req, res) => {
    try {
        const user = await User.findById(req.body.userid).populate("courses");
        // console.log(user.courses);
        return res.json(user.courses);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};
