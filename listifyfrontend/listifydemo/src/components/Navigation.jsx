import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css';
import logo from '../assets/logo.png'; // Update the path to your logo image

const Navigation = () => {
    return (
        <div className="header">
            <div className="header-left">
                <img src={logo} alt="Logo" className="nav-logo" />
            </div>
            <nav className="header-nav">
                <NavLink to="/" className="nav-item">Home</NavLink>
                <NavLink to="/calendar" className="nav-item">Calendar</NavLink>
                <NavLink to="/wallet" className="nav-item">Wallet</NavLink>
                <NavLink to="/tasks" className="nav-item">Tasks</NavLink>
            </nav>
        </div>
    );
};

export default Navigation;
