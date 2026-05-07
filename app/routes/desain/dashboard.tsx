import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { DashboardDesainDesktop } from "~/features/desain/dashboard/DashboardDesainDesktop";
import { DashboardDesainMobile } from "~/features/desain/dashboard/DashboardDesainMobile";

export default function DesignerDashboardRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <DashboardDesainMobile /> : <DashboardDesainDesktop />;
}
