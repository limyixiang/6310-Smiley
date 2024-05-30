import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getTasksForCourse } from "../Backend";
import "./coursePage.css";

function CoursePage() {
    const [tasks, setTasks] = useState([]);

    const location = useLocation();
    const { course } = location.state;

    useEffect(() => {
        getTasksForCourse({ courseid: course._id })
            .then((data) => setTasks(data))
            .catch((err) => console.error("Error fetching data:", err));
    });

    return (
        <div className="main-container">
            <div className="course-header">
                {course.courseCode + " " + course.courseName}
            </div>
            <div className="course-tasks-list">
                {tasks.map((task, index) => (
                    <div key={index} className="course-task-item">
                        <div className="task-item-text">{task.taskName}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CoursePage;
