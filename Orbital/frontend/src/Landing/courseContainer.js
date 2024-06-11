import styles from "./landingPage.module.css";
import AddCourseModal from "./addCourseModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function CourseContainer({
    user,
    courses,
    courseValues,
    courseModalTasks,
    temporaryCourses,
    defaultTasks,
    openCourseModal,
    handleInputChange,
    handleCourseModalInputChange,
    closeModal,
    handleAddCourse,
    handleDeleteCourse,
    errorMessage,
    handleAddToTemporaryCourseArray,
    handleOnDragEnd,
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
                courseValues={courseValues}
                courseModalTasks={courseModalTasks}
                temporaryCourses={temporaryCourses}
                defaultTasks={defaultTasks}
                handleInputChange={handleInputChange}
                handleCourseModalInputChange={handleCourseModalInputChange}
                closeModal={closeModal}
                handleAddCourse={handleAddCourse}
                errorMessage={errorMessage}
                handleAddToTemporaryCourseArray={
                    handleAddToTemporaryCourseArray
                }
                handleOnDragEnd={handleOnDragEnd}
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
