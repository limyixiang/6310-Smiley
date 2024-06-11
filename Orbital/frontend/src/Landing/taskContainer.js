import styles from "./landingPage.module.css";
import UpcomingTasksContainer from "./upcomingTasksContainer";
import AddTaskModal from "./addTaskModal";

function TaskContainer({
    viewTasks,
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
        <div className={styles.TaskContainer}>
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
            <select
                id="viewTasks"
                value={landingPageValues.viewTasks}
                onChange={handleInputChange("landingPageValues", "viewTasks")}
            >
                <option name="viewTasksOption" value="thisWeek">
                    This Week
                </option>
                <option name="viewTasksOption" value="nextWeek">
                    Next Week
                </option>
            </select>
            <UpcomingTasksContainer
                viewTasks={viewTasks}
                tasks={tasks}
                handleDeleteTask={handleDeleteTask}
                handleTaskCheckboxChange={handleTaskCheckboxChange}
                courseDescription={courseDescription}
                deadlineDescription={deadlineDescription}
            />
            <button className={styles.buttonGroup} onClick={openTaskModal}>
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
