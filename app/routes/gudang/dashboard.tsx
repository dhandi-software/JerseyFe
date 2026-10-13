import { useOutletContext } from "react-router";
import { DashboardGudangDesktop, DashboardGudangMobile } from "~/features/gudang/dashboard";

export default function WarehouseDashboardRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <DashboardGudangMobile /> : <DashboardGudangDesktop />;
}
