const mongoose = require('mongoose')

// Define the schema for the Course collection
const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
    },
    courseName: {
        type: String,
        required: true,
    },
    priority: {
        type: Number,
        required: true,
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