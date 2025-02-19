import React, { useState } from 'react';
import axios from "axios";

const AddAssignment = ({ fetchTasks }) => {
    const [task, setTask] = useState('');
    const [priority, setPriority] = useState('Low');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/submit', { task, priority, dueDate });
            if (response.status === 201) {
                console.log('Task added successfully');
                setTask('');
                setPriority('Low');
                setDueDate('');
                fetchTasks(); // Update tasks
            } else {
                console.error('Failed to add task');
            }
        } catch (error) {
            console.error('Error submitting task:', error);
        }
    };

    return (
        <div>
            <form id="taskForm" className="mt-4" aria-labelledby="taskFormTitle" onSubmit={handleSubmit}>
                <h3 id="taskFormTitle">Enter a new task:</h3>

                <div className="form-group">
                    <label htmlFor="task">Task:</label>
                    <input
                        type="text"
                        id="task"
                        name="task"
                        className="form-control"
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="priority">Priority:</label>
                    <select
                        id="priority"
                        name="priority"
                        className="form-control"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        required
                    >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="dueDate">Due Date:</label>
                    <input
                        type="date"
                        id="dueDate"
                        name="dueDate"
                        className="form-control"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">Add Task</button>
            </form>
        </div>
    );
};

export default AddAssignment;