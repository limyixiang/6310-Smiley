import { React, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import styles from "./coursePage.module.css";
import {
    getTasksByDateForCourse,
    getTasksByPriorityForCourse,
    deleteTask,
    completeTask,
    reverseCompleteTask,
} from "../Backend";
import CourseTasksList from "./courseTasksList";
import CourseCompletedTasks from "./courseCompletedTasks";

function CoursePage() {
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
    }, [refresh, sortBy, course._id]);

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

    return (
        <div className={styles.mainContainer}>
            <div className={styles.courseHeader}>
                {course.courseCode + " " + course.courseName}
            </div>
            <div className={styles.courseTasksContainer}>
                <div className={styles.sortByLabel}>
                    Sort By:
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
            <center>
                <p className={styles.courseToLandingPage}>
                    <b>
                        <Link to="/landingPage" state={{ user: user }}>
                            Back to Landing Page
                        </Link>
                    </b>
                </p>
            </center>
        </div>
    );
}

export default CoursePage;
