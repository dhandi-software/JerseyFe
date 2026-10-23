import { useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router";
import type { ContextType } from "~/root";
import { LoginDesktop, LoginMobile } from "~/features/login";
import { useAuth } from "~/hooks/useAuth";

export default function Login() {
  const context = useOutletContext<ContextType | null | undefined>();
  const isMobile = Boolean(context?.isMobile);
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const role = (user.role || "").toLowerCase();
      const target =
        role === "admin" ? "/admin" :
        role === "customer" ? "/customer" :
        role === "manager" ? "/manager" :
        role === "desain" ? "/desain" :
        role === "gudang" ? "/gudang" : "/";
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  return isMobile ? <LoginMobile /> : <LoginDesktop />;
}
