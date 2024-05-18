import React, { useState } from 'react';
import './landingPage.css';

function LandingPage() {
    const [courseName, setCourseName] = useState('');
    const [taskName, setTaskName] = useState('');
    const [courses, setCourses] = useState([]);
    const [tasks, setTasks] = useState([]);

    const handleCourseChange = (e) => {
        setCourseName(e.target.value);
    };

    const handleTaskChange = (e) => {
        setTaskName(e.target.value);
    };

    const handleAddCourse = () => {
        if (courseName.trim() !== '') {
            setCourses([...courses, courseName]);
            setCourseName('');
        }
    };

    const handleAddTask = () => {
        if (taskName.trim() !== '') {
            setTasks([...tasks, { name: taskName, completed: false }]);
            setTaskName('');
        }
    };

    const handleTaskCheckboxChange = (index) => {
        const newTasks = [...tasks];
        newTasks[index].completed = !newTasks[index].completed;
        setTasks(newTasks);
    };

    return (
        <div className="main-container">
            <div className="courses-container">
                <h2>Your Courses</h2>
                <div className="add-a-course">
                    <input 
                        type= "text" 
                        value={courseName} 
                        onChange={handleCourseChange} 
                        placeholder="Enter course name" 
                    />
                    <button onClick={handleAddCourse}>Add Course</button>
                </div>
                <div className="courses-list">
                    {courses.map((course, index) => (
                        <div key={index} className="course-item">
                            {course}
                        </div>
                    ))}
                </div>
            </div>
            <div className="tasks-container">
                <h2>Upcoming Deadlines</h2>
                <div className="add-a-task">
                    <input 
                        type="text" 
                        value={taskName} 
                        onChange={handleTaskChange} 
                        placeholder="Enter task name" 
                    />
                    <button onClick={handleAddTask}>Add Task</button>
                </div>
                <div className="tasks-list">
                    {tasks.map((task, index) => (
                        <div key={index} className="task-item">
                            <input
                                type="checkbox" 
                                checked={task.completed} 
                                onChange={() => handleTaskCheckboxChange(index)} 
                            />
                            <span style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                {task.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LandingPage;
