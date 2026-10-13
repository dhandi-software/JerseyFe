import { useOutletContext } from "react-router";
import { BahanBajuDetailDesktop, BahanBajuDetailMobile } from "~/features/admin/bahan-baju";

export default function AdminBahanBajuDetailRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <BahanBajuDetailMobile /> : <BahanBajuDetailDesktop />;
}
