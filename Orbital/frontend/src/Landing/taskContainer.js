import "./landingPage.css";
import UpcomingTasksContainer from "./upcomingTasksContainer";
import AddTaskModal from "./addTaskModal";

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
            <UpcomingTasksContainer
                tasks={tasks}
                handleDeleteTask={handleDeleteTask}
                handleTaskCheckboxChange={handleTaskCheckboxChange}
                courseDescription={courseDescription}
                deadlineDescription={deadlineDescription}
            />
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
        </div>
    );
}

export default TaskContainer;
