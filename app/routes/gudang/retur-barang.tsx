import { useOutletContext } from "react-router";
import { ReturBarangDesktop, ReturBarangMobile } from "~/features/admin/retur-barang";

export default function GudangReturBarangRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();
  return isMobile ? <ReturBarangMobile /> : <ReturBarangDesktop />;
}
