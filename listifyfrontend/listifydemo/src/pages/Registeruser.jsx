import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const UserRegister = ({ setPage, registerUser, checkEmailExists }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if email is unique when email input changes
    const checkEmail = async () => {
      if (email) {
        const isUnique = await checkEmailExists(email);
        setIsEmailUnique(isUnique);
      }
    };
    checkEmail();
  }, [email, checkEmailExists]);

  const isFormValid = () => {
    return firstName && lastName && email && password && isEmailUnique;
  };

  const handleRegister = async () => {
    const success = await registerUser('users', { firstName, lastName, email, password });
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
        <button style={styles.registerButton} onClick={() => setPage('login')}>Back to Login</button>
      </div>

      <div style={styles.container}>
        <div style={styles.form}>
          <h2 style={styles.welcomeBackHeader}>User Register</h2>
          <input
            type="text"
            placeholder="First Name"
            style={styles.input}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name"
            style={styles.input}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {!isEmailUnique && <p style={styles.errorText}>Email is already taken</p>}
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
          <button
            style={styles.button}
            onClick={handleRegister}
            disabled={!isFormValid()}
          >
            Register
          </button>
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
    backgroundColor: '#4b6cb7',
    padding: '5px 10px',
    borderRadius: '20px',
    marginRight: '15px',
    fontSize: '60px',
    color: 'white',
  },
  leftSideHeader: {
    fontSize: '60px',
    fontWeight: 'bold',
    color: '#4b6cb7',
  },
  leftSideSubheader: {
    fontSize: '18px',
    fontWeight: 'normal',
    color: '#555',
    marginBottom: '30px',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '45%',
    height: '100vh',
    background: 'linear-gradient(135deg, #4b6cb7, #182848)',
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
    color: '#4b6cb7',
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
    color: '#4b6cb7',
    cursor: 'pointer',
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
    marginTop: '20px',
  },
  errorText: {
    color: 'red',
    fontSize: '14px',
    marginTop: '5px',
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

export default UserRegister;
