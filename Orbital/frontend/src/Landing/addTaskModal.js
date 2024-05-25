import Modal from 'react-modal';
import './landingPage.css';

Modal.setAppElement('#root');

function AddTaskModal({ courses, taskValues, handleInputChange, closeModal, handleAddTask }) {
    return (
        <Modal
            isOpen={taskValues.openModalType === 'task'} 
            onRequestClose={closeModal}
            contentLabel='Add-a-task-modal'
            className='add-a-task-popup'
            overlayClassName='backdrop-task-popup'
        >
            <h2>Add Your Task</h2>
            <div className="select-course">
                <label>Select a Course</label>
                <select value={taskValues.taskCourseId} onChange={handleInputChange('task', 'taskCourseId')}>
                    <option value="" disabled hidden>Select a Course</option>
                    {courses.map((course, index) => (
                        <option key={index} value={course._id}>{course.courseCode + " " + course.courseName}</option>
                    ))}
                </select>
            </div>
            <div className="select-priority-level">
                <label>Select Priority Level</label>
                <select value={taskValues.priorityLevel} onChange={handleInputChange('task', 'priorityLevel')}>
                    <option value="" disabled hidden>Select Priority Level</option>
                    <option value='High'>High</option>
                    <option value='Low'>Low</option>
                </select>
            </div>
            <div className="input-task-name">
                <label>Name of Task</label>
                <input 
                    type='text'
                    value={taskValues.taskName}
                    onChange={handleInputChange('task', 'taskName')}
                    placeholder='Task Name'
                />
            </div>
            <div className="select-due-date">
                <label>Deadline</label>
                <input 
                    type='date'
                    value={taskValues.dueDate}
                    onChange={handleInputChange('task', 'dueDate')}
                />
            </div>
            <button onClick={handleAddTask}>Submit</button>
            <button onClick={() => closeModal('task')}>Close</button>
        </Modal>
    );
}

export default AddTaskModal;
