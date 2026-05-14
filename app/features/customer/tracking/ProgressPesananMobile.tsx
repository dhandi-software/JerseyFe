import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle2, Truck, FileText, Loader2, ChevronLeft, ShoppingBag, ChevronRight, Eye, Printer, Scissors, Palette, Ruler, Layers, User } from "lucide-react";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { UPLOADS_URL } from "~/api/client";
import { useAuth } from "~/context/AuthContext";
import { sortPlayersBySize } from "~/lib/sizeUtils";
import { Link } from "react-router";

const STAGES = [
    { id: "MENUNGGU", label: "Verifikasi", icon: Clock, desc: "Cek bayar" },
    { id: "DESAIN", label: "Desain", icon: Palette, desc: "Mockup" },
    { id: "LAYOUT", label: "Layout", icon: Ruler, desc: "Pola" },
    { id: "PRINT", label: "Print", icon: Printer, desc: "Cetak" },
    { id: "FINISHING", label: "Finishing", icon: Scissors, desc: "Jahit & QC" },
    { id: "SELESAI", label: "Selesai", icon: CheckCircle2, desc: "Diterima" }
];

export function ProgressPesananMobile() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) return;
            try {
                const data = await orderService.getCustomerOrders(user.id);
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    const getCurrentStageIndex = (status: string) => {
        return STAGES.findIndex(s => s.id === status);
    };

    if (selectedOrder) {
        return (
            <div className="min-h-screen bg-slate-50 font-geist pb-24">
                <div className="bg-white p-6 border-b border-slate-100 sticky top-0 z-50">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest italic mb-2"
                    >
                        <ChevronLeft size={16} /> Kembali
                    </button>
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Progress Pesanan</h1>
                    <p className="text-[10px] font-bold text-[#D25026] uppercase italic mt-1 font-mono">{selectedOrder.orderId}</p>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic mb-0.5">Produk</p>
                                <h2 className="text-sm font-black text-slate-900 uppercase italic">{selectedOrder.details?.[0]?.productTitle || "Custom Jersey"}</h2>
                            </div>
                            <div className="text-right">
                                <div className={cn("px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border bg-[#D25026] text-slate-900 border-[#D25026]/20")}>
                                    {selectedOrder.status}
                                </div>
                            </div>
                        </div>

                        {/* Vertical Stepper */}
                        <div className="space-y-6">
                            {STAGES.map((stage, idx) => {
                                const isCompleted = idx <= getCurrentStageIndex(selectedOrder.status);
                                const isActive = idx === getCurrentStageIndex(selectedOrder.status);
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

                    {/* New Design Reference Card Mobile */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <FileText className="text-[#D25026]" size={14} /> Referensi & Catatan
                        </h3>
                        {selectedOrder.designUrl ? (
                            <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                {selectedOrder.designUrl.toLowerCase().endsWith('.pdf') ? (
                                    <div className="flex flex-col items-center justify-center p-8 bg-white gap-4 group">
                                        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
                                            <FileText size={32} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-slate-900 uppercase italic">Dokumen PDF</p>
                                        </div>
                                        <a 
                                            href={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl.startsWith('/') ? '' : '/'}${selectedOrder.designUrl}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-red-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 italic shadow-lg shadow-red-600/20"
                                        >
                                            <Eye size={12} /> Buka PDF
                                        </a>
                                    </div>
                                ) : (
                                    <img 
                                        src={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl.startsWith('/') ? '' : '/'}${selectedOrder.designUrl}`} 
                                        className="w-full h-auto max-h-[250px] object-contain mx-auto" 
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-100">
                                <p className="text-[8px] font-bold text-slate-300 italic uppercase">Tidak ada referensi</p>
                            </div>
                        )}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Catatan:</p>
                            <p className="text-[10px] text-slate-700 font-medium italic leading-relaxed">{selectedOrder.designNote || "Tidak ada catatan."}</p>
                        </div>
                    </div>

                    {/* New Payment Detail Card Mobile */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <Package className="text-[#D25026]" size={14} /> Info Pembayaran
                        </h3>
                        {selectedOrder.paymentUrl ? (
                            <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                <img 
                                    src={selectedOrder.paymentUrl.startsWith('http') ? selectedOrder.paymentUrl : `${UPLOADS_URL}${selectedOrder.paymentUrl.startsWith('/') ? '' : '/'}${selectedOrder.paymentUrl}`} 
                                    className="w-full h-auto max-h-[250px] object-contain mx-auto" 
                                />
                            </div>
                        ) : (
                            <div className="w-full h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-100">
                                <p className="text-[8px] font-bold text-slate-300 italic uppercase">Belum ada bukti bayar</p>
                            </div>
                        )}
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
                            <div>
                                <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest italic">Total:</p>
                                <p className="text-sm font-black text-emerald-800 italic uppercase">Paid</p>
                            </div>
                            <p className="text-lg font-black text-emerald-700 italic">Rp {selectedOrder.totalAmount?.toLocaleString('id-ID')}</p>
                        </div>
                    </div>

                    {/* Data Pemain Card Mobile */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <User className="text-[#D25026]" size={14} /> Data Pemain
                        </h3>
                        <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left relative">
                                    <thead className="bg-slate-100 sticky top-0 z-10 border-b border-slate-200 shadow-sm">
                                        <tr>
                                            <th className="px-3 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Nama</th>
                                            <th className="px-3 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest italic text-center">No</th>
                                            <th className="px-3 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest italic text-center">Size</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-slate-50">
                                        {sortPlayersBySize(selectedOrder.details || []).map((item: any, idx: number) => (
                                            <tr key={idx}>
                                                <td className="px-3 py-2 text-[10px] font-black text-slate-700 uppercase italic truncate max-w-[100px]">{item.playerName || "-"}</td>
                                                <td className="px-3 py-2 text-[10px] font-black text-[#D25026] text-center">{item.playerNumber || "-"}</td>
                                                <td className="px-3 py-2 text-center text-[10px] font-black italic text-slate-500">{item.playerSize || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white">
                        <h4 className="text-sm font-black uppercase italic tracking-tighter mb-2">Butuh Bantuan?</h4>
                        <p className="text-[9px] text-slate-400 font-medium italic leading-relaxed mb-4">
                            Hubungi admin jika Anda memiliki pertanyaan seputar progress produksi.
                        </p>
                        <button className="w-full bg-[#D25026] text-slate-900 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest italic">
                            Hubungi Support
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-geist pb-24">
            <div className="bg-white px-6 pt-12, pb-6 border-b border-slate-100 sticky top-0 z-40">
                <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Daftar Progress</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Pantau Semua Pesanan Aktif</p>
            </div>

            <div className="p-6 space-y-4">
                {loading ? (
                    <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center flex flex-col items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-[#D25026]" />
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Memuat...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-10 rounded-[2rem] border border-slate-100 text-center space-y-3">
                        <ShoppingBag className="mx-auto text-slate-100" size={32} />
                        <p className="text-[10px] font-bold text-slate-400 italic uppercase">Belum ada pesanan aktif</p>
                        <Link to="/customer/custom-jersey" className="block text-[#D25026] text-[8px] font-black uppercase tracking-widest">Order Sekarang &rarr;</Link>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div 
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform"
                        >
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-black text-slate-400 font-mono">{order.orderId}</span>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border",
                                        order.status === "SELESAI" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-[#D25026] border-orange-100"
                                    )}>
                                        {order.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-900 uppercase italic leading-tight">{order.details?.[0]?.productTitle || "Custom Jersey"}</p>
                                    <p className="text-[8px] font-bold text-slate-400 italic">{order.details?.length} Unit • {new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-xl">
                                <ChevronRight size={16} className="text-slate-300" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
