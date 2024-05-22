import { React, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './landingPage.css';
import { createCourse, createTask, getCourses } from '../Backend';

function LandingPage() {
    const [courseName, setCourseName] = useState('');
    const [taskName, setTaskName] = useState('');
    const [courses, setCourses] = useState([]);
    const [tasks, setTasks] = useState([]);

    const location = useLocation();
    const { user } = location.state;
    
    useEffect(() => {
        getCourses(user)
            // .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error("Error fetching data:", err));
    }, []);

    const handleCourseChange = (e) => {
        setCourseName(e.target.value);
    };

    const handleTaskChange = (e) => {
        setTaskName(e.target.value);
    };

    const handleAddCourse = () => {
        if (courseName.trim() !== '') {
            createCourse({ courseName: courseName, user: user })
                .then(data => {
                    if (data.error) {
                        // do we want to have loading and success states?
                    } else {
                        console.log(data);
                        setCourses([...courses, data.data]);
                    }
                })
                .catch();
            // setCourses([...courses, courseName]);
            setCourseName('');
        }
    };

    const handleAddTask = () => {
        if (taskName.trim() !== '') {
            createTask(user, taskName);
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
                            {course.courseName}
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
                <screenLeft><p className='landing-to-dashboard-redirect'><b><a href='/'>Back to Dashboard</a></b></p></screenLeft>
            </div>
        </div>
    );
}

export default LandingPage;
