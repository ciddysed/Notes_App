import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../assets/logo.png';

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
      {/* LEFT SIDE */}
      <div style={styles.leftSide}>
        <img
          src={logo}
          alt="Logo"
          style={{
            width: '150px',            // adjust size as needed
            height: '150px',
            borderRadius: '50%',       // circular
            border: '4px solid var(--gold-primary)', // gold outline
            boxShadow: '0 0 15px 5px rgba(255, 215, 0, 0.6)', // soft gold glow
            marginBottom: '20px',
            boxSizing: 'border-box',   // ensures border is counted in size
          }}
        />
        
        <div style={styles.leftSideHeaderContainer}>
          <h1 style={styles.helloContainer}>Hello</h1>
          <h1 style={styles.leftSideHeader}>WELCOME TO LISTIFY!</h1>
        </div>
        <h5 style={styles.leftSideSubheader}>Never worry about missing a task again</h5>
        <button style={styles.registerButton} onClick={() => setPage('userRegister')}>
          User Register
        </button>
      </div>

      {/* RIGHT SIDE (FORM) */}
      <div style={styles.container}>
        <div style={styles.form}>
          <h2 style={styles.welcomeBackHeader}>Welcome👋</h2>
          
          {/* EMAIL INPUT */}
          <div style={styles.inputWrapper}>
            <FaEnvelope style={styles.icon} />
            <input
              type="text"
              placeholder="Email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD INPUT */}
          <div style={styles.inputWrapper}>
            <FaLock style={styles.icon} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              style={styles.iconButton}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          {/* LOGIN BUTTON */}
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
    width: '50%',
    height: '100vh',
    backgroundColor: 'var(--maroon-primary)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
    borderTopRightRadius: '40px',
    borderBottomRightRadius: '40px',
  
  },
  logo: {
    width: '120px',
    marginBottom: '20px',
  },
  leftSideHeaderContainer: {
    marginBottom: '15px',
    textAlign: 'center',
  },
  helloContainer: {
    fontSize: '48px',
    fontWeight: 'bold',
    margin: '0',
    color: 'var(--gold-primary)',
  },
  leftSideHeader: {
    fontSize: '26px',
    fontWeight: '600',
    margin: '10px 0',
    color: '#fff',
  },
  leftSideSubheader: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: '30px',
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    height: '100vh',
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#f9f9f9',
  },
  form: {
    backgroundColor: '#fff',
    padding: '40px 50px',
    borderRadius: '12px',
    boxShadow: '0 6px 18px rgba(0, 0, 0, 0.1)',
    width: '350px',
    textAlign: 'center',
    animation: 'popUp 0.6s ease',
  },
  welcomeBackHeader: {
    fontSize: '24px',
    fontWeight: '600',
    color: 'var(--maroon-primary)',
    marginBottom: '25px',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    marginBottom: '18px',
  },
  input: {
    width: '100%',
    padding: '12px 40px 12px 35px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '15px',
    outline: 'none',
    transition: 'border-color 0.3s, box-shadow 0.3s',
  },
  icon: {
    position: 'absolute',
    left: '10px',
    color: 'gray',
    fontSize: '16px',
  },
  iconButton: {
    position: 'absolute',
    right: '10px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: 'var(--maroon-primary)',
    fontSize: '18px',
  },
  buttonContainer: {
    margin: '20px 0',
  },
  button: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'var(--maroon-primary)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
  registerButton: {
    marginTop: '15px',
    padding: '12px',
    backgroundColor: 'var(--gold-primary)',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    fontWeight: '600',
    cursor: 'pointer',
    fontSize: '15px',
    transition: 'background-color 0.3s ease, transform 0.2s ease',
  },
};

export default Login;
