import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { login } from '../api/Auth';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
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
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="login-container">
      <NavBar />
      <div className="logo-bar">
        <h1>BA</h1>
        <p> Built for recruiters and candidates alike</p>
      </div>
      <div className="login-panel">
        <div className="login-tagline">
          <p>Secure access to your coding dashboard.</p>
        </div>
        <div className="vertical-divider"></div>

        <form onSubmit={handleLogin}>
          <h2>Welcome Back</h2>
          {error && <p className="error-message">{error}</p>}
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
          <div className="divider-row">
            <div className="divider-line"></div>
            <div className="divider-text">or</div>
            <div className="divider-line"></div>
          </div>
          <p>Don't have an account? <a href="/register">Register here</a>.</p>
          <p>Forgot your password? <a href="/forgot-password">Reset it here</a>.</p>
        </form>
      </div>
    </div>
  );
}

export default Login;