const mongoose = require("mongoose");

// Define the schema for the Course collection
const courseSchema = new mongoose.Schema({
    courseCode: {
        type: String,
        required: true,
        match: /^(?=.*[A-Z])(?=.*[0-9])[A-Z0-9]+$/, // All uppercase with at least one digit and one uppercase letter
    },
    courseName: {
        type: String,
        required: true,
    },
    priority: {
        type: Number,
        default: 0,
    },
    tasksByDate: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    tasksByPriority: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Course", courseSchema);
