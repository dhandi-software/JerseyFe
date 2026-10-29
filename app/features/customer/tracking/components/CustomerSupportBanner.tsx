import { MessageCircle, Truck } from "lucide-react";
import { useCustomerSupportBanner } from "~/hooks";
import type { CustomerSupportBannerProps } from "~/types";

export function CustomerSupportBanner({
    orderId,
    variant = "desktop",
}: CustomerSupportBannerProps) {
    const { handleOpenSupport } = useCustomerSupportBanner(orderId);
    const isMobile = variant === "mobile";

    if (isMobile) {
        return (
            <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white space-y-4">
                <div className="w-full min-w-0">
                    <h4 className="text-base font-black uppercase italic tracking-tight mb-1.5 text-[#D25026]">
                        Butuh Bantuan?
                    </h4>
                    <p className="text-sm text-slate-300 font-medium italic leading-relaxed">
                        Jika Anda memiliki pertanyaan mengenai status pesanan Anda, silakan hubungi tim dukungan kami melalui WhatsApp.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleOpenSupport}
                    className="w-full min-h-11 bg-[#D25026] hover:bg-[#B34320] text-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest italic flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer shadow-sm"
                >
                    <MessageCircle size={15} />
                    Hubungi Support (+62 858-9272-0034)
                </button>
            </div>
        );
    }

    return (
        <div className="w-full bg-slate-900 p-8 md:p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="relative z-10 flex-1 min-w-0">
                <h3 className="text-base font-black uppercase tracking-widest text-[#D25026] mb-2 italic">
                    Butuh Bantuan?
                </h3>
                <p className="text-base text-slate-300 font-medium leading-relaxed italic">
                    Jika Anda memiliki pertanyaan mengenai status pesanan Anda, silakan hubungi tim dukungan kami melalui chat atau WhatsApp.
                </p>
            </div>
            <div className="relative z-10 shrink-0">
                <button
                    type="button"
                    onClick={handleOpenSupport}
                    className="bg-white text-slate-900 px-8 py-4 min-h-11 rounded-xl text-xs font-black uppercase tracking-widest italic hover:bg-[#D25026] hover:text-white transition-colors cursor-pointer flex items-center gap-2"
                >
                    <MessageCircle size={16} />
                    Hubungi Admin
                </button>
            </div>
            <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                <Truck size={180} />
            </div>
        </div>
    );
}
