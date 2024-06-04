import "./landingPage.css";
import AddTaskModal from "./addTaskModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function TaskContainer({
    courses,
    tasks,
    openTaskModal,
    handleInputChange,
    closeModal,
    handleAddTask,
    handleDeleteTask,
    taskValues,
    landingPageValues,
    handleTaskCheckboxChange,
    errorMessage,
}) {
    function courseDescription(courseId) {
        const course = courses.filter((course) => course._id === courseId)[0];
        return course ? course.courseCode + " " + course.courseName : "";
    }

    function deadlineDescription(deadline) {
        return deadline == null
            ? ""
            : "Due: " + new Date(deadline).toDateString() + " ";
    }

    return (
        <div className="tasks-container">
            <h2>Upcoming Deadlines</h2>
            <select
                id="sortBy"
                value={landingPageValues.sortBy}
                onChange={handleInputChange("landingPageValues", "sortBy")}
            >
                <option name="sortByOption" value="date">
                    Nearest Deadline
                </option>
                <option name="sortByOption" value="priorityLevel">
                    Priority Level
                </option>
            </select>
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
            <button className="add-a-task-button" onClick={openTaskModal}>
                Add a task
            </button>
            <AddTaskModal
                courses={courses}
                taskValues={taskValues}
                handleInputChange={handleInputChange}
                closeModal={closeModal}
                handleAddTask={handleAddTask}
                errorMessage={errorMessage}
            />
            <center>
                <p className="landing-to-dashboard">
                    <b>
                        <a href="/">Back to Dashboard</a>
                    </b>
                </p>
            </center>
        </div>
    );
}

export default TaskContainer;
