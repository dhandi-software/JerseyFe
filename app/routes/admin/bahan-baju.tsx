import { useOutletContext } from "react-router";
import { BahanBajuDesktop, BahanBajuMobile } from "~/features/admin/bahan-baju";

export default function AdminBahanBajuRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <BahanBajuMobile /> : <BahanBajuDesktop />;
}
