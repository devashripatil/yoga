import React from 'react';
import Button from './Button';

const ResponsiveMap = () => {
  return (
    <div style={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1.5rem',
      backgroundColor: 'var(--white)',
      padding: '1.5rem',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-md)',
      marginTop: '1rem'
    }}>
      {/* Map Container */}
      <div style={{
        flex: '1 1 350px',
        minHeight: '350px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.05), 0 2px 4px rgba(0,0,0,0.05)',
        position: 'relative',
        border: '2px solid var(--accent)'
      }}>
        <iframe
          title="Sattva Yoga Center Location"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src="https://maps.google.com/maps?q=Veerbhadra%20Nagar,%20India&t=&z=15&ie=UTF8&iwloc=&output=embed"
        ></iframe>
      </div>

      {/* Info Card */}
      <div 
        className="map-info-card"
        style={{
          flex: '1 1 250px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '2rem',
          backgroundColor: 'var(--secondary)',
          borderRadius: 'var(--radius-lg)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <h3 style={{ fontSize: '1.4rem', color: 'var(--primary-dark)', marginBottom: '1.5rem' }}>
          Sattva Yoga Center
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--white)', borderRadius: '50%', color: 'var(--primary)', flexShrink: 0, display: 'flex' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div style={{ paddingTop: '0.2rem' }}>
              <strong style={{ display: 'block', color: 'var(--primary-dark)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Address</strong>
              <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Veerbhadra Nagar, India</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--white)', borderRadius: '50%', color: 'var(--primary)', flexShrink: 0, display: 'flex' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            </div>
            <div style={{ paddingTop: '0.2rem' }}>
              <strong style={{ display: 'block', color: 'var(--primary-dark)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Contact</strong>
              <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>+91 96231 27008</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
            <div style={{ padding: '0.5rem', backgroundColor: 'var(--white)', borderRadius: '50%', color: 'var(--primary)', flexShrink: 0, display: 'flex' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <div style={{ paddingTop: '0.2rem' }}>
              <strong style={{ display: 'block', color: 'var(--primary-dark)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Timings</strong>
              <span style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>Mon–Sat, 6:00 AM – 8:00 PM</span>
            </div>
          </div>
        </div>
        
        <Button 
          variant="primary"
          style={{ marginTop: '2.5rem', width: '100%' }}
          onClick={() => window.open("https://maps.google.com/maps?daddr=Veerbhadra+Nagar,+India", "_blank")}
        >
          Get Directions
        </Button>
      </div>
    </div>
  );
};

export default ResponsiveMap;
