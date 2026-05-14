import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Search, Package, Clock, CheckCircle2, Truck, FileText, AlertCircle, Loader2, ChevronRight, MapPin, Printer, User, Scissors, Palette, Ruler } from "lucide-react";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { sortPlayersBySize } from "~/lib/sizeUtils";

const STAGES = [
    { id: "MENUNGGU", label: "Verifikasi", icon: Clock, desc: "Cek pembayaran" },
    { id: "DESAIN", label: "Desain", icon: Palette, desc: "Mockup desain" },
    { id: "LAYOUT", label: "Layout", icon: Ruler, desc: "Pola & Layout" },
    { id: "PRINT", label: "Print", icon: Printer, desc: "Cetak kain" },
    { id: "FINISHING", label: "Finishing", icon: Scissors, desc: "Jahit & QC" },
    { id: "SELESAI", label: "Selesai", icon: CheckCircle2, desc: "Selesai" }
];

export function TrackingPesananDesktop() {
    const [searchParams] = useSearchParams();
    const [orderId, setOrderId] = useState(searchParams.get("id") || "");
    const [order, setOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            setOrderId(id);
            executeSearch(id);
        }
    }, [searchParams]);

    const executeSearch = async (idToSearch: string) => {
        if (!idToSearch.trim()) return;

        setLoading(true);
        setError("");
        try {
            const data = await orderService.trackOrder(idToSearch.trim());
            setOrder(data);
        } catch (err: any) {
            setError("ID Pesanan tidak ditemukan. Pastikan kode yang Anda masukkan benar.");
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        executeSearch(orderId);
    };

    const getCurrentStageIndex = () => {
        if (!order) return -1;
        return STAGES.findIndex(s => s.id === order.status);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-geist pb-20">
            {/* Hero Header */}
            <div className="bg-slate-900 pt-24 pb-40 px-10 relative overflow-hidden">
                <div className="w-full mx-auto relative z-10 text-center">
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-4 leading-none">Lacak Pesanan Anda</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs mb-12 italic">Cek Progress Pembuatan Jersey Custom Secara Real-Time</p>
                    
                    <form onSubmit={handleSearch} className="relative w-full mx-auto">
                        <input 
                            type="text" 
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                            placeholder="Masukkan Tracking ID (Contoh: JK-XXXXXX)"
                            className="w-full h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] px-10 text-white text-xl font-black placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#D25026] transition-all text-center uppercase tracking-widest"
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="absolute right-3 top-3 bottom-3 bg-[#D25026] hover:bg-[#B34320] text-slate-900 px-8 rounded-[2rem] font-black italic uppercase tracking-widest text-xs transition-all shadow-lg flex items-center gap-3 active:scale-95"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search size={20} />}
                            Lacak
                        </button>
                    </form>
                </div>
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[40px] border-white rounded-full"></div>
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full mx-auto -mt-20 px-10 relative z-20">
                {error && (
                    <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4 text-red-600 animate-in fade-in slide-in-from-top-4">
                        <AlertCircle size={24} />
                        <p className="font-bold text-sm italic uppercase tracking-tight">{error}</p>
                    </div>
                )}

                {order && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        {/* Status Stepper */}
                        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                            <div className="flex justify-between items-start mb-16">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Order Identity</p>
                                    <h2 className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{order.orderId}</h2>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Current Status</p>
                                    <div className="flex items-center gap-2 justify-end">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                                        <p className="text-xl font-black text-[#D25026] uppercase italic">{order.status}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                {/* Connector Line */}
                                <div className="absolute top-8 left-0 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#D25026] transition-all duration-1000 ease-out" 
                                        style={{ width: `${(getCurrentStageIndex() / (STAGES.length - 1)) * 100}%` }}
                                    ></div>
                                </div>

                                {/* Steps */}
                                <div className="relative flex justify-between">
                                    {STAGES.map((stage, idx) => {
                                        const isCompleted = idx <= getCurrentStageIndex();
                                        const isActive = idx === getCurrentStageIndex();
                                        const Icon = stage.icon;

                                        return (
                                            <div key={stage.id} className="flex flex-col items-center group w-40 text-center">
                                                <div className={cn(
                                                    "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 border-4",
                                                    isCompleted ? "bg-[#D25026] border-white text-slate-900 shadow-xl shadow-[#D25026]/30" : "bg-white border-slate-50 text-slate-200"
                                                )}>
                                                    <Icon size={24} className={cn(isActive && "animate-bounce")} />
                                                </div>
                                                <div className="mt-4 space-y-1">
                                                    <p className={cn(
                                                        "text-[11px] font-black uppercase tracking-widest italic",
                                                        isCompleted ? "text-slate-900" : "text-slate-300"
                                                    )}>
                                                        {stage.label}
                                                    </p>
                                                    <p className="text-[9px] font-medium text-slate-400 leading-tight">
                                                        {stage.desc}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Order Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3 italic">
                                    <Package className="text-[#D25026]" size={16} /> Detail Pesanan
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Pemesan</p>
                                        <p className="text-sm font-black text-slate-900 uppercase italic">{order.customerName}</p>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Item</p>
                                        <p className="text-sm font-black text-slate-900 uppercase italic">{order.details?.[0]?.productTitle || "Custom Jersey"}</p>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Total Unit</p>
                                        <p className="text-sm font-black text-slate-900 uppercase italic">{order.details?.length} Unit</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-50 mt-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-4">Daftar Pemain</p>
                                        <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                                <table className="w-full text-left relative">
                                                    <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm">
                                                        <tr>
                                                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Nama</th>
                                                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest italic text-center">No</th>
                                                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest italic text-center">Size</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 bg-slate-50">
                                                        {sortPlayersBySize(order.details || []).map((item: any, idx: number) => (
                                                            <tr key={idx} className="hover:bg-white transition-colors">
                                                                <td className="px-4 py-3 text-[11px] font-black text-slate-900 uppercase italic">{item.playerName || "-"}</td>
                                                                <td className="px-4 py-3 text-[11px] font-black text-[#D25026] text-center">{item.playerNumber || "-"}</td>
                                                                <td className="px-4 py-3 text-center">
                                                                    <span className="bg-white px-2 py-1 rounded text-[9px] font-black italic border border-slate-200">{item.playerSize || "-"}</span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Tanggal Order</p>
                                        <p className="text-sm font-black text-slate-900 uppercase italic">
                                            {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#D25026] mb-6 italic">Butuh Bantuan?</h3>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed italic mb-8">
                                        Jika Anda memiliki pertanyaan mengenai status pesanan Anda, silakan hubungi tim dukungan kami melalui chat atau WhatsApp.
                                    </p>
                                    <button className="bg-white text-slate-900 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest italic hover:bg-[#D25026] transition-colors">
                                        Hubungi Admin
                                    </button>
                                </div>
                                <div className="absolute -right-6 -bottom-6 opacity-5 transform rotate-12">
                                    <Truck size={120} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
