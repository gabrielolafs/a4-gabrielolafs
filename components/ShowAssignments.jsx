import React from 'react';
import axios from 'axios';

const ShowAssignments = ({ tasks, fetchTasks }) => {
    const handleDelete = async (task) => {
        try {
            const response = await axios.post("/delete-task", { task: task });
            console.log('Response from server:', response.data);
            fetchTasks(); // Update tasks
        } catch (error) {
            console.error('Error sending data to server:', error);
        }
    }

    const handleCompleteChange = async (task, complete) => {
        complete = complete === "on" ? "off" : "on";

        try {
            const response = await axios.post("/update-task", { task: task, complete: complete });
            console.log('Response from server:', response.data);
            fetchTasks(); // Update tasks
        } catch (error) {
            console.error('Error sending data to server:', error);
        }
    }

    function daysTillDue(dueDate) {
        const today = new Date();
        const due = new Date(dueDate);
        const diffTime = due - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    return (
        <div className="container mt-5">
            <h2>Total List of Assignments:</h2>
            <table className="table table-striped mt-3">
                <thead>
                <tr>
                    <th>Complete? (edits)</th>
                    <th>Days Till Due</th>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Due Date</th>
                    <th>Press to Delete</th>
                </tr>
                </thead>
                <tbody id="completedTasksBody">
                {tasks.map(task => (
                    <tr key={task._id}>
                        <td>
                            <input
                                type="checkbox"
                                name={`complete-${task.task}`}
                                checked={task.complete === "on"}
                                onChange={() => handleCompleteChange(task.task, task.complete)}
                            />
                        </td>
                        <td>{daysTillDue(task.dueDate)}</td>
                        <td>{task.task}</td>
                        <td>{task.priority}</td>
                        <td>{task.dueDate.split('T')[0]}</td>
                        <td>
                            <button className="btn btn-danger" onClick={() => handleDelete(task.task)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ShowAssignments;