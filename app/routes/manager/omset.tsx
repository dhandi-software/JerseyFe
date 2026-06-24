import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { OmsetDesktop } from "~/features/manager/omset/OmsetDesktop";
import { OmsetMobile } from "~/features/manager/omset/OmsetMobile";

export default function ManagerOmsetRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <OmsetMobile /> : <OmsetDesktop />;
}
