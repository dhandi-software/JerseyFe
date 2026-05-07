import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle2, Truck, FileText, Loader2, ChevronLeft, ShoppingBag, Eye } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { UPLOADS_URL } from "~/api/client";
import { useAuth } from "~/context/AuthContext";

const STAGES = [
    { id: "MENUNGGU", label: "Verifikasi", icon: Clock, desc: "Pengecekan pembayaran" },
    { id: "DESAIN", label: "Desain", icon: FileText, desc: "Mockup sedang dibuat" },
    { id: "LAYOUT", label: "Layout", icon: Package, desc: "Penyusunan tata letak" },
    { id: "FINISHING", label: "Finishing", icon: Truck, desc: "Tahap akhir pengerjaan" },
    { id: "SELESAI", label: "Selesai", icon: CheckCircle2, desc: "Pesanan siap diambil" }
];

export function ProgressPesananDesktop() {
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
            <div className="p-10 space-y-8 animate-in fade-in duration-500 font-geist">
                <button 
                    onClick={() => setSelectedOrder(null)}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest italic mb-4"
                >
                    <ChevronLeft size={16} /> Kembali ke Daftar
                </button>

                <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                    <div className="flex justify-between items-start mb-16">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Order Identity</p>
                            <h2 className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{selectedOrder.orderId}</h2>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Current Status</p>
                            <div className="flex items-center gap-2 justify-end">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                                <p className="text-xl font-black text-[#D25026] uppercase italic">{selectedOrder.status}</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute top-8 left-0 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[#D25026] transition-all duration-1000 ease-out" 
                                style={{ width: `${(getCurrentStageIndex(selectedOrder.status) / (STAGES.length - 1)) * 100}%` }}
                            ></div>
                        </div>

                        <div className="relative flex justify-between">
                            {STAGES.map((stage, idx) => {
                                const isCompleted = idx <= getCurrentStageIndex(selectedOrder.status);
                                const isActive = idx === getCurrentStageIndex(selectedOrder.status);
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

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-50 pt-16">
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                <FileText className="text-[#D25026]" size={16} /> Referensi Desain
                            </h3>
                            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                                {selectedOrder.designUrl ? (
                                    <div className="w-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                                        {selectedOrder.designUrl.toLowerCase().endsWith('.pdf') ? (
                                            <div className="flex flex-col items-center justify-center p-12 bg-slate-50 gap-6 group">
                                                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                    <FileText size={40} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-black text-slate-900 uppercase italic">Dokumen PDF</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Referensi Desain</p>
                                                </div>
                                                <a 
                                                    href={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl.startsWith('/') ? '' : '/'}${selectedOrder.designUrl}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 italic"
                                                >
                                                    <Eye size={14} /> Lihat PDF
                                                </a>
                                            </div>
                                        ) : (
                                            <img 
                                                src={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl.startsWith('/') ? '' : '/'}${selectedOrder.designUrl}`} 
                                                alt="Design Reference" 
                                                className="w-full h-auto max-h-[300px] object-contain mx-auto" 
                                            />
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full h-32 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                        <p className="text-[10px] font-bold text-slate-400 italic uppercase">Tidak ada referensi gambar</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Catatan:</p>
                                    <p className="text-sm text-slate-700 font-medium italic leading-relaxed bg-white p-6 rounded-2xl border border-slate-100">
                                        {selectedOrder.designNote || "Tidak ada catatan tambahan."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                <Package className="text-[#D25026]" size={16} /> Bukti Pembayaran
                            </h3>
                            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                                {selectedOrder.paymentUrl ? (
                                    <div className="w-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                                        <img 
                                            src={selectedOrder.paymentUrl.startsWith('http') ? selectedOrder.paymentUrl : `${UPLOADS_URL}${selectedOrder.paymentUrl.startsWith('/') ? '' : '/'}${selectedOrder.paymentUrl}`} 
                                            alt="Payment Proof" 
                                            className="w-full h-auto max-h-[300px] object-contain mx-auto" 
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-32 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                        <p className="text-[10px] font-bold text-slate-400 italic uppercase">Belum ada bukti bayar</p>
                                    </div>
                                )}
                                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">Total Pembayaran:</p>
                                        <p className="text-xs font-black text-emerald-700 uppercase italic">Paid</p>
                                    </div>
                                    <p className="text-2xl font-black text-emerald-800 tracking-tighter italic">Rp {selectedOrder.totalAmount?.toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex justify-between items-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Butuh Bantuan?</h3>
                        <p className="text-sm text-slate-400 font-medium italic">Tim admin kami siap membantu Anda 24/7 untuk pertanyaan seputar pesanan.</p>
                    </div>
                    <button className="relative z-10 bg-[#D25026] text-slate-900 px-8 py-4 rounded-xl font-black italic uppercase tracking-widest text-xs">Hubungi Admin</button>
                    <div className="absolute -right-10 -bottom-10 opacity-5">
                        <Truck size={200} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-10 space-y-10 animate-in fade-in duration-500 font-geist">
            <div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Progress Pesanan</h1>
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">Pantau status produksi jersey kamu</p>
            </div>

            {loading ? (
                <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#D25026]" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Memuat pesanan Anda...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center space-y-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="text-slate-200" size={40} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-lg font-black uppercase italic tracking-tight text-slate-900">Belum ada pesanan aktif</p>
                        <p className="text-xs font-medium text-slate-400 italic">Mulai buat jersey custom kamu sekarang dan pantau progressnya di sini.</p>
                    </div>
                    <Link to="/customer/custom-jersey" className="inline-block bg-[#D25026] text-slate-900 px-8 py-4 rounded-xl font-black italic uppercase tracking-widest text-xs">Order Sekarang</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <div 
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#D25026]/10 transition-colors">
                                    <Package className="text-slate-300 group-hover:text-[#D25026]" size={24} />
                                </div>
                                <span className={cn(
                                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                    order.status === "SELESAI" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-[#D25026] border-orange-100"
                                )}>
                                    {order.status}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">{order.orderId}</p>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">
                                    {order.details?.[0]?.productTitle || "Custom Jersey"}
                                </h3>
                                <p className="text-[10px] font-black text-[#D25026] uppercase italic tracking-widest">
                                    {order.details?.length} Units • {new Date(order.createdAt).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest italic text-slate-400 group-hover:text-[#D25026] transition-colors">
                                Lihat Progress
                                <Truck size={14} />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
