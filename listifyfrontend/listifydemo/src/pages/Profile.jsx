import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import logo from '../assets/logo.png';

const Profile = ({ username, setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [editing, setEditing] = useState(false);
  const [showEmailChange, setShowEmailChange] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const userId = localStorage.getItem('userId');
  const apiUrl = 'http://localhost:8080/api/auth';

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`${apiUrl}/student/${userId}`);
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Failed to fetch user details.');
      }
    };

    if (userId) fetchUserDetails();
  }, [userId]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate('/');
  };

  const handleUpdateDetails = async () => {
    try {
      const response = await axios.put(`${apiUrl}/student/${userId}`, userDetails);
      setUserDetails(response.data);
      setEditing(false);
      alert('User details updated successfully.');
    } catch (error) {
      console.error('Error updating user details:', error);
      alert('Failed to update user details.');
    }
  };

  const sendVerificationCode = async (type) => {
    try {
      await axios.post(`${apiUrl}/send-verification-code`, null, {
        params: { userId, email: newEmail || userDetails.email }
      });
      setStep(2);
    } catch (error) {
      alert('Failed to send verification code.');
      console.error(error);
    }
  };

  const updateEmail = async () => {
    try {
      await axios.post(`${apiUrl}/update-email`, null, {
        params: { userId, newEmail, code }
      });
      alert('Email updated!');
      setShowEmailChange(false);
      window.location.reload();
    } catch (error) {
      alert('Invalid verification code or failed to update email.');
    }
  };

  const updatePassword = async () => {
    try {
      await axios.post(`${apiUrl}/update-password`, null, {
        params: { userId, newPassword, code }
      });
      alert('Password updated!');
      setShowPasswordChange(false);
    } catch (error) {
      alert('Invalid verification code or failed to update password.');
    }
  };

  return (
    <div className="profile-container">
      <div className="profileHeader">
        <div className="welcome-container">
          <div className="welcome-box">
            <h1>Welcome</h1>
          </div>
          <h1 className="welcome-text">, {username}!</h1>
        </div>
      </div>

      <div className="divider"></div>

      {userDetails ? (
        <div className="user-details">
          {editing ? (
            <div>
              <input
                type="text"
                value={userDetails.firstName || ''}
                onChange={(e) => setUserDetails({ ...userDetails, firstName: e.target.value })}
                placeholder="First Name"
              />
              <input
                type="text"
                value={userDetails.lastName || ''}
                onChange={(e) => setUserDetails({ ...userDetails, lastName: e.target.value })}
                placeholder="Last Name"
              />
              <button onClick={handleUpdateDetails}>Save</button>
              <button onClick={() => setEditing(false)}>Cancel</button>
            </div>
          ) : (
            <div>
              <p><strong>First Name:</strong> {userDetails.firstName}</p>
              <p><strong>Last Name:</strong> {userDetails.lastName}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <button onClick={() => setEditing(true)}>Edit</button>
            </div>
          )}

          {/* 🔐 Change Email */}
          <div className="section">
            <h3>Change Email</h3>
            {showEmailChange ? (
              step === 1 ? (
                <>
                  <input
                    type="email"
                    placeholder="New Email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <button onClick={() => sendVerificationCode('email')}>Send Verification Code</button>
                </>
              ) : (
                <>
                  <input
                    placeholder="Enter Verification Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <button onClick={updateEmail}>Verify & Update Email</button>
                </>
              )
            ) : (
              <button onClick={() => setShowEmailChange(true)}>Change Email</button>
            )}
          </div>

          {/* 🔐 Change Password */}
          <div className="section">
            <h3>Change Password</h3>
            {showPasswordChange ? (
              step === 1 ? (
                <>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button onClick={() => sendVerificationCode('password')}>Send Verification Code</button>
                </>
              ) : (
                <>
                  <input
                    placeholder="Enter Verification Code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                  />
                  <button onClick={updatePassword}>Verify & Update Password</button>
                </>
              )
            ) : (
              <button onClick={() => setShowPasswordChange(true)}>Change Password</button>
            )}
          </div>
        </div>
      ) : (
        <p>Loading user details...</p>
      )}

      <div className="divider"></div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;
