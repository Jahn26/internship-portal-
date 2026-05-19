import { Navigate, Outlet } from 'react-router-dom';
import Spinner from './Spinner';
import { useAuth } from '../context/AuthContext';
import { roleHomeRoute } from '../utils/formatters';

const ProtectedRoute = ({ allowedRoles }) => {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) {
    return <Spinner label="Checking session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={roleHomeRoute(user.role)} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
