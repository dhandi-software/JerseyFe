import { useOutletContext } from "react-router";
import { ProgressPesananDesktop, ProgressPesananMobile } from "~/features/customer/tracking";

export default function ProgressPesananRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <ProgressPesananMobile /> : <ProgressPesananDesktop />;
}
