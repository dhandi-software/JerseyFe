import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { PackingDesktop } from "~/features/gudang/packing/PackingDesktop";
import { PackingMobile } from "~/features/gudang/packing/PackingMobile";

export default function GudangPackingRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <PackingMobile /> : <PackingDesktop />;
}
