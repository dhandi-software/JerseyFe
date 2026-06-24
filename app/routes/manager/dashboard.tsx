import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { DashboardDesktop, DashboardMobile } from "~/features/manager/dashboard";

export default function ManagerDashboardRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <DashboardMobile /> : <DashboardDesktop />;
}
