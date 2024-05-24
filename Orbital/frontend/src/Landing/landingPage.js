import { React, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './landingPage.css';
import { createCourse, createTask, getCourses, completeTask, getTasksForUser, reverseCompleteTask, deleteCourse, deleteTask } from '../Backend';
import CourseContainer from './courseContainer';
import TaskContainer from './taskContainer';

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
            <CourseContainer 
                openCourseModal={openCourseModal}
                landingValues={landingValues}
                handleInputChange={handleInputChange}
                closeModal={closeModal}
                handleSubmit={handleSubmit}
                courses={courses}
                handleDeleteCourse={handleDeleteCourse} />
            <TaskContainer
                tasks={tasks}
                openTaskModal={openTaskModal}
                handleInputChange={handleInputChange}
                closeModal={closeModal}
                handleSubmit={handleSubmit}
                handleDeleteTask={handleDeleteTask}
                landingValues={landingValues}
                handleTaskCheckboxChange={handleTaskCheckboxChange} />
        </div>
    );
};

export default LandingPage;
