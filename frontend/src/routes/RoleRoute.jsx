import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

const hasRole = (user, allowedRoles) => {
  if (!allowedRoles) return true;
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  return roles.includes(user?.role);
};

export default function RoleRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);

  return (
    <ProtectedRoute>
      {!hasRole(user, allowedRoles) ? <Navigate to='/dashboard' replace /> : children}
    </ProtectedRoute>
  );
}
