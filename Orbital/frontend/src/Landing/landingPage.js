import { React, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./landingPage.css";
import {
    createCourse,
    createTask,
    getCourses,
    completeTask,
    getTasksForUser,
    reverseCompleteTask,
    deleteCourse,
    deleteTask,
} from "../Backend";
import CourseContainer from "./courseContainer";
import TaskContainer from "./taskContainer";

function LandingPage() {
    const [refresh, setRefresh] = useState(false);
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

    // Fetches courses and tasks for the user everytime a submit is made
    useEffect(() => {
        console.log("Fetching data");
        getCourses({ userid: user._id })
            .then((data) => setCourses(data))
            .then(() =>
                getTasksForUser({ userid: user._id }).then((data) =>
                    setTasks(data)
                )
            )
            .then(() => setRefresh(false))
            .catch((err) => console.error("Error fetching data:", err));
    }, [refresh, user._id]);

    // Displays error message if there's any
    const errorMessage = () => {
        return (
            <div
                className="error-message"
                style={{ display: err ? "" : "none", color: "red" }}
            >
                {err}
            </div>
        );
    };

    // Handles changes in the input fields
    const handleInputChange = (type, name) => (event) => {
        type === "course"
            ? setCourseValues({
                  ...courseValues,
                  error: false,
                  [name]: event.target.value,
              })
            : setTaskValues({
                  ...taskValues,
                  error: false,
                  [name]: event.target.value,
              });
    };

    // Handles open and closing of course popup
    const openCourseModal = () => {
        setCourseValues((courseValues) => ({
            ...courseValues,
            openModalType: "course",
        }));
    };

    // Handles open and closing of task popup
    const openTaskModal = () => {
        setTaskValues((taskValues) => ({
            ...taskValues,
            openModalType: "task",
        }));
    };

    // Closes the popup and reset all values
    const closeModal = (modalType) => {
        modalType === "course"
            ? setCourseValues((courseValues) => ({
                  ...courseValues,
                  courseCode: "",
                  courseName: "",
                  openModalType: null,
              }))
            : setTaskValues((taskValues) => ({
                  ...taskValues,
                  taskCourseId: "",
                  priorityLevel: "",
                  taskName: "",
                  dueDate: "",
                  openModalType: null,
              }));
        setErr("");
        setRefresh(true);
    };

    // Course inputted shown below
    const handleAddCourse = async () => {
        if (courseCode.trim() === "") {
            setErr("Invalid course code.");
            return;
        } else if (courseName.trim() === "") {
            setErr("Invalid course name.");
            return;
        } else {
            createCourse({
                courseName: courseName,
                courseCode: courseCode,
                userid: user._id,
            })
                .then((data) => {
                    if (data.error) {
                        setErr(data.error);
                    } else {
                        setCourses([...courses, data.data]);
                        closeModal("course");
                    }
                })
                .catch();
        }
    };

    // Course deleted shown below
    const handleDeleteCourse = async (event, courseId) => {
        event.preventDefault();
        deleteCourse(courseId)
            .then((data) => {
                if (data.error) {
                } else {
                    setCourses(data.data);
                }
            })
            .then(() => setRefresh(true))
            .catch();
    };

    // Task inputted shown below
    const handleAddTask = async (event) => {
        event.preventDefault();
        // console.log(dueDate);
        if (taskCourseId === "") {
            setErr("Please select a course.");
            return;
        } else if (priorityLevel === "") {
            setErr("Please select a priority level.");
            return;
        } else if (taskName.trim() === "") {
            setErr("Invalid task name.");
            return;
        } else if (dueDate === "") {
            setErr("Please select a due date.");
            return;
            // Check if due date is in the past
            // Since dueDate is at 0000H for now, we can compare with Date.now() - 1 without any issues to allow the user to add
        } else if (
            new Date(dueDate) < new Date(Date.now()).setHours(0, 0, 0, 0)
        ) {
            setErr("Invalid date! Please select a future date.");
        } else {
            createTask({
                taskName: taskName.trim(),
                dueDate: dueDate,
                priority: priorityLevel,
                courseid: courses.filter(
                    (course) => course._id === taskCourseId
                )[0]._id,
                userid: user._id,
            })
                .then((data) => {
                    if (data.error) {
                        setErr(data.error);
                    } else {
                        setTasks([...tasks, data.data]);
                        closeModal("task");
                    }
                })
                .catch();
        }
    };

    // Task deleted shown below
    const handleDeleteTask = async (taskId) => {
        deleteTask(taskId)
            .then((data) => {
                if (data.error) {
                } else {
                    setTasks(data.data);
                }
            })
            .then(() => setRefresh(true))
            .catch();
    };

    // Tick off box task strikethroughs
    const handleTaskCheckboxChange = async (task) => {
        console.log(task);
        if (task.status === "Done") {
            reverseCompleteTask({ taskid: task._id }).then(() =>
                setRefresh(true)
            );
        } else {
            completeTask({ taskid: task._id }).then(() => setRefresh(true));
        }
    };

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
                errorMessage={errorMessage}
            />
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
                errorMessage={errorMessage}
            />
        </div>
    );
}

export default LandingPage;
