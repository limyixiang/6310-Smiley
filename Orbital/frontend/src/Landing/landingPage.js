import { React, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './landingPage.css';
import { createCourse, createTask, getCourses, completeTask, getTasksForUser, reverseCompleteTask, deleteCourse, deleteTask } from '../Backend';
import CourseContainer from './courseContainer';
import TaskContainer from './taskContainer';

function LandingPage() {

    const [err, setErr] = useState("");
    
    const [courseValues, setCourseValues] = useState({
        openModalType: null,
        courseName: "",
        courseCode: "",
    });
    
    const [taskValues, setTaskValues] = useState({
        openModalType: null,
        taskCourseId: "",
        priorityLevel: "",
        taskName: "",
        dueDate: "",
    });
    
    // Destructuring values from the state
    const { courseName, courseCode } = courseValues;
    const { taskCourseId, priorityLevel, taskName, dueDate } = taskValues;
    const [courses, setCourses] = useState([]);
    const [tasks, setTasks] = useState([]);

    const location = useLocation();
    const { user } = location.state;
    
    // Fetches courses and tasks for the user everytime user and tasks are updated
    useEffect(() => {
        getCourses(user)
            .then(data => setCourses(data))
            .catch(err => console.error("Error fetching data:", err));
        getTasksForUser(user)
            .then(data => setTasks(data))
            .catch(err => console.error("Error fetching data:", err));
    }, [user, tasks]);

    // Displays error message if there's any
    const errorMessage = () => {
        return (<div className='error-message' style={{ display: err ? "" : "none", color: "red" }}>
            {err}
        </div>);
    }

    // Handles changes in the input fields
    const handleInputChange = (type, name) => event => {
        type === "course"
            ? setCourseValues({ ...courseValues, error: false, [name]: event.target.value })
            : setTaskValues({ ...taskValues, error: false, [name]: event.target.value });
    };

    // Handles open and closing of course popup
    const openCourseModal = () => {
        setCourseValues(courseValues => ({
            ...courseValues,
            openModalType: 'course'
        }));
    }; 

    // Handles open and closing of task popup
    const openTaskModal = () => {
        setTaskValues(taskValues => ({
            ...taskValues,
            openModalType: 'task'
        }));
    };

    // Closes the popup and reset all values
    const closeModal = (modalType) => {
        modalType === 'course'
            ? setCourseValues(courseValues => ({
                ...courseValues,
                courseCode: '',
                courseName: '',
                openModalType: null
            }))
            : setTaskValues(taskValues => ({
                ...taskValues,
                taskCourseId: '',
                priorityLevel: '',
                taskName: '',
                dueDate: '',
                openModalType: null
            }));
        setErr("");
    };

    // Course inputted shown below
    const handleAddCourse = async () => {
        if (courseCode.trim() === '') {
            setErr('Invalid course code.');
            return;
        } else if (courseName.trim() === '') {
            setErr('Invalid course name.');
            return;
        } else {
            createCourse({ courseName: courseName, courseCode: courseCode, user: user })
                .then(data => {
                    if (data.error) {
                        setErr(data.error);
                    } else {
                        setCourses([...courses, data.data]);
                        closeModal('course');
                    }
                })
                .catch();
        }
    };

    // Course deleted shown below
    const handleDeleteCourse = async (courseId) => {
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
    const handleAddTask = async event => {
        event.preventDefault();
        if (taskCourseId === '') {
            setErr('Please select a course.');
            return;
        } else if (priorityLevel === '') {
            setErr('Please select a priority level.');
            return;
        } else if (taskName.trim() === '') {
            setErr('Invalid task name.');
            return;
        } else if (dueDate === '') {
            setErr('Please select a due date.');
            return;
        } else {
            createTask({ 
                taskName: taskName.trim(), 
                dueDate: dueDate,
                priority: priorityLevel,
                course: courses.filter(course => course._id === taskCourseId)[0],
                user: user 
            })
                .then(data => {
                    if (data.error) {
                        setErr(data.error);
                    } else {
                        setTasks([...tasks, data.data]);
                        closeModal('task');
                    }
                })
                .catch();
        }
    };

    // Task deleted shown below
    const handleDeleteTask = async (taskId) => {
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
                courseValues={courseValues}
                handleInputChange={handleInputChange}
                closeModal={closeModal}
                handleAddCourse={handleAddCourse}
                courses={courses}
                handleDeleteCourse={handleDeleteCourse}
                errorMessage = {errorMessage} />
            <TaskContainer
                courses={courses}
                tasks={tasks}
                openTaskModal={openTaskModal}
                handleInputChange={handleInputChange}
                closeModal={closeModal}
                handleAddTask={handleAddTask}
                handleDeleteTask={handleDeleteTask}
                taskValues={taskValues}
                handleTaskCheckboxChange={handleTaskCheckboxChange}
                errorMessage={errorMessage} />
        </div>
    );
};

export default LandingPage;
