import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "~/hooks/useAuth";

export function ProtectedRoute({ children }: { children?: React.ReactNode }) {
  const { isAuthenticated, isLoading, isLoggingOut } = useAuth();
  const location = useLocation();

  if (isLoggingOut) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
