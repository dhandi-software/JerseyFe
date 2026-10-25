import { Truck } from "lucide-react";

interface ShippingInfoSectionProps {
    shippingMethod?: string;
    shippingAddress?: string;
    variant?: "desktop" | "mobile";
}

export function ShippingInfoSection({
    shippingMethod,
    shippingAddress,
    variant = "desktop"
}: ShippingInfoSectionProps) {
    const isMobile = variant === "mobile";
    const isCOD = shippingMethod === "COD";

    return (
        <div className="space-y-4">
            <h3 className={isMobile ? "text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic" : "text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic"}>
                <div className="w-8 h-8 bg-white rounded-xl shadow-xs flex items-center justify-center border border-slate-100">
                    <Truck className="text-[#D25026]" size={16} />
                </div>
                Informasi Pengiriman
            </h3>

            <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-xs ${isMobile ? "p-4 space-y-4" : "p-6 grid grid-cols-1 md:grid-cols-2 gap-6"}`}>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 italic">
                        Metode Pengiriman:
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-black text-slate-900 uppercase italic">
                            {isCOD ? "COD (Penerima yang bayar)" : "Ambil di tempat (Self-Pickup)"}
                        </p>
                    </div>
                </div>

                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 italic">
                        {isCOD ? "Alamat Tujuan Pengiriman:" : "Alamat Toko (Kunjungi Toko):"}
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs text-slate-700 font-medium italic leading-relaxed">
                        {isCOD
                            ? (shippingAddress || "Alamat pengiriman tidak diisi.")
                            : "Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178"
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}
