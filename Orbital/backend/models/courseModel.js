const mongoose = require('mongoose')

// Define the schema for the Course collection
const courseSchema = new mongoose.Schema({
    // turned required off for now, for testing purposes
    courseCode: {
        type: String,
        required: false,
    },
    courseName: {
        type: String,
        required: true,
    },
    // turned required off for now, for testing purposes
    priority: {
        type: Number,
        required: false,
    },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
   
});
  

module.exports = mongoose.model('Course', courseSchema);