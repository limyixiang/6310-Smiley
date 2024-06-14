import styles from "./landingPage.module.css";
import UpcomingTasksContainer from "./upcomingTasksContainer";
import AddTaskModal from "./addTaskModal";
import ProgressBar from "react-bootstrap/ProgressBar";

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

    const getPercentageCompleted = () => {
        const completedTasks = displayedTasks.filter(
            (task) => task.status === "Done"
        );
        return Math.round(
            (completedTasks.length / displayedTasks.length) * 100
        );
    };

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
                displayedTasks={displayedTasks}
                handleDeleteTask={handleDeleteTask}
                handleTaskCheckboxChange={handleTaskCheckboxChange}
                courseDescription={courseDescription}
                deadlineDescription={deadlineDescription}
            />
            <ProgressBar
                animated
                now={getPercentageCompleted()}
                variant="info"
                label={`${getPercentageCompleted()}%`}
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
