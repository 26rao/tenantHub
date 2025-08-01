import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../App.css';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', dark);
  }, [dark]);

  useEffect(() => {
    setUser(() => {
      try {
        return JSON.parse(localStorage.getItem('user'));
      } catch {
        return null;
      }
    });
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-link" style={{ fontWeight: 800, fontSize: 22, color: '#2563eb', textDecoration: 'none' }}>
          <img src="/logo.png" alt="Logo" style={{ height: 40, width: 40, borderRadius: '50%', marginRight: 12, verticalAlign: 'middle' }} />
          Resident Portal
        </Link>
        <div className="navbar-links">
          <Link to="/dashboard" className={`navbar-link${location.pathname === '/dashboard' ? ' active' : ''}`}>Dashboard</Link>
          <Link to="/notices" className={`navbar-link${location.pathname === '/notices' ? ' active' : ''}`}>Notices</Link>
          <Link to="/complaints" className={`navbar-link${location.pathname === '/complaints' ? ' active' : ''}`}>Complaints</Link>
          <Link to="/rent" className={`navbar-link${location.pathname === '/rent' ? ' active' : ''}`}>Rent</Link>
          <Link to="/profile" className={`navbar-link${location.pathname === '/profile' ? ' active' : ''}`}>Profile</Link>
          <button
            className="navbar-link"
            style={{ fontSize: 20, padding: '0.7rem 1.2rem', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => setDark(d => !d)}
            title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {dark ? '🌙' : '☀️'}
          </button>
          {user && (
            <>
              <span className="navbar-user" style={{ marginLeft: 12, marginRight: 8, fontWeight: 600, color: '#2563eb' }}>{user.name}</span>
              <button className="btn" style={{ width: 'auto', padding: '0.5em 1.5em', marginLeft: 8 }} onClick={handleLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 