import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { forgotPassword } from '../api/Auth';
import './ForgotPassword.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await forgotPassword(email);
      setMessage(response.message);
      setEmail(''); // Clear email for security
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <NavBar />
      <div className="logo-bar">
        <h1>BA</h1>
        <p> Built for recruiters and candidates alike</p>
      </div>
      <div className="forgot-password-panel">
        <div className="forgot-password-tagline">
          <p>Reset your password securely.</p>
        </div>
        <div className="vertical-divider"></div>

        <form onSubmit={handleSubmit}>
          <h2>Forgot Password</h2>
          <p className="instruction-text">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          
          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
          
          <input 
            type="email"
            placeholder='Email'
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)} 
          />
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
          
          <div className="divider-row">
            <div className="divider-line"></div>
            <div className="divider-text">or</div>
            <div className="divider-line"></div>
          </div>
          
          <p>Remember your password? <a href="/login">Login here</a>.</p>
          <p>Don't have an account? <a href="/register">Register here</a>.</p>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword; 