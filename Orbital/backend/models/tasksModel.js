const mongoose = require("mongoose");

// Define the schema for the Task collection
const taskSchema = new mongoose.Schema({
    taskName: {
        type: String,
        required: true,
    },
    // temporarily false (maybe we dont need this)
    description: {
        type: String,
        required: false,
    },
    dueDate: {
        type: Date,
        required: true,
    },
    priority: {
        type: String,
        enum: ["High", "Low"],
        required: true,
    },
    // temporarily false, remember to change to true
    reminders: {
        type: Boolean,
        required: false,
    },
    status: {
        type: String,
        enum: ["Todo", "Done"],
        default: "Todo",
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    notifications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "agendaJobs",
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Task", taskSchema);
