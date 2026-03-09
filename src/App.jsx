import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import SectionLayout from './components/SectionLayout';
import Button from './components/Button';
import Card from './components/Card';
import FormInput from './components/FormInput';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import Overview from './pages/dashboard/Overview';
import BookClass from './pages/dashboard/BookClass';
import MyBookings from './pages/dashboard/MyBookings';
import Tracker from './pages/dashboard/Tracker';
import Notifications from './pages/dashboard/Notifications';
import Profile from './pages/dashboard/Profile';
import AICoachDashboard from './pages/dashboard/AICoachDashboard';

import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import AdminOverview from './pages/admin/Overview';
import ManageClasses from './pages/admin/ManageClasses';
import AdminBookings from './pages/admin/ManageBookings';
import AttendanceTracker from './pages/admin/AttendanceTracker';
import UserManagement from './pages/admin/UserManagement';
import AdminNotifications from './pages/admin/AdminNotifications';
import CalendarView from './pages/admin/CalendarView';
import PaymentSettings from './pages/admin/PaymentSettings';

import ChatbotWidget from './components/ChatbotWidget';

import AuthContext from './context/AuthContext';
import './index.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { registerUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    wellnessGoal: '',
    experienceLevel: '',
    preferredTime: '',
    dietPreference: '',
    timeAvailable: 30,
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // AuthContext handles toast notifications internally
    const success = await registerUser(formData.name, formData.email, formData.password, formData.phone, formData.wellnessGoal, formData.experienceLevel, formData.preferredTime, formData.dietPreference, formData.timeAvailable);
    if (success) {
      navigate('/login');
    }
  };

  return (
    <SectionLayout background="background" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '8rem 0 4rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap-reverse', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-hover)' }}>
          {/* Left Side: Form */}
          <div style={{ flex: '1 1 500px', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '2.5rem' }}>Join Us</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.1rem' }}>Create an account to track your progress and book classes.</p>
            </div>

            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <FormInput label="Full Name" name="name" value={formData.name} onChange={handleChange} type="text" placeholder="John Doe" required />
              <FormInput label="Email Address" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="john@example.com" required />
              <FormInput label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} type="tel" placeholder="+1 (555) 000-0000" />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <FormInput label="Password" name="password" value={formData.password} onChange={handleChange} type="password" placeholder="••••••••" required />
                <FormInput label="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} type="password" placeholder="••••••••" required />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>What is your goal?</label>
                  <select name="wellnessGoal" value={formData.wellnessGoal} onChange={handleChange} style={{
                    padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '1rem', backgroundColor: 'var(--background)'
                  }}>
                    <option value="">-- Choose a goal --</option>
                    <option value="Reduce stress">Reduce stress</option>
                    <option value="Improve flexibility">Improve flexibility</option>
                    <option value="Meditation practice">Meditation practice</option>
                    <option value="Fitness">Fitness</option>
                  </select>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Experience level</label>
                  <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} style={{
                    padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '1rem', backgroundColor: 'var(--background)'
                  }}>
                    <option value="">-- Choose experience --</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Preferred time</label>
                  <select name="preferredTime" value={formData.preferredTime} onChange={handleChange} style={{
                    padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '1rem', backgroundColor: 'var(--background)'
                  }}>
                    <option value="">-- Choose time --</option>
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Diet Preference</label>
                    <select name="dietPreference" value={formData.dietPreference} onChange={handleChange} style={{
                      padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', fontFamily: 'inherit', fontSize: '1rem', backgroundColor: 'var(--background)'
                    }}>
                      <option value="">-- Choose diet --</option>
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Vegan">Vegan</option>
                      <option value="Balanced">Balanced</option>
                    </select>
                  </div>
                  
                  <FormInput label="Daily Time Available (mins)" name="timeAvailable" value={formData.timeAvailable} onChange={handleChange} type="number" min="10" max="180" />
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" style={{ width: '100%', marginTop: '1rem' }}>
                Create Account
              </Button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Already have an account? <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Login instead</a>
              </p>
            </div>
          </div>

          {/* Right Side: Image */}
          <div style={{ flex: '1 1 400px', backgroundImage: 'url("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px' }}></div>
        </div>
      </div>
    </SectionLayout>
  );
};

const AdminLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const userResponse = await loginUser(formData.email, formData.password);
    if (userResponse) {
      if (userResponse.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        alert("You do not have admin permissions. Redirecting to user dashboard.");
        navigate('/dashboard');
      }
    }
  };

  return (
    <SectionLayout background="background" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', paddingTop: '8rem' }}>
      <div style={{ maxWidth: '450px', margin: '0 auto', width: '100%' }}>
        <Card style={{ padding: '3rem', borderTop: '4px solid var(--primary)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '2rem' }}>Admin Access</h2>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Secure login for Sattva Yoga administrators.</p>
          </div>

          <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <FormInput
              label="Admin Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="admin@sattvayoga.com"
              required
            />

            <div style={{ position: 'relative' }}>
              <FormInput
                label="Password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '2.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0.25rem'
                }}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>

            <Button type="submit" style={{ width: '100%', marginTop: '1rem', backgroundColor: '#1f2937', color: 'white' }} size="lg">
              Secure Login
            </Button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <a href="#home" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>&larr; Return to main site</a>
          </div>
        </Card>
      </div>
    </SectionLayout>
  );
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    const userResponse = await loginUser(formData.email, formData.password);
    if (userResponse) {
      if (userResponse.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/dashboard');
      }
    }
  };

  return (
    <SectionLayout background="background" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '8rem 0 4rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', flexWrap: 'wrap', backgroundColor: 'var(--white)', borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-hover)' }}>
          {/* Left Side: Image */}
          <div style={{ flex: '1 1 400px', backgroundImage: 'url("https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?q=80&w=800&fit=crop")', backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px' }}></div>

          {/* Right Side: Form */}
          <div style={{ flex: '1 1 500px', padding: '4rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: '2.5rem' }}>
              <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '2.5rem' }}>Welcome Back</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '1.1rem' }}>Log in to access your Sattva Yoga dashboard.</p>
            </div>

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <FormInput label="Email Address" name="email" value={formData.email} onChange={handleChange} type="email" placeholder="john@example.com" required />

              <div style={{ position: 'relative' }}>
                <FormInput
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  style={{ paddingRight: '2.5rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '2.8rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.25rem'
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-0.75rem' }}>
                <a href="#forgot-password" style={{ fontSize: '0.9rem', color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Forgot password?</a>
              </div>

              <Button type="submit" variant="primary" size="lg" style={{ width: '100%', marginTop: '0.5rem' }}>
                Sign In
              </Button>
            </form>

            <div style={{ textAlign: 'center', marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                Don't have an account? <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }} style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>Register here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};

const HomeView = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const isLoggedIn = !!user;

  return (
    <div className="app-container">
      <Navbar />

      {/* Hero Section */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: 'linear-gradient(to bottom, rgba(45, 55, 72, 0.4), rgba(45, 55, 72, 0.7)), url("https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2000&auto=format&fit=crop")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          color: 'var(--white)',
          textAlign: 'center',
          position: 'relative',
          padding: '6rem 0'
        }}
        className="animate-fade-in"
      >
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            marginBottom: '1.5rem',
            color: 'var(--white)',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            maxWidth: '900px',
            margin: '0 auto 1.5rem auto',
            lineHeight: '1.2'
          }}>
            “Yoga is the journey of the self, through the self, to the self.”
          </h1>
          <p style={{
            fontSize: 'clamp(1.1rem, 2vw, 1.25rem)',
            maxWidth: '600px',
            margin: '0 auto 3rem auto',
            opacity: 0.9,
            textShadow: '0 1px 2px rgba(0,0,0,0.5)'
          }}>
            Begin your transformative yoga journey today. Cultivate mindfulness, strength, and inner peace in a supportive environment.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                const el = document.getElementById('classes');
                if (el) {
                  const y = el.getBoundingClientRect().top + window.scrollY - 80; // Offset for sticky navbar
                  window.scrollTo({ top: y, behavior: 'smooth' });
                }
              }}
            >
              Join Online Class
            </Button>
          </div>
        </div>
      </section>

      {/* Meet Your Instructor */}
      <SectionLayout
        id="about"
        background="background"
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4rem', alignItems: 'center' }}>
          {/* Left Side: Instructor Image */}
          <div style={{ flex: '1 1 400px' }}>
            <div style={{
              width: '100%',
              height: '550px',
              backgroundColor: 'var(--accent)',
              borderRadius: 'var(--radius-xl)',
              backgroundImage: 'url("https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=800")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
                padding: '2rem',
                color: 'white'
              }}>
                <h3 style={{ margin: 0, fontSize: '1.75rem', fontFamily: 'var(--font-heading)', color: 'white' }}>Maya Sharma</h3>
                <p style={{ margin: 0, opacity: 0.9 }}>Lead Yoga Instructor</p>
              </div>
            </div>
          </div>

          {/* Right Side: Instructor Content */}
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>Meet Your Instructor</h2>
            <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
              Namaste! I'm Maya, and my journey with yoga began over 15 years ago. I believe that yoga is not just about physical postures, but a holistic path to discovering your inner peace and potential. My classes are designed to be a safe haven where you can explore mindful movement, deepen your breath, and align your spirit.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '2rem 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)', padding: '0.75rem', borderRadius: '50%' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>15+ Years Experience</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Practicing and teaching globally</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)', padding: '0.75rem', borderRadius: '50%' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>500-Hour RYT Certified</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Yoga Alliance registered</p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)', padding: '0.75rem', borderRadius: '50%' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path><path d="M2 12h20"></path></svg>
                </div>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.1rem' }}>Specializations</h4>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Vinyasa Flow, Yin Yoga, Mindfulness Meditation</p>
                </div>
              </div>
            </div>

            <Button
              size="lg"
              onClick={() => {
                const el = document.getElementById('classes');
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
              }}
            >
              Book Your Class
            </Button>
          </div>
        </div>
      </SectionLayout>

      {/* Featured Yoga Classes */}
      <SectionLayout
        id="classes"
        title="Featured Yoga Classes"
        subtitle="Find the perfect class for your mood and experience level."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          {[
            {
              name: "Vinyasa Flow",
              desc: "A dynamic, fluid practice connecting breath to movement to build heat and endurance.",
              level: "Intermediate",
              time: "60 Min",
              schedule: "Mon, Wed, Fri - 8:00 AM",
              tag: "Energy",
              img: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=400&fit=crop"
            },
            {
              name: "Yin Serenity",
              desc: "Deep, passive stretching held for longer periods to target connective tissues and calm the mind.",
              level: "All Levels",
              time: "75 Min",
              schedule: "Tue, Thu - 6:30 PM",
              tag: "Relaxation",
              img: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=400&fit=crop"
            },
            {
              name: "Power Core",
              desc: "An intense, challenging sequence focused on building raw core strength, balance, and stability.",
              level: "Advanced",
              time: "45 Min",
              schedule: "Saturday - 9:00 AM",
              tag: "Strength",
              img: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=400&fit=crop"
            }
          ].map((cls, idx) => (
            <Card key={idx} hover={true} style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ position: 'relative' }}>
                <img src={cls.img} alt={cls.name} style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }} />
                <span style={{ position: 'absolute', top: '1rem', right: '1rem', backgroundColor: 'var(--white)', color: 'var(--primary)', padding: '0.25rem 0.75rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 600, boxShadow: 'var(--shadow-sm)' }}>
                  {cls.tag}
                </span>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>{cls.name}</h3>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500, backgroundColor: 'var(--background)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                    {cls.time}
                  </span>
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                  {cls.desc}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <span>{cls.schedule}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                    <span>{cls.level}</span>
                  </div>
                </div>
                <Button
                  variant="secondary"
                  style={{ width: '100%', marginTop: 'auto' }}
                  onClick={() => {
                    if (!isLoggedIn) {
                      navigate('/login');
                    } else {
                      navigate('/dashboard/book');
                    }
                  }}
                >
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </SectionLayout>

      {/* Why Learn Yoga */}
      <SectionLayout
        title="Why Learn Yoga?"
        subtitle="Discover the profound benefits of a consistent yoga practice."
        background="accent"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
          {[
            {
              title: "Improve Flexibility",
              desc: "Safely stretch and lengthen your muscles, increasing your body's full range of motion over time.",
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
            },
            {
              title: "Reduce Stress",
              desc: "Calm your nervous system and release tension through intentional breathwork and mindful movement.",
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            },
            {
              title: "Improve Posture",
              desc: "Strengthen your core and back to correct alignment, relieve chronic pain, and stand taller.",
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"></path><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="19" r="2"></circle><circle cx="5" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle></svg>
            },
            {
              title: "Increase Energy",
              desc: "Awaken your body and boost your vitality naturally, leaving you feeling invigorated all day.",
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            },
            {
              title: "Mental Clarity",
              desc: "Clear mental fog and enhance your focus by practicing being fully present on the mat.",
              icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            }
          ].map((benefit, idx) => (
            <Card key={idx} style={{ textAlign: 'left', padding: '2rem' }}>
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--white)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                boxShadow: 'var(--shadow-sm)'
              }}>
                {benefit.icon}
              </div>
              <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '1.25rem' }}>{benefit.title}</h3>
              <p style={{ margin: 0, fontSize: '0.95rem' }}>{benefit.desc}</p>
            </Card>
          ))}
        </div>
      </SectionLayout>

      {/* Custom Testimonials Placeholder (Removed old sections) */}
      <SectionLayout
        background="background"
        title="Student Testimonials"
        subtitle="Hear what others have experienced practicing with Maya."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {[
            { text: "Maya's classes have completely transformed my mornings. Her gentle guidance and focus on alignment have helped me cure my chronic back pain.", author: "Sarah Jenkins" },
            { text: "I've never felt so present. The way she blends mindfulness with physical challenge is exactly what my stressful work week needs.", author: "David Chen" },
            { text: "As a beginner, I was intimidated, but Maya made every pose accessible. I've gained strength and a new perspective on wellness.", author: "Emily Rivera" }
          ].map((test, idx) => (
            <Card key={idx} style={{ padding: '2.5rem', backgroundColor: 'var(--white)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '1rem', right: '1.5rem', fontSize: '4rem', color: 'var(--secondary)', opacity: 0.5, fontFamily: 'serif', lineHeight: 1 }}>"</div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', position: 'relative', zIndex: 1, color: 'var(--text-secondary)' }}>{test.text}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                  {test.author.charAt(0)}
                </div>
                <strong>{test.author}</strong>
              </div>
            </Card>
          ))}
        </div>
      </SectionLayout>

      {/* Contact Section */}
      <SectionLayout
        id="contact"
        title="Get in Touch"
        subtitle="Have questions about classes or memberships? We'd love to hear from you."
        background="background"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'flex-start' }}>

          {/* Contact Form */}
          <Card style={{ padding: '2.5rem', backgroundColor: 'var(--white)' }}>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Send a Message</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you for reaching out! Your message has been sent successfully.');
              e.target.reset();
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Full Name *</label>
                <input required type="text" placeholder="Jane Doe" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '1rem', fontFamily: 'var(--font-body)', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Email Address *</label>
                <input required type="email" placeholder="jane@example.com" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '1rem', fontFamily: 'var(--font-body)', outline: 'none' }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Message *</label>
                <textarea required rows="4" placeholder="How can we help you?" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '1rem', fontFamily: 'var(--font-body)', resize: 'vertical', outline: 'none' }}></textarea>
              </div>

              <Button type="submit" variant="primary" size="lg" style={{ marginTop: '0.5rem', width: '100%' }}>Send Message</Button>
            </form>
          </Card>

          {/* Contact Info & Map */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Visit Our Studio</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Location</strong>
                    <span style={{ color: 'var(--text-secondary)', lineHeight: 1.5 }}>123 Serenity Lane<br />Wellness Valley, CA 90210</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Phone</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>+1 (555) 123-4567</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--secondary)', color: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div>
                    <strong style={{ display: 'block', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Email</strong>
                    <span style={{ color: 'var(--text-secondary)' }}>hello@sattvayoga.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Placeholder */}
            <div style={{
              width: '100%',
              height: '250px',
              backgroundColor: 'var(--accent)',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              position: 'relative',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
            }}>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-dark)', opacity: 0.6 }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.5rem' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Interactive Map Placeholder</span>
              </div>
            </div>
          </div>

        </div>
      </SectionLayout>

      {/* Call to Action */}
      <section style={{ padding: '6rem 0', backgroundColor: 'var(--primary)', color: 'var(--white)', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'var(--white)', fontSize: '3rem', marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Ready to Begin Your Practice?</h2>
          <p style={{ fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem auto', opacity: 0.9 }}>
            Join our supportive community today and get your first week of classes completely free.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button
              variant="white"
              size="lg"
              onClick={() => navigate('/register')}
            >
              Create Free Account
            </Button>
            <Button
              variant="white-outline"
              size="lg"
              onClick={() => {
                const el = document.getElementById('contact');
                if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
              }}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      <footer style={{
        padding: '5rem 0 2rem 0',
        backgroundColor: '#1f2937', // Dark gray background 
        color: '#d1d5db' // Light text
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
            {/* Column 1 - About */}
            <div>
              <h3 style={{ color: 'var(--white)', margin: '0 0 1.5rem 0', fontSize: '1.5rem', fontFamily: 'var(--font-heading)' }}>Sattva Yoga</h3>
              <p style={{ lineHeight: 1.6, margin: 0 }}>
                Discover peace and mindfulness through our holistic approach to yoga. Join us to transform your physical health, mental clarity, and spiritual well-being.
              </p>
            </div>

            {/* Column 2 - Quick Links */}
            <div>
              <h4 style={{ color: 'var(--white)', margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {['Home', 'About', 'Classes', 'Register', 'Contact'].map(link => (
                  <li key={link}>
                    <a
                      href={`#${link.toLowerCase()}`}
                      style={{ color: '#d1d5db', textDecoration: 'none', transition: 'color 0.2s' }}
                      onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
                      onMouseOut={e => e.currentTarget.style.color = '#d1d5db'}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 - Contact Info */}
            <div>
              <h4 style={{ color: 'var(--white)', margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>Contact Information</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '2px' }}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>123 Serenity Lane<br />Wellness Valley, CA 90210</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <span>+1 (555) 123-4567</span>
                </li>
                <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  <span>hello@sattvayoga.com</span>
                </li>
              </ul>
            </div>

            {/* Column 4 - Social Media */}
            <div>
              <h4 style={{ color: 'var(--white)', margin: '0 0 1.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href="#" style={{ color: '#d1d5db', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} onMouseOver={e => { e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.backgroundColor = 'var(--primary)' }} onMouseOut={e => { e.currentTarget.style.color = '#d1d5db'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" style={{ color: '#d1d5db', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} onMouseOver={e => { e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.backgroundColor = 'var(--primary)' }} onMouseOut={e => { e.currentTarget.style.color = '#d1d5db'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a href="#" style={{ color: '#d1d5db', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} onMouseOver={e => { e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.backgroundColor = 'var(--primary)' }} onMouseOut={e => { e.currentTarget.style.color = '#d1d5db'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
                </a>
                <a href="#" style={{ color: '#d1d5db', transition: 'color 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.1)' }} onMouseOver={e => { e.currentTarget.style.color = 'var(--white)'; e.currentTarget.style.backgroundColor = 'var(--primary)' }} onMouseOut={e => { e.currentTarget.style.color = '#d1d5db'; e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
              </div>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            paddingTop: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <p style={{ fontSize: '0.875rem', margin: 0 }}>
              &copy; 2026 Sattva Yoga. All Rights Reserved.
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin-login')}
              style={{ fontSize: '0.875rem' }}
            >
              Admin Access
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />

        {/* User Dashboard */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Overview />} />
          <Route path="coach" element={<AICoachDashboard />} />
          <Route path="book" element={<BookClass />} />
          <Route path="bookings" element={<MyBookings />} />
          <Route path="tracker" element={<Tracker />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Protected Admin Routes */}
        <Route path="/admin-dashboard" element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }>
          <Route index element={<AdminOverview />} />
          <Route path="classes" element={<ManageClasses />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="attendance" element={<AttendanceTracker />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="calendar" element={<CalendarView />} />
          <Route path="payment-settings" element={<PaymentSettings />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ChatbotWidget />
    </>
  );
};

export default App;
