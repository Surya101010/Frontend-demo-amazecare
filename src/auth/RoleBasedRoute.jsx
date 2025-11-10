import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

function RoleBasedRoute({ allowedRoles }) {
  const { role } = useAuth();

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

export default RoleBasedRoute;