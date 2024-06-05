import { React, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { getTasksForCourse } from "../Backend";
import styles from "./coursePage.module.css";
import { deleteTask, completeTask, reverseCompleteTask } from "../Backend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function CoursePage() {
    const [tasks, setTasks] = useState([]);
    const [coursePageValues, setCoursePageValues] = useState({
        refresh: false,
        sortBy: "date",
    });

    const location = useLocation();
    const { user, course } = location.state;
    const { refresh, sortBy } = coursePageValues;

    useEffect(() => {
        console.log("Fetching data for course page");
        getTasksForCourse({ courseid: course._id })
            .then((data) => setTasks(data))
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
            <div className={styles.courseTasksList}>
                {tasks.map((task, index) => (
                    <div key={index} className={styles.courseTaskItem}>
                        <input
                            name="task-checkbox"
                            className="task-checkbox"
                            type="checkbox"
                            onChange={() => handleTaskCheckboxChange(task)}
                            checked={task.status === "Done"}
                        />
                        <span
                            className="task-item-description"
                            style={{
                                textDecoration:
                                    task.status === "Done"
                                        ? "line-through"
                                        : "none",
                            }}
                        >
                            {task.taskName}
                            <br />
                            {deadlineDescription(task) +
                                "Priority: " +
                                task.priority}
                        </span>
                        <FontAwesomeIcon
                            className="trashcan task-trashcan"
                            icon={faTrashCan}
                            onClick={() => handleDeleteTask(task._id)}
                        />
                    </div>
                ))}
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
