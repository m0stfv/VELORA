import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

export default function AdminRoute({ children }) {
  const { user, authInitialized, isAuthenticated } = useAuthStore();

  if (!authInitialized) {
    return null;
  }

  if (!isAuthenticated || !user || user.role !== 'ADMIN') {
    return <Navigate to="/" replace />;
  }

  return children;
}
