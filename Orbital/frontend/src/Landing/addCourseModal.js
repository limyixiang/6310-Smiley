import Modal from 'react-modal';
import './landingPage.css';

Modal.setAppElement('#root');

function AddCourseModal({ courseValues, handleInputChange, closeModal, handleAddCourse, errorMessage }) {
    return (
        <Modal
            isOpen={courseValues.openModalType === 'course'} 
            onRequestClose={closeModal}
            contentLabel='Add-a-course-modal'
            className='add-a-course-popup'
            overlayClassName='backdrop-course-popup'
        >
            <h2>Add Your Course</h2>
            {/* Input Course Code text box */}
            <input 
                type='text'
                value={courseValues.courseCode}
                onChange={handleInputChange('course', 'courseCode')}
                placeholder='Course Code'
            />
            {/* Input Course Name text box */}
            <input 
                type='text'
                value={courseValues.courseName}
                onChange={handleInputChange('course', 'courseName')}
                placeholder='Course Name'
            />
            {errorMessage()}
            <button onClick={handleAddCourse}>Submit</button>
            <button onClick={() => closeModal('course')}>Close</button>
        </Modal>
    );
}

export default AddCourseModal;
