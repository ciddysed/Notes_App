import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import Navigation from '../components/Navigation.jsx';

Modal.setAppElement('#root');

const localizer = momentLocalizer(moment);

function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState({});
    const [existingTasks, setExistingTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const apiUrl = 'http://localhost:8080/api/task';

    const fetchTasks = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${apiUrl}/getAllTasks`);
            const fetchedTasks = response.data;

            const taskMap = {};
            fetchedTasks.forEach(task => {
                const taskDate = new Date(task.date).toDateString();
                if (!taskMap[taskDate]) {
                    taskMap[taskDate] = [];
                }
                taskMap[taskDate].push(task);
            });

            setTasks(taskMap);
            setExistingTasks(fetchedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            alert('Failed to load tasks. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const events = Object.entries(tasks).flatMap(([dateString, taskList]) =>
        taskList.map((task) => ({
            title: task.task,
            start: new Date(dateString),
            end: new Date(dateString),
            allDay: true,
        }))
    );

    const handleSelectSlot = (slotInfo) => {
        setDate(slotInfo.start);
        setIsModalOpen(true);
    };

    const recordExistingTaskWithDate = async (taskId) => {
        const localDateString = date.toLocaleDateString('en-CA');
        setIsLoading(true);

        try {
            const response = await axios.post(`${apiUrl}/recordTask/${localDateString}/${taskId}`);
            if (response.status === 200) {
                console.log('Recorded Task:', response.data);
                fetchTasks();
                setIsModalOpen(false);
                setSelectedTask(null);
            } else {
                console.error('Failed to record task, response status:', response.status);
            }
        } catch (error) {
            console.error('Error recording task:', error.response ? error.response.data : error.message);
            alert('Failed to record task. Please check the console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="calendar-page">
            <Navigation />

            <div className="title-container">
                <h2>📅 Calendar Overview</h2>
                <p>Click on any date to assign tasks or view your schedule</p>
            </div>

            <div className="record-task-container">
                <h3>📋 Quick Task Assignment for {date.toDateString()}</h3>

                <div className="task-assignment-row">
                    <select
                        value={selectedTask?.id || ''}
                        onChange={(e) => {
                            const taskId = Number(e.target.value);
                            const task = existingTasks.find(task => task.id === taskId);
                            setSelectedTask(task);
                        }}
                        disabled={isLoading}
                    >
                        <option value="">Choose a task to assign...</option>
                        {existingTasks.map((task) => (
                            <option key={task.id} value={task.id}>{task.task}</option>
                        ))}
                    </select>

                    <button
                        className="assign-btn"
                        onClick={() => {
                            if (selectedTask) {
                                recordExistingTaskWithDate(selectedTask.id);
                            }
                        }}
                        disabled={!selectedTask || isLoading}
                    >
                        {isLoading ? '⏳ Assigning...' : '✅ Assign Task'}
                    </button>
                </div>
            </div>

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                onSelectSlot={handleSelectSlot}
                style={{ height: 500 }}
                className="enhanced-calendar"
            />

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Assign Task"
                className="task-modal"
                overlayClassName="task-modal-overlay"
            >
                <div className="modal-content">
                    <h3>📋 Assign Task for {date.toDateString()}</h3>

                    <div className="modal-task-selection">
                        <select
                            value={selectedTask?.id || ''}
                            onChange={(e) => {
                                const taskId = Number(e.target.value);
                                const task = existingTasks.find(task => task.id === taskId);
                                setSelectedTask(task);
                            }}
                            disabled={isLoading}
                        >
                            <option value="">Choose a task to assign...</option>
                            {existingTasks.map((task) => (
                                <option key={task.id} value={task.id}>{task.task}</option>
                            ))}
                        </select>
                    </div>

                    <div className="modal-actions">
                        <button
                            className="assign-btn"
                            onClick={() => {
                                if (selectedTask) {
                                    recordExistingTaskWithDate(selectedTask.id);
                                }
                            }}
                            disabled={!selectedTask || isLoading}
                        >
                            {isLoading ? '⏳ Assigning...' : '✅ Assign Task'}
                        </button>
                        <button 
                            className="cancel-btn"
                            onClick={() => setIsModalOpen(false)}
                            disabled={isLoading}
                        >
                            ❌ Cancel
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}

export default CalendarPage;
