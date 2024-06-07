import Modal from "react-modal";
import { React, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import "./landingPage.css";

Modal.setAppElement("#root");

function AddCourseModal({
    courses,
    courseValues,
    handleInputChange,
    closeModal,
    handleAddCourse,
    errorMessage,
}) {
    /*for modal to have two pages*/
    const [currentPage, setCurrentPage] = useState(1);
    const [isClicked, setIsClicked] = useState(false);
    const [temporaryCourses, setTemporaryCourses] = useState(
        courses.map((course) => ({ _id: course._id, courseCode: course.courseCode, courseName: course.courseName }))
    );
    const nextPage = () => {
        setCurrentPage(currentPage + 1);
        if (!isClicked) {
            handleAddToTemporaryCourseArray();
            setIsClicked(true);
        }
    };    
    const prevPage = () => {setCurrentPage(currentPage - 1);};
    
    useEffect(() => {
        // Cleanup function to reset temporaryCourses when the modal is closed
        return () => {
            setTemporaryCourses(courses.map((course) => ({ _id: course._id, courseCode: course.courseCode, courseName: course.courseName })));
            setIsClicked(false);
        };
    }, [closeModal, courses]); // Run this effect when closeModal or courses updates
    
    const handleAddToTemporaryCourseArray = () => {
        // Check if both course code and course name are provided
        if (courseValues.courseCode && courseValues.courseName) {
          // Add courseValues to temporaryCourses array
          setTemporaryCourses([...temporaryCourses, { _id: Math.random().toString(), courseCode: courseValues.courseCode, courseName: courseValues.courseName }]);
        } 
    };

    const handleTemporaryCourseArrayInputChange = (field, index) => (event) => {
        const updatedCourses = [...temporaryCourses];
        if (index !== -1) {
            updatedCourses[index] = {
                ...updatedCourses[index],
                [field]: event.target.value,
            };
            setTemporaryCourses(updatedCourses);
        }
    };

    const handleOnDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        const { source, destination } = result;
        // If item dropped in the same position, do nothing
        if (source.index === destination.index) {
            return;
        }
        const updatedCourses = Array.from(temporaryCourses);
        const [reorderedItem] = updatedCourses.splice(source.index, 1);
        updatedCourses.splice(destination.index, 0, reorderedItem);
        setTemporaryCourses(updatedCourses);
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
                        <label htmlFor='addCourseCode'>Course Code</label>
                        <input
                            id="addCourseCode"
                            type="text"
                            value={courseValues.courseCode}
                            onChange={(event) => {
                                handleInputChange("course", "courseCode")(event);
                                const index = temporaryCourses.findIndex(course => course.courseCode === courseValues.courseCode);
                                handleTemporaryCourseArrayInputChange('courseCode', index)(event);
                            }}
                            placeholder="Please enter a Course Code"
                        />
                    </div>
                    {/* Input Course Name text box */}
                    <div className="form-group">
                        <label htmlFor='addCourseName'>Course Name</label>
                        <input
                            id="addCourseName"
                            type="text"
                            value={courseValues.courseName}
                            onChange={(event) => {
                                handleInputChange("course", "courseName")(event);
                                const index = temporaryCourses.findIndex(course => course.courseName === courseValues.courseName);
                                handleTemporaryCourseArrayInputChange('courseName', index)(event);
                            }}
                            placeholder="Please enter a Course Name"
                        />
                    </div>
                    {/* Select repeated reminders dropdown */}
                    <div className="select-reminder-frequency">
                        <h3>Turn on Repeated Reminders:</h3>
                        {['Tutorial', 'Lecture', 'Quiz', 'Others'].map((reminder) => (
                            <div key={reminder} className="reminder-group">
                                <div className="checkbox-container">
                                    <input type="checkbox"/>
                                    <label>{reminder}</label>
                                </div>
                                <div className="dropdown-container">
                                    {reminder === "Others" && (
                                        <input type="text" name="taskName" placeholder="Name of Task"/>
                                    )}
                                    <select defaultValue="">
                                        <option value="" disabled hidden>Day</option>
                                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                    <select defaultValue="">
                                        <option value="" disabled hidden>Frequency</option>
                                        {["Daily", "Weekly", "Bi-Weekly", "Monthly"].map((frequency) => (
                                            <option key={frequency} value={frequency}>{frequency}</option>
                                        ))}
                                    </select>
                                    {reminder === "Others" && (
                                        <select defaultValue="">
                                            <option value="" disabled hidden>Priority</option>
                                            {["Low", "High"].map((priority) => (
                                                <option key={priority} value={priority}>{priority}</option>
                                            ))}
                                        </select>
                                    )}
                                    <select defaultValue="">
                                        <option value="" disabled hidden>Entry No.</option>
                                        {Array.from({ length: 13 }, (_, index) => index + 1).map((entryNo) => (
                                            <option key={entryNo} value={entryNo}>{entryNo}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                    {errorMessage()}
                    <button onClick={nextPage}>Next</button>
                    <button onClick={() => closeModal("course")}>Close</button>
                </div>
            )}

            {currentPage === 2 && (
                <div className="course-popup2">
                    <h2>Drag and drop to order the priority of your courses.</h2>
                    <DragDropContext onDragEnd={handleOnDragEnd}>
                        <Droppable droppableId="droppable">
                            {(provided) => (
                                <ul {...provided.droppableProps} ref={provided.innerRef} style={{ listStyleType: 'none', padding: '0' }}>
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
                                                    {course.courseCode + " " + course.courseName}
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
                    <button onClick={() => {handleAddCourse(); prevPage();}}>Submit</button>
                    <button onClick={() => {prevPage(); closeModal("course");}}>Close</button>
                </div>
            )}
        </Modal>
    );
}

export default AddCourseModal;
