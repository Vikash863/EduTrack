import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const hasRole = (user, allowedRoles) => {
  if (!allowedRoles) return true;
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user?.role);
};

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, user } = useContext(AuthContext);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasRole(user, allowedRoles)) {
    return <Navigate to='/dashboard' replace />;
  }

  return children;
}
