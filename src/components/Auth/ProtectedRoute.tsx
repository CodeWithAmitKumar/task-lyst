import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import AuthService from '../../services/AuthService';

const ProtectedRoute: React.FC = () => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!AuthService.isStorageAvailable()) {
      setIsAuthorized(false);
      return;
    }

    const authStatus = AuthService.isAuthenticated();
    setIsAuthorized(authStatus);

    if (!authStatus) {
      AuthService.logout();
    }
  }, [navigate]);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute; 