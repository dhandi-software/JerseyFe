import { useState } from "react";
import { ChevronLeft, Copy, Check, Printer, Loader2 } from "lucide-react";
import { cn } from "~/lib/utils";
import { getStatusStyle } from "../../utils";
import type { MonitoringOrder } from "~/types";

interface DetailHeaderProps {
    order: MonitoringOrder;
    onBack?: () => void;
    isPrinting: boolean;
    onPrint?: () => Promise<void>;
    onPrintInvoice?: () => Promise<void>;
    variant?: "desktop" | "mobile";
    isMobile?: boolean;
}

export function DetailHeader({
    order,
    onBack,
    isPrinting,
    onPrint,
    onPrintInvoice,
    variant,
    isMobile = false
}: DetailHeaderProps) {
    const mobileMode = variant === "mobile" || isMobile;
    const printHandler = onPrint || onPrintInvoice || (async () => {});
    const [copiedId, setCopiedId] = useState(false);

    const handleCopyId = async () => {
        try {
            await navigator.clipboard.writeText(order.id);
        } catch {
            const textArea = document.createElement("textarea");
            textArea.value = order.id;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
        }
        setCopiedId(true);
        setTimeout(() => setCopiedId(false), 2000);
    };

    if (mobileMode) {
        return (
            <div className="p-5 bg-white border-b border-slate-100 sticky top-0 z-40">
                {onBack && (
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest italic mb-3 cursor-pointer"
                    >
                        <ChevronLeft size={16} /> Kembali ke Monitoring
                    </button>
                )}
                <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1.5 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className={cn("px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border", getStatusStyle(order.status))}>
                                {order.status}
                            </span>
                            {order.paymentType === "DP" ? (
                                <span className="bg-amber-50 text-amber-800 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-amber-200">
                                    DP (Sisa: Rp {(order.remainingAmount ?? 0).toLocaleString("id-ID")})
                                </span>
                            ) : (
                                <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded text-[8px] font-black uppercase border border-emerald-200">
                                    Full Cash
                                </span>
                            )}
                            {order.queueNumber && (
                                <span className="bg-orange-50 text-[#D25026] px-2 py-0.5 rounded text-[8px] font-black uppercase border border-orange-200">
                                    Antrean: {order.queueNumber}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900 font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                {order.id}
                            </span>
                            <button 
                                type="button"
                                onClick={handleCopyId}
                                className={cn(
                                    "p-1.5 rounded-lg transition-all cursor-pointer flex items-center justify-center",
                                    copiedId ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                )}
                                title={copiedId ? "Tersalin!" : "Salin ID"}
                            >
                                {copiedId ? (
                                    <Check size={13} className="text-emerald-600 stroke-[2.5]" />
                                ) : (
                                    <Copy size={13} />
                                )}
                            </button>
                        </div>
                    </div>
                    <button
                        onClick={printHandler}
                        disabled={isPrinting}
                        className="px-3 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shrink-0 active:scale-95 transition-transform cursor-pointer"
                    >
                        {isPrinting ? <Loader2 size={12} className="animate-spin" /> : <Printer size={12} />}
                        Invoice
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="relative p-8 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <span className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border uppercase", getStatusStyle(order.status))}>
                        {order.status}
                    </span>
                    {order.paymentType === "DP" ? (
                        <span className="text-[10px] font-black text-amber-800 uppercase tracking-widest italic bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 inline-block">
                            DP · Sisa Rp {(order.remainingAmount ?? 0).toLocaleString("id-ID")}
                        </span>
                    ) : (
                        <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest italic bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 inline-block">
                            Full Cash
                        </span>
                    )}
                    <span className="text-[10px] font-black text-[#D25026] uppercase tracking-widest italic bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 inline-block">
                        ID: {order.id}
                    </span>
                    <button 
                        type="button"
                        onClick={handleCopyId}
                        className={cn(
                            "flex items-center gap-1.5 text-[10px] font-bold transition-all px-3 py-1.5 rounded-lg border cursor-pointer",
                            copiedId
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300 ring-2 ring-emerald-500/20 shadow-xs"
                                : "text-slate-500 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border-slate-200"
                        )}
                        title={copiedId ? "Tersalin ke clipboard" : "Salin ID Pesanan"}
                    >
                        {copiedId ? (
                            <>
                                <Check size={13} className="text-emerald-600 stroke-[2.5]" />
                                <span className="font-black text-emerald-700">Tersalin!</span>
                            </>
                        ) : (
                            <>
                                <Copy size={12} />
                                <span>Salin ID</span>
                            </>
                        )}
                    </button>
                    {order.queueNumber && (
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            Antrean #{order.queueNumber}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={printHandler}
                        disabled={isPrinting}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                    >
                        {isPrinting ? <Loader2 size={14} className="animate-spin" /> : <Printer size={14} />}
                        Cetak Invoice PDF
                    </button>
                </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase italic tracking-tight">
                        Detail Pesanan & Produksi
                    </h2>
                    <p className="text-xs text-slate-400 font-medium mt-1">
                        Dibuat pada {order.dateTime || order.date} · Pelanggan: <strong className="text-slate-700">{order.customer}</strong> · Desainer: <strong className="text-slate-700">{order.designer}</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}
