import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  style = {},
  ...props 
}) => {
  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600',
    fontFamily: 'var(--font-heading)',
    borderRadius: 'var(--radius-xl)',
    transition: 'all var(--transition-fast)',
    cursor: 'pointer',
    border: '2px solid transparent',
    outline: 'none',
    letterSpacing: '0.025em',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: 'var(--white)',
      boxShadow: '0 4px 6px rgba(74, 124, 89, 0.25)',
    },
    secondary: {
      backgroundColor: 'var(--secondary)',
      color: 'var(--primary-dark)',
    },
    outline: {
      backgroundColor: 'transparent',
      color: 'var(--primary)',
      borderColor: 'var(--primary)',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary)',
    },
    white: {
      backgroundColor: 'var(--white)',
      color: 'var(--primary)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    'white-outline': {
      backgroundColor: 'transparent',
      color: 'var(--white)',
      borderColor: 'var(--white)',
    }
  };

  const sizes = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };

  const currentStyle = {
    ...baseStyle,
    ...variants[variant],
    ...sizes[size],
    ...style
  };

  return (
    <button 
      style={currentStyle} 
      className={`btn-${variant} ${className}`}
      onMouseOver={(e) => {
        if(variant === 'primary') {
            e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(74, 124, 89, 0.3)';
        }
        if(variant === 'secondary') {
            e.currentTarget.style.backgroundColor = '#bde0ae';
            e.currentTarget.style.transform = 'translateY(-2px)';
        }
        if(variant === 'outline') {
            e.currentTarget.style.backgroundColor = 'var(--primary)';
            e.currentTarget.style.color = 'var(--white)';
            e.currentTarget.style.transform = 'translateY(-2px)';
        }
        if(variant === 'ghost') {
            e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.05)';
        }
        if(variant === 'white') {
            e.currentTarget.style.backgroundColor = 'var(--background)';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
        }
        if(variant === 'white-outline') {
            e.currentTarget.style.backgroundColor = 'var(--white)';
            e.currentTarget.style.color = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseOut={(e) => {
        if(variant === 'primary') {
            e.currentTarget.style.backgroundColor = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(74, 124, 89, 0.25)';
        }
        if(variant === 'secondary') {
            e.currentTarget.style.backgroundColor = 'var(--secondary)';
            e.currentTarget.style.transform = 'translateY(0)';
        }
        if(variant === 'outline') {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--primary)';
            e.currentTarget.style.transform = 'translateY(0)';
        }
        if(variant === 'ghost') {
            e.currentTarget.style.backgroundColor = 'transparent';
        }
        if(variant === 'white') {
            e.currentTarget.style.backgroundColor = 'var(--white)';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }
        if(variant === 'white-outline') {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--white)';
            e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
