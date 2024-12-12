import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { auth } = useAuth();

  return allowedRoles.includes(auth.role) ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
