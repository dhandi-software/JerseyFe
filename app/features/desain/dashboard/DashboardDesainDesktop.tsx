import { useState, useEffect } from "react";
import { Clock, Eye, CheckCircle, Package, Truck, Image as ImageIcon, CreditCard, ChevronLeft, MessageCircle, FileText } from "lucide-react";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { UPLOADS_URL } from "~/api/client";
import { useAuth } from "~/hooks/useAuth";

export function DashboardDesainDesktop() {
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
            <div className="min-h-screen bg-slate-50 font-geist">
                <div className="max-w-[87.5rem] mx-auto px-8 py-10">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm mb-8 group"
                    >
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Kembali ke Dashboard
                    </button>

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl overflow-hidden ring-1 ring-black/5">
                        <div className="relative p-10 border-b border-slate-100 bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <span className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border uppercase", getStatusStyle(selectedOrder.status))}>
                                    {selectedOrder.status}
                                </span>
                                <p className="text-sm font-bold text-slate-900 font-mono tracking-tighter bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                                    {selectedOrder.id}
                                </p>
                            </div>
                            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Pesanan {selectedOrder.customer}</h1>
                            <p className="text-slate-500 font-medium text-lg mt-2">{selectedOrder.product} - {selectedOrder.qty} Pcs</p>
                            
                            <div className="mt-4 flex flex-wrap items-center gap-6">
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
                                            Referensi Desain
                                        </h3>
                                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5 space-y-6">
                                            {selectedOrder.designUrl ? (
                                                selectedOrder.designUrl.toLowerCase().endsWith('.pdf') ? (
                                                    <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 gap-6 group">
                                                        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                            <FileText size={48} />
                                                        </div>
                                                        <div className="text-center">
                                                            <p className="text-sm font-black text-slate-900 uppercase italic tracking-wider">Dokumen Referensi PDF</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Klik tombol di bawah untuk melihat</p>
                                                        </div>
                                                        <a 
                                                            href={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl.startsWith('/') ? '' : '/'}${selectedOrder.designUrl}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="px-8 py-4 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 flex items-center gap-3 italic"
                                                        >
                                                            <Eye size={18} />
                                                            Buka Dokumen PDF
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <img 
                                                        src={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl.startsWith('/') ? '' : '/'}${selectedOrder.designUrl}`} 
                                                        alt="Design Reference" 
                                                        className="w-full h-auto rounded-xl border border-slate-200 shadow-sm" 
                                                    />
                                                )
                                            ) : (
                                                <div className="w-full h-32 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                                    <p className="text-[10px] font-bold text-slate-400 italic uppercase">Tidak ada referensi gambar</p>
                                                </div>
                                            )}
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Catatan Pelanggan:</p>
                                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                                    <p className="text-sm text-slate-700 font-medium leading-relaxed italic">{selectedOrder.designNote || "Tidak ada catatan."}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-10">
                                    <div>
                                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3 italic">
                                            Daftar Nama & Nomor
                                        </h3>
                                        <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm ring-1 ring-black/5">
                                            <table className="w-full text-left">
                                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                                    <tr>
                                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Nama</th>
                                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Nomor</th>
                                                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Ukuran</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-slate-50 text-sm">
                                                    {selectedOrder.playerInfo.map((player: any, idx: number) => (
                                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4 font-black text-slate-800 uppercase italic">{player.name}</td>
                                                            <td className="px-6 py-4 text-center font-black text-[#D25026] text-lg">{player.number}</td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black italic">{player.size}</span>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 border-t border-slate-100 bg-white flex justify-end gap-4">
                            <button 
                                onClick={() => window.location.href = `/desain/chat?userId=${selectedOrder.customerId}`}
                                className="px-8 py-5 bg-slate-900 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center gap-3 italic"
                            >
                                <MessageCircle size={16} />
                                Chat Customer
                            </button>
                            {selectedOrder.status === "DESAIN" && (
                                <button 
                                    onClick={() => handleUpdateStatus(selectedOrder.rawId, "LAYOUT")}
                                    className="px-12 py-5 bg-amber-100 text-amber-800 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-amber-200 transition-all border border-amber-200 italic"
                                >
                                    Selesai Desain & Lanjut Layout
                                </button>
                            )}
                            {selectedOrder.status === "LAYOUT" && (
                                <button 
                                    onClick={() => handleUpdateStatus(selectedOrder.rawId, "FINISHING")}
                                    className="px-12 py-5 bg-blue-100 text-blue-800 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-blue-200 transition-all border border-blue-200 italic"
                                >
                                    Selesai Layout & Lanjut Finishing
                                </button>
                            )}
                            {selectedOrder.status === "FINISHING" && (
                                <button 
                                    onClick={() => handleUpdateStatus(selectedOrder.rawId, "SELESAI")}
                                    className="px-12 py-5 bg-emerald-100 text-emerald-800 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-emerald-200 transition-all border border-emerald-200 italic"
                                >
                                    Selesaikan Pesanan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[87.5rem] mx-auto space-y-8 font-geist">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Pesanan Anda</h1>
                    <p className="text-slate-500 mt-2 font-medium">Kelola pesanan yang telah diserahkan admin ke Anda.</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden ring-1 ring-black/5">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic">Order ID / Waktu</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic">Customer</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic">Produk</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic text-center">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest italic text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-medium">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-6 h-6 border-2 border-slate-200 border-t-[#D25026] rounded-full animate-spin" />
                                            Memuat data pesanan...
                                        </div>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-medium">Belum ada pesanan untuk Anda.</td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order.rawId} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-slate-900 font-mono text-sm group-hover:text-[#D25026] transition-colors">{order.id}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-1">{order.dateTime}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-slate-700">{order.customer}</p>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="font-bold text-slate-700">{order.product}</p>
                                            <p className="text-xs text-slate-500 font-medium mt-1">{order.qty} Items</p>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <span className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border uppercase inline-block", getStatusStyle(order.status))}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 text-center">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedOrder(order);
                                                }}
                                                className="p-3 text-[#D25026] bg-[#D25026]/5 rounded-xl hover:bg-[#D25026] hover:text-white transition-all shadow-sm mx-auto flex items-center justify-center gap-2"
                                            >
                                                <Eye size={16} />
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
    );
}
