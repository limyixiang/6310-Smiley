import styles from "./landingPage.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function UpcomingTasksContainer({
    viewTasks,
    tasks,
    handleDeleteTask,
    handleTaskCheckboxChange,
    courseDescription,
    deadlineDescription,
}) {
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
    const currentWeekTasks = tasks.filter((task) => {
        const dueDate = new Date(task.dueDate);
        return dueDate >= firstDayOfWeek && dueDate <= lastDayOfWeek;
    });
    // Filter tasks that are due the next week
    const nextWeekTasks = tasks.filter((task) => {
        const dueDate = new Date(task.dueDate);
        const nextWeekLastDay = new Date(lastDayOfWeek);
        nextWeekLastDay.setDate(nextWeekLastDay.getDate() + 7);
        return dueDate >= lastDayOfWeek && dueDate <= nextWeekLastDay;
    });

    const displayedTasks =
        viewTasks === "thisWeek" ? currentWeekTasks : nextWeekTasks;

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
