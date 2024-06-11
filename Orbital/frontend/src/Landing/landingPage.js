import { React, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./landingPage.module.css";
import {
    createCourse,
    createTask,
    getCourses,
    completeTask,
    getTasksByDateForUser,
    getTasksByPriorityForUser,
    reverseCompleteTask,
    deleteCourse,
    deleteTask,
} from "../Backend";
import CourseContainer from "./courseContainer";
import TaskContainer from "./taskContainer";

function LandingPage() {
    const [landingPageValues, setLandingPageValues] = useState({
        refresh: false,
        sortBy: "date",
    });

    const [err, setErr] = useState("");

    const [courseValues, setCourseValues] = useState({
        openModalType: null,
        courseName: "",
        courseCode: "",
    });

    const defaultTasks = [
        { taskName: "Tutorial", taskPriority: "Low" },
        { taskName: "Lecture", taskPriority: "Low" },
        { taskName: "Quiz", taskPriority: "High" },
    ];

    const [courseModalTasks, setCourseModalTasks] = useState({
        isSelected: [],
        reminderDay: [],
        reminderFrequency: [],
        reminderNumberOfRepeats: [],
        recurringTaskName: defaultTasks.map((task) => task.taskName),
        recurringTaskPriorityLevel: defaultTasks.map(
            (task) => task.taskPriority
        ),
    });

    // console.log(courseModalTasks);

    const [taskValues, setTaskValues] = useState({
        openModalType: null,
        taskCourseId: "",
        priorityLevel: "",
        taskName: "",
        dueDate: "",
    });

    const [temporaryCourses, setTemporaryCourses] = useState([]);

    // Destructuring values from the state
    const { refresh, sortBy } = landingPageValues;
    const { courseName, courseCode } = courseValues;
    const {
        isSelected,
        reminderDay,
        reminderFrequency,
        reminderNumberOfRepeats,
        recurringTaskName,
        recurringTaskPriorityLevel,
    } = courseModalTasks;
    const { taskCourseId, priorityLevel, taskName, dueDate } = taskValues;
    const [courses, setCourses] = useState([]);
    const [tasks, setTasks] = useState([]);

    const location = useLocation();
    const { user } = location.state;

    // Fetches courses and tasks for the user everytime a submit is made
    useEffect(() => {
        console.log("Fetching data");
        getCourses({ userid: user._id })
            .then((data) => {
                setCourses(data);
            })
            .then(() =>
                sortBy === "date"
                    ? getTasksByDateForUser({ userid: user._id }).then((data) =>
                          setTasks(rearrangeTasks(data))
                      )
                    : getTasksByPriorityForUser({ userid: user._id }).then(
                          (data) => setTasks(rearrangeTasks(data))
                      )
            )
            .then(() => {
                setLandingPageValues((prevValues) => ({
                    ...prevValues,
                    refresh: false,
                }));
                setTemporaryCourses([]);
            })
            .catch((err) => console.error("Error fetching data:", err));
    }, [refresh, user._id, sortBy]);

    // Displays error message if there's any
    const errorMessage = () => {
        return (
            <div
                className={styles.errorMessage}
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
            : type === "task"
            ? setTaskValues({
                  ...taskValues,
                  error: false,
                  [name]: event.target.value,
              })
            : setLandingPageValues({
                  ...landingPageValues,
                  [name]: event.target.value,
              });
    };

    // Handles changes in the Add Course Modal
    const handleCourseModalInputChange = (name, index) => (event) => {
        const newCourseModalTasks = { ...courseModalTasks };
        if (name === "isSelected") {
            newCourseModalTasks[name][index] = event.target.checked;
        } else {
            newCourseModalTasks[name][index] = event.target.value;
        }
        setCourseModalTasks(newCourseModalTasks);
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
        if (modalType === "course") {
            setCourseValues((courseValues) => ({
                ...courseValues,
                courseCode: "",
                courseName: "",
                openModalType: null,
            }));
            setCourseModalTasks({
                isSelected: [],
                reminderDay: [],
                reminderFrequency: [],
                reminderNumberOfRepeats: [],
                recurringTaskName: defaultTasks.map((task) => task.taskName),
                recurringTaskPriorityLevel: defaultTasks.map(
                    (task) => task.taskPriority
                ),
            });
        } else {
            setTaskValues((taskValues) => ({
                ...taskValues,
                taskCourseId: "",
                priorityLevel: "",
                taskName: "",
                dueDate: "",
                openModalType: null,
            }));
        }
        setErr("");
        setLandingPageValues({ ...landingPageValues, refresh: true });
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
            const numberOfTypesOfTasks = isSelected.length;
            const tasks = [];
            for (let i = 0; i < numberOfTypesOfTasks; i++) {
                if (isSelected[i]) {
                    if (
                        !reminderDay[i] ||
                        !reminderFrequency[i] ||
                        !reminderNumberOfRepeats[i] ||
                        !recurringTaskName[i] ||
                        recurringTaskName[i] === "" ||
                        !recurringTaskPriorityLevel[i]
                    ) {
                        setErr("One or more task fields are empty.");
                        return;
                    }
                    tasks.push({
                        reminderDay: reminderDay[i],
                        reminderFrequency: reminderFrequency[i],
                        reminderNumberOfRepeats: reminderNumberOfRepeats[i],
                        recurringTaskName: recurringTaskName[i],
                        recurringTaskPriorityLevel:
                            recurringTaskPriorityLevel[i],
                    });
                }
            }
            // console.log(tasks);
            console.log(temporaryCourses);
            const courseOrder = temporaryCourses.map((course) => course._id);
            createCourse({
                courseName: courseName,
                courseCode: courseCode,
                userid: user._id,
                tasks: tasks,
                courseOrder: courseOrder,
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
            .then(() =>
                setLandingPageValues({ ...landingPageValues, refresh: true })
            )
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
            .then(() =>
                setLandingPageValues({ ...landingPageValues, refresh: true })
            )
            .catch();
    };

    // Tick off box task strikethroughs
    const handleTaskCheckboxChange = async (task) => {
        console.log(task);
        if (task.status === "Done") {
            reverseCompleteTask({ taskid: task._id }).then(() =>
                setLandingPageValues({ ...landingPageValues, refresh: true })
            );
        } else {
            completeTask({ taskid: task._id }).then(() =>
                setLandingPageValues({ ...landingPageValues, refresh: true })
            );
        }
    };

    // Rearranges tasks such that completed tasks are at the bottom
    const rearrangeTasks = (tasks) => {
        const completedTasks = [];
        const incompleteTasks = [];
        tasks.forEach((task) => {
            if (task.status === "Done") {
                completedTasks.push(task);
            } else {
                incompleteTasks.push(task);
            }
        });
        const rearrangedTasks = [...incompleteTasks, ...completedTasks];
        return rearrangedTasks;
    };

    const getTemporaryCourseArray = () => {
        return courses.map((course) => ({
            _id: course._id,
            courseCode: course.courseCode,
            courseName: course.courseName,
        }));
    };

    const handleAddToTemporaryCourseArray = () => {
        // Check if both course code and course name are provided
        if (courseValues.courseCode && courseValues.courseName) {
            // Add courseValues to temporaryCourses array
            const tempArray = getTemporaryCourseArray();
            tempArray[courses.length] = {
                _id: "temp",
                courseCode: courseValues.courseCode,
                courseName: courseValues.courseName,
            };
            setTemporaryCourses(tempArray);
        } else if (temporaryCourses.length !== courses.length) {
            setTemporaryCourses(getTemporaryCourseArray());
        }
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const { source, destination } = result;
        // If item dropped in the same position, do nothing
        if (source.index === destination.index) {
            return;
        }
        const updatedCourses = Array.from(temporaryCourses);
        const [reorderedItem] = updatedCourses.splice(source.index, 1);
        updatedCourses.splice(destination.index, 0, reorderedItem);
        setTemporaryCourses(updatedCourses);
    };

    return (
        <div className={styles.mainContainer}>
            <CourseContainer
                user={user}
                courses={courses}
                courseValues={courseValues}
                courseModalTasks={courseModalTasks}
                temporaryCourses={temporaryCourses}
                defaultTasks={defaultTasks}
                openCourseModal={openCourseModal}
                handleInputChange={handleInputChange}
                handleCourseModalInputChange={handleCourseModalInputChange}
                closeModal={closeModal}
                handleAddCourse={handleAddCourse}
                handleDeleteCourse={handleDeleteCourse}
                errorMessage={errorMessage}
                handleAddToTemporaryCourseArray={
                    handleAddToTemporaryCourseArray
                }
                handleOnDragEnd={handleOnDragEnd}
            />
            <TaskContainer
                courses={courses}
                tasks={tasks}
                taskValues={taskValues}
                landingPageValues={landingPageValues}
                openTaskModal={openTaskModal}
                handleInputChange={handleInputChange}
                closeModal={closeModal}
                handleAddTask={handleAddTask}
                handleDeleteTask={handleDeleteTask}
                handleTaskCheckboxChange={handleTaskCheckboxChange}
                errorMessage={errorMessage}
            />
            <center>
                <p className={styles.linkGroup}>
                    <b>
                        <a href="/">Back to Dashboard</a>
                    </b>
                </p>
            </center>
        </div>
    );
}

export default LandingPage;
