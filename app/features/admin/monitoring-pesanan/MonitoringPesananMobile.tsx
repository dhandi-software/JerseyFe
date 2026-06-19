import { useState, useEffect, useRef } from "react";
import { ShoppingBag, CheckCircle, Clock, FileText, Eye, User, Image as ImageIcon, CreditCard, ChevronRight, Loader2, ChevronLeft, Copy, Truck, Download, Search, ChevronDown, AlertCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { UPLOADS_URL } from "~/api/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { adminApi } from "~/api/admin";
import { Toast } from "~/components/ui/toast";
import { sortPlayersBySize, downloadPlayersPDF } from "~/lib/sizeUtils";
import { Button } from "~/components/ui/button";
import { CustomSelect } from "~/components/ui/custom-select";
import { Input } from "~/components/ui/input";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "~/components/ui/pagination";

export function MonitoringPesananMobile() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [designers, setDesigners] = useState<any[]>([]);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedDesignerId, setSelectedDesignerId] = useState<number | "">("");
    const [orderToAssign, setOrderToAssign] = useState<number | null>(null);
    const [toast, setToast] = useState<{ title: string; variant: "success" | "destructive" } | null>(null);
    const [bahanList, setBahanList] = useState<any[]>([]);
    const [isRecommendModalOpen, setIsRecommendModalOpen] = useState(false);
    const [tempRecommendedIds, setTempRecommendedIds] = useState<number[]>([]);

    useEffect(() => {
        if (selectedOrder) {
            setTempRecommendedIds(selectedOrder.recommendedBahanIds || []);
        }
    }, [selectedOrder]);

    // Search, Sort, and Pagination states
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("menunggu");
    const [currentPage, setCurrentPage] = useState(1);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const itemsPerPage = 10;
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    // Reset page on filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy]);

    // Click outside handler for dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
                setShowSortDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                    productId: o.details.length > 0 ? o.details[0].productId : null,
                    recommendedBahanIds: o.recommendedBahanIds || [],
                    qty: o.details.length,
                    status: o.status,
                    queueNumber: o.queueNumber,
                    isWorking: o.isWorking,
                    date: new Date(o.createdAt).toISOString().split('T')[0],
                    playerInfo: sortPlayersBySize(o.details.map((d: any) => ({
                        name: d.playerName || "-",
                        number: d.playerNumber || "-",
                        size: d.playerSize || "-"
                    }))),
                    designNote: o.designNote,
                    designUrl: o.designUrl,
                    paymentProofUrl: o.paymentUrl,
                    totalAmount: o.totalAmount,
                    shippingMethod: o.shippingMethod,
                    shippingAddress: o.shippingAddress,
                    mockupUrl: o.mockupUrl,
                    designStatus: o.designStatus,
                    designFeedback: o.designFeedback,
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

        const fetchBahan = async () => {
            try {
                const res = await adminApi.getBahanBaju();
                if (res.status === "success") {
                    setBahanList(res.data);
                }
            } catch (error) {
                console.error("Error fetching bahan:", error);
            }
        };

        fetchOrders();
        fetchDesigners();
        fetchBahan();
    }, []);

    const handleSendRecommendations = async () => {
        if (!selectedOrder) return;
        try {
            await orderService.recommendAlternatives(selectedOrder.rawId, tempRecommendedIds);
            
            // Update local state
            setOrders(prev => prev.map(o => o.rawId === selectedOrder.rawId ? { ...o, recommendedBahanIds: tempRecommendedIds } : o));
            setSelectedOrder((prev: any) => ({ ...prev, recommendedBahanIds: tempRecommendedIds }));
            
            setIsRecommendModalOpen(false);
            setToast({ title: "Rekomendasi bahan alternatif berhasil dikirim", variant: "success" });
        } catch (error) {
            console.error("Error sending recommendations:", error);
            setToast({ title: "Gagal mengirim rekomendasi", variant: "destructive" });
        }
    };

    const handleUpdateStatus = async (id: number, newStatus: string, designerId?: number) => {
        try {
            await orderService.updateOrderStatus(id, newStatus, designerId);
            setOrders(prev => prev.map(o => o.rawId === id ? { ...o, status: newStatus } : o));
            if (selectedOrder?.rawId === id) {
                setSelectedOrder((prev: any) => ({ ...prev, status: newStatus }));
            }
            
            if (newStatus === "DESAIN") {
                setToast({ title: "Pesanan berhasil diserahkan ke tim desain", variant: "success" });
            } else {
                setToast({ title: `Status pesanan diperbarui ke ${newStatus}`, variant: "success" });
            }
        } catch (error) {
            console.error("Error updating status:", error);
            setToast({ title: "Gagal memperbarui status", variant: "destructive" });
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case "SELESAI": return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "FINISHING": return "bg-blue-50 text-blue-700 border-blue-200";
            case "PRINT": return "bg-cyan-50 text-cyan-700 border-cyan-200";
            case "LAYOUT": return "bg-amber-50 text-amber-700 border-amber-200";
            case "DESAIN": return "bg-purple-50 text-purple-700 border-purple-200";
            case "DITOLAK": return "bg-red-50 text-red-700 border-red-200";
            case "MENUNGGU": default: return "bg-slate-50 text-slate-700 border-slate-200";
        }
    };

    // Search, Filter and Sort orders
    const filteredAndSortedOrders = orders.filter(o => {
        if (sortBy === "menunggu") {
            const status = (o.status || "").toUpperCase();
            if (status !== "MENUNGGU" && status !== "MENUNGGU VERIFIKASI") {
                return false;
            }
        }

        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return (
            (o.id && o.id.toLowerCase().includes(query)) ||
            (o.customer && o.customer.toLowerCase().includes(query)) ||
            (o.product && o.product.toLowerCase().includes(query))
        );
    }).sort((a, b) => {
        if (sortBy === "menunggu") {
            if (a.status === "MENUNGGU" && b.status !== "MENUNGGU") return -1;
            if (b.status === "MENUNGGU" && a.status !== "MENUNGGU") return 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === "newest") {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (sortBy === "oldest") {
            return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (sortBy === "name-asc") {
            return (a.customer || "").localeCompare(b.customer || "");
        }
        if (sortBy === "name-desc") {
            return (b.customer || "").localeCompare(a.customer || "");
        }
        if (sortBy === "price-highest") {
            return (b.totalAmount || 0) - (a.totalAmount || 0);
        }
        if (sortBy === "price-lowest") {
            return (a.totalAmount || 0) - (b.totalAmount || 0);
        }
        if (sortBy === "qty-highest") {
            return (b.qty || 0) - (a.qty || 0);
        }
        if (sortBy === "qty-lowest") {
            return (a.qty || 0) - (b.qty || 0);
        }
        return 0;
    });

    // Pagination calculations
    const totalItems = filteredAndSortedOrders.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const paginatedOrders = filteredAndSortedOrders.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                pages.push(1, 2, 3, 4, "ellipsis", totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
            }
        }
        return pages;
    };

    if (selectedOrder) {
        return (
            <div className="min-h-screen bg-white font-geist flex flex-col">
                {toast && (
                    <div className="fixed top-4 left-4 right-4 z-[9999]">
                        <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />
                    </div>
                )}
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
                            <p className="text-[10px] font-black text-[#D25026] uppercase tracking-widest italic leading-tight bg-orange-50 p-2 rounded-lg border border-orange-100 w-fit">
                                 Info: ID ini dikirim ke customer untuk melacak pesanan
                             </p>
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
                                {selectedOrder.queueNumber && (
                                    <span className="bg-[#D25026]/10 text-[#D25026] px-2 py-0.5 rounded-md text-[8px] font-black uppercase italic border border-[#D25026]/20">
                                        Antrean: {selectedOrder.queueNumber}
                                    </span>
                                )}
                            </div>
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

                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-slate-50 pb-32">
                    {(() => {
                        const currentBahan = bahanList.find(b => b.id === selectedOrder.productId);
                        const isBahanHabis = currentBahan?.status === "Habis";
                        if (!isBahanHabis) return null;

                        return (
                            <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                        <AlertCircle className="text-red-600 w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-red-900 leading-none mb-1">Bahan Terpilih Habis!</h4>
                                        <p className="text-[10px] text-red-600 font-medium leading-relaxed">
                                            Bahan "{currentBahan.nama}" saat ini habis/tidak tersedia. Berikan rekomendasi bahan alternatif agar customer dapat memilih bahan pengganti.
                                        </p>
                                        {selectedOrder.recommendedBahanIds && selectedOrder.recommendedBahanIds.length > 0 && (
                                            <p className="text-[10px] text-slate-500 font-bold mt-2">
                                                Rekomendasi saat ini: {selectedOrder.recommendedBahanIds.map((id: number) => bahanList.find(b => b.id === id)?.nama).filter(Boolean).join(", ")}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Dialog open={isRecommendModalOpen} onOpenChange={setIsRecommendModalOpen}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-black uppercase tracking-widest text-[10px] hover:bg-[#D25026] active:scale-95 transition-all shadow-md">
                                            Rekomendasikan Alternatif
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[90%] font-geist border-slate-100 shadow-xl rounded-3xl p-6 w-11/12 mx-auto bg-white">
                                        <DialogHeader>
                                            <DialogTitle className="text-lg font-black uppercase italic tracking-tighter text-slate-900">Rekomendasi Bahan</DialogTitle>
                                        </DialogHeader>
                                        <div className="py-4 space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar">
                                            <p className="text-[10px] font-bold text-slate-500 italic uppercase">Pilih bahan pengganti:</p>
                                            {bahanList.filter(b => b.status === "Tersedia").map(b => {
                                                const isChecked = tempRecommendedIds.includes(b.id);
                                                return (
                                                    <label key={b.id} className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer transition-all">
                                                        <input 
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => {
                                                                if (isChecked) {
                                                                    setTempRecommendedIds(prev => prev.filter(id => id !== b.id));
                                                                } else {
                                                                    setTempRecommendedIds(prev => [...prev, b.id]);
                                                                }
                                                            }}
                                                            className="w-4 h-4 rounded border-slate-300 text-[#D25026] focus:ring-[#D25026]"
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-xs font-black text-slate-900 uppercase">{b.nama}</p>
                                                            <p className="text-[10px] font-bold text-[#D25026]">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(b.harga || 150000)}</p>
                                                        </div>
                                                    </label>
                                                );
                                            })}
                                            {bahanList.filter(b => b.status === "Tersedia").length === 0 && (
                                                <p className="text-xs font-medium text-slate-400 italic">Tidak ada bahan tersedia saat ini.</p>
                                            )}
                                        </div>
                                        <div className="flex justify-end gap-2 mt-4">
                                            <Button
                                                variant="ghost"
                                                onClick={() => setIsRecommendModalOpen(false)}
                                                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs"
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                onClick={handleSendRecommendations}
                                                className="px-4 py-2 bg-[#D25026] text-white font-bold rounded-lg text-xs"
                                            >
                                                Kirim Rekomendasi
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        );
                    })()}
                    {/* Design Reference Section */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <ImageIcon className="text-[#D25026]" size={14} /> Referensi Desain
                        </h3>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            {selectedOrder.designUrl ? (
                                <div className="w-full bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                                    {selectedOrder.designUrl.toLowerCase().endsWith('.pdf') ? (
                                        <div className="w-full h-32 bg-red-50 flex flex-col items-center justify-center">
                                            <FileText className="w-10 h-10 text-red-500 mb-2" />
                                            <a href={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl}`} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">
                                                Buka Referensi (PDF)
                                            </a>
                                        </div>
                                    ) : (
                                        <img 
                                            src={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl}`} 
                                            className="w-full h-auto max-h-[300px] object-contain mx-auto" 
                                        />
                                    )}
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
                                    {selectedOrder.paymentProofUrl.toLowerCase().endsWith('.pdf') ? (
                                        <div className="w-full h-32 bg-red-50 flex flex-col items-center justify-center">
                                            <FileText className="w-10 h-10 text-red-500 mb-2" />
                                            <a href={selectedOrder.paymentProofUrl.startsWith('http') ? selectedOrder.paymentProofUrl : `${UPLOADS_URL}${selectedOrder.paymentProofUrl}`} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">
                                                Buka Bukti (PDF)
                                            </a>
                                        </div>
                                    ) : (
                                        <img 
                                            src={selectedOrder.paymentProofUrl.startsWith('http') ? selectedOrder.paymentProofUrl : `${UPLOADS_URL}${selectedOrder.paymentProofUrl}`} 
                                            className="w-full h-auto max-h-[400px] object-contain mx-auto" 
                                        />
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-16 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-100">
                                <p className="text-[8px] font-bold text-slate-300 italic uppercase">Belum ada bukti bayar</p>
                            </div>
                        )}
                    </div>

                    {/* Mockup Hasil Desain Section (Mobile Admin Monitor) */}
                    {selectedOrder.status !== "MENUNGGU" && (
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                                <ImageIcon className="text-[#D25026]" size={14} /> Progress Mockup Desain
                            </h3>
                            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                {selectedOrder.mockupUrl ? (
                                    <div className="space-y-3">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Persetujuan:</span>
                                            {selectedOrder.designStatus === "SENT" && (
                                                <span className="bg-amber-50 text-amber-700 border-amber-200 border px-2 py-0.5 rounded text-[8px] font-black italic">
                                                    Menunggu Persetujuan Customer
                                                </span>
                                            )}
                                            {selectedOrder.designStatus === "APPROVED" && (
                                                <span className="bg-emerald-50 text-emerald-700 border-emerald-200 border px-2 py-0.5 rounded text-[8px] font-black italic">
                                                    Disetujui
                                                </span>
                                            )}
                                            {selectedOrder.designStatus === "REVISI" && (
                                                <span className="bg-red-50 text-red-700 border-red-200 border px-2 py-0.5 rounded text-[8px] font-black italic">
                                                    Revisi Diminta
                                                </span>
                                            )}
                                            {selectedOrder.designStatus === "PENDING" && (
                                                <span className="bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[8px] font-black italic">
                                                    Belum Diupload
                                                </span>
                                            )}
                                        </div>

                                        {selectedOrder.designStatus === "REVISI" && selectedOrder.designFeedback && (
                                            <div className="bg-red-50/50 p-3 rounded-lg border border-red-100">
                                                <p className="text-[7px] font-black text-red-600 uppercase tracking-widest italic mb-0.5">Catatan Revisi:</p>
                                                <p className="text-[10px] text-red-700 font-bold leading-relaxed italic">"{selectedOrder.designFeedback}"</p>
                                            </div>
                                        )}

                                        <div className="w-full bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                                            {selectedOrder.mockupUrl.toLowerCase().endsWith('.pdf') ? (
                                                <div className="w-full h-32 bg-red-50 flex flex-col items-center justify-center">
                                                    <FileText className="w-10 h-10 text-red-500 mb-2" />
                                                    <a href={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl}`} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">
                                                        Buka Mockup (PDF)
                                                    </a>
                                                </div>
                                            ) : (
                                                <img 
                                                    src={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl}`} 
                                                    className="w-full h-auto max-h-[300px] object-contain mx-auto" 
                                                />
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-full h-16 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-100">
                                        <p className="text-[8px] font-bold text-slate-300 italic uppercase">Belum ada mockup diupload</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Shipping Info Section Mobile */}
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <Truck className="text-[#D25026]" size={14} /> Informasi Pengiriman
                        </h3>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            <div>
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Metode Pengiriman:</p>
                                <p className="text-xs font-black text-slate-900 uppercase italic">
                                    {selectedOrder.shippingMethod === "COD" ? "COD (Penerima yang bayar)" : "Ambil di tempat"}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">
                                    {selectedOrder.shippingMethod === "COD" ? "Alamat Tujuan COD:" : "Alamat Toko (Kunjungi Toko):"}
                                </p>
                                <p className="text-[10px] text-slate-700 font-medium italic leading-relaxed font-mono">
                                    {selectedOrder.shippingMethod === "COD" 
                                        ? (selectedOrder.shippingAddress || "Alamat tidak diisi.")
                                        : "Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Player Info Section */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                                <User className="text-[#D25026]" size={14} /> Data Pemain ({selectedOrder.playerInfo.length})
                            </h3>
                            <Button 
                                variant="outline"
                                onClick={() => downloadPlayersPDF(selectedOrder)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[7px] font-black uppercase tracking-widest italic shadow-sm cursor-pointer"
                            >
                                <FileText size={10} className="text-[#D25026]" />
                                PDF
                            </Button>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left relative">
                                     <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100 shadow-sm">
                                         <tr>
                                             <th className="px-4 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Nama</th>
                                             <th className="px-4 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest italic text-center">No</th>
                                             <th className="px-4 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest italic text-center">Size</th>
                                             <th className="px-4 py-3 text-[8px] font-black text-slate-400 uppercase tracking-widest italic text-center">Lengan</th>
                                         </tr>
                                     </thead>
                                     <tbody className="divide-y divide-slate-50 text-[10px] bg-white">
                                         {selectedOrder.playerInfo.map((p: any, idx: number) => {
                                             let sizeOnly = p.size || "-";
                                             let sleeve = "-";
                                             if (sizeOnly.includes("(")) {
                                                 const parts = sizeOnly.split("(");
                                                 sizeOnly = parts[0].trim();
                                                 sleeve = parts[1].replace(")", "").trim();
                                             } else if (sizeOnly.includes("-")) {
                                                 const parts = sizeOnly.split("-");
                                                 sizeOnly = parts[0].trim();
                                                 sleeve = parts.slice(1).join("-").trim();
                                             }
                                             return (
                                                 <tr key={idx}>
                                                     <td className="px-4 py-3 font-bold text-slate-700 uppercase italic truncate max-w-[90px]">{p.name}</td>
                                                     <td className="px-4 py-3 text-center font-black text-slate-900">{p.number}</td>
                                                     <td className="px-4 py-3 text-center">
                                                         <span className="bg-slate-50 px-2 py-1 rounded-md font-bold">{sizeOnly}</span>
                                                     </td>
                                                     <td className="px-4 py-3 text-center text-slate-600 truncate max-w-[80px]">
                                                         {sleeve}
                                                     </td>
                                                 </tr>
                                             );
                                         })}
                                     </tbody>
                                </table>
                            </div>
                            <div className="bg-slate-50 border-t border-slate-100 font-black italic uppercase text-[8px] text-[#D25026] p-4 flex justify-between items-center">
                                <span>Total Item: {selectedOrder.playerInfo.length}</span>
                                <span className="text-xs">Rp {selectedOrder.totalAmount?.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile Action Buttons Footer */}
                <div className="p-6 bg-white border-t border-slate-100 flex flex-col gap-3 fixed bottom-0 left-0 right-0 z-50">
                    <div className="flex gap-2">
                        {selectedOrder.status === "MENUNGGU" && (
                            <>
                                <Button 
                                    variant="outline"
                                    onClick={() => handleUpdateStatus(selectedOrder.rawId, "DITOLAK")}
                                    className="flex-1 h-12 bg-red-50 text-red-600 rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-red-100 cursor-pointer"
                                >
                                    Reject
                                </Button>
                                <Button 
                                    onClick={() => {
                                        setOrderToAssign(selectedOrder.rawId);
                                        setIsAssignModalOpen(true);
                                    }}
                                    className="flex-[2] h-12 bg-[#D25026] text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-[#D25026]/20 cursor-pointer border-none"
                                >
                                    Terima & Serahkan
                                </Button>
                            </>
                        )}
                        {/* Status update flow removed from Admin */}
                    </div>
                </div>

                {/* Handover Modal */}
                <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                    <DialogContent className="sm:max-w-[500px] font-geist border-slate-100 shadow-xl rounded-3xl p-8 w-11/12 mx-auto">
                        <DialogHeader>
                            <DialogTitle className="text-lg font-black uppercase italic tracking-tighter text-slate-900 pr-10">Serahkan ke Desainer</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <label className="block text-xs font-bold text-slate-700 mb-2 italic">Pilih Tim Desain</label>
                            <CustomSelect
                                options={designers.map(d => ({
                                    value: String(d.id),
                                    label: `${d.nama} (${d.email})`
                                }))}
                                value={selectedDesignerId ? String(selectedDesignerId) : ""}
                                onChange={(val) => setSelectedDesignerId(val ? Number(val) : "")}
                                placeholder="-- Pilih Desainer --"
                                searchPlaceholder="Cari desainer..."
                                emptyMessage="Desainer tidak ditemukan."
                            />
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <Button
                                variant="ghost"
                                onClick={() => setIsAssignModalOpen(false)}
                                className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
                            >
                                Batal
                            </Button>
                            <Button
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
                                className="px-4 py-2 bg-[#D25026] text-white font-bold rounded-lg text-xs disabled:opacity-50 cursor-pointer"
                            >
                                Konfirmasi
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-geist pb-24">
            {toast && (
                <div className="fixed top-4 left-4 right-4 z-[9999]">
                    <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />
                </div>
            )}
            
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
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Prod (Lay/Prnt/Fin)</p>
                    <p className="text-xl font-black text-blue-600 leading-none">{orders.filter(o => ["LAYOUT", "PRINT", "FINISHING"].includes(o.status)).length}</p>
                </div>
                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Selesai</p>
                    <p className="text-xl font-black text-emerald-600 leading-none">{orders.filter(o => o.status === "SELESAI").length}</p>
                </div>
            </div>

            {/* Search & Sort Controls Mobile */}
            <div className="px-4 space-y-3 mb-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <Input
                        type="text"
                        placeholder="Cari ID Pesanan, Customer, Produk..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2.5 bg-white border-slate-200 rounded-xl w-full text-xs font-medium focus:ring-1 focus:ring-[#D25026]"
                    />
                </div>
                
                <div ref={sortDropdownRef} className="flex items-center gap-2 bg-white px-4 py-3 rounded-xl border border-slate-200/80 justify-between relative">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Urutkan:</span>
                    <div className="relative flex-1 text-right">
                        <button
                            onClick={() => setShowSortDropdown(!showSortDropdown)}
                            className="inline-flex items-center gap-2 text-slate-700 text-[10px] font-black uppercase tracking-widest italic cursor-pointer justify-end w-full"
                        >
                            <span>
                                {sortBy === "menunggu" && "Menunggu Verifikasi"}
                                {sortBy === "newest" && "Terbaru (Tanggal)"}
                                {sortBy === "oldest" && "Terlama (Tanggal)"}
                                {sortBy === "name-asc" && "Customer A-Z"}
                                {sortBy === "name-desc" && "Customer Z-A"}
                                {sortBy === "price-highest" && "Harga Tertinggi"}
                                {sortBy === "price-lowest" && "Harga Terendah"}
                                {sortBy === "qty-highest" && "Jumlah Terbanyak"}
                                {sortBy === "qty-lowest" && "Jumlah Tersedikit"}
                            </span>
                            <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform duration-200", showSortDropdown && "rotate-180")} />
                        </button>

                        {showSortDropdown && (
                            <div className="absolute right-0 mt-2 w-52 bg-white border border-slate-150 rounded-xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-left">
                                {[
                                    { val: "menunggu", label: "Menunggu Verifikasi" },
                                    { val: "newest", label: "Terbaru (Tanggal)" },
                                    { val: "oldest", label: "Terlama (Tanggal)" },
                                    { val: "name-asc", label: "Customer A-Z" },
                                    { val: "name-desc", label: "Customer Z-A" },
                                    { val: "price-highest", label: "Harga Tertinggi" },
                                    { val: "price-lowest", label: "Harga Terendah" },
                                    { val: "qty-highest", label: "Jumlah Terbanyak" },
                                    { val: "qty-lowest", label: "Jumlah Tersedikit" }
                                ].map((opt) => (
                                    <button
                                        key={opt.val}
                                        onClick={() => {
                                            setSortBy(opt.val);
                                            setShowSortDropdown(false);
                                        }}
                                        className={cn(
                                            "w-full text-left px-4 py-2.5 text-[10px] font-black uppercase tracking-widest italic transition-colors hover:bg-[#FFF0EB]/50 hover:text-[#D25026] cursor-pointer border-none",
                                            sortBy === opt.val ? "bg-[#FFF0EB]/30 text-[#D25026] font-bold" : "text-slate-600"
                                        )}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Order Cards */}
            <div className="px-4 space-y-3 mt-2">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <Loader2 className="w-8 h-8 animate-spin text-[#D25026]" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Memuat Pesanan...</p>
                    </div>
                ) : filteredAndSortedOrders.length === 0 ? (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 text-center space-y-3">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                            <ShoppingBag className="text-slate-200" size={32} />
                        </div>
                        <p className="text-xs font-bold text-slate-400 italic uppercase tracking-widest">Pesanan tidak ditemukan</p>
                    </div>
                ) : (
                    paginatedOrders.map((order) => (
                        <div 
                            key={order.rawId}
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm active:scale-[0.98] transition-all flex items-center justify-between group cursor-pointer"
                        >
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black text-slate-300 font-mono tracking-tighter">{order.id}</span>
                                    {order.queueNumber && (
                                        <span className="bg-[#D25026]/10 text-[#D25026] px-1.5 py-0.5 rounded text-[7px] font-black uppercase italic border border-[#D25026]/20">
                                            Antrean: {order.queueNumber}
                                        </span>
                                    )}
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

            {/* Pagination Controls Mobile */}
            {totalPages > 1 && (
                <div className="mt-6 px-4 flex justify-center pb-6">
                    <Pagination>
                        <PaginationContent className="gap-1">
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                                    }}
                                    className={cn(
                                        "h-8 w-8 p-0 cursor-pointer hover:bg-slate-100",
                                        currentPage === 1 && "pointer-events-none opacity-40"
                                    )}
                                />
                            </PaginationItem>

                            {getPageNumbers().map((page, index) => (
                                <PaginationItem key={index}>
                                    {page === "ellipsis" ? (
                                        <PaginationEllipsis className="h-8 w-8" />
                                    ) : (
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(page as number);
                                            }}
                                            isActive={currentPage === page}
                                            className="h-8 w-8 p-0 cursor-pointer font-bold font-mono text-xs"
                                        >
                                            {page}
                                        </PaginationLink>
                                    )}
                                </PaginationItem>
                            ))}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                    }}
                                    className={cn(
                                        "h-8 w-8 p-0 cursor-pointer hover:bg-slate-100",
                                        currentPage === totalPages && "pointer-events-none opacity-40"
                                    )}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    );
}
