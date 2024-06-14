import styles from "./landingPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function UpcomingTasksContainer({
    displayedTasks,
    handleDeleteTask,
    handleTaskCheckboxChange,
    courseDescription,
    deadlineDescription,
}) {
    return (
        <div className={styles.upcomingTasksContainer}>
            <div className={styles.taskList}>
                {displayedTasks.map((task, index) => (
                    <div className={styles.taskRow} key={index}>
                        <input
                            name="task-checkbox"
                            className={styles.taskCheckbox}
                            type="checkbox"
                            onChange={() => handleTaskCheckboxChange(task)}
                            checked={task.status === "Done"}
                        />
                        <span
                            className={styles.taskItem}
                            style={{
                                textDecoration:
                                    task.status === "Done"
                                        ? "line-through"
                                        : "none",
                            }}
                        >
                            {courseDescription(task.course) +
                                " - " +
                                task.taskName}
                            <br />
                            {deadlineDescription(task.dueDate) +
                                "Priority: " +
                                task.priority}
                        </span>
                        <FontAwesomeIcon
                            className={`${styles.trashcan} ${styles.taskTrashcan}`}
                            icon={faTrashCan}
                            onClick={() => handleDeleteTask(task._id)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UpcomingTasksContainer;
