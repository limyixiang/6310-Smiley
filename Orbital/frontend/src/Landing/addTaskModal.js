import Modal from 'react-modal';
import './landingPage.css';

Modal.setAppElement('#root');

function AddTaskModal({ courses, taskValues, handleInputChange, closeModal, handleAddTask, errorMessage }) {
    return (
        <Modal
            isOpen={taskValues.openModalType === 'task'} 
            onRequestClose={closeModal}
            contentLabel='Add-a-task-modal'
            className='add-a-task-popup'
            overlayClassName='backdrop-task-popup'
        >
            <h2>Add Your Task</h2>
            {/* Select a Course dropdown */}
            <div className="select-course">
                <label htmlFor='courseSelect'> Select a Course</label>
                <select id='courseSelect' value={taskValues.taskCourseId} onChange={handleInputChange('task', 'taskCourseId')}>
                    <option value="" disabled hidden>Select a Course</option>
                    {courses.map((course, index) => (
                        <option name='courseSelectOption' key={index} value={course._id}>{course.courseCode + " " + course.courseName}</option>
                    ))}
                </select>
            </div>
            {/* Input task name text box */}
            <div className="input-task-name">
                <label htmlFor='taskName'>Name of Task</label>
                <input 
                    id='taskName'
                    type='text'
                    value={taskValues.taskName}
                    onChange={handleInputChange('task', 'taskName')}
                    placeholder='Task Name'
                />
            </div>
            {/* Select Priority Level dropdown */}
            <div className="select-priority-level">
                <label htmlFor='priorityLevel'>Select Priority Level</label>
                <select id='priorityLevel' value={taskValues.priorityLevel} onChange={handleInputChange('task', 'priorityLevel')}>
                    <option value="" disabled hidden>Select Priority Level</option>
                    <option value='High'>High</option>
                    <option value='Low'>Low</option>
                </select>
            </div>
            {/* Deadline date selector */}
            <div className="select-due-date">
                <label htmlFor='dueDate'>Deadline</label>
                <input 
                    id='dueDate'
                    type='date'
                    value={taskValues.dueDate}
                    onChange={handleInputChange('task', 'dueDate')}
                />
            </div>
            {errorMessage()}
            <button onClick={handleAddTask}>Submit</button>
            <button onClick={() => closeModal('task')}>Close</button>
        </Modal>
    );
}

export default AddTaskModal;
