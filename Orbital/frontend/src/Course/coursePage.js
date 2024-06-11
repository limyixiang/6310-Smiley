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

    function deadlineDescription(task) {
        return task.dueDate == null
            ? ""
            : "Due: " + new Date(task.dueDate).toDateString() + " ";
    }

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
