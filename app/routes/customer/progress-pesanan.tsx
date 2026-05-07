import { useOutletContext } from "react-router";
import type { ContextType } from "../../root";
import { ProgressPesananDesktop } from "../../features/customer/tracking/ProgressPesananDesktop";
import { ProgressPesananMobile } from "../../features/customer/tracking/ProgressPesananMobile";

export default function ProgressPesananRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <ProgressPesananMobile /> : <ProgressPesananDesktop />;
}
