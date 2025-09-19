import React, { useState } from 'react';

const AdminRegister = ({ setPage, registerUser }) => {
  const [adminID, setAdminID] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password

  return (
    
    <div style={styles.page}>
       <div style={styles.leftSide}>
        <div style={styles.leftSideHeaderContainer}>
          <h1 style={styles.helloContainer}>Hello</h1>
          <h1 style={styles.leftSideHeader}>WELCOME TO LISTIFY!</h1>
        </div>
        <h5 style={styles.leftSideSubheader}>Never worry about missing a task again</h5>
        <button style={styles.registerButton} onClick={() => setPage('userRegister')}>User Register</button>
      </div>

      <div style={styles.container}>
        <h2 style={styles.header}>Admin Register</h2>
        <input
          type="text"
          placeholder="Admin ID"
          style={styles.input}
          value={adminID}
          onChange={(e) => setAdminID(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div style={styles.passwordContainer}>
          <input
            type={showPassword ? 'text' : 'password'} // Toggle password visibility
            placeholder="Password"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            style={styles.toggleButton}
            onClick={() => setShowPassword(!showPassword)} // Toggle show/hide
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
        <button
          style={styles.button}
          onClick={() => registerUser('admins', { adminID, email, password })}
        >
          Register
        </button>
        <button style={styles.backButton} onClick={() => setPage('login')}>
          Back to Login
        </button>
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
    background: 'linear-gradient(135deg, #4b6cb7, #182848)', // Same gradient background as Login
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
    width: '350px',
    padding: '30px',
    textAlign: 'center',
    backgroundColor: '#ffffff', // Same background color as Login form
    borderRadius: '12px',
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)', // Matching shadow from Login form
    marginLeft: '1100px',

  },
  header: {
    fontSize: '32px', // Same header font size as Login
    fontWeight: 'bold',
    color: '#4b6cb7', // Blue color for header
    marginBottom: '20px',
  },
  input: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    border: '1px solid #ddd', // Matching border style
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#f9f9f9',
    color: '#333',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  passwordContainer: {
    position: 'relative',
    marginTop: '5px', // Reduced margin top to align with other inputs
  },
  toggleButton: {
    position: 'absolute',
    right: '10px',
    top: '10px',
    border: 'none',
    background: 'none',
    color: '#4b6cb7',
    cursor: 'pointer',
    fontSize: '14px',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#4b6cb7', // Same blue color as Login button
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '15px',
    transition: 'background-color 0.3s ease',
  },
  backButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#182848', // Darker blue background for back button
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '16px',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
};

export default AdminRegister;
