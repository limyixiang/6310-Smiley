import Modal from "react-modal";
import { React, useState } from "react";
import "./landingPage.css";

Modal.setAppElement("#root");

function AddCourseModal({
    courseValues,
    handleInputChange,
    closeModal,
    handleAddCourse,
    errorMessage,
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const nextPage = () => setCurrentPage(currentPage + 1);
    const prevPage = () => setCurrentPage(currentPage - 1);
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
                        <input
                            id="addCourseCode"
                            type="text"
                            value={courseValues.courseCode}
                            onChange={handleInputChange("course", "courseCode")}
                            placeholder="Course Code"
                        />
                    </div>
                    {/* Input Course Name text box */}
                    <div className="form-group">
                        <input
                            id="addCourseName"
                            type="text"
                            value={courseValues.courseName}
                            onChange={handleInputChange("course", "courseName")}
                            placeholder="Course Name"
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
                                    <select>
                                        <option value="Monday">Monday</option>
                                        <option value="Tuesday">Tuesday</option>
                                        <option value="Wednesday">Wednesday</option>
                                        <option value="Thursday">Thursday</option>
                                        <option value="Friday">Friday</option>
                                        <option value="Saturday">Saturday</option>
                                        <option value="Sunday">Sunday</option>
                                    </select>
                                    <select>
                                        <option value="Daily">Daily</option>
                                        <option value="Weekly">Weekly</option>
                                        <option value="Bi-weekly">Bi-weekly</option>
                                        <option value="Monthly">Monthly</option>
                                    </select>
                                    {reminder === "Others" && (
                                        <select>
                                            <option value="High">High</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    )}
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
                    <h2>Please provide some details of the course.</h2>
                    <button onClick={prevPage}>Previous</button>
                    <button onClick={handleAddCourse}>Submit</button>
                    <button onClick={() => closeModal("course")}>Close</button>
                </div>
            )}
        </Modal>
    );
}

export default AddCourseModal;
