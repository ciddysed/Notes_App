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
          <div className="profile-avatar" title={`${username}'s Profile`}>
            {username ? username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="welcome-box">
            <h1>Welcome Back</h1>
          </div>
          <h1 className="welcome-text">{username}!</h1>
          <p style={{ color: 'var(--gold-secondary)', fontSize: '1.2rem', margin: 0, fontStyle: 'italic' }}>
            Manage your account settings
          </p>
        </div>
      </div>

      {userDetails ? (
        <div className="user-details">
          {editing ? (
            <div className="user-info-card">
              <h2 style={{ 
                color: 'var(--maroon-primary)', 
                marginBottom: '30px', 
                fontFamily: 'Playfair Display, serif',
                fontSize: '2rem',
                textAlign: 'center'
              }}>
                ✏️ Edit Profile Information
              </h2>
              <div className="edit-form">
                <input
                  type="text"
                  value={userDetails.firstName || ''}
                  onChange={(e) => setUserDetails({ ...userDetails, firstName: e.target.value })}
                  placeholder="Enter your first name"
                />
                <input
                  type="text"
                  value={userDetails.lastName || ''}
                  onChange={(e) => setUserDetails({ ...userDetails, lastName: e.target.value })}
                  placeholder="Enter your last name"
                />
                <div className="button-group">
                  <button onClick={handleUpdateDetails}>💾 Save Changes</button>
                  <button className="secondary" onClick={() => setEditing(false)}>❌ Cancel</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="user-info-card">
              <h2 style={{ 
                color: 'var(--maroon-primary)', 
                marginBottom: '30px', 
                fontFamily: 'Playfair Display, serif',
                fontSize: '2rem',
                textAlign: 'center'
              }}>
                👤 Profile Information
              </h2>
              <p><strong>First Name:</strong> {userDetails.firstName || 'Not provided'}</p>
              <p><strong>Last Name:</strong> {userDetails.lastName || 'Not provided'}</p>
              <p><strong>Email:</strong> {userDetails.email}</p>
              <p><strong>Member Since:</strong> {new Date().getFullYear()}</p>
              <div className="button-group">
                <button onClick={() => setEditing(true)}>✏️ Edit Profile</button>
              </div>
            </div>
          )}

          {/* 🔐 Change Email */}
          <div className="section">
            <h3>Email Management</h3>
            {showEmailChange ? (
              step === 1 ? (
                <div>
                  <p style={{ 
                    color: 'var(--maroon-secondary)', 
                    marginBottom: '25px',
                    fontSize: '1.1rem',
                    textAlign: 'center'
                  }}>
                    📧 Enter your new email address below
                  </p>
                  <input
                    type="email"
                    placeholder="Enter new email address"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                  />
                  <div className="button-group">
                    <button onClick={() => sendVerificationCode('email')}>📧 Send Verification Code</button>
                    <button className="secondary" onClick={() => setShowEmailChange(false)}>❌ Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ 
                    color: 'var(--maroon-secondary)', 
                    marginBottom: '25px',
                    fontSize: '1.1rem',
                    textAlign: 'center'
                  }}>
                    🔐 Check your email and enter the 6-digit code
                  </p>
                  <input
                    placeholder="Enter 6-digit verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                  />
                  <div className="button-group">
                    <button onClick={updateEmail}>✅ Verify & Update Email</button>
                    <button className="secondary" onClick={() => { 
                      setShowEmailChange(false); 
                      setStep(1); 
                      setCode(''); 
                      setNewEmail('');
                    }}>❌ Cancel</button>
                  </div>
                </div>
              )
            ) : (
              <div>
                <p style={{ 
                  color: 'var(--maroon-secondary)', 
                  marginBottom: '25px',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  lineHeight: '1.6'
                }}>
                  🛡️ Update your account email address securely with verification
                </p>
                <div className="button-group">
                  <button onClick={() => setShowEmailChange(true)}>📧 Change Email Address</button>
                </div>
              </div>
            )}
          </div>

          {/* 🔐 Change Password */}
          <div className="section">
            <h3>Security Settings</h3>
            {showPasswordChange ? (
              step === 1 ? (
                <div>
                  <p style={{ 
                    color: 'var(--maroon-secondary)', 
                    marginBottom: '25px',
                    fontSize: '1.1rem',
                    textAlign: 'center'
                  }}>
                    🔑 Create a strong, secure password
                  </p>
                  <input
                    type="password"
                    placeholder="Enter new secure password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <div className="button-group">
                    <button onClick={() => sendVerificationCode('password')}>📧 Send Verification Code</button>
                    <button className="secondary" onClick={() => setShowPasswordChange(false)}>❌ Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <p style={{ 
                    color: 'var(--maroon-secondary)', 
                    marginBottom: '25px',
                    fontSize: '1.1rem',
                    textAlign: 'center'
                  }}>
                    🔐 Enter the verification code sent to your email
                  </p>
                  <input
                    placeholder="Enter 6-digit verification code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={6}
                    style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.5rem' }}
                  />
                  <div className="button-group">
                    <button onClick={updatePassword}>✅ Verify & Update Password</button>
                    <button className="secondary" onClick={() => { 
                      setShowPasswordChange(false); 
                      setStep(1); 
                      setCode('');
                      setNewPassword('');
                    }}>❌ Cancel</button>
                  </div>
                </div>
              )
            ) : (
              <div>
                <p style={{ 
                  color: 'var(--maroon-secondary)', 
                  marginBottom: '25px',
                  fontSize: '1.1rem',
                  textAlign: 'center',
                  lineHeight: '1.6'
                }}>
                  🛡️ Keep your account secure with a strong password
                </p>
                <div className="button-group">
                  <button onClick={() => setShowPasswordChange(true)}>🔑 Change Password</button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="loading">
          <p>Loading your profile data...</p>
        </div>
      )}

      <div className="divider"></div>
      <div className="logout-section">
        <p style={{ 
          color: 'var(--maroon-secondary)', 
          marginBottom: '20px',
          fontSize: '1.1rem'
        }}>
          Ready to leave? Sign out securely below
        </p>
        <button className="danger" onClick={handleLogout}>🚪 Sign Out Securely</button>
      </div>
    </div>
  );
};

export default Profile;
