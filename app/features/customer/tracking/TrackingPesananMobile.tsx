import { useState } from "react";
import { Search, Package, Clock, CheckCircle2, Truck, FileText, AlertCircle, Loader2, ChevronLeft, MapPin } from "lucide-react";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";

const STAGES = [
    { id: "MENUNGGU", label: "Verifikasi", icon: Clock, desc: "Cek pembayaran" },
    { id: "DESAIN", label: "Desain", icon: FileText, desc: "Mockup desain" },
    { id: "PRODUKSI", label: "Produksi", icon: Package, desc: "Cetak & Jahit" },
    { id: "PENGIRIMAN", label: "Kirim", icon: Truck, desc: "Oleh kurir" },
    { id: "SELESAI", label: "Selesai", icon: CheckCircle2, desc: "Diterima" }
];

export function TrackingPesananMobile() {
    const [orderId, setOrderId] = useState("");
    const [order, setOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setError("");
        try {
            const data = await orderService.trackOrder(orderId.trim());
            setOrder(data);
        } catch (err: any) {
            setError("ID tidak ditemukan");
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const getCurrentStageIndex = () => {
        if (!order) return -1;
        return STAGES.findIndex(s => s.id === order.status);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-geist pb-20">
            {/* Header */}
            <div className="bg-slate-900 pt-16 pb-24 px-6 relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">Lacak Jersey</h1>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Real-Time Production Tracking</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative">
                        <input 
                            type="text" 
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                            placeholder="Tracking ID (JK-XXXXXX)"
                            className="w-full h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 text-white text-sm font-black placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D25026] text-center uppercase tracking-[0.2em]"
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="absolute right-2 top-2 bottom-2 bg-[#D25026] text-slate-900 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest italic flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search size={16} />}
                        </button>
                    </form>
                </div>
            </div>

            <div className="px-6 -mt-10 relative z-20 space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600">
                        <AlertCircle size={18} />
                        <p className="font-bold text-[10px] italic uppercase tracking-tight">{error}</p>
                    </div>
                )}

                {order && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        {/* Main Status Card */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic mb-0.5">Order ID</p>
                                    <h2 className="text-lg font-black text-slate-900 font-mono tracking-tighter">{order.orderId}</h2>
                                </div>
                                <div className="text-right">
                                    <div className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border bg-[#D25026] text-slate-900 border-[#D25026]/20")}>
                                        {order.status}
                                    </div>
                                </div>
                            </div>

                            {/* Vertical Stepper */}
                            <div className="space-y-6">
                                {STAGES.map((stage, idx) => {
                                    const isCompleted = idx <= getCurrentStageIndex();
                                    const isActive = idx === getCurrentStageIndex();
                                    const Icon = stage.icon;

                                    return (
                                        <div key={stage.id} className="flex gap-4 group">
                                            <div className="flex flex-col items-center">
                                                <div className={cn(
                                                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 relative z-10",
                                                    isCompleted ? "bg-[#D25026] border-white text-slate-900 shadow-lg shadow-[#D25026]/20" : "bg-white border-slate-50 text-slate-200"
                                                )}>
                                                    <Icon size={18} className={cn(isActive && "animate-pulse")} />
                                                </div>
                                                {idx !== STAGES.length - 1 && (
                                                    <div className={cn(
                                                        "w-0.5 h-10 -my-1",
                                                        isCompleted ? "bg-[#D25026]" : "bg-slate-100"
                                                    )}></div>
                                                )}
                                            </div>
                                            <div className="pt-1">
                                                <p className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest italic",
                                                    isCompleted ? "text-slate-900" : "text-slate-300"
                                                )}>
                                                    {stage.label}
                                                </p>
                                                <p className="text-[9px] font-medium text-slate-400 mt-0.5 leading-tight italic">
                                                    {stage.desc}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Order Details Mini Card */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                            <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-900 italic flex items-center gap-2">
                                <Package className="text-[#D25026]" size={12} /> Info Pesanan
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest italic mb-0.5">Produk</p>
                                    <p className="text-[10px] font-bold text-slate-700 uppercase italic truncate">{order.details?.[0]?.productTitle || "Custom Jersey"}</p>
                                </div>
                                <div>
                                    <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest italic mb-0.5">Jumlah</p>
                                    <p className="text-[10px] font-bold text-slate-700 uppercase italic">{order.details?.length} Unit</p>
                                </div>
                            </div>
                        </div>

                        {/* Help Card */}
                        <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white">
                            <h4 className="text-sm font-black uppercase italic tracking-tighter mb-2">Butuh Bantuan?</h4>
                            <p className="text-[9px] text-slate-400 font-medium italic leading-relaxed mb-4">
                                Hubungi admin jika kode pelacakan tidak valid atau bermasalah.
                            </p>
                            <button className="w-full bg-[#D25026] text-slate-900 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest italic">
                                Hubungi Support
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
