import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import logo from '../assets/logo.png'; // optional: show logo in left side

const UserRegister = ({ setPage, registerUser, checkEmailExists }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailUnique, setIsEmailUnique] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkEmail = async () => {
      if (email) {
        const isUnique = await checkEmailExists(email);
        setIsEmailUnique(isUnique);
      }
    };
    checkEmail();
  }, [email, checkEmailExists]);

  const isFormValid = () => firstName && lastName && email && password && isEmailUnique;

  const handleRegister = async () => {
    const success = await registerUser('users', { firstName, lastName, email, password });
    if (success) navigate('/');
  };

  return (
    <>
      <div style={styles.leftSide}>
        {logo && <img
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
                />}
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
          <input type="text" placeholder="First Name" style={styles.input} value={firstName} onChange={e => setFirstName(e.target.value)} />
          <input type="text" placeholder="Last Name" style={styles.input} value={lastName} onChange={e => setLastName(e.target.value)} />
          <input type="email" placeholder="Email" style={styles.input} value={email} onChange={e => setEmail(e.target.value)} />
          {!isEmailUnique && <p style={styles.errorText}>Email is already taken</p>}

          <div style={styles.passwordContainer}>
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" style={styles.input} value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" style={styles.toggleButton} onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>

          <button style={styles.button} onClick={handleRegister} disabled={!isFormValid()}>Register</button>
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
    width: '70%',
    height: '100vh',
    backgroundColor: 'var(--maroon-primary)',
    color: 'var(--gold-primary)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
    fontFamily: '"Segoe UI", "Roboto", sans-serif',
    borderTopRightRadius: '40px',
    borderBottomRightRadius: '40px',
    boxShadow: '8px 0 30px rgba(0,0,0,0.2)',
  },
  logo: {
    width: '120px',
    marginBottom: '20px',
  },
  leftSideHeaderContainer: {
    marginBottom: '15px',
    textAlign: 'center',
  },
  helloContainer: { fontSize: '54px', fontWeight: 'bold', margin: '0', color: 'var(--gold-primary)' },
  leftSideHeader: { fontSize: '28px', fontWeight: '600', margin: '10px 0', color: '#fff' },
  leftSideSubheader: { fontSize: '16px', color: 'rgba(255,255,255,0.8)', marginBottom: '30px' },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '30%',
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
    boxShadow: '0 6px 18px rgba(0,0,0,0.1)',
    width: '350px',
    textAlign: 'center',
  },
  welcomeBackHeader: { fontSize: '26px', fontWeight: '600', color: 'var(--maroon-primary)', marginBottom: '20px' },
  input: { width: '100%', padding: '12px', margin: '12px 0', border: '1px solid #ccc', borderRadius: '6px', fontSize: '15px', transition: 'border-color 0.3s, box-shadow 0.3s' },
  passwordContainer: { position: 'relative' },
  toggleButton: { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--maroon-primary)', cursor: 'pointer', fontSize: '18px' },
  button: { width: '100%', padding: '14px', backgroundColor: 'var(--maroon-primary)', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '15px', marginTop: '20px' },
  errorText: { color: 'red', fontSize: '14px', marginTop: '5px' },
  registerButton: { marginTop: '15px', padding: '12px', backgroundColor: 'var(--gold-primary)', color: '#000', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', fontSize: '15px' },
};

export default UserRegister;
