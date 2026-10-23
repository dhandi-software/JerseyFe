import { Send, ShoppingBag, X } from "lucide-react";
import { UPLOADS_URL } from "~/api/client";
import { cn } from "~/lib/utils";

interface ChatActiveOrderBannerProps {
    activeOrder: any;
    currentUserRole?: string;
    onDismiss: () => void;
    onSendOrderReference: () => void;
}

export function ChatActiveOrderBanner({
    activeOrder,
    currentUserRole,
    onDismiss,
    onSendOrderReference
}: ChatActiveOrderBannerProps) {
    if (!activeOrder) return null;

    return (
        <div className="px-4 py-2 z-10 animate-in fade-in slide-in-from-bottom-2 duration-300 w-full flex-shrink-0 bg-[#FCFCFC] border-t border-slate-100">
            <div className="w-full bg-white border border-slate-200 rounded-3xl p-4 shadow-sm relative group">
                {/* Header with Close */}
                <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest italic">
                        {currentUserRole?.toLowerCase() === "customer"
                            ? "Kamu menanyakan pesanan ini"
                            : "Kamu ingin menanyakan pesanan ini"}
                    </span>
                    <button
                        onClick={onDismiss}
                        className="p-1 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center border border-[#FDE8DF] overflow-hidden shrink-0">
                        {activeOrder.designUrl ? (
                            <img
                                src={`${UPLOADS_URL}${activeOrder.designUrl}`}
                                alt="Design"
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <ShoppingBag size={24} className="text-slate-950" />
                        )}
                    </div>

                    <div className="flex-1 flex flex-col min-w-0">
                        <div className="flex flex-col">
                            <h4 className="text-[14px] font-black text-slate-900 uppercase italic tracking-tight leading-tight">
                                {activeOrder.details?.[0]?.productTitle || "Custom Jersey"}
                            </h4>
                            <p className="text-[13px] font-bold text-slate-500 mt-1">
                                {activeOrder.details?.length || 0} Produk · <span className="text-slate-950">Rp {activeOrder.totalAmount?.toLocaleString('id-ID')}</span>
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className={cn(
                                    "text-[9px] font-black px-2 py-0.5 rounded-full uppercase italic",
                                    activeOrder.status === "DIPROSES" ? "bg-blue-50 text-blue-600 border border-blue-100" :
                                    activeOrder.status === "DESAIN" ? "bg-purple-50 text-purple-600 border border-purple-100" :
                                    "bg-orange-50 text-orange-600 border border-orange-100"
                                )}>
                                    {activeOrder.status}
                                </span>
                                <span className="text-[9px] font-mono font-bold text-slate-400">#{activeOrder.orderId}</span>
                            </div>
                        </div>
                    </div>

                    {/* Send Button */}
                    <button
                        onClick={onSendOrderReference}
                        className="px-4 py-2.5 bg-slate-900 text-white text-[11px] font-black uppercase italic rounded-2xl hover:bg-slate-800 transition-all shadow-md shadow-slate-900/20 flex items-center gap-2 self-center cursor-pointer"
                    >
                        <Send size={14} />
                        Kirim
                    </button>
                </div>
            </div>
        </div>
    );
}
