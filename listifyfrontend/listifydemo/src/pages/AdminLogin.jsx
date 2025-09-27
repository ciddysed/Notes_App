import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = ({ handleLogin, registerUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [adminID, setAdminID] = useState('');
  const navigate = useNavigate();

  const loginAsAdmin = async () => {
    const success = await handleLogin('admins', { email, password });
    if (success) {
      navigate('/calendar');
    }
  };

  const handleAdminRegister = async () => {
    await registerUser('admins', { adminID, email, password });
    setIsRegistering(false);
    // Clear form
    setAdminID('');
    setEmail('');
    setPassword('');
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftSide}>
        <div style={styles.leftSideHeaderContainer}>
          <h1 style={styles.helloContainer}>Admin</h1>
          <h1 style={styles.leftSideHeader}>PORTAL</h1>
        </div>
        <h5 style={styles.leftSideSubheader}>Administrative access to LISTIFY</h5>
        <button style={styles.backToUserButton} onClick={() => navigate('/')}>
          Back to User Login
        </button>
      </div>

      <div style={styles.container}>
        <div style={styles.form}>
          <h2 style={styles.welcomeBackHeader}>
            {isRegistering ? 'Admin Register' : 'Admin Login'}
          </h2>
          
          {isRegistering && (
            <input
              type="text"
              placeholder="Admin ID"
              style={styles.input}
              value={adminID}
              onChange={(e) => setAdminID(e.target.value)}
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          
          <div style={styles.passwordContainer}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              style={styles.toggleButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          
          <div style={styles.buttonContainer}>
            <button 
              style={styles.button} 
              onClick={isRegistering ? handleAdminRegister : loginAsAdmin}
            >
              {isRegistering ? 'Register' : 'Login'}
            </button>
          </div>
          
          <button 
            style={styles.switchButton} 
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? 'Already have an account? Login' : 'Need to register? Click here'}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
    background: 'linear-gradient(135deg, #dc3545, #8b0000)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  leftSide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%',
    height: '100vh',
    backgroundColor: '#ffffff',
    boxShadow: '16px 0 40px rgba(0, 0, 0, 0.4)',
    borderRadius: '30px',
    zIndex: 2,
    padding: '50px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftSideHeaderContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  helloContainer: {
    backgroundColor: '#dc3545',
    padding: '5px 10px',
    borderRadius: '20px',
    marginRight: '15px',
    fontSize: '60px',
    color: 'white',
  },
  leftSideHeader: {
    fontSize: '60px',
    fontWeight: 'bold',
    color: '#dc3545',
  },
  leftSideSubheader: {
    fontSize: '18px',
    fontWeight: 'normal',
    color: '#555',
    marginBottom: '30px',
  },
  backToUserButton: {
    padding: '12px',
    backgroundColor: '#182848',
    color: '#fff',
    border: 'none',
    borderRadius: '15px',
    cursor: 'pointer',
    fontWeight: 'bold',
    width: '200px',
    fontSize: '20px',
    transition: 'background-color 0.3s, transform 0.2s',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    height: '100vh',
    background: 'linear-gradient(135deg, #dc3545, #8b0000)',
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 0,
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '50px 60px',
    borderRadius: '12px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
    width: '380px',
    textAlign: 'center',
    animation: 'popUp 0.5s ease-out',
    marginLeft: '100px',
  },
  welcomeBackHeader: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#f9f9f9',
    color: '#333',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  passwordContainer: {
    position: 'relative',
    marginTop: '5px',
  },
  toggleButton: {
    position: 'absolute',
    right: '10px',
    top: '10px',
    background: 'none',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
  },
  buttonContainer: {
    margin: '20px 0',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s, transform 0.2s',
    marginBottom: '5px',
  },
  switchButton: {
    background: 'none',
    border: 'none',
    color: '#dc3545',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
    marginTop: '10px',
  },
};

export default AdminLogin;
