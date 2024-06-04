import Modal from "react-modal";
import "./landingPage.css";

Modal.setAppElement("#root");

function AddCourseModal({
    courseValues,
    handleInputChange,
    closeModal,
    handleAddCourse,
    errorMessage,
}) {
    return (
        <Modal
            isOpen={courseValues.openModalType === "course"}
            onRequestClose={closeModal}
            contentLabel="Add-a-course-modal"
            className="add-a-course-popup"
            overlayClassName="backdrop-course-popup"
        >
            <h2 className="course-popup-1">Please provide some details of the course.</h2>
            {/* Input Course Code text box */}
            <input
                id="addCourseCode"
                type="text"
                value={courseValues.courseCode}
                onChange={handleInputChange("course", "courseCode")}
                placeholder="Course Code"
            />
            {/* Input Course Name text box */}
            <input
                id="addCourseName"
                type="text"
                value={courseValues.courseName}
                onChange={handleInputChange("course", "courseName")}
                placeholder="Course Name"
            />
            {/* Select repeated reminders dropdown */}
            <div className="select-reminder-frequency">
                <label>Turn on Repeated Reminders:</label>
                <form>
                    <div className="reminder-checkbox">
                        <input type='checkbox' id="tutorial-reminder" name="Tutorial"/>
                        <label for="tutorial-reminder">Tutorial</label>
                    </div>
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
                </form>
                <form>
                    <div className="reminder-checkbox">
                        <input type='checkbox' id="lecture-reminder" name="Lecture"/>
                        <label for="tutorial-reminder">Lecture</label>
                    </div>
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
                </form>
                <form>
                    <div className="reminder-checkbox">
                        <input type='checkbox' id="quiz-reminder" name="Quiz"/>
                        <label for="tutorial-reminder">Quiz</label>
                    </div>
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
                </form>
                <form>
                    <div className="reminder-checkbox">
                        <input type='checkbox' id="other-reminder" name="Others"/>
                        <label for="tutorial-reminder">Others</label>
                    </div>
                    <input id="other-reminder" type="text" placeholder="Name of Task"/>
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
                    <select id='priorityLevel'>
                        <option value='High'>High</option>
                        <option value='Low'>Low</option>
                    </select>            
                </form>
            </div>
            {errorMessage()}
            <button onClick={handleAddCourse}>Submit</button>
            <button onClick={() => closeModal("course")}>Close</button>
        </Modal>
    );
}

export default AddCourseModal;
