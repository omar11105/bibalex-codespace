import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import axios from '../api/axios';
import './EmailVerification.css';

function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided');
      return;
    }
    
    verifyEmail(token);
  }, [searchParams]);
  
  const verifyEmail = async (token) => {
    try {
      await axios.get(`/api/auth/verify?token=${token}`);
      setStatus('success');
      setMessage('Email verified successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setStatus('error');
      if (error.response?.data?.error) {
        setMessage(error.response.data.error);
      } else {
        setMessage('Verification failed. Please try again or contact support.');
      }
    }
  };
  
  const handleResendVerification = () => {
    navigate('/login');
  };
  
  const renderContent = () => {
    switch (status) {
      case 'verifying':
        return (
          <div className="verification-content">
            <div className="loading-spinner"></div>
            <h2>Verifying your email...</h2>
            <p>Please wait while we verify your email address.</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="verification-content">
            <div className="success-icon">✓</div>
            <h2>Email Verified Successfully!</h2>
            <p>{message}</p>
            <button onClick={() => navigate('/login')} className="login-button">
              Go to Login
            </button>
          </div>
        );
      
      case 'error':
        return (
          <div className="verification-content">
            <div className="error-icon">✗</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <div className="verification-actions">
              <button onClick={handleResendVerification} className="resend-button">
                Try Again
              </button>
              <button onClick={() => navigate('/login')} className="login-button">
                Go to Login
              </button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="email-verification-container">
      <NavBar />
      <div className="logo-bar">
        <h1>BA</h1>
        <p> Built for recruiters and candidates alike</p>
      </div>
      <div className="verification-panel">
        {renderContent()}
      </div>
    </div>
  );
}

export default EmailVerification; 