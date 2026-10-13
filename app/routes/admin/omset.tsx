import { useOutletContext } from "react-router";
import { OmsetDesktop, OmsetMobile } from "~/features/admin/omset";

export default function AdminOmsetRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <OmsetMobile /> : <OmsetDesktop />;
}
