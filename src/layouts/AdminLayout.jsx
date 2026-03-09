import React, { useContext, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  CreditCard,
  Video,
  ListRestart,
  Send,
  CalendarDays,
  Banknote
} from 'lucide-react';

const AdminLayout = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/admin-login');
  };

  const navLinks = [
    { name: 'Overview', path: '/admin-dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Manage Classes', path: '/admin-dashboard/classes', icon: <Video size={20} /> },
    { name: 'Bookings Management', path: '/admin-dashboard/bookings', icon: <CreditCard size={20} /> },
    { name: 'Attendance Tracker', path: '/admin-dashboard/attendance', icon: <ListRestart size={20} /> },
    { name: 'User Management', path: '/admin-dashboard/users', icon: <Users size={20} /> },
    { name: 'Notifications & Email', path: '/admin-dashboard/notifications', icon: <Send size={20} /> },
    { name: 'Schedule Calendar', path: '/admin-dashboard/calendar', icon: <CalendarDays size={20} /> },
    { name: 'Payment Settings', path: '/admin-dashboard/payment-settings', icon: <Banknote size={20} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f1f5f9' }}>
      {/* Sidebar - Desktop */}
      <aside
        style={{
          width: '260px',
          backgroundColor: '#1e293b', // Dark slate background for admin
          color: 'white',
          borderRight: '1px solid #334155',
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
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'white', textDecoration: 'none' }}>
            Sattva Admin Console
          </Link>
          {window.innerWidth < 768 && (
            <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
              <X size={24} />
            </button>
          )}
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', overflowY: 'auto' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || location.pathname.startsWith(`${link.path}/`);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => window.innerWidth < 768 && setIsMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.875rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? 'white' : '#94a3b8',
                  backgroundColor: isActive ? '#334155' : 'transparent',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = '#0f172a';
                    e.currentTarget.style.color = '#e2e8f0';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }
                }}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid #334155' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.875rem 1rem',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              color: '#fca5a5',
              backgroundColor: 'transparent',
              fontWeight: 500,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#7f1d1d'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={20} />
            <span>Secure Logout</span>
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
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
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
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e293b', marginRight: '1rem', display: 'flex', alignItems: 'center' }}
              >
                <Menu size={24} />
              </button>
            )}
            <h2 style={{ fontSize: '1.25rem', margin: 0, display: window.innerWidth < 768 ? 'none' : 'block', color: '#1e293b' }}>
              {navLinks.find(link => link.path === location.pathname)?.name || 'Admin Overview'}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid #e2e8f0' }}>
              <div style={{ textAlign: 'right', display: window.innerWidth < 600 ? 'none' : 'block' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1e293b' }}>{user?.name || 'Administrator'}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Root Access</p>
              </div>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#1e293b',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                A
              </div>
            </div>
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

export default AdminLayout;
