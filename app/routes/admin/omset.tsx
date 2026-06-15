import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { OmsetDesktop } from "~/features/admin/omset/OmsetDesktop";
import { OmsetMobile } from "~/features/admin/omset/OmsetMobile";

export default function AdminOmsetRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <OmsetMobile /> : <OmsetDesktop />;
}
