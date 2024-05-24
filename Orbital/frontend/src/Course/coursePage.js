import { React, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './coursePage.css';

function CoursePage() {

    const location = useLocation();
    const { course } = location.state;

    return (
        <div className='main-container'>
            <div className="course-header">
                {course.courseCode + " " + course.courseName}
            </div>
            <div className="course-tasks-list">
                {course.tasks.map((task, index) => (
                    <div key={index} className="course-task-item">
                        <div className="task-item-text">
                            {task.taskName}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CoursePage;
