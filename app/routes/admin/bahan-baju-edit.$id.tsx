import { useOutletContext } from "react-router";
import { BahanBajuEditDesktop, BahanBajuEditMobile } from "~/features/admin/bahan-baju";

export default function AdminBahanBajuEditRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <BahanBajuEditMobile /> : <BahanBajuEditDesktop />;
}
