import React from "react";
import { useNavigate } from "react-router-dom";
import "./HeaderBar.css";

function HeaderBar({ user }) {
  const navigate = useNavigate();

  // Get username with fallbacks
  const getDisplayName = () => {
    if (user?.username) return user.username;
    if (user?.email) return user.email.split('@')[0]; // Use email prefix as fallback
    return 'User';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="header-bar">
      <div className="left">
        <h1>BA</h1>
      </div>
      <div className="center">
        <h2>Welcome, {getDisplayName()}</h2>
        <p className="tagline">Ready for your next challenge?</p>
      </div>
      <div className="right">
        <button className="logout-btn" onClick={handleLogout}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}

export default HeaderBar;