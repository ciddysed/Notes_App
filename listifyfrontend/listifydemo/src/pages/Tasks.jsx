import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navigation from '../components/Navigation.jsx';
import Subnote from './Subnotes.jsx';
import './Tasks.css';

const Tasks = () => {
    const [todos, setTodos] = useState([]);
    const [todoValue, setTodoValue] = useState('');
    const [editId, setEditId] = useState(null);
    const [taskStatus, setTaskStatus] = useState('Pending');

    const apiUrl = 'http://localhost:8080/api/task';

    // Fetch todos from the API
    const fetchTodos = async () => {
        try {
            const response = await axios.get(`${apiUrl}/getAllTasks`);
            const todosWithSubnotes = response.data.map(todo => ({
                ...todo,
                subnotes: Array.isArray(todo.subnotes) ? todo.subnotes : [],
             }));
            setTodos(todosWithSubnotes);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Add or update todos
    const handleAddTodos = async () => {
        if (!todoValue) {
            alert("Please enter a task");
            return;
        }

        try {
            if (editId) {
                const confirmUpdate = window.confirm("Are you sure you want to update this task?");
                if (confirmUpdate) {
                    await handleUpdate(editId, {
                        task: todoValue,
                        taskStatus: taskStatus,
                    });
                }
            } else {
                const response = await axios.post(`${apiUrl}/posttask`, {
                    task: todoValue,
                    taskStatus: taskStatus,
                });
                const newTodo = {
                    ...response.data,
                    subnotes: [],
                };
                setTodos(prevTodos => [...prevTodos, newTodo]);
            }
            resetTodoInput();
        } catch (error) {
            console.error("Error adding/updating task:", error);
            alert("An error occurred while adding/updating the task.");
        }
    };

    // Update a task
    const handleUpdate = async (id, updatedTask) => {
        try {
            const response = await axios.put(`${apiUrl}/putTaskDetails/${id}`, updatedTask);
            setTodos(prevTodos =>
                prevTodos.map(todo => (todo.id === id ? { ...response.data, subnotes: [] } : todo))
            );
            resetTodoInput();
        } catch (error) {
            console.error("Error updating task:", error);
            alert("An error occurred while updating the task.");
        }
    };

    // Delete a task
    const handleDeleteTodo = async (id) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await axios.delete(`${apiUrl}/deleteTask/${id}`);
                setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
            } catch (error) {
                console.error("Error deleting task:", error);
                alert("An error occurred while deleting the task.");
            }
        }
    };

    // Remove date from a task
    const handleRemoveDateFromTask = async (id) => {
        if (window.confirm("Are you sure you want to remove the date from this task?")) {
            try {
                await axios.post(`${apiUrl}/removeDate/${id}`);
                setTodos(prevTodos =>
                    prevTodos.map(todo => (todo.id === id ? { ...todo, date: null } : todo))
                );
            } catch (error) {
                console.error("Error removing date from task:", error);
                alert("An error occurred while removing the date from the task.");
            }
        }
    };

    // Edit a task
    const handleEditTodo = (id) => {
        const todoToEdit = todos.find(todo => todo.id === id);
        if (todoToEdit) {
            setTodoValue(todoToEdit.task);
            setTaskStatus(todoToEdit.taskStatus);
            setEditId(id);
        }
    };

    // Reset input fields
    const resetTodoInput = () => {
        setTodoValue('');
        setTaskStatus('Pending');
        setEditId(null);
    };

    // Fetch todos when component mounts
    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div>
            <Navigation />
    
            <div className="task-list-container">
                <div className="task-list">
                    {/* Task Statistics */}
                    {todos.length > 0 && (
                        <div className="task-stats">
                            <div className="stat-card pending">
                                <div className="stat-icon">⏳</div>
                                <div className="stat-number">
                                    {todos.filter(todo => todo.taskStatus === 'Pending').length}
                                </div>
                                <div className="stat-label">Pending</div>
                            </div>
                            <div className="stat-card ongoing">
                                <div className="stat-icon">🔄</div>
                                <div className="stat-number">
                                    {todos.filter(todo => todo.taskStatus === 'Ongoing').length}
                                </div>
                                <div className="stat-label">In Progress</div>
                            </div>
                            <div className="stat-card done">
                                <div className="stat-icon">✅</div>
                                <div className="stat-number">
                                    {todos.filter(todo => todo.taskStatus === 'Done').length}
                                </div>
                                <div className="stat-label">Completed</div>
                            </div>
                        </div>
                    )}

                    {todos.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📋</div>
                            <h2>No Tasks Yet</h2>
                            <p>Create your first task to get started with organizing your work!</p>
                        </div>
                    ) : (
                        todos.map((todo) => (
                            <div key={todo.id} className="task-wrapper">
                                <div className="task-item">
                                    <div className="task-header">
                                        <div className="task-content">
                                            <h3>{todo.task}</h3>
                                            <div className="task-meta">
                                                <span className={`task-status ${todo.taskStatus.toLowerCase()}`}>
                                                    {todo.taskStatus === 'Pending' && '⏳'}
                                                    {todo.taskStatus === 'Ongoing' && '🔄'}
                                                    {todo.taskStatus === 'Done' && '✅'}
                                                    <span>{todo.taskStatus}</span>
                                                </span>
                                                {todo.date && (
                                                    <div className="task-date">
                                                        <span className="date-icon">📅</span>
                                                        <span>Due {new Date(todo.date).toLocaleDateString()}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="task-actions">
                                            <button 
                                                className="update-btn" 
                                                onClick={() => handleEditTodo(todo.id)}
                                                title="Edit this task"
                                            >
                                                <span>✏️</span> Edit
                                            </button>
                                            <button 
                                                className="delete-btn" 
                                                onClick={() => handleDeleteTodo(todo.id)}
                                                title="Delete this task permanently"
                                            >
                                                <span>🗑️</span> Delete
                                            </button>
                                            {todo.date && (
                                                <button 
                                                    className="remove-date-btn" 
                                                    onClick={() => handleRemoveDateFromTask(todo.id)}
                                                    title="Remove due date"
                                                >
                                                    <span>📅</span> Clear Date
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
    
                                <div className="subnotes-section">
                                    <div className="subnotes-header">
                                        <h4>📝 Notes & Details</h4>
                                        <div className="subnotes-count">
                                            {Array.isArray(todo.subnotes) ? todo.subnotes.length : 0} notes
                                        </div>
                                    </div>
                                    <Subnote
                                        taskId={todo.id}
                                        subnotes={Array.isArray(todo.subnotes) ? todo.subnotes : []}
                                        setSubnotes={(newSubnotes) => {
                                            setTodos(prevTodos =>
                                                prevTodos.map(item =>
                                                    item.id === todo.id ? { ...item, subnotes: newSubnotes } : item
                                                )
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
    
            <div className="todo-input">
                <div className="input-label">
                    {editId ? '✏️ Edit Task' : '➕ New Task'}
                </div>
                <input
                    type="text"
                    value={todoValue}
                    onChange={(e) => setTodoValue(e.target.value)}
                    placeholder={editId ? 'Update your task...' : 'What would you like to accomplish?'}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTodos()}
                />
                <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    title="Set task priority"
                >
                    <option value="Pending">⏳ Pending</option>
                    <option value="Ongoing">🔄 In Progress</option>
                    <option value="Done">✅ Completed</option>
                </select>
                <button onClick={handleAddTodos} className="primary-btn">
                    {editId ? '💾 Update' : '➕ Add Task'}
                </button>
                {editId && (
                    <button 
                        className="cancel"
                        onClick={resetTodoInput}
                        title="Cancel editing and clear form"
                    >
                        ❌ Cancel
                    </button>
                )}
            </div>
        </div>
    );
    
};

export default Tasks;
