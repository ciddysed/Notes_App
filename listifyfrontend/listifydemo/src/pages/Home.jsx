import React from 'react';
import './Home.css';
import logo from '../assets/logo.png'; // Ensure the logo path is correct
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

function Home({ setIsLoggedIn }) {
    const navigate = useNavigate(); // Initialize the navigate function

    const handleGetStarted = () => {
        // Navigate to the tasks page
        navigate('/tasks');
    };

    // Logout function
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn'); // Clear login state
        setIsLoggedIn(false); // Update login state
        navigate('/'); // Redirect to login page
    };

    return (
        <div className="home-container">
            <header className="home-header">
                <img src={logo} alt="logo" className="logo" />
                <div className="welcome-container">
                    <div className="welcome-box">
                        <h1>Welcome</h1>
                    </div>
                    <h1 className="welcome-text">to Our Task Manager</h1>
                </div>
                <p className="tagline">Never worry about missing a task again</p>
                <div className="cta-section">
                    <button className="cta-button" onClick={handleGetStarted}>
                        Get Started
                    </button>
                </div>
                <p className="footer-text">&copy; 2024 Task Manager App. All rights reserved.</p>
            </header>
        </div>
    );
}

export default Home;
