import React, { useContext, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { LayoutDashboard, Calendar as CalendarIcon, ClipboardList, Activity, Bell, User as UserIcon, LogOut, Menu, X, Sparkles, MessageSquare } from 'lucide-react';

const DashboardLayout = () => {
  const { user, logoutUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/');
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background)', color: 'var(--text-primary)' }}>
      {/* Sidebar - Desktop */}
      <aside 
        style={{ 
          width: '280px', 
          backgroundColor: 'var(--white)', 
          margin: '1rem',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transition: 'all var(--transition-normal)',
          border: '1px solid var(--border-light)',
          transform: window.innerWidth < 1024 && !isMobileMenuOpen ? 'translateX(-120%)' : 'translateX(0)'
        }}
      >
        <div style={{ padding: '2.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: 'var(--primary)', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: '0 8px 16px -4px rgba(74, 124, 89, 0.4)'
            }}>
              <Sparkles size={22} />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-heading)', color: 'var(--primary-dark)', letterSpacing: '-0.02em' }}>
              Sattva
            </span>
          </Link>
          {window.innerWidth < 1024 && (
            <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'var(--background)', border: 'none', borderRadius: '50%', padding: '0.5rem', cursor: 'pointer', color: 'var(--text-secondary)' }}>
              <X size={20} />
            </button>
          )}
        </div>

        <nav style={{ flex: 1, padding: '0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.25rem', overflowY: 'auto' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', paddingLeft: '1rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Menu</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {[
              { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
              { path: '/dashboard/coach', icon: Sparkles, label: 'AI Coach' },
              { path: '/dashboard/book', icon: CalendarIcon, label: 'Book Class' },
              { path: '/dashboard/bookings', icon: ClipboardList, label: 'My Bookings' },
              { path: '/dashboard/tracker', icon: Activity, label: 'Yoga Tracker' },
              { path: '/dashboard/queries', icon: MessageSquare, label: 'My Queries' },
              { path: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
              { path: '/dashboard/profile', icon: UserIcon, label: 'Profile' },
            ].map((item) => (
              <li 
                key={item.path}
                style={{ 
                  padding: '0.85rem 1rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.85rem', 
                  cursor: 'pointer', 
                  borderRadius: 'var(--radius-md)', 
                  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                  ...isActive(item.path) 
                }} 
                onClick={() => { navigate(item.path); setIsMobileMenuOpen(false); }}
                onMouseOver={(e) => { 
                  if (location.pathname !== item.path) { 
                    e.currentTarget.style.backgroundColor = 'var(--border-light)'; 
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }
                }}
                onMouseOut={(e) => { 
                  if (location.pathname !== item.path) { 
                    e.currentTarget.style.backgroundColor = 'transparent'; 
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <item.icon size={20} strokeWidth={isActive(item.path).fontWeight === 600 ? 2.5 : 2} /> 
                <span style={{ fontSize: '0.95rem' }}>{item.label}</span>
              </li>
            ))}
          </ul>
        </nav>

        <div style={{ padding: '1.5rem 1.25rem', borderTop: '1px solid var(--border-light)' }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.85rem 1rem',
              width: '100%',
              borderRadius: 'var(--radius-md)',
              color: '#ef4444',
              backgroundColor: 'rgba(239, 68, 68, 0.03)',
              fontWeight: 600,
              border: '1px solid rgba(239, 68, 68, 0.1)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: '0.95rem',
              transition: 'all 0.2s',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.08)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.03)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ 
        flex: 1, 
        marginLeft: window.innerWidth >= 1024 ? '312px' : '0', // 280 sidebar + 32 margin
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        transition: 'all 0.3s ease'
      }}>
        {/* Topbar */}
        <header style={{ 
          height: '80px', 
          backgroundColor: 'rgba(255, 255, 255, 0.8)', 
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--border-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {window.innerWidth < 1024 && (
              <button 
                onClick={() => setIsMobileMenuOpen(true)}
                style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: '10px', width: '42px', height: '42px', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)' }}
              >
                <Menu size={22} />
              </button>
            )}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {
                  (() => {
                    switch (location.pathname) {
                      case '/dashboard': return 'Personal Overview';
                      case '/dashboard/coach': return 'Zen AI Coach';
                      case '/dashboard/book': return 'Book Practice';
                      case '/dashboard/bookings': return 'My Sessions';
                      case '/dashboard/tracker': return 'Practice History';
                      case '/dashboard/notifications': return 'Inbox';
                      case '/dashboard/profile': return 'Profile Settings';
                      case '/dashboard/queries': return 'Personal Support';
                      default: return 'Dashboard';
                    }
                  })()
                }
              </h2>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                Welcome back, {user?.name?.split(' ')[0] || 'Yogi'}!
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <Link to="/dashboard/notifications" style={{ 
              color: 'var(--text-secondary)', 
              position: 'relative', 
              width: '42px', 
              height: '42px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: 'var(--white)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              transition: 'all 0.2s'
            }}>
              <Bell size={20} />
              <span style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', border: '2px solid white' }}></span>
            </Link>
            
            <div 
              onClick={() => navigate('/dashboard/profile')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.85rem', 
                padding: '0.4rem 0.6rem 0.4rem 1.25rem', 
                backgroundColor: 'var(--white)',
                borderRadius: '14px',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
              onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ textAlign: 'right', display: window.innerWidth < 640 ? 'none' : 'block' }}>
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{user?.name || 'Yogi'}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600 }}>Student Member</p>
              </div>
              <div style={{ 
                width: '38px', 
                height: '38px', 
                borderRadius: '10px', 
                backgroundColor: 'var(--secondary)', 
                color: 'var(--primary-dark)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 800,
                fontSize: '1.1rem'
              }}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'Y'}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div style={{ padding: '2.5rem', flex: 1, overflowY: 'auto' }}>
          <div className="animate-fade-in" style={{ maxWidth: '1400px', margin: '0 auto' }}>
            <Outlet />
          </div>
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && window.innerWidth < 1024 && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(58, 98, 70, 0.2)', // Tinted overlay
            backdropFilter: 'blur(4px)',
            zIndex: 45
          }}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
