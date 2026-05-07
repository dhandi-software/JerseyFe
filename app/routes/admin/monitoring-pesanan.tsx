import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { MonitoringPesananDesktop, MonitoringPesananMobile } from "~/features/admin/monitoring-pesanan";

export default function AdminMonitoringPesananRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <MonitoringPesananMobile /> : <MonitoringPesananDesktop />;
}
