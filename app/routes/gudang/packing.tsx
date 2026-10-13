import { useOutletContext } from "react-router";
import { PackingDesktop, PackingMobile } from "~/features/gudang/packing";

export default function GudangPackingRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <PackingMobile /> : <PackingDesktop />;
}
