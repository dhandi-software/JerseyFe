import { Navigate, Outlet } from "react-router";
import { useAuth } from "~/hooks/useAuth";
import type { User } from "~/api/types";

interface RoleGuardProps {
  allowedRoles: User["role"][];
  children?: React.ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { user, isLoading, isLoggingOut } = useAuth();

  if (isLoggingOut) {
    return null;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userRole = (user.role || "").trim().toLowerCase();
  const allowed = allowedRoles.map(r => r.trim().toLowerCase());

  if (!allowed.includes(userRole)) {
    const roleDashboard = 
      userRole === "admin" ? "/admin" :
      userRole === "customer" ? "/customer" :
      userRole === "manager" ? "/manager" :
      userRole === "desain" ? "/desain" :
      userRole === "gudang" ? "/gudang" : "/";
    return <Navigate to={roleDashboard} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}
