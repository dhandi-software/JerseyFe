import { useOutletContext } from "react-router";
import { BahanBajuCreateDesktop, BahanBajuCreateMobile } from "~/features/admin/bahan-baju";

export default function AdminBahanBajuCreateRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <BahanBajuCreateMobile /> : <BahanBajuCreateDesktop />;
}
