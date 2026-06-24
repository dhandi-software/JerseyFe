import { useState, useEffect } from "react";
import { Clock, Eye, CheckCircle, Package, ImageIcon, FileText, ChevronLeft, Search } from "lucide-react";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { UPLOADS_URL } from "~/api/client";
import { useAuth } from "~/hooks/useAuth";
import { sortPlayersBySize, downloadPlayersPDF } from "~/lib/sizeUtils";
import { Toast } from "~/components/ui/toast";

export function PackingMobile() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [filterTab, setFilterTab] = useState<"ALL" | "PRINT" | "FINISHING" | "SELESAI">("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [toast, setToast] = useState<{ title: string; variant: "success" | "destructive" } | null>(null);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getOrders();
                const formattedOrders = data.map((o: any) => ({
                    id: o.orderId,
                    rawId: o.id,
                    customer: o.customerName,
                    product: o.details?.length > 0 ? o.details[0].productTitle : "Custom Jersey",
                    qty: o.details?.length || 0,
                    status: o.status,
                    queueNumber: o.queueNumber,
                    mockupUrl: o.mockupUrl,
                    layoutUrl: o.layoutUrl,
                    dateTime: new Date(o.createdAt).toLocaleString('id-ID', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    }),
                    playerInfo: sortPlayersBySize((o.details || []).map((d: any) => {
                        let baseSize = d.playerSize || "-";
                        let sleeve = "-";
                        if (baseSize.includes("(")) {
                            const parts = baseSize.split("(");
                            baseSize = parts[0].trim();
                            sleeve = parts[1].replace(")", "").trim();
                        }
                        return {
                            name: d.playerName || "-",
                            number: d.playerNumber || "-",
                            size: baseSize,
                            sleeve: sleeve,
                            playerSize: d.playerSize
                        };
                    })),
                    designNote: o.designNote,
                }));
                const gudangOrders = formattedOrders.filter((o: any) => 
                    ["PRINT", "FINISHING", "SELESAI"].includes(o.status)
                );
                setOrders(gudangOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(searchInput);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchInput]);

    const filteredOrders = orders.filter(order => {
        const matchesSearch = 
            order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.product.toLowerCase().includes(searchQuery.toLowerCase());
            
        if (!matchesSearch) return false;

        if (filterTab !== "ALL" && order.status !== filterTab) {
            return false;
        }
        return true;
    });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (!a.queueNumber) return 1;
        if (!b.queueNumber) return -1;
        return a.queueNumber.localeCompare(b.queueNumber);
    });

    const requestConfirmation = (title: string, message: string, onConfirm: () => void) => {
        setConfirmModal({
            isOpen: true,
            title,
            message,
            onConfirm
        });
    };

    const handleUpdateStatus = (id: number, newStatus: string) => {
        let msg = `Yakin ubah status ke ${newStatus}?`;
        if (newStatus === "SELESAI") {
            msg = "Apakah pesanan ini sudah selesai dipacking dan siap dikirim?";
        }

        requestConfirmation(
            "Konfirmasi Status",
            msg,
            async () => {
                try {
                    await orderService.updateOrderStatus(id, newStatus);
                    setOrders(prev => prev.map(o => o.rawId === id ? { ...o, status: newStatus } : o));
                    if (selectedOrder?.rawId === id) {
                        setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
                    }
                    setToast({ title: "Status diperbarui", variant: "success" });
                } catch (error) {
                    setToast({ title: "Gagal memperbarui status", variant: "destructive" });
                } finally {
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        );
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "SELESAI": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "FINISHING": return "bg-blue-50 text-blue-700 border-blue-200";
            case "PRINT": return "bg-cyan-50 text-cyan-700 border-cyan-200";
            default: return "bg-slate-50 text-slate-700 border-slate-200";
        }
    };

    if (selectedOrder) {
        return (
            <div className="min-h-screen bg-slate-50 pb-24 font-geist">
                <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex items-center">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="p-2 -ml-2 text-slate-400 hover:text-slate-900 transition-colors"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h1 className="ml-2 text-lg font-black italic uppercase tracking-tighter text-slate-900 line-clamp-1">
                        Pesanan {selectedOrder.customer}
                    </h1>
                </div>

                <div className="p-4 space-y-4">
                    {/* Header Card */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <span className={cn("px-3 py-1 rounded-lg text-[10px] font-black tracking-widest border uppercase", getStatusStyle(selectedOrder.status))}>
                                {selectedOrder.status}
                            </span>
                            <span className="text-xs font-bold text-slate-500 font-mono">
                                #{selectedOrder.id}
                            </span>
                        </div>
                        {selectedOrder.queueNumber && (
                            <div className="mb-4 inline-block bg-[#D25026]/10 text-[#D25026] px-3 py-1.5 rounded-xl text-xs font-black italic border border-[#D25026]/20">
                                Antrean: {selectedOrder.queueNumber}
                            </div>
                        )}
                        <h2 className="text-xl font-bold text-slate-900 leading-tight">{selectedOrder.product}</h2>
                        <div className="flex items-center gap-2 mt-2 text-slate-500 text-xs font-medium">
                            <Package size={14} />
                            <span>Total: <strong className="text-slate-900">{selectedOrder.qty} Pcs</strong></span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-slate-500 text-xs">
                            <Clock size={14} />
                            <span>{selectedOrder.dateTime}</span>
                        </div>
                    </div>

                    {/* Mockup & Layout Cards */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 space-y-6">
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2 italic">
                                <ImageIcon className="text-[#D25026]" size={14} />
                                Mockup Desain
                            </h3>
                            {selectedOrder.mockupUrl ? (
                                <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 p-2">
                                    {selectedOrder.mockupUrl.toLowerCase().endsWith('.pdf') ? (
                                        <div className="w-full py-8 bg-red-50 flex flex-col items-center justify-center rounded-xl">
                                            <FileText className="w-8 h-8 text-red-500 mb-2" />
                                            <a href={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-red-600 underline">
                                                Buka PDF
                                            </a>
                                        </div>
                                    ) : (
                                        <img 
                                            src={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} 
                                            alt="Mockup" 
                                            className="w-full h-auto object-contain rounded-xl" 
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="w-full py-6 bg-slate-50 rounded-2xl text-center border-2 border-dashed border-slate-200">
                                    <p className="text-[10px] font-bold text-slate-400 italic uppercase tracking-widest">Tidak ada mockup</p>
                                </div>
                            )}
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4 flex items-center gap-2 italic">
                                <ImageIcon className="text-[#D25026]" size={14} />
                                Layout Pola Cetak
                            </h3>
                            {selectedOrder.layoutUrl ? (
                                <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 p-2">
                                    {selectedOrder.layoutUrl.toLowerCase().endsWith('.pdf') ? (
                                        <div className="w-full py-8 bg-red-50 flex flex-col items-center justify-center rounded-xl">
                                            <FileText className="w-8 h-8 text-red-500 mb-2" />
                                            <a href={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-red-600 underline">
                                                Buka Layout (PDF)
                                            </a>
                                        </div>
                                    ) : (
                                        <img 
                                            src={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} 
                                            alt="Layout" 
                                            className="w-full h-auto object-contain rounded-xl" 
                                        />
                                    )}
                                </div>
                            ) : (
                                <div className="w-full py-6 bg-slate-50 rounded-2xl text-center border-2 border-dashed border-slate-200">
                                    <p className="text-[10px] font-bold text-slate-400 italic uppercase tracking-widest">Tidak ada layout</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Data Pemain */}
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                                <Package className="text-[#D25026]" size={14} />
                                Data Pemain
                            </h3>
                            <button 
                                onClick={() => downloadPlayersPDF(selectedOrder)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors border border-slate-200"
                            >
                                <FileText size={12} className="text-[#D25026]" />
                                Cetak PDF
                            </button>
                        </div>
                        {selectedOrder.playerInfo.length > 0 ? (
                            <div className="space-y-3">
                                {selectedOrder.playerInfo.map((player: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-slate-800">{player.name}</span>
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">Nomor: {player.number}</span>
                                            <span className="text-[10px] font-bold text-slate-500 capitalize mt-0.5">Lengan: {player.sleeve}</span>
                                        </div>
                                        <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center shadow-sm">
                                            <span className="text-sm font-black text-[#D25026]">{player.size}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-[10px] font-bold text-slate-400 italic uppercase tracking-widest">Tidak ada data pemain</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 z-40 pb-safe">
                    <div className="flex gap-3 max-w-[87.5rem] mx-auto">
                        {selectedOrder.status !== "FINISHING" && selectedOrder.status !== "SELESAI" && (
                            <button 
                                onClick={() => handleUpdateStatus(selectedOrder.rawId, "FINISHING")}
                                className="flex-1 py-3.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-2xl font-black text-xs uppercase tracking-widest transition-colors border border-blue-200"
                            >
                                Ke Finishing
                            </button>
                        )}
                        {selectedOrder.status !== "SELESAI" && (
                            <button 
                                onClick={() => handleUpdateStatus(selectedOrder.rawId, "SELESAI")}
                                className="flex-1 py-3.5 bg-emerald-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                            >
                                <CheckCircle size={16} />
                                Packing Beres
                            </button>
                        )}
                    </div>
                </div>

                {confirmModal.isOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-[2rem] w-[90vw] max-w-[450px] p-8 border border-slate-100 shadow-2xl space-y-6 transform animate-in zoom-in-95 duration-200">
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-slate-900">{confirmModal.title}</h3>
                                <p className="text-sm font-normal text-slate-500 leading-relaxed">{confirmModal.message}</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                    className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-semibold transition-all"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={confirmModal.onConfirm}
                                    className="px-6 py-3 bg-[#D25026] hover:bg-[#B34320] text-white rounded-xl text-xs font-semibold transition-all shadow-md shadow-[#D25026]/20"
                                >
                                    Ya, Lanjutkan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-4 font-geist pb-24">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 mb-1">Packing</h1>
            <p className="text-xs text-slate-500 font-medium mb-6">Kelola pesanan siap packing</p>

            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Cari Pesanan..." 
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-[#D25026]"
                />
            </div>

            <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 pb-2">
                {(["ALL", "PRINT", "FINISHING", "SELESAI"] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setFilterTab(tab)}
                        className={cn(
                            "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap border transition-colors",
                            filterTab === tab ? "bg-white text-[#D25026] border-[#D25026]/20 shadow-sm" : "bg-transparent border-transparent text-slate-400 hover:text-slate-600"
                        )}
                    >
                        {tab === "ALL" ? "Semua" : tab}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="py-12 text-center">
                        <div className="w-8 h-8 border-4 border-[#D25026] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic animate-pulse">Memuat data...</p>
                    </div>
                ) : sortedOrders.length > 0 ? (
                    sortedOrders.map((order) => (
                        <div key={order.rawId} className="bg-white rounded-[2rem] border border-slate-100 p-5 shadow-sm">
                            <div className="flex items-center justify-between mb-3">
                                <span className={cn("px-2.5 py-1 rounded-lg text-[9px] font-black tracking-widest border uppercase", getStatusStyle(order.status))}>
                                    {order.status}
                                </span>
                                {order.queueNumber && (
                                    <span className="text-xs font-black italic text-[#D25026]">Antrean: {order.queueNumber}</span>
                                )}
                            </div>
                            
                            <h3 className="text-lg font-black italic uppercase tracking-tight text-slate-900 mb-1 line-clamp-1">{order.customer}</h3>
                            <p className="text-xs font-bold text-slate-500 mb-4 line-clamp-1">{order.product}</p>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    Total: <strong className="text-slate-800">{order.qty} pcs</strong>
                                </span>
                                <button 
                                    onClick={() => setSelectedOrder(order)}
                                    className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200"
                                >
                                    Detail
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-12 text-center">
                        <Package className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">Tidak ada pesanan</p>
                    </div>
                )}
            </div>

            {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
        </div>
    );
}
