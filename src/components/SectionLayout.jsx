import React from 'react';

const SectionLayout = ({ 
  children, 
  title, 
  subtitle,
  background = 'transparent',
  padding = 'py-lg',
  className = '',
  ...props 
}) => {
  const sectionStyle = {
    padding: padding === 'py-lg' ? '6rem 0' : '3rem 0',
    backgroundColor: background === 'accent' ? 'var(--accent)' : 'transparent',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '4rem',
    maxWidth: '800px',
    margin: '0 auto 4rem auto',
  };

  return (
    <section style={sectionStyle} className={`section ${className}`} {...props}>
      <div className="container">
        {(title || subtitle) && (
          <div style={headerStyle} className="animate-fade-in">
            {title && <h2>{title}</h2>}
            {subtitle && <p style={{ fontSize: '1.125rem' }}>{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export default SectionLayout;
