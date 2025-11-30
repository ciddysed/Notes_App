import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
// No backend: using localStorage for mock data
import './App.css';
import logo from './assets/logo.png';

// Import pages
import Login from './pages/loginpage';
import UserRegister from './pages/Registeruser';
import CalendarPage from './pages/Calendar';
import Tasks from './pages/Tasks';
import Notification from './pages/Notification';
import Home from './pages/Home';
import Profile from './pages/Profile';
// Wallet panel for Cardano actions (lazy-loaded to reduce initial bundle size)
const WalletPanel = lazy(() => import('./components/cardano/WalletPanel'));

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

  const fetchUnreadCount = () => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const unread = notifications.filter((n) => !n.read).length;
    setUnreadCount(unread);
  };

  const markNotificationAsRead = (id) => {
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    localStorage.setItem('notifications', JSON.stringify(updated));
    fetchUnreadCount();
  };

  useEffect(() => {
    // seed mock notifications if empty
    const existing = JSON.parse(localStorage.getItem('notifications') || '[]');
    if (existing.length === 0) {
      const seed = [
        { id: 1, title: 'Welcome to Listify', read: false },
        { id: 2, title: 'Try creating your first task', read: false },
      ];
      localStorage.setItem('notifications', JSON.stringify(seed));
    }
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (type, credentials) => {
    // Mock login: accept any non-empty email/password and create a user profile
    const { email, password, firstName = 'John', lastName = 'Doe' } = credentials;
    if (!email || !password) {
      alert('Please provide email and password.');
      return false;
    }
    const userData = {
      id: Date.now(),
      email,
      firstName,
      lastName,
    };
    setUsername(`${userData.firstName} ${userData.lastName}`);
    setIsLoggedIn(true);
    setPage('home');
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userId', String(userData.id));
    return true;
  };

  const registerUser = async (type, credentials) => {
    // Mock register: store the user in localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = users.some((u) => u.email === credentials.email);
    if (exists) {
      alert('User already registered. Please login.');
      setPage('login');
      return;
    }
    const newUser = { id: Date.now(), ...credentials };
    localStorage.setItem('users', JSON.stringify([...users, newUser]));
    alert('User registered successfully!');
    setPage('login');
  };

  // Add logout function
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setPage('login');
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
              <NavLink to="/wallet" className="nav-link">WALLET</NavLink>
              <NavLink to="/tasks" className="nav-link">TASKS</NavLink>
              <button className="logout-button" onClick={handleLogout}>
                LOGOUT
              </button>
            </>
          ) : (
            <>
              {page === 'login' && (
                <Login setPage={setPage} handleLogin={handleLogin} setIsLoggedIn={setIsLoggedIn} />
              )}
              {page === 'userRegister' && (
                <UserRegister setPage={setPage} registerUser={registerUser} />
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
        <Route
          path="/wallet"
          element={
            <Suspense fallback={<div>Loading wallet...</div>}>
              <WalletPanel />
            </Suspense>
          }
        />
      </Routes>
          
        </div>
      </div>
    </Router>
  );
};

export default App;
      
