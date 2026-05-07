import { useState, useEffect } from "react";
import { ShoppingBag, CheckCircle, Clock, FileText, Eye, User, Image as ImageIcon, CreditCard, ChevronRight, Loader2, ChevronLeft, Copy } from "lucide-react";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { UPLOADS_URL } from "~/api/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { adminApi } from "~/api/admin";

export function MonitoringPesananMobile() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [designers, setDesigners] = useState<any[]>([]);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedDesignerId, setSelectedDesignerId] = useState<number | "">("");
    const [orderToAssign, setOrderToAssign] = useState<number | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getOrders();
                const formattedOrders = data.map((o: any) => ({
                    id: o.orderId,
                    rawId: o.id,
                    customer: o.customerName,
                    designer: o.designerName || "Belum Ada",
                    product: o.details.length > 0 ? o.details[0].productTitle : "Custom Jersey",
                    qty: o.details.length,
                    status: o.status,
                    date: new Date(o.createdAt).toISOString().split('T')[0],
                    playerInfo: o.details.map((d: any) => ({
                        name: d.playerName || "-",
                        number: d.playerNumber || "-",
                        size: d.playerSize || "-"
                    })),
                    designNote: o.designNote,
                    designUrl: o.designUrl,
                    paymentProofUrl: o.paymentUrl,
                    totalAmount: o.totalAmount,
                    dateTime: new Date(o.createdAt).toLocaleString('id-ID', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })
                }));
                setOrders(formattedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchDesigners = async () => {
            try {
                const res = await adminApi.getDesigners();
                if (res.data) setDesigners(res.data);
            } catch (error) {
                console.error("Error fetching designers:", error);
            }
        };

        fetchOrders();
        fetchDesigners();
    }, []);

    const handleUpdateStatus = async (id: number, newStatus: string, designerId?: number) => {
        try {
            await orderService.updateOrderStatus(id, newStatus, designerId);
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
            <div className="min-h-screen bg-white font-geist flex flex-col">
                <div className="p-6 bg-white border-b border-slate-100 sticky top-0 z-50">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest italic mb-4"
                    >
                        <ChevronLeft size={16} /> Kembali
                    </button>
                    <div className="flex items-start justify-between mb-4">
                        <div className="space-y-2">
                            <span className={cn("px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border", getStatusStyle(selectedOrder.status))}>
                                {selectedOrder.status}
                            </span>
                            <div className="flex items-center gap-2">
                                <p className="text-[12px] font-bold text-slate-900 font-mono tracking-tighter bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                    {selectedOrder.id}
                                </p>
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(selectedOrder.id);
                                        alert("ID Berhasil disalin!");
                                    }}
                                    className="p-1 text-slate-400 active:text-[#D25026]"
                                >
                                    <Copy size={14} />
                                </button>
                            </div>
                            <p className="text-[10px] font-black text-[#D25026] uppercase tracking-widest italic leading-tight bg-orange-50 p-2 rounded-lg border border-orange-100">
                                 Info: ID ini dikirim ke customer untuk melacak pesanan
                             </p>
                         </div>
                    </div>
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Detail Pesanan</h1>
                    <p className="text-[10px] font-bold text-[#D25026] uppercase italic mt-1">{selectedOrder.customer}</p>
                    {selectedOrder.status !== "MENUNGGU" && selectedOrder.status !== "DITOLAK" && (
                        <p className="text-[10px] font-bold text-slate-600 mt-1">Dikerjakan oleh: <span className="text-purple-600">{selectedOrder.designer}</span></p>
                    )}
                    <div className="flex items-center gap-1.5 mt-2 text-slate-400">
                        <Clock size={10} />
                        <span className="text-[8px] font-black uppercase tracking-widest italic">{selectedOrder.dateTime}</span>
                    </div>
                    <div className="mt-4 bg-[#D25026]/5 p-3 rounded-xl border border-[#D25026]/10 flex justify-between items-center">
                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Total Harga:</span>
                        <span className="text-[#D25026] text-lg font-black italic uppercase">Rp {selectedOrder.totalAmount?.toLocaleString('id-ID')}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50/50 pb-32">
                    {/* Player Info Section */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <User className="text-[#D25026]" size={14} /> Data Pemain ({selectedOrder.playerInfo.length})
                        </h3>
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-4 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Nama</th>
                                        <th className="px-4 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest italic text-center">No</th>
                                        <th className="px-4 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest italic text-center">Size</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-[10px]">
                                    {selectedOrder.playerInfo.map((p: any, idx: number) => (
                                        <tr key={idx}>
                                            <td className="px-4 py-3 font-bold text-slate-700 uppercase italic truncate max-w-[120px]">{p.name}</td>
                                            <td className="px-4 py-3 text-center font-black text-slate-900">{p.number}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="bg-slate-50 px-2 py-1 rounded-md font-bold">{p.size}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-slate-50 border-t border-slate-100 font-black italic uppercase text-[8px] text-[#D25026]">
                                    <tr>
                                        <td colSpan={2} className="px-4 py-3 text-right">Total:</td>
                                        <td className="px-4 py-3 text-center text-xs">Rp {selectedOrder.totalAmount?.toLocaleString('id-ID')}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>

                    {/* Design Reference Section */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <ImageIcon className="text-[#D25026]" size={14} /> Referensi Desain
                        </h3>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            {selectedOrder.designUrl ? (
                                <div className="w-full bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                                    <img 
                                        src={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl}`} 
                                        className="w-full h-auto max-h-[300px] object-contain mx-auto" 
                                    />
                                </div>
                            ) : (
                                <div className="w-full h-16 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-100">
                                    <p className="text-[8px] font-bold text-slate-300 italic uppercase">Tidak ada referensi</p>
                                </div>
                            )}
                            <div className="bg-slate-50 p-4 rounded-xl">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Catatan:</p>
                                <p className="text-[10px] text-slate-700 font-medium italic leading-relaxed">{selectedOrder.designNote || "Tidak ada catatan"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Proof Section */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <CreditCard className="text-[#D25026]" size={14} /> Bukti Pembayaran
                        </h3>
                        {selectedOrder.paymentProofUrl ? (
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                                <div className="w-full bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                                    <img 
                                        src={selectedOrder.paymentProofUrl.startsWith('http') ? selectedOrder.paymentProofUrl : `${UPLOADS_URL}${selectedOrder.paymentProofUrl}`} 
                                        className="w-full h-auto max-h-[400px] object-contain mx-auto" 
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-16 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-100">
                                <p className="text-[8px] font-bold text-slate-300 italic uppercase">Belum ada bukti bayar</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Action Buttons Footer */}
                <div className="p-6 bg-white border-t border-slate-100 flex flex-col gap-3 fixed bottom-0 left-0 right-0 z-50">
                    <div className="flex gap-2">
                        {selectedOrder.status === "MENUNGGU" && (
                            <>
                                <button 
                                    onClick={() => handleUpdateStatus(selectedOrder.rawId, "DITOLAK")}
                                    className="flex-1 h-12 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-red-100"
                                >
                                    Reject
                                </button>
                                <button 
                                    onClick={() => {
                                        setOrderToAssign(selectedOrder.rawId);
                                        setIsAssignModalOpen(true);
                                    }}
                                    className="flex-[2] h-12 bg-[#D25026] text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-[#D25026]/20"
                                >
                                    Terima & Serahkan
                                </button>
                            </>
                        )}
                        {/* Status update flow removed from Admin */}
                    </div>
                </div>

                {/* Handover Modal */}
                <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                    <DialogContent className="sm:max-w-[90%] font-geist border-slate-100 shadow-xl rounded-3xl p-6 w-11/12 mx-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-black uppercase italic tracking-tighter text-slate-900">Serahkan ke Desainer</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <label className="block text-xs font-bold text-slate-700 mb-2 italic">Pilih Tim Desain</label>
                            <select 
                                value={selectedDesignerId}
                                onChange={(e) => setSelectedDesignerId(Number(e.target.value))}
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#D25026]"
                            >
                                <option value="" disabled>-- Pilih Desainer --</option>
                                {designers.map(d => (
                                    <option key={d.id} value={d.id}>{d.nama} ({d.email})</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <button
                                onClick={() => setIsAssignModalOpen(false)}
                                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs"
                            >
                                Batal
                            </button>
                            <button
                                onClick={async () => {
                                    if (!selectedDesignerId || !orderToAssign) {
                                        alert("Pilih desainer terlebih dahulu");
                                        return;
                                    }
                                    await handleUpdateStatus(orderToAssign, "DESAIN", selectedDesignerId as number);
                                    setIsAssignModalOpen(false);
                                    setSelectedDesignerId("");
                                }}
                                disabled={!selectedDesignerId}
                                className="px-4 py-2 bg-[#D25026] text-white font-bold rounded-lg text-xs disabled:opacity-50"
                            >
                                Konfirmasi
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-geist pb-20">
            {/* Mobile Header */}
            <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#D25026]/10 rounded-lg">
                        <ShoppingBag className="text-[#D25026]" size={20} />
                    </div>
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Monitoring</h1>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Pantau Pesanan Pelanggan</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-3 p-4">
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Menunggu</p>
                    <p className="text-xl font-black text-slate-900 leading-none">{orders.filter(o => o.status === "MENUNGGU").length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Proses Desain</p>
                    <p className="text-xl font-black text-purple-600 leading-none">{orders.filter(o => o.status === "DESAIN").length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Layout & Finish</p>
                    <p className="text-xl font-black text-blue-600 leading-none">{orders.filter(o => ["LAYOUT", "FINISHING"].includes(o.status)).length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Selesai</p>
                    <p className="text-xl font-black text-emerald-600 leading-none">{orders.filter(o => o.status === "SELESAI").length}</p>
                </div>
            </div>

            {/* Order Cards */}
            <div className="px-4 space-y-3 mt-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#D25026]" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Memuat Pesanan...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 text-center space-y-3">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                            <ShoppingBag className="text-slate-200" size={32} />
                        </div>
                        <p className="text-xs font-bold text-slate-400 italic uppercase tracking-widest">Belum ada pesanan masuk</p>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div 
                            key={order.rawId}
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm active:scale-[0.98] transition-all flex items-center justify-between group"
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-slate-300 font-mono tracking-tighter">{order.id}</span>
                                    <span className={cn("px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border", getStatusStyle(order.status))}>
                                        {order.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-black text-slate-900 uppercase italic truncate max-w-[180px] leading-tight">{order.customer}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-[9px] font-bold text-slate-400 italic uppercase tracking-tight">{order.product} ({order.qty} Unit)</p>
                                        <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                        <p className="text-[9px] font-black text-[#D25026] italic">Rp {order.totalAmount?.toLocaleString('id-ID')}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-2.5 rounded-xl group-hover:bg-[#D25026]/10 group-hover:text-[#D25026] transition-colors">
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-[#D25026]" />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
