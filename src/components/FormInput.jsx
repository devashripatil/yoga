import React, { useState } from 'react';

const FormInput = ({ 
  label, 
  id, 
  type = 'text', 
  placeholder = '', 
  className = '', 
  ...props 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginBottom: '1rem',
  };

  const labelStyle = {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: 'var(--text-secondary)',
  };

  const inputStyle = {
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    color: 'var(--text-primary)',
    backgroundColor: 'var(--white)',
    border: `1px solid ${isFocused ? 'var(--primary)' : 'var(--border)'}`,
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    transition: 'all var(--transition-fast)',
    boxShadow: isFocused ? '0 0 0 3px rgba(58, 125, 68, 0.1)' : 'none',
    fontFamily: 'var(--font-body)',
  };

  return (
    <div style={containerStyle} className={className}>
      {label && <label htmlFor={id} style={labelStyle}>{label}</label>}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        style={inputStyle}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </div>
  );
};

export default FormInput;
