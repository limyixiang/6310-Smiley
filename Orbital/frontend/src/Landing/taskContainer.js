import './landingPage.css';
import AddTaskModal from './addTaskModal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

function TaskContainer({ courses, tasks, openTaskModal, handleInputChange, closeModal, handleAddTask, handleDeleteTask, taskValues, handleTaskCheckboxChange }) {
    return (
        <div className="tasks-container">
            <h2>Upcoming Deadlines</h2>
            <div className="tasks-list">
                {tasks.map((task, index) => (
                    <div className="task-row" key={index}>
                        <input
                            className='task-checkbox'
                            type="checkbox" 
                            onChange={() => handleTaskCheckboxChange(task)} 
                            checked={task.status === 'Done'} 
                        />
                        <span className="task-item" style={{ textDecoration: task.status === 'Done' ? 'line-through' : 'none' }}>
                            {task.taskName}
                        </span>
                        <FontAwesomeIcon className='trashcan task-trashcan' icon={faTrashCan} onClick={() => handleDeleteTask(task._id)}/>
                    </div>
                ))}
            </div>
            <button className="add-a-task-button" onClick={openTaskModal}>Add a task</button>
            <AddTaskModal 
                courses={courses}
                taskValues={taskValues}
                handleInputChange={handleInputChange}
                closeModal={closeModal}
                handleAddTask={handleAddTask} />
            <center><p className='landing-to-dashboard'><b><a href='/'>Back to Dashboard</a></b></p></center>
        </div>
    );
}

export default TaskContainer;
