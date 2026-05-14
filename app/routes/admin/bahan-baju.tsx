import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { BahanBajuDesktop, BahanBajuMobile } from "~/features/admin/bahan-baju";

export default function AdminBahanBajuRoute() {
  const { isMobile } = useOutletContext<ContextType>();
  return isMobile ? <BahanBajuMobile /> : <BahanBajuDesktop />;
}
