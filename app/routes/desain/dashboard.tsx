import { useOutletContext } from "react-router";
import { DashboardDesainDesktop, DashboardDesainMobile } from "~/features/desain/dashboard";

export default function DesignerDashboardRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <DashboardDesainMobile /> : <DashboardDesainDesktop />;
}
