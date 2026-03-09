import React, { useContext, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, Calendar as CalendarIcon, ClipboardList, Activity, Bell, User as UserIcon, LogOut, Menu, X, Sparkles } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const isActive = (path) => {
    const commonStyles = {
      color: 'var(--text-secondary)',
      backgroundColor: 'transparent',
      fontWeight: 500,
    };
    const activeStyles = {
      color: 'var(--primary-dark)',
      backgroundColor: 'var(--secondary)',
      fontWeight: 600,
    };

    if (location.pathname === path) {
      return activeStyles;
    }
    return commonStyles;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
      {/* Sidebar - Desktop */}
      <aside 
        style={{ 
          width: '260px', 
          backgroundColor: 'var(--white)', 
          borderRight: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transition: 'transform 0.3s ease',
          transform: window.innerWidth < 768 && !isMobileMenuOpen ? 'translateX(-100%)' : 'translateX(0)'
        }}
      >
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--primary)', textDecoration: 'none' }}>
            Sattva Yoga
          </Link>
          {window.innerWidth < 768 && (
            <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={24} />
            </button>
          )}
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li 
              style={{ 
                padding: '0.75rem 1rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                cursor: 'pointer', 
                borderRadius: 'var(--radius-md)', 
                ...isActive('/dashboard') 
              }} 
              onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }}
              onMouseOver={(e) => { if (location.pathname !== '/dashboard') { e.currentTarget.style.backgroundColor = 'rgba(74, 124, 89, 0.05)'; e.currentTarget.style.color = 'var(--primary)'; }}}
              onMouseOut={(e) => { if (location.pathname !== '/dashboard') { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
            >
              <LayoutDashboard size={20} /> Overview
            </li>
            <li 
              style={{ 
                padding: '0.75rem 1rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                cursor: 'pointer', 
                borderRadius: 'var(--radius-md)', 
                ...isActive('/dashboard/coach') 
              }} 
              onClick={() => { navigate('/dashboard/coach'); setIsMobileMenuOpen(false); }}
              onMouseOver={(e) => { if (location.pathname !== '/dashboard/coach') { e.currentTarget.style.backgroundColor = 'rgba(74, 124, 89, 0.05)'; e.currentTarget.style.color = 'var(--primary)'; }}}
              onMouseOut={(e) => { if (location.pathname !== '/dashboard/coach') { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
            >
              <Sparkles size={20} /> AI Coach
            </li>
            <li 
              style={{ 
                padding: '0.75rem 1rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                cursor: 'pointer', 
                borderRadius: 'var(--radius-md)', 
                ...isActive('/dashboard/book') 
              }} 
              onClick={() => { navigate('/dashboard/book'); setIsMobileMenuOpen(false); }}
              onMouseOver={(e) => { if (location.pathname !== '/dashboard/book') { e.currentTarget.style.backgroundColor = 'rgba(74, 124, 89, 0.05)'; e.currentTarget.style.color = 'var(--primary)'; }}}
              onMouseOut={(e) => { if (location.pathname !== '/dashboard/book') { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
            >
              <CalendarIcon size={20} /> Book Class
            </li>
            <li 
              style={{ 
                padding: '0.75rem 1rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                cursor: 'pointer', 
                borderRadius: 'var(--radius-md)', 
                ...isActive('/dashboard/bookings') 
              }} 
              onClick={() => { navigate('/dashboard/bookings'); setIsMobileMenuOpen(false); }}
              onMouseOver={(e) => { if (location.pathname !== '/dashboard/bookings') { e.currentTarget.style.backgroundColor = 'rgba(74, 124, 89, 0.05)'; e.currentTarget.style.color = 'var(--primary)'; }}}
              onMouseOut={(e) => { if (location.pathname !== '/dashboard/bookings') { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
            >
              <ClipboardList size={20} /> My Bookings
            </li>
            <li 
              style={{ 
                padding: '0.75rem 1rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                cursor: 'pointer', 
                borderRadius: 'var(--radius-md)', 
                ...isActive('/dashboard/tracker') 
              }} 
              onClick={() => { navigate('/dashboard/tracker'); setIsMobileMenuOpen(false); }}
              onMouseOver={(e) => { if (location.pathname !== '/dashboard/tracker') { e.currentTarget.style.backgroundColor = 'rgba(74, 124, 89, 0.05)'; e.currentTarget.style.color = 'var(--primary)'; }}}
              onMouseOut={(e) => { if (location.pathname !== '/dashboard/tracker') { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
            >
              <Activity size={20} /> Yoga Tracker
            </li>
            <li 
              style={{ 
                padding: '0.75rem 1rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                cursor: 'pointer', 
                borderRadius: 'var(--radius-md)', 
                ...isActive('/dashboard/notifications') 
              }} 
              onClick={() => { navigate('/dashboard/notifications'); setIsMobileMenuOpen(false); }}
              onMouseOver={(e) => { if (location.pathname !== '/dashboard/notifications') { e.currentTarget.style.backgroundColor = 'rgba(74, 124, 89, 0.05)'; e.currentTarget.style.color = 'var(--primary)'; }}}
              onMouseOut={(e) => { if (location.pathname !== '/dashboard/notifications') { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
            >
              <Bell size={20} /> Notifications
            </li>
            <li 
              style={{ 
                padding: '0.75rem 1rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem', 
                cursor: 'pointer', 
                borderRadius: 'var(--radius-md)', 
                ...isActive('/dashboard/profile') 
              }} 
              onClick={() => { navigate('/dashboard/profile'); setIsMobileMenuOpen(false); }}
              onMouseOver={(e) => { if (location.pathname !== '/dashboard/profile') { e.currentTarget.style.backgroundColor = 'rgba(74, 124, 89, 0.05)'; e.currentTarget.style.color = 'var(--primary)'; }}}
              onMouseOut={(e) => { if (location.pathname !== '/dashboard/profile') { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
            >
              <UserIcon size={20} /> Profile Settings
            </li>
          </ul>
        </nav>

        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.875rem 1rem',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              color: '#ef4444', // Red for logout
              backgroundColor: 'transparent',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.05)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        marginLeft: window.innerWidth >= 768 ? '260px' : '0',
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0 // Prevent flexbox blowout
      }}>
        {/* Topbar */}
        <header style={{ 
          height: '70px', 
          backgroundColor: 'var(--white)', 
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {window.innerWidth < 768 && (
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', marginRight: '1rem', display: 'flex', alignItems: 'center' }}
              >
                <Menu size={24} />
              </button>
            )}
            <h2 style={{ fontSize: '1.25rem', margin: 0, display: window.innerWidth < 768 ? 'none' : 'block' }}>
              {/* Dynamically determine title based on current path */}
              {
                (() => {
                  switch (location.pathname) {
                    case '/dashboard': return 'Overview';
                    case '/dashboard/coach': return 'AI Coach';
                    case '/dashboard/book': return 'Book Class';
                    case '/dashboard/bookings': return 'My Bookings';
                    case '/dashboard/tracker': return 'Yoga Tracker';
                    case '/dashboard/notifications': return 'Notifications';
                    case '/dashboard/profile': return 'Profile Settings';
                    default: return 'Dashboard';
                  }
                })()
              }
            </h2>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/dashboard/notifications" style={{ color: 'var(--text-secondary)', position: 'relative', display: 'flex', alignItems: 'center' }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></span>
            </Link>
            <Link to="/dashboard/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)', textDecoration: 'none', cursor: 'pointer', color: 'inherit' }}>
              <div style={{ textAlign: 'right', display: window.innerWidth < 600 ? 'none' : 'block' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name || 'Yogi'}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Student</p>
              </div>
              <div style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '50%', 
                backgroundColor: 'var(--primary)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 'bold' 
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'Y'}
              </div>
            </Link>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && window.innerWidth < 768 && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 45
          }}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
