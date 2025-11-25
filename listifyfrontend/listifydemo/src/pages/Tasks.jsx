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
    const [project, setProject] = useState(''); // NEW: Project input
    const [selectedProject, setSelectedProject] = useState('All'); // Filter
    const [isLoading, setIsLoading] = useState(false);
    const [loadingAction, setLoadingAction] = useState(null);

    const apiUrl = 'http://localhost:8080/api/task';

    // Fetch all tasks
    const fetchTodos = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/getAllTasks`);
            const todosWithSubnotes = response.data.map(todo => ({
                ...todo,
                subnotes: Array.isArray(todo.subnotes) ? todo.subnotes : [],
            }));
            setTodos(todosWithSubnotes);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch tasks filtered by project
    const fetchTodosByProject = async (projectName) => {
        setIsLoading(true);
        try {
            let response;
            if (projectName === 'All') {
                response = await axios.get(`${apiUrl}/getAllTasks`);
            } else {
                response = await axios.get(`${apiUrl}/project/${projectName}`);
            }
            const todosWithSubnotes = response.data.map(todo => ({
                ...todo,
                subnotes: Array.isArray(todo.subnotes) ? todo.subnotes : [],
            }));
            setTodos(todosWithSubnotes);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Add or update task
    const handleAddTodos = async () => {
        if (!todoValue.trim()) {
            alert("Please enter a task");
            return;
        }

        setLoadingAction('add');
        try {
            if (editId) {
                const confirmUpdate = window.confirm("Update this task?");
                if (confirmUpdate) {
                    await handleUpdate(editId, {
                        task: todoValue,
                        taskStatus,
                        project: project.trim() || null, // send null if empty
                    });
                }
            } else {
                const response = await axios.post(`${apiUrl}/posttask`, {
                    task: todoValue,
                    taskStatus,
                    project: project.trim() || null,
                });
                setTodos(prev => [...prev, { ...response.data, subnotes: [] }]);
            }
            resetTodoInput();
        } catch (error) {
            console.error(error);
            alert("Error adding/updating task");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleUpdate = async (id, updatedTask) => {
        try {
            const response = await axios.put(`${apiUrl}/putTaskDetails/${id}`, updatedTask);
            setTodos(prev => prev.map(todo => todo.id === id ? { ...response.data, subnotes: [] } : todo));
            resetTodoInput();
        } catch (error) {
            console.error(error);
            alert("Error updating task");
        }
    };

    const handleDeleteTodo = async (id) => {
        if (!window.confirm("Delete this task?")) return;
        setLoadingAction(`delete-${id}`);
        try {
            await axios.delete(`${apiUrl}/deleteTask/${id}`);
            setTodos(prev => prev.filter(todo => todo.id !== id));
        } catch (error) {
            console.error(error);
            alert("Error deleting task");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleEditTodo = (id) => {
        const todoToEdit = todos.find(todo => todo.id === id);
        if (todoToEdit) {
            setTodoValue(todoToEdit.task);
            setTaskStatus(todoToEdit.taskStatus);
            setProject(todoToEdit.project || ''); // show empty if no project
            setEditId(id);
        }
    };

    const resetTodoInput = () => {
        setTodoValue('');
        setTaskStatus('Pending');
        setProject('');
        setEditId(null);
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleProjectFilterChange = (e) => {
        const projectName = e.target.value;
        setSelectedProject(projectName);
        fetchTodosByProject(projectName);
    };

    const projectOptions = ['All', ...new Set(todos.map(todo => todo.project).filter(p => p))];

    return (
        <div>
            <Navigation />

            <div className="task-filters">
                <label>Filter by Project: </label>
                <select value={selectedProject} onChange={handleProjectFilterChange}>
                    {projectOptions.map(proj => (
                        <option key={proj} value={proj}>{proj}</option>
                    ))}
                </select>
            </div>

            <div className="task-list-container">
                {isLoading ? (
                    <div className="loading-state">
                        <div className="loading-spinner">⏳</div>
                        <p>Loading your tasks...</p>
                    </div>
                ) : (
                    <div className="task-list">
                        {todos.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">📋</div>
                                <h2>No Tasks Yet</h2>
                                <p>Create your first task to get started!</p>
                            </div>
                        ) : (
                            todos.map(todo => (
                                <div key={todo.id} className="task-wrapper">
                                    <div className="task-item">
                                        <div className="task-header">
                                            <div className="task-content">
                                                <h3>{todo.task}</h3>
                                                {todo.project && <p className="task-project">📂 {todo.project}</p>}
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
                                                <button onClick={() => handleEditTodo(todo.id)} disabled={loadingAction !== null}>✏️ Edit</button>
                                                <button onClick={() => handleDeleteTodo(todo.id)} disabled={loadingAction !== null}>🗑️ Delete</button>
                                            </div>
                                        </div>
                                    </div>

                                    <Subnote
                                        taskId={todo.id}
                                        subnotes={Array.isArray(todo.subnotes) ? todo.subnotes : []}
                                        setSubnotes={(newSubnotes) => {
                                            setTodos(prev => prev.map(item => item.id === todo.id ? { ...item, subnotes: newSubnotes } : item));
                                        }}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            <div className="todo-input">
                <input
                    type="text"
                    value={todoValue}
                    onChange={(e) => setTodoValue(e.target.value)}
                    placeholder={editId ? 'Update your task...' : 'What would you like to accomplish?'}
                    onKeyPress={(e) => e.key === 'Enter' && !loadingAction && handleAddTodos()}
                />
                <select value={taskStatus} onChange={(e) => setTaskStatus(e.target.value)}>
                    <option value="Pending">⏳ Pending</option>
                    <option value="Ongoing">🔄 In Progress</option>
                    <option value="Done">✅ Completed</option>
                </select>
                <input
                    type="text"
                    placeholder="Project / Category"
                    value={project}
                    onChange={(e) => setProject(e.target.value)}
                />
                <button onClick={handleAddTodos} disabled={loadingAction !== null}>
                    {editId ? '💾 Update Task' : '➕ Add Task'}
                </button>
                {editId && <button onClick={resetTodoInput}>❌ Cancel</button>}
            </div>
        </div>
    );
};

export default Tasks;
