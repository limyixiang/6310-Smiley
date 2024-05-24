import Modal from 'react-modal';
// import './landingPage.css';

Modal.setAppElement('#root');

function AddTaskModal({ landingValues, handleInputChange, closeModal, handleSubmit }) {
    return (
        <Modal
            isOpen={landingValues.openModalType === 'task'} 
            onRequestClose={closeModal}
            contentLabel='Add-a-task-modal'
            className='add-a-task-popup'
            overlayClassName='backdrop-task-popup'
        >
            <h2>Add Your Task</h2>
            <input 
                type='text'
                value={landingValues.taskName}
                onChange={handleInputChange('taskName')}
                placeholder='Task Name'
            />
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={closeModal}>Close</button>
        </Modal>
    );
}

export default AddTaskModal;
