import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: 'var(--background)' }}>
        <div className="spinner"></div> {/* Apply global CSS spinner */}
      </div>
    );
  }

  // If user is logged in but NOT an admin, block them completely
  return user && user.role === 'admin' ? children : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;
