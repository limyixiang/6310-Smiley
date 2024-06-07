import "./landingPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function UpcomingTasksContainer({
    tasks,
    handleDeleteTask,
    handleTaskCheckboxChange,
    courseDescription,
    deadlineDescription,
}) {
    return (
        <div className="upcoming-tasks-container">
            <div className="tasks-list">
                {tasks.map((task, index) => (
                    <div className="task-row" key={index}>
                        <input
                            name="task-checkbox"
                            className="task-checkbox"
                            type="checkbox"
                            onChange={() => handleTaskCheckboxChange(task)}
                            checked={task.status === "Done"}
                        />
                        <span
                            className="task-item"
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
                            className="trashcan task-trashcan"
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
