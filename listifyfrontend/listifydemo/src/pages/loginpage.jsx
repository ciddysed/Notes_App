import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setPage, handleLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const loginAsUser = async () => {
    const success = await handleLogin('users', { email, password });
    if (success) {
      navigate('/');
    }
  };

  return (
    <>
      <div style={styles.leftSide}>
        <div style={styles.leftSideHeaderContainer}>
          <h1 style={styles.helloContainer}>Hello</h1>
          <h1 style={styles.leftSideHeader}>WELCOME TO LISTIFY!</h1>
        </div>
        <h5 style={styles.leftSideSubheader}>Never worry about missing a task again</h5>
        <button style={styles.registerButton} onClick={() => setPage('userRegister')}>User Register</button>
      </div>

      <div style={styles.container}>
        <div style={styles.form}>
          <h2 style={styles.welcomeBackHeader}>Welcome Back</h2>
          
          <input
            type="text"
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
            <button style={styles.button} onClick={loginAsUser}>Login as User</button>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  leftSide: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '60%', // Fills the left side of the screen
    height: '100vh',
    backgroundColor: '#ffffff', // White background
    boxShadow: '16px 0 40px rgba(0, 0, 0, 0.4)', // Bigger and more visible shadow
    borderRadius: '30px',
    zIndex: 2, // Ensure the left side is above the form
    padding: '50px',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif', // Add a font family
    color: '#333', // Change text color
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center', // Center the content both vertically and horizontally
  },
  leftSideHeaderContainer: {
    display: 'flex', // Display header content in a row
    justifyContent: 'center', // Center them horizontally
    alignItems: 'center', // Align them vertically
  },
  helloContainer: {
    backgroundColor: '#4b6cb7', // Blue background
    padding: '5px 10px',
    borderRadius: '20px',
    marginRight: '15px', // Space between "Hello" and "WELCOME"
    fontSize: '60px',
    color: 'white', // Set text color to white
  },
  leftSideHeader: {
    fontSize: '60px', // Make the font even bigger
    fontWeight: 'bold', // Ensure boldness
    color: '#4b6cb7', // Set the color to blue for emphasis
  },
  leftSideSubheader: {
    fontSize: '18px', // Increase font size
    fontWeight: 'normal', // Normal weight for subheader
    color: '#555', // Slightly lighter color
    marginBottom: '30px',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%', // Right half of the screen
    height: '100vh',
    background: 'linear-gradient(135deg, #4b6cb7, #182848)', // Gradient background
    position: 'absolute',
    top: 0,
    right: 0, // Move the form to the right side
    zIndex: 0, // Ensure the form is behind the left side div
  },
  form: {
    backgroundColor: '#ffffff',
    padding: '50px 60px', // Increased padding for more space
    borderRadius: '12px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)',
    width: '380px', // Wider form
    textAlign: 'center',
    animation: 'popUp 0.5s ease-out',
    marginLeft: '100px',
  },
  welcomeBackHeader: {
    fontSize: '32px', // Increased font size
    fontWeight: 'bold', // Bold style
    color: '#4b6cb7', // Blue color
    marginBottom: '20px',
  },
  header: {
    fontSize: '24px',
    fontWeight: '700',
    marginBottom: '20px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0', // Reduced margin between fields
    border: '1px solid #ddd',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#f9f9f9',
    color: '#333',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  inputFocus: {
    borderColor: '#4b6cb7',
    boxShadow: '0 0 5px rgba(75, 108, 183, 0.5)',
  },
  passwordContainer: {
    position: 'relative',
    marginTop: '5px', // Reduced margin top to bring it closer to the email input
  },
  toggleButton: {
    position: 'absolute',
    right: '10px',
    top: '10px',
    background: 'none',
    border: 'none',
    color: '#4b6cb7',
    cursor: 'pointer',
  },
  buttonContainer: {
    margin: '20px 0',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4b6cb7',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '16px',
    transition: 'background-color 0.3s, transform 0.2s',
    marginBottom: '5px',
  },
  buttonHover: {
    backgroundColor: '#365f91',
    transform: 'scale(1.05)',
  },
  registerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  registerButton: {
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
  registerButtonHover: {
    backgroundColor: '#0d1e2d',
    transform: 'scale(1.05)',
  },
};

const keyframes = `
@keyframes popUp {
  0% {
    transform: translateY(50px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}`;

export default Login;
    
    