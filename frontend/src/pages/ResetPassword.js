import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { resetPassword, validateResetToken } from '../api/Auth';
import './ResetPassword.css';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setError('Invalid reset link. Please request a new password reset.');
    }
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await validateResetToken(token);
      if (response.valid) {
        setIsValidToken(true);
        setUserEmail(response.email);
      } else {
        setError('This password reset link is invalid or has expired. Please request a new one.');
      }
    } catch (error) {
      setError('Failed to validate reset link. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await resetPassword(token, newPassword);
      setMessage(response.message);
      
      // Redirect to login after successful password reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="reset-password-container">
        <NavBar />
        <div className="error-panel">
          <h2>Invalid Reset Link</h2>
          <p>This password reset link is invalid. Please request a new password reset.</p>
          <button onClick={() => navigate('/forgot-password')}>
            Go to Forgot Password
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="reset-password-container">
      <NavBar />
      <div className="logo-bar">
        <h1>BA</h1>
        <p> Built for recruiters and candidates alike</p>
      </div>
      <div className="reset-password-panel">
        <div className="reset-password-tagline">
          <p>Set your new password.</p>
        </div>
        <div className="vertical-divider"></div>

        {isValidToken ? (
          <form onSubmit={handleSubmit}>
            <h2>Reset Password</h2>
            <p className="instruction-text">
              Enter your new password for the account: <strong>{userEmail}</strong>
            </p>
            
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}
            
            <input 
              type="password"
              placeholder='New Password'
              value={newPassword}
              required
              onChange={(e) => setNewPassword(e.target.value)} 
            />
            
            <input 
              type="password"
              placeholder='Confirm New Password'
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)} 
            />
            
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
            
            <div className="divider-row">
              <div className="divider-line"></div>
              <div className="divider-text">or</div>
              <div className="divider-line"></div>
            </div>
            
            <p>Remember your password? <a href="/login">Login here</a>.</p>
          </form>
        ) : (
          <div className="loading-panel">
            <h2>Validating Reset Link</h2>
            <p>Please wait while we validate your password reset link...</p>
            {error && (
              <div>
                <p className="error-message">{error}</p>
                <button onClick={() => navigate('/forgot-password')}>
                  Request New Reset Link
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword; 