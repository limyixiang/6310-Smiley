import { React, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Modal from 'react-modal';
import './landingPage.css';
import { createCourse, createTask, getCourses, completeTask, getTasksForUser, reverseCompleteTask, deleteCourse, deleteTask } from '../Backend';

Modal.setAppElement('#root');

function LandingPage() {
    
    const [landingValues, setLandingValues] = useState({
        openModalType: null,
        courseName: "",
        courseCode: "",
        taskName: "",
    });

    // Destructuring values from the state
    const { courseCode, courseName, taskName } = landingValues;
    const [courses, setCourses] = useState([]);
    const [tasks, setTasks] = useState([]);

    const location = useLocation();
    const { user } = location.state;
    
    useEffect(() => {
        getCourses(user)
            .then(data => setCourses(data))
            .catch(err => console.error("Error fetching data:", err));
        getTasksForUser(user)
            .then(data => setTasks(data))
            .catch(err => console.error("Error fetching data:", err));
    }, [user, tasks]);

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
            console.log('Course Code:', landingValues.courseCode);
            console.log('Course Name', landingValues.courseName);
        } else if (landingValues.openModalType === 'task') {
            handleAddTask();
            console.log('Task Name:', landingValues.taskName);
        }
        closeModal();
    };

    // Course inputted shown below
    const handleAddCourse = () => {
        if (courseCode.trim() !== '') {
            createCourse({ courseName: courseName, courseCode: courseCode, user: user })
                .then(data => {
                    if (data.error) {
                        // do we want to have loading and success states?
                    } else {
                        setCourses([...courses, data.data]);
                    }
                })
                .catch();
            setLandingValues({ ...landingValues, courseCode: '', courseName: '' });
        }
    };

    // Course deleted shown below
    const handleDeleteCourse = (courseId) => {
        deleteCourse(courseId)
            .then(data => {
                if(data.error) {
                    
                } else {
                    setCourses(courses.filter(course => course._id !== courseId))
                }
            })
            .catch();
    };

    // Task inputted shown below
    const handleAddTask = () => {
        if (taskName.trim() !== '') {
            createTask({ taskName: taskName, user: user})
                .then(data => {
                    if (data.error) {
                        // do we want to have loading and success states?
                    } else {
                        setTasks([...tasks, data.data]);
                    }
                })
                .catch();
            setLandingValues({ ...landingValues, taskName: '' }); 
        }
    };

    // Task deleted shown below
    const handleDeleteTask = (taskId) => {
        deleteTask(taskId)
            .then(data => {
                if(data.error) {
                    
                } else {
                    setTasks(tasks.filter(task => task._id !== taskId))
                }
            })
            .catch();
    };


    // Tick off box task strikethroughs
    // const handleTaskCheckboxChange = (index) => {
    //     const newTasks = [...tasks];
    //     newTasks[index].completed = !newTasks[index].completed;
    //     setTasks(newTasks);
    // };
    const handleTaskCheckboxChange = async task => {
        console.log(task);
        if (task.status === 'Done') {
            reverseCompleteTask({ task: task });
        } else {
            completeTask({ task: task });
        }
    }

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
                        value={landingValues.courseCode}
                        onChange={handleInputChange('courseCode')}
                        placeholder='Course Code'
                    />
                    <input 
                        type='text'
                        value={landingValues.courseName}
                        onChange={handleInputChange('courseName')}
                        placeholder='Course Name'
                    />
                    <button onClick={handleSubmit}>Submit</button>
                    <button onClick={closeModal}>Close</button>
                </Modal>

                {/* only display courseCode */}
                <div className="courses-list"> 
                    {courses.map((course, index) => (
                        <div key={index} className="course-item">
                            {course.courseCode}
                            <button onClick ={()=>handleDeleteCourse(course._id)}>Delete</button>
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
                                onChange={() => handleTaskCheckboxChange(task)} 
                                checked={task.status === 'Done'} 
                            />
                            <span style={{ textDecoration: task.status === 'Done' ? 'line-through' : 'none' }}>
                                {task.taskName}
                                <button onClick ={()=>handleDeleteTask(task._id)}>Delete</button>
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
