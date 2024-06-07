import styles from "./coursePage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function CourseTasksList({
    tasks,
    sortBy,
    handleSortByChange,
    handleDeleteTask,
    handleTaskCheckboxChange,
    deadlineDescription,
}) {
    return (
        <div className={styles.courseTasksList}>
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
            {tasks.map((task, index) => (
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
                            textDecoration:
                                task.status === "Done"
                                    ? "line-through"
                                    : "none",
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

export default CourseTasksList;
