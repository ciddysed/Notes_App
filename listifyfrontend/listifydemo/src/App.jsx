import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import logo from './assets/logo.png';

// Import pages
import Login from './pages/loginpage';
import UserRegister from './pages/Registeruser';
import AdminRegister from './pages/Registeradmin';
import CalendarPage from './pages/Calendar';
import Tasks from './pages/Tasks';
import Notification from './pages/Notification';
import Home from './pages/Home';
import Profile from './pages/Profile';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState('login');
  const [username, setUsername] = useState('John Doe');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('isLoggedIn');
    const storedUser = localStorage.getItem('user');
    if (loggedInUser === 'true' && storedUser) {
      const user = JSON.parse(storedUser);
      setUsername(`${user.firstName} ${user.lastName}`);
      setIsLoggedIn(true);
    }
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/notifications/unread');
      setUnreadCount(response.data.length);
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
    }
  };

  const markNotificationAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/${id}/read`);
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (type, credentials) => {
    try {
      const url =
        type === 'users'
          ? 'http://localhost:8080/api/auth/login/user'
          : 'http://localhost:8080/api/auth/login/admin';

      const response = await axios.post(url, credentials);
      const userData = response.data;

      setUsername(`${userData.firstName} ${userData.lastName}`);
      setIsLoggedIn(true);
      setPage('home');

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userId', userData.id); // important for profile use

      return true;
    } catch (error) {
      alert('Invalid credentials or user not registered.');
      console.error('Error logging in:', error);
      return false;
    }
  };

  const registerUser = async (type, credentials) => {
    try {
      const url =
        type === 'users'
          ? 'http://localhost:8080/api/auth/register/user'
          : 'http://localhost:8080/api/auth/register/admin';
      await axios.post(url, credentials);
      alert(`${type === 'users' ? 'User' : 'Admin'} registered successfully!`);
      setPage('login');
    } catch (error) {
      alert('Registration failed. Please try again.');
      console.error('Error registering:', error);
    }
  };

  return (
    <Router>
      <div className="Layout">
        {/* Side Navigation */}
        <div className="SideNavigation">
          <div className="profile-header">
            <div className="header-right">
              <NavLink to="/notifications" className="notification-btn" aria-label="Notifications">
                🔔
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </NavLink>
            </div>

            <div className="header-left">
              <NavLink to={`/profile/${username}`} className="profile-image-link">
                <span className="username">{username}</span>
              </NavLink>
              <img src={logo} alt="User Profile" className="profile-image" />
            </div>
          </div>

          {isLoggedIn ? (
            <>
              <NavLink to="/" className="nav-link">HOME</NavLink>
              <NavLink to="/calendar" className="nav-link">CALENDAR</NavLink>
              <NavLink to="/tasks" className="nav-link">TASKS</NavLink>
            </>
          ) : (
            <>
              {page === 'login' && (
                <Login setPage={setPage} handleLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} />
              )}
              {page === 'userRegister' && (
                <UserRegister setPage={setPage} registerUser={registerUser} />
              )}
              {page === 'adminRegister' && (
                <AdminRegister setPage={setPage} registerUser={registerUser} />
              )}
            </>
          )}
        </div>

        {/* Main Content */}
        <div className="MainContent">
        <Routes>
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Home setIsLoggedIn={setIsLoggedIn} />
            ) : (
              <Login setPage={setPage} handleLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} />
            )
          }
        />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route
          path="/notifications"
          element={
            <Notification
              fetchUnreadCount={fetchUnreadCount}
              markNotificationAsRead={markNotificationAsRead}
            />
          }
        />
        <Route
          path="/profile/:username"
          element={<Profile username={username} setIsLoggedIn={setIsLoggedIn} />}
        />
      </Routes>
          
        </div>
      </div>
    </Router>
  );
};

export default App;
