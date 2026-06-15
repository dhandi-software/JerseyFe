import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { DashboardGudangDesktop } from "~/features/gudang/dashboard/DashboardGudangDesktop";
import { DashboardGudangMobile } from "~/features/gudang/dashboard/DashboardGudangMobile";

export default function WarehouseDashboardRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <DashboardGudangMobile /> : <DashboardGudangDesktop />;
}
