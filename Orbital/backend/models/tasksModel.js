const mongoose = require('mongoose')

// Define the schema for the Task collection
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    // temporarily false, remember to change to true
    description: {
        type: String,
        required: false,
    },
    // temporarily false, remember to change to true
    dueDate: {
        type: Date,
        required: false,
    },
    // temporarily false, remember to change to true
    priority: {
        type: String,
        enum: ['High', 'Low'],
        required: false,
    },
    status: {
        type: String,
        enum: ['Todo', 'Done'],
        default: 'Todo',
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
   
});
  

module.exports = mongoose.model('Task', taskSchema);