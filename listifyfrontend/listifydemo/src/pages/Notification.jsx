import React, { useEffect, useState } from 'react'; 
import './notification.css';

const Notification = ({ fetchUnreadCount, markNotificationAsRead }) => {
  const [notifications, setNotifications] = useState([]);

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/notifications');
      const data = await response.json();
      // Load the read state from localStorage and set it for each notification
      const storedNotifications = JSON.parse(localStorage.getItem('notificationsState')) || [];
      const updatedNotifications = data.map((notification) => {
        const storedNotification = storedNotifications.find(item => item.id === notification.id);
        return {
          ...notification,
          isRead: storedNotification ? storedNotification.isRead : notification.isRead,
        };
      });
      setNotifications(updatedNotifications);
      fetchUnreadCount(); // Update unread count in parent
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await markNotificationAsRead(id); // Delegate to parent method
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, isRead: true } : notification
        )
      );
      
      // Save the updated read state to localStorage
      const updatedNotifications = notifications.map((notification) =>
        notification.id === id ? { ...notification, isRead: true } : notification
      );
      localStorage.setItem('notificationsState', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const generateNotifications = async () => {
    try {
      await fetch('http://localhost:8080/api/notifications/generate', { method: 'POST' });
      alert('Notifications generated successfully!');
      fetchNotifications(); // Refresh all notifications
    } catch (error) {
      console.error('Error generating notifications:', error);
      alert('Failed to generate notifications. Please try again.');
    }
  };

  return (
    <>
   
      <div className="notification-container">
        <div className='NotificationBox'>
          <h2 >Notifications</h2>
        </div>
        {notifications.length > 0 ? (
          <ul className="notification-list">
            {notifications.map((notification) => (
              <li
                key={notification.id}
                className={`notification-item ${notification.isRead ? 'read' : ''}`}
                onClick={() => !notification.isRead && markAsRead(notification.id)} // Prevent click if already read
              >
                <p className="notification-title">REMINDER!!!</p>
                <p className="notification-task">{`Task: ${notification.task.task}`}</p>
                <p className="notification-date">{`Due Date: ${notification.task.date}`}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-notifications">No notifications available</p>
        )}

      </div>
      <button className="generate-btn" onClick={generateNotifications}>
      Generate Notifications
    </button>
   </>
  );
};

export default Notification;
