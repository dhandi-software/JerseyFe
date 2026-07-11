import { useOutletContext } from "react-router";
import type { ContextType } from "~/root";
import { BuatPesananDesktop } from "~/features/admin/buat-pesanan/desktop/BuatPesananDesktop";
import { BuatPesananMobile } from "~/features/admin/buat-pesanan/mobile/BuatPesananMobile";

export default function BuatPesananAdminRoute() {
    const { isMobile } = useOutletContext<ContextType>();
    
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
