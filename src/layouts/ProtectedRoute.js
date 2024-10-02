import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from './UserContext'; // Import the context

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(UserContext);

  if (!user?.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
