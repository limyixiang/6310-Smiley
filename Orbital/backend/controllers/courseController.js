const Course = require('../models/courseModel');

// Create a new course
exports.createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json({ message: 'Course created successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a course

