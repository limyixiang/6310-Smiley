import styles from "./coursePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function CourseTasksList({
    incompleteTasks,
    handleDeleteTask,
    handleTaskCheckboxChange,
    deadlineDescription,
}) {
    return (
        <div className={styles.courseTasksListUpcoming}>
            <h2 className={styles.courseTasksHeader}>UPCOMING DEADLINES</h2>
            <div className={styles.courseTasksList}>
                {incompleteTasks.map((task, index) => (
                    <div key={index} className={styles.courseTaskRow}>
                        <input
                            name="task-checkbox"
                            className={styles.courseTaskCheckbox}
                            type="checkbox"
                            onChange={() => handleTaskCheckboxChange(task)}
                            checked={task.status === "Done"}
                        />
                        <div className={styles.taskItem}>
                            <div className={styles.taskDescription}>
                                {task.taskName}
                            </div>
                            <div className={styles.taskDeadlinePriority}>
                                {deadlineDescription(task) +
                                    ", Priority: " +
                                    task.priority}
                            </div>
                        </div>
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

export default CourseTasksList;
