import "./landingPage.css";
import AddCourseModal from "./addCourseModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function CourseContainer({
    courses,
    openCourseModal,
    handleInputChange,
    closeModal,
    handleAddCourse,
    handleDeleteCourse,
    courseValues,
    errorMessage,
    user,
}) {
    return (
        <div className="courses-container">
            <div className="courses-header">
                <h2>Your Courses</h2>
                <button
                    className="add-a-course-button"
                    onClick={openCourseModal}
                >
                    Add a course
                </button>
            </div>
            <AddCourseModal
                courseValues={courseValues}
                handleInputChange={handleInputChange}
                closeModal={closeModal}
                handleAddCourse={handleAddCourse}
                errorMessage={errorMessage}
            />
            {/* only display courseCode */}
            <div className="courses-list">
                {courses.map((course, index) => (
                    <Link
                        key={index}
                        to={"/coursepage"}
                        state={{
                            course: course,
                            user: user,
                        }}
                    >
                        <div className="course-item">
                            <div className="course-item-text">
                                {course.courseCode}
                            </div>
                            <div>
                                <FontAwesomeIcon
                                    className="trashcan course-trashcan"
                                    icon={faTrashCan}
                                    onClick={(event) =>
                                        handleDeleteCourse(event, course._id)
                                    }
                                />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default CourseContainer;
