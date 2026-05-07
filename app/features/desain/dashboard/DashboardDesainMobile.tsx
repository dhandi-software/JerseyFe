import { useState, useEffect } from "react";
import { Clock, Eye, Package, ChevronLeft, Image as ImageIcon, MessageCircle, FileText } from "lucide-react";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { UPLOADS_URL } from "~/api/client";
import { useAuth } from "~/hooks/useAuth";

export function DashboardDesainMobile() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) return;
            try {
                const data = await orderService.getDesignerOrders(user.id);
                const formattedOrders = data.map((o: any) => ({
                    id: o.orderId,
                    rawId: o.id,
                    customer: o.customerName,
                    product: o.details.length > 0 ? o.details[0].productTitle : "Custom Jersey",
                    qty: o.details.length,
                    status: o.status,
                    dateTime: new Date(o.createdAt).toLocaleString('id-ID', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    }),
                    playerInfo: o.details.map((d: any) => ({
                        name: d.playerName || "-",
                        number: d.playerNumber || "-",
                        size: d.playerSize || "-"
                    })).sort((a: any, b: any) => {
                        const sizeOrder = ['XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', 'XXXL', '4XL', 'XXXXL', '5XL', 'XXXXXL'];
                        const sizeA = a.size.toUpperCase();
                        const sizeB = b.size.toUpperCase();
                        const numA = parseInt(sizeA);
                        const numB = parseInt(sizeB);
                        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
                        if (!isNaN(numA)) return -1;
                        if (!isNaN(numB)) return 1;
                        const indexA = sizeOrder.indexOf(sizeA);
                        const indexB = sizeOrder.indexOf(sizeB);
                        if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                        if (indexA !== -1) return -1;
                        if (indexB !== -1) return 1;
                        return sizeA.localeCompare(sizeB);
                    }),
                    designNote: o.designNote,
                    designUrl: o.designUrl,
                    customerId: o.customerId,
                }));
                setOrders(formattedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user?.id]);

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        try {
            await orderService.updateOrderStatus(id, newStatus);
            setOrders(prev => prev.map(o => o.rawId === id ? { ...o, status: newStatus } : o));
            if (selectedOrder?.rawId === id) {
                setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
            }
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Gagal memperbarui status.");
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "SELESAI": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "FINISHING": return "bg-blue-50 text-blue-700 border-blue-200";
            case "LAYOUT": return "bg-amber-50 text-amber-700 border-amber-200";
            case "DESAIN": return "bg-purple-50 text-purple-700 border-purple-200";
            case "DITOLAK": return "bg-red-50 text-red-700 border-red-200";
            case "MENUNGGU": default: return "bg-slate-50 text-slate-700 border-slate-200";
        }
    };

    if (selectedOrder) {
        return (
            <div className="min-h-screen bg-slate-50 font-geist pb-24">
                <div className="bg-white px-6 pt-6 pb-6 border-b border-slate-100 sticky top-0 z-40">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-bold text-xs mb-4"
                    >
                        <ChevronLeft size={16} /> Kembali
                    </button>
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col gap-2">
                            <span className={cn("px-3 py-1 rounded-lg text-[8px] font-black tracking-widest border uppercase w-fit", getStatusStyle(selectedOrder.status))}>
                                {selectedOrder.status}
                            </span>
                            <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Pesanan {selectedOrder.customer}</h1>
                            <p className="text-[10px] font-bold text-slate-500 italic mt-1">{selectedOrder.product} - {selectedOrder.qty} Pcs</p>
                            <div className="flex items-center gap-1.5 mt-2 text-slate-400">
                                <Clock size={10} />
                                <span className="text-[8px] font-black uppercase tracking-widest italic">{selectedOrder.dateTime}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-6 space-y-6">
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <ImageIcon className="text-[#D25026]" size={14} /> Referensi Desain
                        </h3>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            {selectedOrder.designUrl ? (
                                <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                    {selectedOrder.designUrl.toLowerCase().endsWith('.pdf') ? (
                                        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 gap-4 group">
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
                                                className="px-6 py-3 bg-red-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 italic"
                                            >
                                                <Eye size={12} /> Buka PDF
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
                                <div className="w-full h-24 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-100">
                                    <p className="text-[10px] font-bold text-slate-400 italic uppercase">Tidak ada referensi</p>
                                </div>
                            )}
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Catatan:</p>
                                <p className="text-[10px] text-slate-700 font-medium italic leading-relaxed">{selectedOrder.designNote || "Tidak ada catatan"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <Package className="text-[#D25026]" size={14} /> Daftar Nama & Nomor
                        </h3>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            {selectedOrder.playerInfo.map((player: any, idx: number) => (
                                <div key={idx} className="p-4 border-b border-slate-50 last:border-0 flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-black text-slate-800 uppercase italic">{player.name}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="bg-slate-100 px-2 py-1 rounded text-[10px] font-black italic">{player.size}</span>
                                        <span className="text-[#D25026] font-black text-lg w-6 text-center">{player.number}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-white border-t border-slate-100 flex flex-col gap-3 fixed bottom-0 left-0 right-0 z-50">
                    <button 
                        onClick={() => window.location.href = `/desain/chat?userId=${selectedOrder.customerId}`}
                        className="w-full h-12 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic flex items-center justify-center gap-2 shadow-lg"
                    >
                        <MessageCircle size={14} /> Chat Customer
                    </button>
                    <div className="flex gap-2">
                        {selectedOrder.status === "DESAIN" && (
                            <button 
                                onClick={() => handleUpdateStatus(selectedOrder.rawId, "LAYOUT")}
                                className="flex-1 h-12 bg-amber-400 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-amber-500/20"
                            >
                                Lanjut Layout
                            </button>
                        )}
                        {selectedOrder.status === "LAYOUT" && (
                            <button 
                                onClick={() => handleUpdateStatus(selectedOrder.rawId, "FINISHING")}
                                className="flex-1 h-12 bg-blue-400 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-blue-500/20"
                            >
                                Lanjut Finishing
                            </button>
                        )}
                        {selectedOrder.status === "FINISHING" && (
                            <button 
                                onClick={() => handleUpdateStatus(selectedOrder.rawId, "SELESAI")}
                                className="flex-1 h-12 bg-emerald-400 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-emerald-500/20"
                            >
                                Selesaikan Pesanan
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-geist pb-20">
            <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 sticky top-0 z-40">
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Pesanan Saya</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kelola tugas desain Anda</p>
            </div>

            <div className="p-6 space-y-4">
                {loading ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-3">
                        <div className="w-6 h-6 border-2 border-slate-200 border-t-[#D25026] rounded-full animate-spin" />
                        <p className="text-xs font-bold text-slate-400">Memuat pesanan...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="py-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-sm font-bold text-slate-400">Belum ada pesanan.</p>
                    </div>
                ) : (
                    orders.map(order => (
                        <div key={order.rawId} 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="font-bold text-slate-900 text-sm font-mono">{order.id}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-0.5">{order.dateTime}</p>
                                </div>
                                <span className={cn("px-2 py-1 rounded-md text-[8px] font-black tracking-widest border uppercase", getStatusStyle(order.status))}>
                                    {order.status}
                                </span>
                            </div>
                            
                            <div className="bg-slate-50 rounded-xl p-3 mb-3">
                                <p className="text-xs font-bold text-slate-700">{order.customer}</p>
                                <p className="text-[10px] text-slate-500 font-medium">{order.product} - {order.qty} Items</p>
                            </div>

                            <button className="w-full py-2.5 bg-[#D25026]/5 text-[#D25026] text-[10px] font-black uppercase tracking-widest rounded-xl italic flex items-center justify-center gap-2">
                                <Eye size={12} /> Lihat Detail
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
