import { React, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import './landingPage.css';
import { createCourse, createTask, getCourses } from '../Backend';

Modal.setAppElement('#root');

function LandingPage() {
    
    const [landingValues, setLandingValues] = useState({
        openModalType: null,
        courseName: "",
        taskName: "",
    });

    // Destructuring values from the state
    const { courseName, taskName } = landingValues;
    const [courses, setCourses] = useState([]);
    const [tasks, setTasks] = useState([]);

    const location = useLocation();
    const { user } = location.state;
    
    useEffect(() => {
        getCourses(user)
            // .then(res => res.json())
            .then(data => setCourses(data))
            .catch(err => console.error("Error fetching data:", err));
    }, [user]);

    // Handles changes in the input fields
    const handleInputChange = name => event => {
        setLandingValues({ ...landingValues, error: false, [name]: event.target.value });
    };

    // Handles open and closing of popup
    const openCourseModal = () => {
        setLandingValues(landingValues => ({
            ...landingValues,
            openModalType: 'course'
        }));
    }; 

    const openTaskModal = () => {
        setLandingValues(landingValues => ({
            ...landingValues,
            openModalType: 'task'
        }));
    };

    const closeModal = () => {
        setLandingValues(landingValues => ({
            ...landingValues,
            openModalType: null
        }));
    };

    // Close course popup upon submission
    const handleSubmit = () => {
        if (landingValues.openModalType === 'course') {
            handleAddCourse();
            console.log('Course Name:', landingValues.courseName);
        } else if (landingValues.openModalType === 'task') {
            handleAddTask();
            console.log('Task Name:', landingValues.taskName);
        }
        closeModal();
    };

    // Course inputted shown below
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
            setLandingValues('courseName');
        }
    };

    // Task inputted shown below
    const handleAddTask = () => {
        if (taskName.trim() !== '') {
            createTask(user, taskName);
            setTasks([...tasks, { name: taskName, completed: false }]);
            setLandingValues('taskName');
        }
    };

    // Tick off box task strikethroughs
    const handleTaskCheckboxChange = (index) => {
        const newTasks = [...tasks];
        newTasks[index].completed = !newTasks[index].completed;
        setTasks(newTasks);
    };

    return (
        <div className="main-container">
            <div className="courses-container">
                <h2>Your Courses</h2>
                <button className="add-a-course-button" onClick={openCourseModal}>Add a course</button>
                <Modal
                    isOpen={landingValues.openModalType === 'course'} 
                    onRequestClose={closeModal}
                    contentLabel='Add-a-course-modal'
                    className='add-a-course-popup'
                    overlayClassName='backdrop-course-popup'
                >
                    <h2>Add Your Course</h2>
                    <input 
                        type='text'
                        value={landingValues.courseName}
                        onChange={handleInputChange('courseName')}
                        placeholder='Course Name'
                    />
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={closeModal}>Close</button>
                </Modal>
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
                <button className="add-a-task-button" onClick={openTaskModal}>Add a task</button>
                <Modal
                    isOpen={landingValues.openModalType === 'task'} 
                    onRequestClose={closeModal}
                    contentLabel='Add-a-task-modal'
                    className='add-a-task-popup'
                    overlayClassName='backdrop-task-popup'
                >
                    <h2>Add Your Task</h2>
                    <input 
                        type='text'
                        value={landingValues.taskName}
                        onChange={handleInputChange('taskName')}
                        placeholder='Task Name'
                    />
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={closeModal}>Close</button>
                </Modal>
                <center><p className='landing-to-dashboard'><b><a href='/'>Back to Dashboard</a></b></p></center>
            </div>
        </div>
    );
};

export default LandingPage;
