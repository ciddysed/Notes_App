import React, { useState } from 'react';
import axios from 'axios';

const ChangeEmail = () => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const userId = localStorage.getItem('userId');

  const sendCode = async () => {
    await axios.post(`http://localhost:8080/api/auth/send-verification-code`, null, {
      params: { userId, email }
    });
    setStep(2);
  };

  const verifyAndChange = async () => {
    await axios.post(`http://localhost:8080/api/auth/update-email`, null, {
      params: { userId, newEmail: email, code }
    });
    alert("Email updated!");
  };

  return (
    <div>
      <h2>Change Email</h2>
      {step === 1 ? (
        <>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="New Email" />
          <button onClick={sendCode}>Send Verification Code</button>
        </>
      ) : (
        <>
          <input value={code} onChange={e => setCode(e.target.value)} placeholder="Enter Code" />
          <button onClick={verifyAndChange}>Verify & Update</button>
        </>
      )}
    </div>
  );
};

export default ChangeEmail;
