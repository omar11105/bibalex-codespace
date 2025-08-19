import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import { register, login } from '../api/Auth';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('CANDIDATE');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    try {
      await register(username, email, password, role);
      
      // After successful registration, log in automatically
      const loginResponse = await login(email, password);
      const { token, role: userRole, user } = loginResponse;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('user', JSON.stringify(user));
      
      if (userRole === 'ADMIN') {
        navigate('/adminDashboard');
      } else {
        navigate('/candidateDashboard');
      }
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <NavBar />
        <div className="register-logo-bar">
          <h1>BA</h1>
          <p> Built for recruiters and candidates alike</p>
        </div>
        <div className="register-panel">
          <div className="register-tagline">
            <p>Create your account and showcase your coding skills.</p>
          </div>
          <div className="register-vertical-divider"></div>

          <form onSubmit={handleRegister} className="register-form">
            <h2>Get Started</h2>
            {error && <p className="register-error-message">{error}</p>}
            <input 
              type="text"
              placeholder='Username'
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)} 
            />
            <input 
              type="email"
              placeholder='Email'
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)} 
            />
            <input 
              type="password"
              placeholder='Password'
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <input 
              type="password"
              placeholder='Confirm Password'
              value={confirmPassword}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="CANDIDATE">Candidate</option>
              <option value="ADMIN">Admin</option>
            </select>
            <button type="submit">Register</button>
            <div className="register-divider-row">
              <div className="register-divider-line"></div>
              <div className="register-divider-text">or</div>
              <div className="register-divider-line"></div>
            </div>
            <p>Already have an account? <a href="/login">Login here</a>.</p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;