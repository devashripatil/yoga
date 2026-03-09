import React from 'react';

const Card = ({ children, className = '', hover = true, ...props }) => {
  const style = {
    backgroundColor: 'var(--white)',
    borderRadius: 'var(--radius-lg)',
    padding: '2rem',
    boxShadow: 'var(--shadow-md)',
    transition: 'all var(--transition-normal)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  };

  return (
    <div 
      style={style} 
      className={`card ${className}`}
      onMouseOver={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(-5px)';
          e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
        }
      }}
      onMouseOut={(e) => {
        if (hover) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
