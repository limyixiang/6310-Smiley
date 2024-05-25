import { React, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './landingPage.css';
import { createCourse, createTask, getCourses, completeTask, getTasksForUser, reverseCompleteTask, deleteCourse, deleteTask } from '../Backend';
import CourseContainer from './courseContainer';
import TaskContainer from './taskContainer';

function LandingPage() {
    
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
    
    useEffect(() => {
        getCourses(user)
            .then(data => setCourses(data))
            .catch(err => console.error("Error fetching data:", err));
        getTasksForUser(user)
            .then(data => setTasks(data))
            .catch(err => console.error("Error fetching data:", err));
    }, [user, tasks]);

    // Handles changes in the input fields
    const handleInputChange = (type, name) => event => {
        type === "course"
            ? setCourseValues({ ...courseValues, error: false, [name]: event.target.value })
            : setTaskValues({ ...taskValues, error: false, [name]: event.target.value });
    };

    // Handles open and closing of popup
    const openCourseModal = () => {
        setCourseValues(courseValues => ({
            ...courseValues,
            openModalType: 'course'
        }));
    }; 

    const openTaskModal = () => {
        setTaskValues(taskValues => ({
            ...taskValues,
            openModalType: 'task'
        }));
    };

    const closeModal = (modalType) => {
        modalType === 'course'
            ? setCourseValues(courseValues => ({
                ...courseValues,
                openModalType: null
            }))
            : setTaskValues(taskValues => ({
                ...taskValues,
                openModalType: null
            }));
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
            setCourseValues({ ...courseValues, courseCode: '', courseName: '' });
        }
        closeModal('course');
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
            createTask({ 
                taskName: taskName, 
                dueDate: dueDate,
                priority: priorityLevel,
                course: courses.filter(course => course._id === taskCourseId)[0],
                user: user 
            })
                .then(data => {
                    if (data.error) {
                        // do we want to have loading and success states?
                    } else {
                        setTasks([...tasks, data.data]);
                    }
                })
                .catch();
            setTaskValues({ ...taskValues, 
                taskCourseId: '',
                priorityLevel: '',
                taskName: '',
                dueDate: '',
            }); 
        }
        closeModal('task');
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
                courseValues={courseValues}
                handleInputChange={handleInputChange}
                closeModal={closeModal}
                handleAddCourse={handleAddCourse}
                courses={courses}
                handleDeleteCourse={handleDeleteCourse} />
            <TaskContainer
                courses={courses}
                tasks={tasks}
                openTaskModal={openTaskModal}
                handleInputChange={handleInputChange}
                closeModal={closeModal}
                handleAddTask={handleAddTask}
                handleDeleteTask={handleDeleteTask}
                taskValues={taskValues}
                handleTaskCheckboxChange={handleTaskCheckboxChange} />
        </div>
    );
};

export default LandingPage;
