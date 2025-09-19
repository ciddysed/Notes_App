import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import axios from 'axios';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';
import Navigation from '../components/Navigation.jsx'; // Import Navigation

Modal.setAppElement('#root');

const localizer = momentLocalizer(moment);

function CalendarPage() {
    const [date, setDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [tasks, setTasks] = useState({});
    const [existingTasks, setExistingTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const apiUrl = 'http://localhost:8080/api/task';

    const fetchTasks = async () => {
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
        const localDateString = date.toLocaleDateString('en-CA'); // Format as 'YYYY-MM-DD'

        try {
            const response = await axios.post(`${apiUrl}/recordTask/${localDateString}/${taskId}`);
            if (response.status === 200) {
                console.log('Recorded Task:', response.data);
                fetchTasks(); // Refresh tasks to update the calendar
                setIsModalOpen(false); // Automatically close the modal after recording the task
            } else {
                console.error('Failed to record task, response status:', response.status);
            }
        } catch (error) {
            console.error('Error recording task:', error.response ? error.response.data : error.message);
            alert('Failed to record task. Please check the console for details.');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <div className="calendar-page">
            <Navigation /> {/* Add the Navigation component here */}

            {/* Title Container */}
            <div className="title-container">
                <h2>Calendar Page</h2>
            </div>

            {/* Record Task Container */}
            <div className="record-task-container">
                <h3>Assign Task for {date.toDateString()}</h3>

                <select
                    onChange={(e) => {
                        const taskId = Number(e.target.value);
                        const task = existingTasks.find(task => task.id === taskId);
                        setSelectedTask(task);
                    }}
                >
                    <option value="">Select an existing task</option>
                    {existingTasks.map((task) => (
                        <option key={task.id} value={task.id}>{task.task}</option>
                    ))}
                </select>

                <button
                    onClick={() => {
                        if (selectedTask) {
                            recordExistingTaskWithDate(selectedTask.id);
                        }
                    }}
                    disabled={!selectedTask}
                >
                    Record Existing Task
                </button>
            </div>

            {/* Calendar Component */}
            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable
                onSelectSlot={handleSelectSlot}
                style={{ height: 500 }}
            />

            {/* Modal for assigning task */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                contentLabel="Assign Task"
                className="task-modal"
                overlayClassName="task-modal-overlay"
            >
                <h3>Assign Task for {date.toDateString()}</h3>

                <select
                    onChange={(e) => {
                        const taskId = Number(e.target.value);
                        const task = existingTasks.find(task => task.id === taskId);
                        setSelectedTask(task);
                    }}
                >
                    <option value="">Select an existing task</option>
                    {existingTasks.map((task) => (
                        <option key={task.id} value={task.id}>{task.task}</option>
                    ))}
                </select>

                <button
                    onClick={() => {
                        if (selectedTask) {
                            recordExistingTaskWithDate(selectedTask.id);
                        }
                    }}
                    disabled={!selectedTask}
                >
                    Record Existing Task
                </button>
                <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </Modal>
        </div>
    );
}

export default CalendarPage;
