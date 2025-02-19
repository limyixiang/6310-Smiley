import Modal from "react-modal";
import styles from "./landingPage.module.css";

Modal.setAppElement("#root");

function AddTaskModal({
    courses,
    taskValues,
    handleInputChange,
    closeModal,
    handleAddTask,
    errorMessage,
}) {
    return (
        <Modal
            isOpen={taskValues.openModalType === "task"}
            onRequestClose={closeModal}
            contentLabel="Add-a-task-modal"
            className={styles.addATaskPopup}
            overlayClassName={styles.backdropTaskPopup}
        >
            <h2>PLEASE PROVIDE SOME DETAILS OF THE TASK:</h2>
            {/* Select a Course dropdown */}
            <div className={styles.dropdownContainer2}>
                <label htmlFor="courseSelect"> Select Course</label>
                <select
                    id="courseSelect"
                    value={taskValues.taskCourseId}
                    onChange={handleInputChange("task", "taskCourseId")}
                >
                    <option value="" disabled hidden>
                        Select Course
                    </option>
                    {courses.map((course, index) => (
                        <option
                            name="courseSelectOption"
                            key={index}
                            value={course._id}
                        >
                            {course.courseCode + " " + course.courseName}
                        </option>
                    ))}
                </select>
            </div>
            {/* Input task name text box */}
            <div className={styles.formGroup2}>
                <label htmlFor="taskName">Task Name</label>
                <input
                    id="taskName"
                    type="text"
                    value={taskValues.taskName}
                    onChange={handleInputChange("task", "taskName")}
                    placeholder="Please enter a Task Name"
                />
            </div>
            {/* Select Priority Level dropdown */}
            <div className={styles.dropdownContainer2}>
                <label htmlFor="priorityLevel">Select a Priority Level</label>
                <select
                    id="priorityLevel"
                    value={taskValues.priorityLevel}
                    onChange={handleInputChange("task", "priorityLevel")}
                >
                    <option value="" disabled hidden>
                        Select a Priority Level
                    </option>
                    <option value="High">High</option>
                    <option value="Low">Low</option>
                </select>
            </div>
            {/* Deadline date selector */}
            <div className={styles.deadlineGroup}>
                <label htmlFor="dueDate">Deadline</label>
                <input
                    id="dueDate"
                    type="date"
                    value={taskValues.dueDate}
                    onChange={handleInputChange("task", "dueDate")}
                />
            </div>
            {errorMessage()}
            <button onClick={handleAddTask}>Submit</button>
            <button onClick={() => closeModal("task")}>Close</button>
        </Modal>
    );
}

export default AddTaskModal;
