import styles from "./landingPage.module.css";
import AddCourseModal from "./addCourseModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

    const onCoursePage = (course) => {
        navigate("/coursepage", { state: { course, user } });
    };

    return (
        <div className={styles.coursesContainer}>
            <div className={styles.coursesHeader}>
                <h2>YOUR COURSES</h2>
                <button onClick={openCourseModal}>Add a course</button>
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
                    <div
                        key={index}
                        className={styles.courseItem}
                        onClick={() => onCoursePage(course)}
                    >
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
                ))}
            </div>
        </div>
    );
}

export default CourseContainer;
