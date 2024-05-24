import './landingPage.css';
import AddCourseModal from './addCourseModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

function CourseContainer({ courses, openCourseModal, handleInputChange, closeModal, handleSubmit, handleDeleteCourse, landingValues}) {
    return (
        <div className="courses-container">
            <div className="courses-header">
                <h2>Your Courses</h2>
                <button className="add-a-course-button" onClick={openCourseModal}>Add a course</button>
            </div>
            <AddCourseModal 
                landingValues={landingValues} 
                handleInputChange={handleInputChange} 
                closeModal={closeModal} 
                handleSubmit={handleSubmit} />
            {/* only display courseCode */}
            <div className="courses-list"> 
                {courses.map((course, index) => (
                    <div key={index} className="course-item">
                        <div className="course-item-text">
                            {course.courseCode}
                        </div>
                        <div>
                            <FontAwesomeIcon className='trashcan course-trashcan' icon={faTrashCan} onClick={() => handleDeleteCourse(course._id)}/>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CourseContainer;
