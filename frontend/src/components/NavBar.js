import './NavBar.css';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <ul className="nav-links">
        <li><Link to="/" className={isActive('/') ? 'nav-item active' : 'nav-item'}>Home</Link></li>
        <li><Link to="/Login" className={isActive('/Login') ? 'nav-item active' : 'nav-item'}>Login</Link></li>
        <li><Link to="/Register" className={isActive('/Register') ? 'nav-item active' : 'nav-item'}>Register</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;