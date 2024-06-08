import Modal from "react-modal";
import { React, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./landingPage.css";

Modal.setAppElement("#root");

function AddCourseModal({
    courseValues,
    temporaryCourses,
    handleInputChange,
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
            className="add-a-course-popup"
            overlayClassName="backdrop-course-popup"
        >
            {currentPage === 1 && (
                <div className="course-popup1">
                    <h2>Please provide some details of the course.</h2>
                    {/* Input Course Code text box */}
                    <div className="form-group">
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
                    <div className="form-group">
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
                    <div className="select-reminder-frequency">
                        <h3>Turn on Repeated Reminders:</h3>
                        {["Tutorial", "Lecture", "Quiz"].map((reminder) => (
                            <div key={reminder} className="reminder-group">
                                <div className="checkbox-container">
                                    <input type="checkbox" />
                                    <label>{reminder}</label>
                                </div>
                                <div className="dropdown-container">
                                    <select defaultValue="">
                                        <option value="" disabled hidden>
                                            Day
                                        </option>
                                        {days.map((day) => (
                                            <option key={day} value={day}>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                    <select defaultValue="">
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
                                    <select defaultValue="">
                                        <option value="" disabled hidden>
                                            Entry No.
                                        </option>
                                        {Array.from(
                                            { length: 13 },
                                            (_, index) => index + 1
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
                        <div key="Others" className="reminder-group">
                            <div className="checkbox-container">
                                <input type="checkbox" />
                                <label>Others</label>
                            </div>
                            <div className="dropdown-container">
                                <input
                                    type="text"
                                    name="taskName"
                                    placeholder="Name of Task"
                                />
                                <select defaultValue="">
                                    <option value="" disabled hidden>
                                        Day
                                    </option>
                                    {days.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                                <select defaultValue="">
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
                                <select defaultValue="">
                                    <option value="" disabled hidden>
                                        Priority
                                    </option>
                                    {["Low", "High"].map((priority) => (
                                        <option key={priority} value={priority}>
                                            {priority}
                                        </option>
                                    ))}
                                </select>
                                <select defaultValue="">
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
                <div className="course-popup2">
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
                                                    className="course-draggable"
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
