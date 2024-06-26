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
        <div className={styles.tasksList}>
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
                        <div className={styles.taskDescription}>
                            {courseDescription(task.course) +
                                " - " +
                                task.taskName}
                        </div>
                        <div className={styles.taskDeadlinePriority}>
                            {deadlineDescription(task.dueDate) +
                                ", Priority: " +
                                task.priority}
                        </div>
                    </span>
                    <FontAwesomeIcon
                        className={`${styles.trashcan} ${styles.taskTrashcan}`}
                        icon={faTrashCan}
                        onClick={() => handleDeleteTask(task._id)}
                    />
                </div>
            ))}
        </div>
    );
}

export default UpcomingTasksContainer;
