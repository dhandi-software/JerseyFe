import { useState, useEffect } from "react";
import { ShoppingBag, CheckCircle, Clock, FileText, Eye, User, Image as ImageIcon, CreditCard, X, Loader2, ChevronLeft, Copy } from "lucide-react";
import { cn } from "~/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { orderService } from "~/services/orderService";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";

export function MonitoringPesananDesktop() {
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
            // Refresh local state
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

    // Full-Page Detail View
    if (selectedOrder) {
        return (
            <div className="min-h-screen bg-slate-50 font-geist">
                <div className="max-w-[87.5rem] mx-auto px-8 py-10">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm mb-8 group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Monitoring
                    </button>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden ring-1 ring-black/5">
                        <div className="relative p-10 border-b border-slate-100 bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border uppercase", getStatusStyle(selectedOrder.status))}>
                                        {selectedOrder.status}
                                    </span>
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-bold text-slate-900 font-mono tracking-tighter bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                                                {selectedOrder.id}
                                            </p>
                                            <button 
                                                onClick={() => {
                                                    navigator.clipboard.writeText(selectedOrder.id);
                                                    alert("ID Berhasil disalin!");
                                                }}
                                                className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#D25026] transition-colors"
                                                title="Salin ID"
                                            >
                                                <Copy size={14} />
                                            </button>
                                        </div>
                                         <p className="text-xs font-black text-[#D25026] uppercase tracking-widest mt-2 italic bg-orange-50 px-4 py-2 rounded-lg border border-orange-100 inline-block">
                                            Info: Ini ID yang akan dikirim ke customer untuk melacak pesanan
                                         </p>
                                     </div>
                                </div>
                            </div>
                            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Detail Pesanan Custom</h1>
                            <p className="text-slate-500 font-medium text-lg mt-2">{selectedOrder.product} - <span className="text-[#D25026]">{selectedOrder.customer}</span></p>
                            {selectedOrder.status !== "MENUNGGU" && selectedOrder.status !== "DITOLAK" && (
                                <p className="text-slate-600 font-bold mt-1">Dikerjakan oleh: <span className="text-purple-600">{selectedOrder.designer}</span></p>
                            )}
                            <div className="mt-4 flex flex-wrap items-center gap-6">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Total Harga:</span>
                                    <p className="text-[#D25026] text-3xl font-black italic uppercase tracking-tighter">Rp {selectedOrder.totalAmount?.toLocaleString('id-ID')}</p>
                                </div>
                                <div className="h-8 w-[1px] bg-slate-200 hidden md:block" />
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Clock size={14} className="text-slate-400" />
                                    <span className="text-xs font-bold uppercase tracking-widest">{selectedOrder.dateTime}</span>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 bg-slate-50/50">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-10">
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3 italic">
                                            <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                                <User className="text-[#D25026]" size={16} />
                                            </div>
                                            Daftar Nama Pemain ({selectedOrder.playerInfo.length} Unit)
                                        </h3>
                                        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm ring-1 ring-black/5">
                                            <table className="w-full text-left">
                                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">No</th>
                                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Nama</th>
                                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Nomor</th>
                                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Ukuran</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 text-sm">
                                                    {selectedOrder.playerInfo.map((player: any, idx: number) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4 text-slate-400 font-bold italic">{idx + 1}</td>
                                                            <td className="px-6 py-4 font-black text-slate-800 uppercase italic">{player.name}</td>
                                                            <td className="px-6 py-4 text-center font-black text-[#D25026] text-lg">{player.number}</td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black italic">{player.size}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-slate-50/80 border-t border-slate-100">
                                                    <tr>
                                                        <td colSpan={3} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-right">Grand Total:</td>
                                                        <td className="px-6 py-4 text-center">
                                                            <span className="text-[#D25026] font-black text-lg italic">Rp {selectedOrder.totalAmount?.toLocaleString('id-ID')}</span>
                                                        </td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3 italic">
                                            <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                                <ImageIcon className="text-[#D25026]" size={16} />
                                            </div>
                                            Referensi Desain & Catatan
                                        </h3>
                                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5 space-y-6">
                                            {selectedOrder.designUrl ? (
                                                <div className="w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200">
                                                    <img 
                                                        src={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl}`} 
                                                        alt="Design Reference" 
                                                        className="w-full h-auto max-h-[400px] object-contain mx-auto" 
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-32 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-100">
                                                    <p className="text-xs font-bold text-slate-400 italic uppercase tracking-widest">Tidak ada referensi gambar</p>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Catatan Tambahan:</p>
                                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                    <p className="text-sm text-slate-700 font-medium leading-relaxed italic">{selectedOrder.designNote || "Tidak ada catatan tambahan dari pelanggan."}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3 italic">
                                            <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                                <CreditCard className="text-[#D25026]" size={16} />
                                            </div>
                                            Verifikasi Pembayaran
                                        </h3>
                                        {selectedOrder.paymentProofUrl ? (
                                            <div className="w-full bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5">
                                                <div className="w-full bg-slate-100 rounded-[1.5rem] overflow-hidden border border-slate-200">
                                                    <img 
                                                        src={selectedOrder.paymentProofUrl.startsWith('http') ? selectedOrder.paymentProofUrl : `${UPLOADS_URL}${selectedOrder.paymentProofUrl}`} 
                                                        alt="Payment Proof" 
                                                        className="w-full h-auto max-h-[500px] object-contain mx-auto" 
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-32 bg-slate-50 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-slate-100">
                                                <p className="text-xs font-bold text-slate-400 italic uppercase tracking-widest">Belum ada bukti pembayaran</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 border-t border-slate-100 bg-white flex justify-between items-center px-12">
                            <div className="flex gap-4">
                                {selectedOrder.status === "MENUNGGU" && (
                                    <>
                                        <button 
                                            onClick={() => handleUpdateStatus(selectedOrder.rawId, "DITOLAK")}
                                            className="px-10 py-5 bg-red-50 text-red-600 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100 shadow-lg shadow-red-500/5 italic"
                                        >
                                            Reject Order
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setOrderToAssign(selectedOrder.rawId);
                                                setIsAssignModalOpen(true);
                                            }}
                                            className="px-12 py-5 bg-[#D25026] text-slate-900 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-[#B34320] transition-all shadow-xl shadow-[#D25026]/20 italic"
                                        >
                                            Terima & Serahkan ke Desain
                                        </button>
                                    </>
                                )}
                            </div>
                            <button 
                                onClick={() => setSelectedOrder(null)} 
                                className="px-10 py-5 bg-slate-100 text-slate-500 rounded-[1.5rem] text-xs font-bold uppercase tracking-widest hover:bg-slate-200 transition-colors italic"
                            >
                                Kembali ke Daftar
                            </button>
                        </div>
                    </div>

                    {/* Handover Modal */}
                    <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                        <DialogContent className="sm:max-w-[500px] font-geist border-slate-100 shadow-xl rounded-3xl p-8">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Serahkan ke Tim Desain</DialogTitle>
                            </DialogHeader>
                            <div className="py-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 italic">Pilih Desainer</label>
                                    <select 
                                        value={selectedDesignerId}
                                        onChange={(e) => setSelectedDesignerId(Number(e.target.value))}
                                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 text-slate-900 font-medium focus:outline-none focus:border-[#D25026] transition-colors"
                                    >
                                        <option value="" disabled>-- Pilih Desainer --</option>
                                        {designers.map(d => (
                                            <option key={d.id} value={d.id}>{d.nama} ({d.email})</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 mt-2">
                                <button
                                    onClick={() => setIsAssignModalOpen(false)}
                                    className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
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
                                    className="px-6 py-3 bg-[#D25026] text-white font-bold rounded-xl hover:bg-[#B34320] transition-colors disabled:opacity-50"
                                >
                                    Konfirmasi & Serahkan
                                </button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-geist">
            <div className="max-w-[87.5rem] mx-auto px-8 py-10">
                {/* Header Section */}
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-[#D25026]/10 rounded-xl">
                                <ShoppingBag className="text-[#D25026]" size={24} />
                            </div>
                            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900">Monitoring Pesanan</h1>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] italic">Kelola alur kerja pesanan jersey custom</p>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Total Pesanan</p>
                        <p className="text-3xl font-black text-slate-900">{orders.length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Menunggu Verifikasi</p>
                        <p className="text-3xl font-black text-amber-500">{orders.filter(o => o.status === "MENUNGGU").length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Proses Desain</p>
                        <p className="text-3xl font-black text-purple-500">{orders.filter(o => o.status === "DESAIN").length}</p>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Layout & Finishing</p>
                        <p className="text-3xl font-black text-blue-500">{orders.filter(o => ["LAYOUT", "FINISHING"].includes(o.status)).length}</p>
                    </div>
                </div>

                {/* Data Table */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-[#FAFAFA] border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">ID Pesanan</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Customer</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Produk</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">QTY</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Total Harga</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Status</th>
                                    <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 className="w-8 h-8 animate-spin text-[#D25026]" />
                                                <p className="text-[10px] font-black uppercase tracking-widest italic">Memuat data pesanan...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-20 text-center text-slate-400 font-medium">
                                            <p className="text-[10px] font-black uppercase tracking-widest italic">Belum ada pesanan masuk</p>
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.rawId} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-5 font-bold text-slate-500 font-mono">{order.id}</td>
                                            <td className="px-6 py-5 font-black text-slate-900 uppercase italic">{order.customer}</td>
                                            <td className="px-6 py-5 text-slate-600 font-medium italic">{order.product}</td>
                                            <td className="px-6 py-5 font-black text-slate-800 italic">{order.qty} Unit</td>
                                            <td className="px-6 py-5 font-bold text-[#D25026] italic">Rp {order.totalAmount?.toLocaleString('id-ID')}</td>
                                            <td className="px-6 py-5">
                                                <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border uppercase", getStatusStyle(order.status))}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <button 
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-sm"
                                                >
                                                    <Eye size={14} /> Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
