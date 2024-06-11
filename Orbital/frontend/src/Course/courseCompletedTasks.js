import styles from "./coursePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function CourseCompletedTasks({
    completedTasks,
    handleDeleteTask,
    handleTaskCheckboxChange,
    deadlineDescription,
}) {
    return (
        <div className={styles.courseTasksList}>
            Completed Tasks
            {completedTasks.map((task, index) => (
                <div key={index} className={styles.courseTaskItem}>
                    <input
                        name="task-checkbox"
                        className="task-checkbox"
                        type="checkbox"
                        onChange={() => handleTaskCheckboxChange(task)}
                        checked={task.status === "Done"}
                    />
                    <div
                        className={styles.taskItemDescriptor}
                        style={{
                            textDecoration: "line-through",
                        }}
                    >
                        <span>{task.taskName}</span>
                        <br />
                        <span className={styles.deadlineDescriptor}>
                            {deadlineDescription(task) +
                                "Priority: " +
                                task.priority}
                        </span>
                    </div>
                    <FontAwesomeIcon
                        className="trashcan task-trashcan"
                        icon={faTrashCan}
                        onClick={() => handleDeleteTask(task._id)}
                    />
                </div>
            ))}
        </div>
    );
}

export default CourseCompletedTasks;
