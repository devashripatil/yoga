import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import Button from './Button';
import '../index.css';

const Navbar = ({ className = '' }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activePage, setActivePage] = useState('Home');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logoutUser } = useContext(AuthContext);

  const isLoggedIn = !!user;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = ['Home', 'About', 'Classes', 'Contact'];

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${className}`}>
      <div className="container navbar-container">
        {/* Left Side: Logo & Brand */}
        <a href="/" className="navbar-brand">
          <img src="/logo.png" alt="Sattva Yoga Logo" className="navbar-logo-img" />
          Sattva Yoga
        </a>

        {/* Right Side: Desktop Menu */}
        <div className="navbar-menu-desktop">
          {navLinks.map(link => (
            <a
              key={link}
              href={`/#${link.toLowerCase()}`}
              className={`nav-link ${activePage === link ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActivePage(link);
                if (location.pathname !== '/') {
                  navigate('/');
                  setTimeout(() => {
                    const el = document.getElementById(link.toLowerCase());
                    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
                  }, 100);
                } else {
                  const el = document.getElementById(link.toLowerCase());
                  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
                }
              }}
            >
              {link}
            </a>
          ))}

          {!isLoggedIn ? (
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <a
                href="/login"
                className={`nav-link ${activePage === 'Login' ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('Login');
                  navigate('/login');
                }}
              >
                Login
              </a>
              <Button
                variant="primary"
                onClick={() => {
                  setActivePage('Register');
                  navigate('/register');
                }}
              >
                Register
              </Button>
            </div>
          ) : (
            <div className="profile-dropdown-container">
              <button
                className="profile-icon-btn"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="profile-icon">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
              </button>

              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <div style={{ padding: '0.5rem 1.5rem', opacity: 0.7, fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    Welcome back!
                  </div>
                  <hr className="dropdown-divider" />
                  <button
                    className="dropdown-item"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      navigate('/dashboard');
                    }}
                    style={{ background: 'none', border: 'none', width: '100%', textAlign: 'left', padding: '0.75rem 1.5rem', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                  >
                    Dashboard
                  </button>
                  <button
                    className="dropdown-item logout-btn"
                    onClick={() => {
                      logoutUser();
                      setIsDropdownOpen(false);
                      navigate('/');
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <button
          className="hamburger-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></div>
          <div className={`hamburger-line ${isMobileMenuOpen ? 'open' : ''}`}></div>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="navbar-menu-mobile">
          {navLinks.map(link => (
            <a
              key={link}
              href={`/#${link.toLowerCase()}`}
              className={`mobile-nav-link ${activePage === link ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActivePage(link);
                setIsMobileMenuOpen(false);
                if (location.pathname !== '/') {
                  navigate('/');
                  setTimeout(() => {
                    const el = document.getElementById(link.toLowerCase());
                    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
                  }, 100);
                } else {
                  const el = document.getElementById(link.toLowerCase());
                  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
                }
              }}
            >
              {link}
            </a>
          ))}

          <hr className="mobile-divider" />

          {!isLoggedIn ? (
            <div className="mobile-auth-actions">
              <a
                href="/login"
                className="mobile-nav-link"
                onClick={(e) => {
                  e.preventDefault();
                  setActivePage('Login');
                  navigate('/login');
                  setIsMobileMenuOpen(false);
                }}
              >
                Login
              </a>
              <Button
                variant="primary"
                style={{ width: '100%', marginTop: '1rem' }}
                onClick={() => {
                  setActivePage('Register');
                  navigate('/register');
                  setIsMobileMenuOpen(false);
                }}
              >
                Register
              </Button>
            </div>
          ) : (
            <div className="mobile-logged-in-actions">
              <div className="mobile-user-info">
                <div className="profile-icon small">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
                <span>Welcome back!</span>
              </div>
              <hr className="mobile-divider" />
              <button
                className="mobile-nav-link sub"
                onClick={() => {
                  navigate('/dashboard');
                  setIsMobileMenuOpen(false);
                }}
                style={{ textAlign: 'left', background: 'none', border: 'none', width: '100%', padding: '0.75rem 1rem' }}
              >
                Dashboard
              </button>
              <button
                className="mobile-nav-link sub logout-btn-mobile"
                onClick={() => {
                  logoutUser();
                  setIsMobileMenuOpen(false);
                  navigate('/');
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
