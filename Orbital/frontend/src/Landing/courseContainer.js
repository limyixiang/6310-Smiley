import styles from "./landingPage.module.css";
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
        <div className={styles.coursesContainer}>
            <div className={styles.coursesHeader}>
                <h2>Your Courses</h2>
                <button
                    className={styles.buttonGroup}
                    onClick={openCourseModal}
                >
                    Add a course
                </button>
            </div>
            <AddCourseModal
                courses={courses}
                courseValues={courseValues}
                handleInputChange={handleInputChange}
                closeModal={closeModal}
                handleAddCourse={handleAddCourse}
                errorMessage={errorMessage}
            />
            {/* only display courseCode */}
            <div className={styles.coursesList}>
                {courses.map((course, index) => (
                    <Link
                        key={index}
                        to={"/coursepage"}
                        state={{
                            course: course,
                            user: user,
                        }}
                    >
                        <div className={styles.courseItem}>
                            <div className={styles.courseItemText}>
                                {course.courseCode}
                            </div>
                            <div>
                                <FontAwesomeIcon
                                    className={`${styles.trashcan} ${styles.courseTrashcan}`}
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
