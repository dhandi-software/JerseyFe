import { useOutletContext } from "react-router";
import type { ContextType } from "../../root";
import { TrackingPesananDesktop } from "../../features/customer/tracking/TrackingPesananDesktop";
import { TrackingPesananMobile } from "../../features/customer/tracking/TrackingPesananMobile";

export default function TrackingPesananRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <TrackingPesananMobile /> : <TrackingPesananDesktop />;
}
