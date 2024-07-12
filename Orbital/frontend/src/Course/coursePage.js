import { React, useState, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./coursePage.module.css";
import {
    getTasksByDateForCourse,
    getTasksByPriorityForCourse,
    deleteTask,
    completeTask,
    reverseCompleteTask,
    getColorTheme,
} from "../Backend";
import CourseTasksList from "./courseTasksList";
import CourseCompletedTasks from "./courseCompletedTasks";

function CoursePage() {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState({
        completedTasks: [],
        incompleteTasks: [],
    });
    const [coursePageValues, setCoursePageValues] = useState({
        refresh: false,
        sortBy: "date",
    });

    const location = useLocation();
    const { user, course } = location.state;
    const { completedTasks, incompleteTasks } = tasks;
    const { refresh, sortBy } = coursePageValues;

    const themes = useMemo(
        () => ({
            light: {
                "--mainText-color": "rgb(0, 0, 0)",
                "--pageBackground-color": "rgb(255, 255, 255)",
                "--elementBackground-color": "rgb(255, 255, 255)",
                "--border-color": "rgba(153, 153, 153, 0.4)",
                "--hover-color": "rgb(217, 217, 217)",
                "--focus-color": "rgb(211, 211, 211)",
            },
            dark: {
                "--mainText-color": "rgb(187, 187, 187)",
                "--pageBackground-color": "rgb(0, 0, 0)",
                "--elementBackground-color": "rgb(23, 23, 23)",
                "--border-color": "rgba(212, 212, 212, 0.4)",
                "--hover-color": "grey",
                "--focus-color": "rgb(67, 67, 67)",
            },
            default: {
                "--mainText-color": "rgb(0, 0, 66)",
                "--pageBackground-color": "#d8f5fd",
                "--elementBackground-color": "rgb(248, 254, 255)",
                "--border-color": "rgba(71, 180, 230, 0.4)",
                "--hover-color": "#c5edff",
                "--focus-color": "rgba(118, 198, 235, 0.4)",
            },
            green: {
                "--mainText-color": "rgb(0, 66, 17)",
                "--pageBackground-color": "rgb(199, 228, 207)",
                "--elementBackground-color": "rgb(241, 255, 245)",
                "--border-color": "rgba(0, 160, 35, 0.4)",
                "--hover-color": "rgb(210, 246, 219)",
                "--focus-color": "rgba(0, 178, 118, 0.483)",
            },
            pink: {
                "--mainText-color": "rgb(51, 0, 48)",
                "--pageBackground-color": "#fff2fa",
                "--elementBackground-color": "rgb(255, 254, 255)",
                "--border-color": "rgba(255, 139, 249, 0.4)",
                "--hover-color": "#fee1ff",
                "--focus-color": "rgba(235, 149, 224, 0.4)",
            },
        }),
        []
    );

    useEffect(() => {
        console.log("Fetching data for course page");
        (sortBy === "date"
            ? getTasksByDateForCourse({ courseid: course._id })
            : getTasksByPriorityForCourse({ courseid: course._id })
        )
            .then((data) => {
                const completedTasks = [];
                const incompleteTasks = [];
                data.forEach((task) => {
                    if (task.status === "Done") {
                        completedTasks.push(task);
                    } else {
                        incompleteTasks.push(task);
                    }
                });
                setTasks({
                    completedTasks: completedTasks,
                    incompleteTasks: incompleteTasks,
                });
            })
            .then(() =>
                setCoursePageValues((prevValues) => ({
                    ...prevValues,
                    refresh: false,
                }))
            )
            .catch((err) => console.error("Error fetching data:", err));

        const setThemeColor = (themeName) => {
            const selectedTheme = themes[themeName];
            for (const key in selectedTheme) {
                document.documentElement.style.setProperty(
                    key,
                    selectedTheme[key]
                );
            }
        };

        getColorTheme({ userid: user._id })
            .then((data) => {
                setThemeColor(data.data);
            })
            .catch((err) => console.error("Error fetching data:", err));
    }, [refresh, sortBy, course._id, themes, user._id]);

    // Task deleted shown below
    const handleDeleteTask = async (taskId) => {
        deleteTask(taskId)
            .then(() =>
                setCoursePageValues({ ...coursePageValues, refresh: true })
            )
            .catch();
    };

    // Tick off box task strikethroughs
    const handleTaskCheckboxChange = async (task) => {
        console.log(task);
        if (task.status === "Done") {
            reverseCompleteTask({ taskid: task._id }).then(() =>
                setCoursePageValues({ ...coursePageValues, refresh: true })
            );
        } else {
            completeTask({ taskid: task._id }).then(() =>
                setCoursePageValues({ ...coursePageValues, refresh: true })
            );
        }
    };

    const handleSortByChange = async (event) => {
        setCoursePageValues({
            ...coursePageValues,
            sortBy: event.target.value,
        });
    };

    const deadlineDescription = (task) => {
        return task.dueDate == null
            ? ""
            : "Due: " + new Date(task.dueDate).toDateString() + " ";
    };

    const getPercentageSemCompleted = () => {
        const completed = completedTasks.length;
        const incomplete = incompleteTasks.length;
        const total = completed + incomplete;
        if (total === 0) return 0;
        return Math.round((completed / total) * 100);
    };

    const getPercentageWeekCompleted = () => {
        // Current Date
        const now = new Date();
        // Get the first day of the week (assuming Monday is the first day of the week)
        const firstDayOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay() + 1)
        );
        // Get the last day of the week (assuming Sunday is the last day of the week)
        const lastDayOfWeek = new Date(
            now.setDate(now.getDate() - now.getDay() + 7)
        );
        // Filter tasks that are due within the current week
        const currentWeekCompletedTasks = completedTasks.filter((task) => {
            const dueDate = new Date(task.dueDate);
            return dueDate >= firstDayOfWeek && dueDate <= lastDayOfWeek;
        }).length;
        const currentWeekIncompleteTasks = incompleteTasks.filter((task) => {
            const dueDate = new Date(task.dueDate);
            return dueDate >= firstDayOfWeek && dueDate <= lastDayOfWeek;
        }).length;
        const totalCurrentWeekTasks =
            currentWeekCompletedTasks + currentWeekIncompleteTasks;
        if (totalCurrentWeekTasks === 0) return 0;
        return Math.round(
            (currentWeekCompletedTasks / totalCurrentWeekTasks) * 100
        );
    };

    const ProgressBar = ({ now, label }) => {
        return (
            <div className={styles.progressContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${now}%` }}
                >
                    <span className={styles.progressLabel}>{label}</span>
                </div>
            </div>
        );
    };

    const onLandingPage = () => {
        navigate("/landingpage", { state: { user } });
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.courseHeader}>
                {course.courseCode + " " + course.courseName}
            </div>
            <div className={styles.courseTasksContainer}>
                <div className={styles.sortByDropdownContainer}>
                    <label htmlFor="courseTasksSortBy">Sort By:</label>
                    <select
                        id="courseTasksSortBy"
                        value={sortBy}
                        onChange={handleSortByChange}
                    >
                        <option name="sortByOption" value="date">
                            Nearest Deadline
                        </option>
                        <option name="sortByOption" value="priorityLevel">
                            Priority Level
                        </option>
                    </select>
                </div>
                <div className={styles.upcomingCompletedContainer}>
                    <CourseTasksList
                        incompleteTasks={incompleteTasks}
                        handleDeleteTask={handleDeleteTask}
                        handleTaskCheckboxChange={handleTaskCheckboxChange}
                        deadlineDescription={deadlineDescription}
                    />
                    <CourseCompletedTasks
                        completedTasks={completedTasks}
                        handleDeleteTask={handleDeleteTask}
                        handleTaskCheckboxChange={handleTaskCheckboxChange}
                        deadlineDescription={deadlineDescription}
                    />
                </div>
            </div>
            <div className={styles.progressBarContainer}>
                <div className={styles.courseProgressBarContainer}>
                    <p>Percentage of tasks completed for the week:</p>
                    <ProgressBar
                        now={getPercentageWeekCompleted()}
                        label={`${getPercentageWeekCompleted()}%`}
                    />
                </div>
                <div className={styles.courseProgressBarContainer}>
                    <p>Percentage of tasks completed for the semester:</p>
                    <ProgressBar
                        now={getPercentageSemCompleted()}
                        label={`${getPercentageSemCompleted()}%`}
                    />
                </div>
            </div>
            <div className={styles.linkGroup}>
                <button onClick={onLandingPage}>Back to Landing</button>
            </div>
        </div>
    );
}

export default CoursePage;
