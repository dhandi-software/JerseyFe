import { useEffect } from "react";
import { useOutletContext, useNavigate, useLocation } from "react-router";
import type { ContextType } from "~/root";
import { LoginDesktop, LoginMobile } from "~/features/login";
import { useAuth } from "~/hooks/useAuth";

export default function Login() {
  const context = useOutletContext<ContextType | null | undefined>();
  const isMobile = Boolean(context?.isMobile);
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const role = (user.role || "").toLowerCase();
      const fromLocation = (location.state as any)?.from;
      const from = fromLocation?.pathname || null;
      const fromSearch = fromLocation?.search || "";

      if (
        from &&
        typeof from === "string" &&
        from !== "/login" &&
        from !== "/register" &&
        from !== "/"
      ) {
        const isAllowed =
          (from.startsWith("/admin") && role === "admin") ||
          (from.startsWith("/customer") && role === "customer") ||
          (from.startsWith("/manager") && role === "manager") ||
          (from.startsWith("/desain") && role === "desain") ||
          (from.startsWith("/gudang") && role === "gudang");
        if (isAllowed) {
          navigate(`${from}${fromSearch}`, { replace: true });
          return;
        }
      }

      const target =
        role === "admin" ? "/admin" :
        role === "customer" ? "/customer" :
        role === "manager" ? "/manager" :
        role === "desain" ? "/desain" :
        role === "gudang" ? "/gudang" : "/";
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, isLoading, user, navigate, location.state]);

  return isMobile ? <LoginMobile /> : <LoginDesktop />;
}
