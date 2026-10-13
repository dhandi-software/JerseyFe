import { useOutletContext } from "react-router";
import { BuatPesananDesktop, BuatPesananMobile } from "~/features/admin/buat-pesanan";

export default function BuatPesananAdminRoute() {
  const { isMobile } = useOutletContext<{ isMobile: boolean }>();

  return (
    <div className="flex-1 w-full bg-[#FAFAFA] min-h-screen">
      {isMobile ? (
        <BuatPesananMobile title="Buat Pesanan" />
      ) : (
        <BuatPesananDesktop title="Buat Pesanan" />
      )}
    </div>
  );
}
