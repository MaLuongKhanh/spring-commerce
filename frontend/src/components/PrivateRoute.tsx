import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/auth.service';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = authService.isLoggedIn();

  if (!isAuthenticated) {
    // Chuyển hướng về trang login và lưu lại đường dẫn hiện tại
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute; 