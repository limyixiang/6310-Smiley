import Modal from "react-modal";
import { React, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import styles from "./landingPage.module.css";

Modal.setAppElement("#root");

function AddCourseModal({
    courseValues,
    courseModalTasks,
    temporaryCourses,
    defaultTasks,
    handleInputChange,
    handleCourseModalInputChange,
    closeModal,
    handleAddCourse,
    errorMessage,
    handleAddToTemporaryCourseArray,
    handleOnDragEnd,
}) {
    const days = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    const frequencies = ["Daily", "Weekly", "Bi-Weekly", "Monthly"];
    const defaultTaskNames = defaultTasks.map((task) => task.taskName);
    const getEntryNos = (freqArray, index) => {
        return freqArray[index] === "Weekly"
            ? Array.from({ length: 13 }, (_, index) => index + 1)
            : freqArray[index] === "Bi-Weekly"
            ? Array.from({ length: 7 }, (_, index) => index + 1)
            : freqArray[index] === "Monthly"
            ? Array.from({ length: 4 }, (_, index) => index + 1)
            : [];
    };
    /*for modal to have two pages*/
    const [currentPage, setCurrentPage] = useState(1);
    const nextPage = () => {
        setCurrentPage(currentPage + 1);
        handleAddToTemporaryCourseArray();
    };
    const prevPage = () => {
        setCurrentPage(currentPage - 1);
    };

    return (
        <Modal
            isOpen={courseValues.openModalType === "course"}
            onRequestClose={closeModal}
            contentLabel="Add-a-course-modal"
            className={styles.addACoursePopup}
            overlayClassName={styles.backdropCoursePopup}
        >
            {currentPage === 1 && (
                <div>
                    <h2>Please provide some details of the course.</h2>
                    {/* Input Course Code text box */}
                    <div className={styles.formGroup}>
                        <label htmlFor="addCourseCode">Course Code</label>
                        <input
                            id="addCourseCode"
                            type="text"
                            value={courseValues.courseCode}
                            onChange={(event) => {
                                handleInputChange(
                                    "course",
                                    "courseCode"
                                )(event);
                            }}
                            placeholder="Please enter a Course Code"
                        />
                    </div>
                    {/* Input Course Name text box */}
                    <div className={styles.formGroup}>
                        <label htmlFor="addCourseName">Course Name</label>
                        <input
                            id="addCourseName"
                            type="text"
                            value={courseValues.courseName}
                            onChange={(event) => {
                                handleInputChange(
                                    "course",
                                    "courseName"
                                )(event);
                            }}
                            placeholder="Please enter a Course Name"
                        />
                    </div>
                    {/* Select repeated reminders dropdown */}
                    <div className={styles.selectReminderFrequency}>
                        <h3>Turn on Repeated Reminders:</h3>
                        {defaultTaskNames.map((reminder, index) => (
                            <div
                                key={reminder}
                                className={styles.reminderGroup}
                            >
                                <div className={styles.checkboxContainer}>
                                    <input
                                        type="checkbox"
                                        value={
                                            courseModalTasks.isSelected[
                                                index
                                            ] || false
                                        }
                                        onChange={handleCourseModalInputChange(
                                            "isSelected",
                                            index
                                        )}
                                        checked={
                                            courseModalTasks.isSelected[
                                                index
                                            ] || false
                                        }
                                    />
                                    <label>{reminder}</label>
                                </div>
                                <div className={styles.dropdownContainer}>
                                    <select
                                        name="daySelect"
                                        value={
                                            courseModalTasks.reminderDay[
                                                index
                                            ] || ""
                                        }
                                        onChange={handleCourseModalInputChange(
                                            "reminderDay",
                                            index
                                        )}
                                    >
                                        <option value="" disabled hidden>
                                            Day
                                        </option>
                                        {days.map((day) => (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        name="frequencySelect"
                                        value={
                                            courseModalTasks.reminderFrequency[
                                                index
                                            ] || ""
                                        }
                                        onChange={handleCourseModalInputChange(
                                            "reminderFrequency",
                                            index
                                        )}
                                    >
                                        <option value="" disabled hidden>
                                            Frequency
                                        </option>
                                        {frequencies.map((frequency) => (
                                            <option
                                                key={frequency}
                                                value={frequency}
                                            >
                                                {frequency}
                                            </option>
                                        ))}
                                    </select>
                                    <select
                                        name="numberOfRepeatsSelect"
                                        value={
                                            courseModalTasks
                                                .reminderNumberOfRepeats[
                                                index
                                            ] || ""
                                        }
                                        onChange={handleCourseModalInputChange(
                                            "reminderNumberOfRepeats",
                                            index
                                        )}
                                    >
                                        <option value="" disabled hidden>
                                            Entry No.
                                        </option>
                                        {getEntryNos(
                                            courseModalTasks.reminderFrequency,
                                            index
                                        ).map((entryNo) => (
                                            <option
                                                key={entryNo}
                                                value={entryNo}
                                            >
                                                {entryNo}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                        <div key="Others" className={styles.reminderGroup}>
                            <div className={styles.checkboxContainer}>
                                <input
                                    type="checkbox"
                                    value={
                                        courseModalTasks.isSelected[
                                            defaultTasks.length
                                        ] || false
                                    }
                                    onChange={handleCourseModalInputChange(
                                        "isSelected",
                                        defaultTasks.length
                                    )}
                                    checked={
                                        courseModalTasks.isSelected[
                                            defaultTasks.length
                                        ] || false
                                    }
                                />
                                <label>Others</label>
                            </div>
                            <div className={styles.dropdownContainer}>
                                <input
                                    type="text"
                                    name="taskName"
                                    placeholder="Name of Task"
                                    value={
                                        courseModalTasks.recurringTaskName[
                                            defaultTasks.length
                                        ] || ""
                                    }
                                    onChange={handleCourseModalInputChange(
                                        "recurringTaskName",
                                        defaultTasks.length
                                    )}
                                />
                                <select
                                    name="daySelect"
                                    value={
                                        courseModalTasks.reminderDay[
                                            defaultTasks.length
                                        ] || ""
                                    }
                                    onChange={handleCourseModalInputChange(
                                        "reminderDay",
                                        defaultTasks.length
                                    )}
                                >
                                    <option value="" disabled hidden>
                                        Day
                                    </option>
                                    {days.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="frequencySelect"
                                    value={
                                        courseModalTasks.reminderFrequency[
                                            defaultTasks.length
                                        ] || ""
                                    }
                                    onChange={handleCourseModalInputChange(
                                        "reminderFrequency",
                                        defaultTasks.length
                                    )}
                                >
                                    <option value="" disabled hidden>
                                        Frequency
                                    </option>
                                    {frequencies.map((frequency) => (
                                        <option
                                            key={frequency}
                                            value={frequency}
                                        >
                                            {frequency}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="customTaskPriorityLevel"
                                    value={
                                        courseModalTasks
                                            .recurringTaskPriorityLevel[
                                            defaultTasks.length
                                        ] || ""
                                    }
                                    onChange={handleCourseModalInputChange(
                                        "recurringTaskPriorityLevel",
                                        defaultTasks.length
                                    )}
                                >
                                    <option value="" disabled hidden>
                                        Priority
                                    </option>
                                    {["Low", "High"].map((priority) => (
                                        <option key={priority} value={priority}>
                                            {priority}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    name="numberOfRepeatsSelect"
                                    value={
                                        courseModalTasks
                                            .reminderNumberOfRepeats[
                                            defaultTasks.length
                                        ] || ""
                                    }
                                    onChange={handleCourseModalInputChange(
                                        "reminderNumberOfRepeats",
                                        defaultTasks.length
                                    )}
                                >
                                    <option value="" disabled hidden>
                                        Entry No.
                                    </option>
                                    {Array.from(
                                        { length: 13 },
                                        (_, index) => index + 1
                                    ).map((entryNo) => (
                                        <option key={entryNo} value={entryNo}>
                                            {entryNo}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    {errorMessage()}
                    <button onClick={nextPage}>Next</button>
                    <button onClick={() => closeModal("course")}>Close</button>
                </div>
            )}

            {currentPage === 2 && (
                <div>
                    <h2>
                        Drag and drop to order the priority of your courses.
                    </h2>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <ul
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    style={{
                                        listStyleType: "none",
                                        padding: "0",
                                    }}
                                >
                                    {temporaryCourses.map((course, index) => (
                                        <Draggable
                                            key={course._id}
                                            draggableId={course._id.toString()}
                                            index={index}
                                        >
                                            {(provided, snapshot) => (
                                                <li
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={
                                                        styles.courseDraggable
                                                    }
                                                >
                                                    {course.courseCode +
                                                        " " +
                                                        course.courseName}
                                                </li>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </ul>
                            )}
                        </Droppable>
                    </DragDropContext>
                    <button onClick={prevPage}>Previous</button>
                    <button
                        onClick={() => {
                            handleAddCourse();
                            prevPage();
                        }}
                    >
                        Submit
                    </button>
                    <button
                        onClick={() => {
                            prevPage();
                            closeModal("course");
                        }}
                    >
                        Close
                    </button>
                </div>
            )}
        </Modal>
    );
}

export default AddCourseModal;
