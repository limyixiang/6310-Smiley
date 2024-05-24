import Modal from 'react-modal';
import './landingPage.css';

Modal.setAppElement('#root');

function AddCourseModal({ landingValues, handleInputChange, closeModal, handleSubmit }) {
    return (
        <Modal
            isOpen={landingValues.openModalType === 'course'} 
            onRequestClose={closeModal}
            contentLabel='Add-a-course-modal'
            className='add-a-course-popup'
            overlayClassName='backdrop-course-popup'
        >
            <h2>Add Your Course</h2>
            <input 
                type='text'
                value={landingValues.courseCode}
                onChange={handleInputChange('courseCode')}
                placeholder='Course Code'
            />
            <input 
                type='text'
                value={landingValues.courseName}
                onChange={handleInputChange('courseName')}
                placeholder='Course Name'
            />
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={closeModal}>Close</button>
        </Modal>
    );
}

export default AddCourseModal;
