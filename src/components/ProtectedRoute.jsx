import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './ui/Spinner';

// Redirige vers /login si pas connecté
export const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Redirige vers / si pas admin
export const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin)         return <Navigate to="/" replace />;

  return children;
};

// Redirige vers / si pas redacteur ou admin
export const RedacteurRoute = ({ children }) => {
  const { isAuthenticated, isRedacteur, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isRedacteur)     return <Navigate to="/" replace />;

  return children;
};