import React, { useState } from 'react';

const FormInput = ({ 
  label, 
  id, 
  type = 'text', 
  placeholder = '', 
  className = '', 
  containerStyle: customContainerStyle = {},
  children,
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    marginBottom: '0.25rem',
    position: 'relative',
    ...customContainerStyle
  };

  const labelStyle = {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: 'var(--text-primary)',
    textTransform: 'uppercase',
    letterSpacing: '0.025em',
  };

  const inputWrapperStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1.125rem',
    fontSize: '1rem',
    color: 'var(--text-primary)',
    backgroundColor: 'var(--background)',
    border: `1.5px solid ${isFocused ? 'var(--primary)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    transition: 'all var(--transition-fast)',
    boxShadow: isFocused ? '0 0 0 4px hsla(var(--primary-h), var(--primary-s), var(--primary-l), 0.1)' : 'none',
    fontFamily: 'var(--font-body)',
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <label htmlFor={id} style={labelStyle}>{label}</label>}
      <div style={inputWrapperStyle}>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          style={inputStyle}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {children}
      </div>
    </div>
  );
};

export default FormInput;
