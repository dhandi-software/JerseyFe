import { useState, useEffect, useRef } from "react";
import { ShoppingBag, CheckCircle, Clock, FileText, Eye, User, Image as ImageIcon, CreditCard, X, Loader2, ChevronLeft, Copy, Truck, Search, ChevronDown, AlertCircle, Printer, Upload } from "lucide-react";
import { cn } from "~/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { orderService } from "~/services/orderService";
import { chatService } from "~/services/chatService";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";
import { Toast } from "~/components/ui/toast";
import { sortPlayersBySize, downloadPlayersPDF } from "~/lib/sizeUtils";
import { generateInvoicePDF } from "~/lib/pdfHelper";
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

export function MonitoringPesananDesktop() {
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

    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrintInvoice = async () => {
        if (!selectedOrder) return;
        setIsPrinting(true);
        try {
            await generateInvoicePDF(selectedOrder);
        } catch (error) {
            console.error("Failed to generate PDF", error);
            setToast({ title: "Gagal mencetak invoice", variant: "destructive" });
        } finally {
            setIsPrinting(false);
        }
    };

    const [isUploadingProof, setIsUploadingProof] = useState(false);
    const proofInputRef = useRef<HTMLInputElement>(null);

    const handleUploadProof = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedOrder) return;
        
        setIsUploadingProof(true);
        try {
            // Upload the file
            const res = await chatService.uploadFile(file);
            const newPaymentUrl = res.url;
            
            // We use the new dedicated API endpoint for paymentUrl update
            await orderService.updatePaymentUrl(selectedOrder.rawId, newPaymentUrl);
            
            setToast({ title: "Bukti pembayaran berhasil diunggah!", variant: "success" });
            
            // Update local state
            setSelectedOrder({ ...selectedOrder, paymentProofUrl: newPaymentUrl });
            setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, paymentProofUrl: newPaymentUrl } : o));
            
        } catch (error) {
            console.error("Gagal mengunggah bukti pembayaran", error);
            setToast({ title: "Gagal mengunggah bukti pembayaran", variant: "destructive" });
        } finally {
            setIsUploadingProof(false);
            if (proofInputRef.current) proofInputRef.current.value = "";
        }
    };

    // Search, Sort, and Pagination states
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("newest");

    const [isUploadingPrint, setIsUploadingPrint] = useState(false);
    const printInputRef = useRef<HTMLInputElement>(null);
    const handleUploadPrint = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedOrder) return;
        
        setIsUploadingPrint(true);
        try {
            const res = await orderService.uploadPrint(selectedOrder.rawId, file);
            setToast({ title: "Foto progres Print berhasil diunggah!", variant: "success" });
            setSelectedOrder({ ...selectedOrder, printUrl: res.printUrl });
            setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, printUrl: res.printUrl } : o));
        } catch (error) {
            console.error("Gagal mengunggah foto Print", error);
            setToast({ title: "Gagal mengunggah foto Print", variant: "destructive" });
        } finally {
            setIsUploadingPrint(false);
            if (printInputRef.current) printInputRef.current.value = "";
        }
    };

    const [isUploadingFinishing, setIsUploadingFinishing] = useState(false);
    const finishingInputRef = useRef<HTMLInputElement>(null);
    const handleUploadFinishing = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedOrder) return;
        
        setIsUploadingFinishing(true);
        try {
            const res = await orderService.uploadFinishing(selectedOrder.rawId, file);
            setToast({ title: "Foto progres Finishing berhasil diunggah!", variant: "success" });
            setSelectedOrder({ ...selectedOrder, finishingUrl: res.finishingUrl });
            setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, finishingUrl: res.finishingUrl } : o));
        } catch (error) {
            console.error("Gagal mengunggah foto Finishing", error);
            setToast({ title: "Gagal mengunggah foto Finishing", variant: "destructive" });
        } finally {
            setIsUploadingFinishing(false);
            if (finishingInputRef.current) finishingInputRef.current.value = "";
        }
    };
    const [filterTab, setFilterTab] = useState("MENUNGGU");
    const [currentPage, setCurrentPage] = useState(1);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const itemsPerPage = 10;
    const sortDropdownRef = useRef<HTMLDivElement>(null);

    // Reset page on filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy, filterTab]);

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
                    isAdminOrder: !!o.isAdminOrder,
                    totalAmount: o.totalAmount,
                    shippingMethod: o.shippingMethod,
                    shippingAddress: o.shippingAddress,
                    mockupUrl: o.mockupUrl,
                    designStatus: o.designStatus,
                    designFeedback: o.designFeedback,
                    layoutUrl: o.layoutUrl,
                    layoutStatus: o.layoutStatus,
                    layoutFeedback: o.layoutFeedback,
                    printUrl: o.printUrl,
                    finishingUrl: o.finishingUrl,
                    details: o.details,
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
            // Refresh local state
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

    const handleApproveDesign = async (id: number) => {
        try {
            await orderService.approveDesign(id);
            setOrders(prev => prev.map(o => o.rawId === id ? { ...o, designStatus: "APPROVED" } : o));
            if (selectedOrder?.rawId === id) {
                setSelectedOrder((prev: any) => ({ ...prev, designStatus: "APPROVED" }));
            }
            setToast({ title: "Desain berhasil disetujui", variant: "success" });
        } catch (error) {
            console.error("Error approving design:", error);
            setToast({ title: "Gagal menyetujui desain", variant: "destructive" });
        }
    };

    const handleRevisiDesign = async (id: number, feedback: string) => {
        try {
            await orderService.revisiDesign(id, feedback);
            setOrders(prev => prev.map(o => o.rawId === id ? { ...o, designStatus: "REVISI", designFeedback: feedback } : o));
            if (selectedOrder?.rawId === id) {
                setSelectedOrder((prev: any) => ({ ...prev, designStatus: "REVISI", designFeedback: feedback }));
            }
            setToast({ title: "Revisi desain berhasil dikirim", variant: "success" });
        } catch (error) {
            console.error("Error requesting revision:", error);
            setToast({ title: "Gagal mengirim revisi", variant: "destructive" });
        }
    };

    const handleApproveLayout = async (id: number) => {
        try {
            await orderService.approveLayout(id);
            setOrders(prev => prev.map(o => o.rawId === id ? { ...o, layoutStatus: "APPROVED" } : o));
            if (selectedOrder?.rawId === id) {
                setSelectedOrder((prev: any) => ({ ...prev, layoutStatus: "APPROVED" }));
            }
            setToast({ title: "Layout berhasil disetujui", variant: "success" });
        } catch (error) {
            console.error("Error approving layout:", error);
            setToast({ title: "Gagal menyetujui layout", variant: "destructive" });
        }
    };

    const handleRevisiLayout = async (id: number, feedback: string) => {
        try {
            await orderService.revisiLayout(id, feedback);
            setOrders(prev => prev.map(o => o.rawId === id ? { ...o, layoutStatus: "REVISI", layoutFeedback: feedback } : o));
            if (selectedOrder?.rawId === id) {
                setSelectedOrder((prev: any) => ({ ...prev, layoutStatus: "REVISI", layoutFeedback: feedback }));
            }
            setToast({ title: "Revisi layout berhasil dikirim", variant: "success" });
        } catch (error) {
            console.error("Error requesting revision:", error);
            setToast({ title: "Gagal mengirim revisi", variant: "destructive" });
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
        if (filterTab !== "ALL") {
            const status = (o.status || "").toUpperCase();
            if (filterTab === "MENUNGGU" && status !== "MENUNGGU" && status !== "MENUNGGU VERIFIKASI") {
                return false;
            } else if (filterTab !== "MENUNGGU" && status !== filterTab) {
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

    // Full-Page Detail View
    if (selectedOrder) {
        return (
            <div className="min-h-screen bg-slate-50 font-geist">
                {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
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
                                         <p className="text-[10px] font-black text-[#D25026] uppercase tracking-widest mb-2 italic bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 inline-block w-fit">
                                            Info: Ini ID yang akan dikirim ke customer untuk melacak pesanan
                                         </p>
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
                                            {selectedOrder.queueNumber && (
                                                <span className="bg-[#D25026]/10 text-[#D25026] px-3 py-1 rounded-lg text-xs font-black italic border border-[#D25026]/20">
                                                    No. Antrean: {selectedOrder.queueNumber}
                                                </span>
                                            )}
                                        </div>
                                     </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <div>
                                    <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900">Detail Pesanan Custom</h1>
                                    <div className="flex items-center gap-2 mt-2">
                                        <p className="text-slate-500 font-medium text-lg">{selectedOrder.product} - <span className="text-[#D25026]">{selectedOrder.customer}</span></p>
                                        {selectedOrder.isAdminOrder && (
                                            <span className="bg-[#D25026]/10 text-[#D25026] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 mt-2 w-max">
                                                <User size={12} />
                                                Dibuat oleh: Admin
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button 
                                    onClick={handlePrintInvoice}
                                    disabled={isPrinting}
                                    className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest italic flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                                >
                                    {isPrinting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer size={16} />}
                                    Cetak Invoice
                                </button>
                            </div>
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

                        <div className="p-10 bg-slate-50 space-y-12">
                            {(() => {
                                const currentBahan = bahanList.find(b => b.id === selectedOrder.productId);
                                const isBahanHabis = currentBahan?.status === "Habis";
                                if (!isBahanHabis) return null;

                                return (
                                    <div className="bg-red-50 border border-red-200 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                                                <AlertCircle className="text-red-600 w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black uppercase tracking-wider text-red-900">Bahan Terpilih Habis!</h4>
                                                <p className="text-xs text-red-600 font-medium leading-relaxed mt-1">
                                                    Bahan "{currentBahan.nama}" saat ini habis/tidak tersedia. Berikan rekomendasi bahan alternatif agar customer dapat memilih bahan pengganti.
                                                </p>
                                                {selectedOrder.recommendedBahanIds && selectedOrder.recommendedBahanIds.length > 0 && (
                                                    <p className="text-xs text-slate-500 font-bold mt-2">
                                                        Rekomendasi saat ini: {selectedOrder.recommendedBahanIds.map((id: number) => bahanList.find(b => b.id === id)?.nama).filter(Boolean).join(", ")}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <Dialog open={isRecommendModalOpen} onOpenChange={setIsRecommendModalOpen}>
                                            <DialogTrigger asChild>
                                                <Button className="bg-slate-900 text-white rounded-2xl px-6 h-14 font-black uppercase tracking-widest text-xs hover:bg-[#D25026] active:scale-95 transition-all shadow-md shrink-0">
                                                    Rekomendasikan Alternatif
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px] font-geist border-slate-100 shadow-xl rounded-3xl p-8 bg-white">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900">Rekomendasi Bahan Alternatif</DialogTitle>
                                                </DialogHeader>
                                                <div className="py-6 space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                                                    <p className="text-xs font-bold text-slate-500 italic uppercase">Pilih bahan pengganti yang berstatus "Tersedia":</p>
                                                    {bahanList.filter(b => b.status === "Tersedia").map(b => {
                                                        const isChecked = tempRecommendedIds.includes(b.id);
                                                        return (
                                                            <label key={b.id} className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl border border-slate-200 cursor-pointer transition-all">
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
                                                                    className="w-5 h-5 rounded border-slate-300 text-[#D25026] focus:ring-[#D25026]"
                                                                />
                                                                <div className="flex-1">
                                                                    <p className="text-sm font-black text-slate-900 uppercase">{b.nama}</p>
                                                                    <p className="text-xs font-bold text-[#D25026]">{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(b.harga || 150000)}</p>
                                                                </div>
                                                            </label>
                                                        );
                                                    })}
                                                    {bahanList.filter(b => b.status === "Tersedia").length === 0 && (
                                                        <p className="text-xs font-medium text-slate-400 italic">Tidak ada bahan tersedia saat ini.</p>
                                                    )}
                                                </div>
                                                <div className="flex justify-end gap-3 mt-4">
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => setIsRecommendModalOpen(false)}
                                                        className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                                                    >
                                                        Batal
                                                    </Button>
                                                    <Button
                                                        onClick={handleSendRecommendations}
                                                        className="px-6 py-3 bg-[#D25026] text-white font-bold rounded-xl hover:bg-[#B34320] transition-colors"
                                                    >
                                                        Kirim Rekomendasi
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                );
                            })()}

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Design Reference */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                        <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                            <ImageIcon className="text-[#D25026]" size={16} />
                                        </div>
                                        Referensi Desain & Catatan
                                    </h3>
                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5 space-y-6">
                                        {selectedOrder.designUrl ? (
                                            <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-3 shadow-sm">
                                                {selectedOrder.designUrl.toLowerCase().endsWith('.pdf') ? (
                                                    <div className="w-full h-48 bg-red-50 flex flex-col items-center justify-center rounded-xl">
                                                        <FileText className="w-12 h-12 text-red-500 mb-3" />
                                                        <a href={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl.startsWith('/') ? '' : '/'}${selectedOrder.designUrl}`} target="_blank" rel="noreferrer" className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">
                                                            Buka Referensi (PDF)
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <img 
                                                        src={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl.startsWith('/') ? '' : '/'}${selectedOrder.designUrl}`} 
                                                        alt="Design Reference" 
                                                        className="w-full h-auto max-h-[400px] object-contain mx-auto rounded-xl" 
                                                    />
                                                )}
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

                                {/* Payment Verification */}
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                        <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                            <CreditCard className="text-[#D25026]" size={16} />
                                        </div>
                                        Verifikasi Pembayaran
                                    </h3>
                                    <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden">
                                        <div className="relative z-10">
                                            {selectedOrder.paymentProofUrl && selectedOrder.paymentProofUrl !== "MENUNGGU_PEMBAYARAN_ADMIN" ? (
                                                    <div className="w-full bg-slate-50 rounded-[1.5rem] overflow-hidden border border-slate-200 flex flex-col items-center justify-center p-3 shadow-sm relative group">
                                                        {selectedOrder.paymentProofUrl.toLowerCase().endsWith('.pdf') ? (
                                                            <div className="w-full h-48 bg-emerald-50 flex flex-col items-center justify-center rounded-xl">
                                                                <FileText className="w-12 h-12 text-emerald-500 mb-3" />
                                                                <a href={selectedOrder.paymentProofUrl.startsWith('http') ? selectedOrder.paymentProofUrl : `${UPLOADS_URL}${selectedOrder.paymentProofUrl.startsWith('/') ? '' : '/'}${selectedOrder.paymentProofUrl}`} target="_blank" rel="noreferrer" className="text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 underline">
                                                                    Buka Bukti (PDF)
                                                                </a>
                                                            </div>
                                                        ) : (
                                                            <img 
                                                                src={selectedOrder.paymentProofUrl.startsWith('http') ? selectedOrder.paymentProofUrl : `${UPLOADS_URL}${selectedOrder.paymentProofUrl.startsWith('/') ? '' : '/'}${selectedOrder.paymentProofUrl}`} 
                                                                alt="Payment Proof" 
                                                                className="w-full h-auto min-h-[150px] max-h-[500px] object-contain mx-auto rounded-xl" 
                                                            />
                                                        )}
                                                        
                                                        {selectedOrder.status === "MENUNGGU" && (
                                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[1.5rem]">
                                                                <label className={`bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm shadow-xl flex items-center gap-2 transition-transform cursor-pointer ${isUploadingProof ? 'opacity-50' : 'hover:scale-105'}`}>
                                                                    {isUploadingProof ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                                                    Ubah Bukti Pembayaran
                                                                    <input 
                                                                        type="file" 
                                                                        onChange={handleUploadProof} 
                                                                        accept="image/*,.pdf" 
                                                                        className="hidden" 
                                                                        disabled={isUploadingProof}
                                                                    />
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                            ) : (
                                                <div className="w-full min-h-[8rem] bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-6">
                                                    {selectedOrder.paymentProofUrl === "MENUNGGU_PEMBAYARAN_ADMIN" ? (
                                                        <div className="flex flex-col items-center text-center">
                                                            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                                                                <Clock className="w-6 h-6 text-amber-600" />
                                                            </div>
                                                            <p className="text-xs font-bold text-slate-600 italic uppercase tracking-widest mb-4">Menunggu Unggahan Admin</p>
                                                            <label className={`bg-[#D25026] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md cursor-pointer ${isUploadingProof ? 'opacity-50' : 'hover:bg-[#B34320]'}`}>
                                                                {isUploadingProof ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload size={14} />}
                                                                Unggah Bukti Transfer
                                                                <input 
                                                                    type="file" 
                                                                    onChange={handleUploadProof} 
                                                                    accept="image/*,.pdf" 
                                                                    className="hidden" 
                                                                    disabled={isUploadingProof}
                                                                />
                                                            </label>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs font-bold text-slate-400 italic uppercase tracking-widest">Belum ada bukti pembayaran</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Mockup Hasil Desain (Admin Monitor) */}
                            {selectedOrder.status !== "MENUNGGU" && (
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                        <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                            <ImageIcon className="text-[#D25026]" size={16} />
                                        </div>
                                        Progress Mockup Desain (Oleh: {selectedOrder.designer})
                                    </h3>
                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5">
                                        {selectedOrder.mockupUrl ? (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Status Persetujuan:</span>
                                                        {selectedOrder.designStatus === "SENT" && (
                                                            <span className="bg-amber-50 text-amber-700 border-amber-200 border px-3 py-1 rounded-lg text-xs font-black italic">
                                                                Menunggu Persetujuan Customer
                                                            </span>
                                                        )}
                                                        {selectedOrder.designStatus === "APPROVED" && (
                                                            <span className="bg-emerald-50 text-emerald-700 border-emerald-200 border px-3 py-1 rounded-lg text-xs font-black italic">
                                                                Disetujui
                                                            </span>
                                                        )}
                                                        {selectedOrder.designStatus === "REVISI" && (
                                                            <span className="bg-red-50 text-red-700 border-red-200 border px-3 py-1 rounded-lg text-xs font-black italic">
                                                                Revisi Diminta
                                                            </span>
                                                        )}
                                                        {selectedOrder.designStatus === "PENDING" && (
                                                            <span className="bg-slate-50 text-slate-700 border-slate-200 border px-3 py-1 rounded-lg text-xs font-black italic">
                                                                Belum Diupload
                                                            </span>
                                                        )}
                                                    </div>

                                                    {selectedOrder.designStatus === "REVISI" && selectedOrder.designFeedback && (
                                                        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 space-y-1">
                                                            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest italic">Feedback Revisi Customer:</p>
                                                            <p className="text-sm text-red-700 font-bold leading-relaxed italic">"{selectedOrder.designFeedback}"</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 p-2 flex items-center justify-center">
                                                    {selectedOrder.mockupUrl.toLowerCase().endsWith('.pdf') ? (
                                                        <div className="w-full h-48 bg-red-50 flex flex-col items-center justify-center rounded-xl">
                                                            <FileText className="w-12 h-12 text-red-500 mb-3" />
                                                            <a href={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} target="_blank" rel="noreferrer" className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline flex items-center gap-2">
                                                                <Eye size={14} /> Buka Mockup (PDF)
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <img 
                                                            src={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} 
                                                            alt="Mockup Design" 
                                                            className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-xl" 
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            {selectedOrder.isAdminOrder && selectedOrder.designStatus === "SENT" && (
                                                <div className="flex gap-3 mt-4 border-t border-slate-100 pt-4">
                                                    <Button 
                                                        onClick={() => {
                                                            const feedback = prompt("Masukkan catatan revisi desain:");
                                                            if (feedback) handleRevisiDesign(selectedOrder.rawId, feedback);
                                                        }}
                                                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                                                    >
                                                        Minta Revisi (Admin)
                                                    </Button>
                                                    <Button 
                                                        onClick={() => handleApproveDesign(selectedOrder.rawId)}
                                                        className="bg-[#D25026] text-white hover:bg-[#B34320] px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                                                    >
                                                        Setujui Desain (Admin)
                                                    </Button>
                                                </div>
                                            )}
                                            </>
                                        ) : (
                                            <div className="w-full h-32 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-100">
                                                <p className="text-xs font-bold text-slate-400 italic uppercase tracking-widest">Desainer belum mengupload mockup desain.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Mockup Layout Pola Cetak (Admin Monitor) */}
                            {(selectedOrder.status === "LAYOUT" || selectedOrder.layoutUrl) && (
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                        <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                            <ImageIcon className="text-[#D25026]" size={16} />
                                        </div>
                                        Progress Layout Pola Cetak (Oleh: {selectedOrder.designer})
                                    </h3>
                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5">
                                        {selectedOrder.layoutUrl ? (
                                            <>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-4">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Status Persetujuan Layout:</span>
                                                        {selectedOrder.layoutStatus === "SENT" && (
                                                            <span className="bg-amber-50 text-amber-700 border-amber-200 border px-3 py-1 rounded-lg text-xs font-black italic">
                                                                Menunggu Persetujuan Customer
                                                            </span>
                                                        )}
                                                        {selectedOrder.layoutStatus === "APPROVED" && (
                                                            <span className="bg-emerald-50 text-emerald-700 border-emerald-200 border px-3 py-1 rounded-lg text-xs font-black italic">
                                                                Disetujui
                                                            </span>
                                                        )}
                                                        {selectedOrder.layoutStatus === "REVISI" && (
                                                            <span className="bg-red-50 text-red-700 border-red-200 border px-3 py-1 rounded-lg text-xs font-black italic">
                                                                Revisi Diminta
                                                            </span>
                                                        )}
                                                        {selectedOrder.layoutStatus === "PENDING" && (
                                                            <span className="bg-slate-50 text-slate-700 border-slate-200 border px-3 py-1 rounded-lg text-xs font-black italic">
                                                                Belum Diupload
                                                            </span>
                                                        )}
                                                    </div>

                                                    {selectedOrder.layoutStatus === "REVISI" && selectedOrder.layoutFeedback && (
                                                        <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100 space-y-1">
                                                            <p className="text-[10px] font-black text-red-600 uppercase tracking-widest italic">Feedback Layout Customer:</p>
                                                            <p className="text-sm text-red-700 font-bold leading-relaxed italic">"{selectedOrder.layoutFeedback}"</p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 p-2 flex items-center justify-center">
                                                    {selectedOrder.layoutUrl.toLowerCase().endsWith('.pdf') ? (
                                                        <div className="w-full h-48 bg-red-50 flex flex-col items-center justify-center rounded-xl">
                                                            <FileText className="w-12 h-12 text-red-500 mb-3" />
                                                            <a href={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} target="_blank" rel="noreferrer" className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline flex items-center gap-2">
                                                                <Eye size={14} /> Buka Layout (PDF)
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        <img 
                                                            src={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} 
                                                            alt="Mockup Layout" 
                                                            className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-xl" 
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            {selectedOrder.isAdminOrder && selectedOrder.layoutStatus === "SENT" && (
                                                <div className="flex gap-3 mt-4 border-t border-slate-100 pt-4">
                                                    <Button 
                                                        onClick={() => {
                                                            const feedback = prompt("Masukkan catatan revisi layout:");
                                                            if (feedback) handleRevisiLayout(selectedOrder.rawId, feedback);
                                                        }}
                                                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                                                    >
                                                        Minta Revisi (Admin)
                                                    </Button>
                                                    <Button 
                                                        onClick={() => handleApproveLayout(selectedOrder.rawId)}
                                                        className="bg-[#D25026] text-white hover:bg-[#B34320] px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                                                    >
                                                        Setujui Layout (Admin)
                                                    </Button>
                                                </div>
                                            )}
                                            </>
                                        ) : (
                                            <div className="w-full h-32 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-100">
                                                <p className="text-xs font-bold text-slate-400 italic uppercase tracking-widest">Desainer belum mengupload layout pola cetak.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Progress Print (Admin Monitor) */}
                            {(["PRINT", "FINISHING", "SELESAI"].includes(selectedOrder.status) || selectedOrder.printUrl) && (
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                        <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                            <Printer className="text-[#D25026]" size={16} />
                                        </div>
                                        Progress Cetak (Print)
                                    </h3>
                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5">
                                        {selectedOrder.printUrl ? (
                                            <div className="w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 p-2 flex items-center justify-center">
                                                <img 
                                                    src={selectedOrder.printUrl.startsWith('http') ? selectedOrder.printUrl : `${UPLOADS_URL}${selectedOrder.printUrl.startsWith('/') ? '' : '/'}${selectedOrder.printUrl}`} 
                                                    alt="Progress Print" 
                                                    className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-xl" 
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full min-h-[8rem] bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-6">
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center mb-3">
                                                        <Printer className="w-6 h-6 text-cyan-600" />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-600 italic uppercase tracking-widest mb-4">Menunggu Foto Print</p>
                                                    <label className={`bg-[#D25026] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md cursor-pointer ${isUploadingPrint ? 'opacity-50' : 'hover:bg-[#B34320]'}`}>
                                                        {isUploadingPrint ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload size={14} />}
                                                        Unggah Foto Print
                                                        <input 
                                                            type="file" 
                                                            onChange={handleUploadPrint} 
                                                            accept="image/*" 
                                                            className="hidden" 
                                                            disabled={isUploadingPrint}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Progress Finishing (Admin Monitor) */}
                            {(["FINISHING", "SELESAI"].includes(selectedOrder.status) || selectedOrder.finishingUrl) && (
                                <div className="space-y-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                        <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                            <CheckCircle className="text-[#D25026]" size={16} />
                                        </div>
                                        Progress Finishing
                                    </h3>
                                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5">
                                        {selectedOrder.finishingUrl ? (
                                            <div className="w-full bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 p-2 flex items-center justify-center">
                                                <img 
                                                    src={selectedOrder.finishingUrl.startsWith('http') ? selectedOrder.finishingUrl : `${UPLOADS_URL}${selectedOrder.finishingUrl.startsWith('/') ? '' : '/'}${selectedOrder.finishingUrl}`} 
                                                    alt="Progress Finishing" 
                                                    className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-xl" 
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full min-h-[8rem] bg-slate-50 rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-6">
                                                <div className="flex flex-col items-center text-center">
                                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                                        <CheckCircle className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                    <p className="text-xs font-bold text-slate-600 italic uppercase tracking-widest mb-4">Menunggu Foto Finishing</p>
                                                    <label className={`bg-[#D25026] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md cursor-pointer ${isUploadingFinishing ? 'opacity-50' : 'hover:bg-[#B34320]'}`}>
                                                        {isUploadingFinishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload size={14} />}
                                                        Unggah Foto Finishing
                                                        <input 
                                                            type="file" 
                                                            onChange={handleUploadFinishing} 
                                                            accept="image/*" 
                                                            className="hidden" 
                                                            disabled={isUploadingFinishing}
                                                        />
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Shipping Information */}
                            <div className="space-y-6">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                    <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                        <Truck className="text-[#D25026]" size={16} />
                                    </div>
                                    Informasi Pengiriman
                                </h3>
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Metode Pengiriman:</p>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                            <p className="text-sm font-black text-slate-900 uppercase italic">
                                                {selectedOrder.shippingMethod === "COD" ? "COD (Penerima yang bayar)" : "Ambil di tempat (Self-Pickup)"}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                                            {selectedOrder.shippingMethod === "COD" ? "Alamat Tujuan COD:" : "Alamat Toko (Kunjungi Toko):"}
                                        </p>
                                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm leading-relaxed text-slate-700 italic">
                                            {selectedOrder.shippingMethod === "COD"
                                                ? (selectedOrder.shippingAddress || "Alamat tidak diisi.")
                                                : "Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178"
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Player List (Full Width) */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                        <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                            <User className="text-[#D25026]" size={16} />
                                        </div>
                                        Daftar Nama Pemain ({selectedOrder.playerInfo.length} Unit)
                                    </h3>
                                    <button 
                                        onClick={() => downloadPlayersPDF(selectedOrder)}
                                        className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest italic hover:bg-slate-50 transition-all shadow-sm group"
                                    >
                                        <FileText size={14} className="text-[#D25026] group-hover:scale-110 transition-transform" />
                                        Download PDF
                                    </button>
                                </div>
                                <div className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden shadow-sm ring-1 ring-black/5">
                                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                        <table className="w-full text-left relative">
                                            <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100 shadow-sm">
                                                <tr>
                                                    <th className="px-6 py-4 text-[10px] font-black text-slate-700 uppercase tracking-widest italic">Nama</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-slate-700 uppercase tracking-widest italic text-center">No</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-slate-700 uppercase tracking-widest italic text-center">Size</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-slate-700 uppercase tracking-widest italic text-center">Lengan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 bg-white">
                                                {selectedOrder.playerInfo.map((player: any, idx: number) => {
                                                    let sizeOnly = player.size || "-";
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
                                                        <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                            <td className="px-6 py-4 text-sm font-black text-slate-800 uppercase italic">{player.name}</td>
                                                            <td className="px-6 py-4 text-center font-black text-[#D25026] text-lg">{player.number}</td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black italic">{sizeOnly}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-center text-sm font-medium text-slate-600">
                                                                {sleeve}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 border-t border-slate-100 bg-white flex justify-between items-center px-12">
                            <div className="flex gap-4">
                                {selectedOrder.status === "MENUNGGU" && (
                                    <>
                                        <Button 
                                            variant="outline"
                                            onClick={() => handleUpdateStatus(selectedOrder.rawId, "DITOLAK")}
                                            className="px-10 py-7 h-auto bg-red-50 hover:bg-red-600 text-red-600 hover:text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest transition-all border border-red-100 shadow-lg shadow-red-500/5 italic cursor-pointer"
                                        >
                                            Reject Order
                                        </Button>
                                        <Button 
                                            onClick={() => {
                                                setOrderToAssign(selectedOrder.rawId);
                                                setIsAssignModalOpen(true);
                                            }}
                                            className="px-12 py-7 h-auto bg-[#D25026] text-slate-900 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-[#B34320] transition-all shadow-xl shadow-[#D25026]/20 italic cursor-pointer border-none"
                                        >
                                            Terima & Serahkan ke Desain
                                        </Button>
                                    </>
                                )}
                            </div>
                            <Button 
                                variant="ghost"
                                onClick={() => setSelectedOrder(null)} 
                                className="px-10 py-7 h-auto bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-[1.5rem] text-xs font-bold uppercase tracking-widest transition-colors italic cursor-pointer"
                            >
                                Kembali ke Daftar
                            </Button>
                        </div>
                    </div>

                    {/* Handover Modal */}
                    <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                        <DialogContent className="sm:max-w-[580px] font-geist border-slate-100 shadow-xl rounded-3xl p-10">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 pr-12">Serahkan ke Tim Desain</DialogTitle>
                            </DialogHeader>
                            <div className="py-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2 italic">Pilih Desainer</label>
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
                            </div>
                            <div className="flex justify-end gap-3 mt-2">
                                <Button
                                    variant="ghost"
                                    onClick={() => setIsAssignModalOpen(false)}
                                    className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
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
                                    className="px-6 py-3 bg-[#D25026] text-white font-bold rounded-xl hover:bg-[#B34320] transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    Konfirmasi & Serahkan
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-geist">
            {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
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
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Produksi (Layout/Print/Finishing)</p>
                        <p className="text-3xl font-black text-blue-500">{orders.filter(o => ["LAYOUT", "PRINT", "FINISHING"].includes(o.status)).length}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex overflow-x-auto gap-2 mb-6 pb-2 custom-scrollbar">
                    {[
                        { id: "ALL", label: "Semua" },
                        { id: "MENUNGGU", label: "Menunggu" },
                        { id: "DESAIN", label: "Desain" },
                        { id: "LAYOUT", label: "Layout" },
                        { id: "PRINT", label: "Print" },
                        { id: "FINISHING", label: "Finishing" },
                        { id: "SELESAI", label: "Selesai" },
                        { id: "DITOLAK", label: "Ditolak" },
                    ].map(tab => {
                        const count = tab.id === "ALL" 
                            ? orders.length 
                            : orders.filter(o => {
                                const status = (o.status || "").toUpperCase();
                                if (tab.id === "MENUNGGU") return status === "MENUNGGU" || status === "MENUNGGU VERIFIKASI";
                                return status === tab.id;
                            }).length;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setFilterTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest italic whitespace-nowrap transition-all",
                                    filterTab === tab.id 
                                        ? "bg-[#D25026] text-white" 
                                        : "bg-white text-slate-500 hover:bg-slate-100 border border-slate-200"
                                )}
                            >
                                <span>{tab.label}</span>
                                {count > 0 && (
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-lg text-[10px]",
                                        filterTab === tab.id
                                            ? "bg-white/20 text-white"
                                            : "bg-slate-100 text-slate-500"
                                    )}>
                                        {count}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Search & Sort Controls */}
                <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-6">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Cari ID Pesanan, Customer, Produk..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-11 pr-4 py-3 bg-white border-slate-200 rounded-2xl w-full text-sm font-medium focus:ring-1 focus:ring-[#D25026]"
                        />
                    </div>
                    
                    <div ref={sortDropdownRef} className="flex items-center gap-3 w-full md:w-auto justify-end relative">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400 italic whitespace-nowrap">Urutkan:</span>
                        <div className="relative">
                            <button
                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                className="flex items-center justify-between gap-4 bg-white border border-slate-200 px-5 py-3 rounded-2xl transition-all duration-200 min-w-[200px] text-left cursor-pointer shadow-sm text-xs font-black uppercase tracking-widest italic"
                            >
                                <span className="text-slate-700">
                                    {sortBy === "newest" && "Terbaru (Tanggal)"}
                                    {sortBy === "oldest" && "Terlama (Tanggal)"}
                                    {sortBy === "name-asc" && "Customer A-Z"}
                                    {sortBy === "name-desc" && "Customer Z-A"}
                                    {sortBy === "price-highest" && "Harga Tertinggi"}
                                    {sortBy === "price-lowest" && "Harga Terendah"}
                                    {sortBy === "qty-highest" && "Jumlah Terbanyak"}
                                    {sortBy === "qty-lowest" && "Jumlah Tersedikit"}
                                </span>
                                <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", showSortDropdown && "rotate-180")} />
                            </button>

                            {showSortDropdown && (
                                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-150 rounded-2xl shadow-xl z-50 py-1 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                                    {[
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
                                                "w-full text-left px-4 py-2.5 text-xs font-black uppercase tracking-widest italic transition-colors hover:bg-[#FFF0EB]/50 hover:text-[#D25026] cursor-pointer border-none",
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
                                        <td colSpan={7} className="px-6 py-20 text-center text-slate-400 font-medium">
                                            <div className="flex flex-col items-center gap-4">
                                                <Loader2 className="w-8 h-8 animate-spin text-[#D25026]" />
                                                <p className="text-[10px] font-black uppercase tracking-widest italic">Memuat data pesanan...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredAndSortedOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-20 text-center text-slate-400 font-medium">
                                            <p className="text-[10px] font-black uppercase tracking-widest italic">Pesanan tidak ditemukan</p>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedOrders.map((order) => (
                                        <tr key={order.rawId} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-5 font-bold text-slate-500 font-mono">
                                                {order.id}
                                                {order.queueNumber && (
                                                    <span className="ml-2 bg-[#D25026]/10 text-[#D25026] px-2 py-0.5 rounded text-[8px] font-black uppercase italic border border-[#D25026]/20">
                                                        {order.queueNumber}
                                                    </span>
                                                )}
                                            </td>
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
                                                <Button 
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-sm cursor-pointer"
                                                >
                                                    <Eye size={14} /> Detail
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="mt-8 flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                                        }}
                                        className={cn(
                                            "cursor-pointer hover:bg-slate-100",
                                            currentPage === 1 && "pointer-events-none opacity-40 hover:bg-transparent"
                                        )}
                                    />
                                </PaginationItem>

                                {getPageNumbers().map((page, index) => (
                                    <PaginationItem key={index}>
                                        {page === "ellipsis" ? (
                                            <PaginationEllipsis />
                                        ) : (
                                            <PaginationLink
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setCurrentPage(page as number);
                                                }}
                                                isActive={currentPage === page}
                                                className="cursor-pointer font-bold font-mono"
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
                                            "cursor-pointer hover:bg-slate-100",
                                            currentPage === totalPages && "pointer-events-none opacity-40 hover:bg-transparent"
                                        )}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </div>
    );
}
