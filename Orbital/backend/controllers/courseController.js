const Course = require('../models/courseModel');
const User = require('../models/userModel');

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        const user = await User.findById(req.body.user._id);
        const userCourses = user.courses;
        userCourses[userCourses.length] = course;
        console.log(user);
        await course.save();
        await user.save();
        return res.status(201).json({ message: 'Course created successfully', data: course });
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
};

// Delete a course

// Get all courses for a particular user
exports.getCourses = async (req, res) => {
    try {
        const user = await User.findById(req.body._id).populate('courses');
        // console.log(user.courses);
        return res.json(user.courses);
    } catch (error) {
        return res.status(400).json({ error: error.message });
    }
}
