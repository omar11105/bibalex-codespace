import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { login, resendVerification } from '../api/Auth';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showResendOption, setShowResendOption] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      const { token, role, user } = response;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('user', JSON.stringify(user));

      if (role === 'ADMIN') {
        navigate('/adminDashboard');
      } else {
        navigate('/candidateDashboard');
      }
    } catch (error) {
      if (error.message.includes('Email not verified')) {
        setShowResendOption(true);
        setError('Please verify your email before logging in.');
      } else {
        setError('Login failed. Please check your credentials.');
      }
    }
  };

  const handleResendVerification = async () => {
    try {
      await resendVerification(email);
      setResendMessage('Verification email sent successfully!');
      setShowResendOption(false);
    } catch (error) {
      setResendMessage('Failed to resend verification email. Please try again.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <NavBar />
        <div className="login-logo-bar">
          <h1>BA</h1>
          <p> Built for recruiters and candidates alike</p>
        </div>
        <div className="login-panel">
          <div className="login-tagline">
            <p>Secure access to your coding dashboard.</p>
          </div>
          <div className="login-vertical-divider"></div>

          <form className="login-form" onSubmit={handleLogin}>
            <h2>Welcome Back</h2>
            {error && <p className="login-error-message">{error}</p>}
            {resendMessage && <p className="login-success-message">{resendMessage}</p>}
            <input 
              type="email"
              placeholder='Email'
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)} 
              /><br />
            <input 
              type="password"
              placeholder='Password'
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              /><br />
            <button type="submit">Login</button>
            
            {showResendOption && (
              <div className="login-resend-verification">
                <p>Need to verify your email?</p>
                <button type="button" onClick={handleResendVerification} className="login-resend-button">
                  Resend Verification Email
                </button>
              </div>
            )}
            
            <div className="login-divider-row">
              <div className="login-divider-line"></div>
              <div className="login-divider-text">or</div>
              <div className="login-divider-line"></div>
            </div>
            <p>Don't have an account? <a href="/register">Register here</a>.</p>
            <p>Forgot your password? <a href="/forgot-password">Reset it here</a>.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;