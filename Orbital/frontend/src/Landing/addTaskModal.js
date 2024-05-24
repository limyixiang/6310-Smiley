import Modal from 'react-modal';
// import './landingPage.css';

Modal.setAppElement('#root');

function AddTaskModal({ courses, landingValues, handleInputChange, closeModal, handleSubmit }) {
    return (
        <Modal
            isOpen={landingValues.openModalType === 'task'} 
            onRequestClose={closeModal}
            contentLabel='Add-a-task-modal'
            className='add-a-task-popup'
            overlayClassName='backdrop-task-popup'
        >
            <h2>Add Your Task</h2>
            <div className="select-course">
                <label>Select a Course</label>
                <select>
                    {courses.map((course, index) => (
                        <option key={index} value={course._id}>{course.courseCode + " " + course.courseName}</option>
                    ))}
                </select>
            </div>
            <div className="select-priority-level">
                <label>Select Priority Level</label>
                <select>
                    <option value='high'>High</option>
                    <option value='low'>Low</option>
                </select>
            </div>
            <div className="input-task-name">
                <label>Name of Task</label>
                <input 
                    type='text'
                    value={landingValues.taskName}
                    onChange={handleInputChange('taskName')}
                    placeholder='Task Name'
                />
            </div>
            <div className="select-task-date">
                <label>Deadline</label>
                <input 
                    type='date'
                    value={landingValues.taskDate}
                    onChange={handleInputChange('taskDate')}
                />
            </div>
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={closeModal}>Close</button>
        </Modal>
    );
}

export default AddTaskModal;
