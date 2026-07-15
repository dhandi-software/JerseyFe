import { useState, useEffect, useRef } from "react";
import { Clock, Eye, CheckCircle, Package, Truck, Image as ImageIcon, CreditCard, ChevronLeft, MessageCircle, FileText, User, UploadCloud } from "lucide-react";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { UPLOADS_URL } from "~/api/client";
import { useAuth } from "~/hooks/useAuth";
import { sortPlayersBySize, downloadPlayersPDF } from "~/lib/sizeUtils";
import { Button } from "~/components/ui/button";
import { Toast } from "~/components/ui/toast";

export function DashboardDesainDesktop() {
    const { user } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [filterTab, setFilterTab] = useState<"ALL" | "WAITING" | "PROCESSING" | "COMPLETED">("ALL");
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [uploading, setUploading] = useState(false);
    const [toast, setToast] = useState<{ title: string; variant: "success" | "destructive" } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [windowDragging, setWindowDragging] = useState(false);
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        onConfirm: () => void;
    }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

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
                    queueNumber: o.queueNumber,
                    isWorking: o.isWorking,
                    mockupUrl: o.mockupUrl,
                    designStatus: o.designStatus,
                    designFeedback: o.designFeedback,
                    layoutUrl: o.layoutUrl,
                    layoutStatus: o.layoutStatus,
                    layoutFeedback: o.layoutFeedback,
                    dateTime: new Date(o.createdAt).toLocaleString('id-ID', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    }),
                    playerInfo: sortPlayersBySize(o.details.map((d: any) => ({
                        name: d.playerName || "-",
                        number: d.playerNumber || "-",
                        size: d.playerSize || "-"
                    }))),
                    designNote: o.designNote,
                    designUrl: o.designUrl,
                    customerId: o.customerId,
                    totalAmount: o.totalAmount
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

        if (filterTab === "WAITING") {
            return order.status === "DESAIN" && !order.isWorking;
        }
        if (filterTab === "PROCESSING") {
            return (order.status === "DESAIN" && order.isWorking) || ["LAYOUT", "PRINT", "FINISHING"].includes(order.status);
        }
        if (filterTab === "COMPLETED") {
            return order.status === "SELESAI";
        }
        return true;
    });

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (a.status === "SELESAI" && b.status !== "SELESAI") return 1;
        if (b.status === "SELESAI" && a.status !== "SELESAI") return -1;

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

    const handleUpdateStatus = (id: number, newStatus: string, isWorking?: boolean) => {
        let msg = "";
        if (newStatus === "LAYOUT") msg = "Apakah Anda yakin ingin menyelesaikan desain dan melanjutkan ke tahap Layout?";
        else if (newStatus === "PRINT") msg = "Apakah Anda yakin ingin menyelesaikan Layout dan melanjutkan ke cetak kain?";
        else if (newStatus === "FINISHING") msg = "Apakah Anda yakin ingin menyelesaikan Print dan melanjutkan ke Finishing?";
        else if (newStatus === "SELESAI") msg = "Apakah Anda yakin ingin menyelesaikan produksi pesanan ini?";
        else if (isWorking) msg = "Apakah Anda yakin ingin mulai mengerjakan pesanan ini?";
        else msg = `Apakah Anda yakin ingin mengubah status pesanan ini ke ${newStatus}?`;

        requestConfirmation(
            "Konfirmasi Perubahan Status",
            msg,
            async () => {
                try {
                    await orderService.updateOrderStatus(id, newStatus, undefined, isWorking);
                    setOrders(prev => prev.map(o => o.rawId === id ? { 
                        ...o, 
                        status: newStatus,
                        isWorking: isWorking !== undefined ? isWorking : o.isWorking 
                    } : o));
                    if (selectedOrder?.rawId === id) {
                        setSelectedOrder((prev: any) => ({ 
                            ...prev, 
                            status: newStatus,
                            isWorking: isWorking !== undefined ? isWorking : prev.isWorking 
                        }));
                    }
                    setToast({ title: "Status pesanan berhasil diperbarui", variant: "success" });
                } catch (error) {
                    console.error("Error updating status:", error);
                    setToast({ title: "Gagal memperbarui status", variant: "destructive" });
                } finally {
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        );
    };

    const handleCancelMockup = async () => {
        if (!selectedOrder) return;
        requestConfirmation(
            "Batalkan Kirim Mockup",
            "Apakah Anda yakin ingin membatalkan / menarik kembali mockup ini agar bisa diedit kembali?",
            async () => {
                try {
                    await orderService.cancelMockup(selectedOrder.rawId);
                    setOrders(prev => prev.map(o => o.rawId === selectedOrder.rawId ? { 
                        ...o, 
                        designStatus: "PENDING",
                        mockupUrl: null
                    } : o));
                    setSelectedOrder((prev: any) => ({
                        ...prev,
                        designStatus: "PENDING",
                        mockupUrl: null
                    }));
                    setToast({ title: "Pengiriman mockup berhasil dibatalkan", variant: "success" });
                } catch (error) {
                    console.error("Gagal membatalkan mockup:", error);
                    setToast({ title: "Gagal membatalkan mockup", variant: "destructive" });
                } finally {
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        );
    };

    const handleUploadMockup = async (fileOrEvent: File | React.ChangeEvent<HTMLInputElement>) => {
        let file: File | undefined;
        if (fileOrEvent instanceof File) {
            file = fileOrEvent;
        } else if (fileOrEvent && 'target' in fileOrEvent) {
            file = fileOrEvent.target.files?.[0];
        }
        if (!file) return;
        setUploading(true);
        try {
            const updated = await orderService.uploadMockup(selectedOrder.rawId, file);
            setOrders(prev => prev.map(o => o.rawId === selectedOrder.rawId ? { 
                ...o, 
                mockupUrl: updated.mockupUrl,
                designStatus: updated.designStatus,
                designFeedback: null 
            } : o));
            setSelectedOrder((prev: any) => ({
                ...prev,
                mockupUrl: updated.mockupUrl,
                designStatus: updated.designStatus,
                designFeedback: null
            }));
            setToast({ title: "Mockup berhasil diunggah dan dikirim!", variant: "success" });
        } catch (error) {
            console.error("Gagal mengupload mockup:", error);
            setToast({ title: "Gagal mengupload mockup", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const handleCancelLayout = async () => {
        if (!selectedOrder) return;
        requestConfirmation(
            "Batalkan Kirim Layout",
            "Apakah Anda yakin ingin membatalkan / menarik kembali layout ini agar bisa diedit kembali?",
            async () => {
                try {
                    await orderService.cancelLayout(selectedOrder.rawId);
                    setOrders(prev => prev.map(o => o.rawId === selectedOrder.rawId ? { 
                        ...o, 
                        layoutStatus: "PENDING",
                        layoutUrl: null
                    } : o));
                    setSelectedOrder((prev: any) => ({
                        ...prev,
                        layoutStatus: "PENDING",
                        layoutUrl: null
                    }));
                    setToast({ title: "Pengiriman layout berhasil dibatalkan", variant: "success" });
                } catch (error) {
                    console.error("Gagal membatalkan layout:", error);
                    setToast({ title: "Gagal membatalkan layout", variant: "destructive" });
                } finally {
                    setConfirmModal(prev => ({ ...prev, isOpen: false }));
                }
            }
        );
    };

    const handleUploadLayout = async (fileOrEvent: File | React.ChangeEvent<HTMLInputElement>) => {
        let file: File | undefined;
        if (fileOrEvent instanceof File) {
            file = fileOrEvent;
        } else if (fileOrEvent && 'target' in fileOrEvent) {
            file = fileOrEvent.target.files?.[0];
        }
        if (!file) return;
        setUploading(true);
        try {
            const updated = await orderService.uploadLayout(selectedOrder.rawId, file);
            setOrders(prev => prev.map(o => o.rawId === selectedOrder.rawId ? { 
                ...o, 
                layoutUrl: updated.layoutUrl,
                layoutStatus: updated.layoutStatus,
                layoutFeedback: null 
            } : o));
            setSelectedOrder((prev: any) => ({
                ...prev,
                layoutUrl: updated.layoutUrl,
                layoutStatus: updated.layoutStatus,
                layoutFeedback: null
            }));
            setToast({ title: "Layout berhasil diunggah dan dikirim!", variant: "success" });
        } catch (error) {
            console.error("Gagal mengupload layout:", error);
            setToast({ title: "Gagal mengupload layout", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const canUpload = selectedOrder && selectedOrder.isWorking && selectedOrder.status === "DESAIN" && 
        (selectedOrder.designStatus === "PENDING" || selectedOrder.designStatus === "REVISI");

    const canUploadLayout = selectedOrder && selectedOrder.status === "LAYOUT" &&
        (selectedOrder.layoutStatus === "PENDING" || selectedOrder.layoutStatus === "REVISI");

    useEffect(() => {
        if (!canUpload && !canUploadLayout) {
            setWindowDragging(false);
            return;
        }

        const handleDragOver = (e: DragEvent) => {
            if (e.dataTransfer?.types.includes("Files")) {
                e.preventDefault();
                setWindowDragging(true);
            }
        };

        const handleDragLeave = (e: DragEvent) => {
            e.preventDefault();
            if (
                e.relatedTarget === null ||
                e.clientX <= 0 ||
                e.clientY <= 0 ||
                e.clientX >= window.innerWidth ||
                e.clientY >= window.innerHeight
            ) {
                setWindowDragging(false);
            }
        };

        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            setWindowDragging(false);
            const files = e.dataTransfer?.files;
            if (files && files.length > 0) {
                if (canUpload) {
                    handleUploadMockup(files[0]);
                } else if (canUploadLayout) {
                    handleUploadLayout(files[0]);
                }
            }
        };

        window.addEventListener("dragover", handleDragOver);
        window.addEventListener("dragleave", handleDragLeave);
        window.addEventListener("drop", handleDrop);

        return () => {
            window.removeEventListener("dragover", handleDragOver);
            window.removeEventListener("dragleave", handleDragLeave);
            window.removeEventListener("drop", handleDrop);
        };
    }, [canUpload, canUploadLayout, selectedOrder?.rawId]);

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

                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl ring-1 ring-black/5">
                        <div className="relative p-10 border-b border-slate-100 bg-white">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border uppercase", getStatusStyle(selectedOrder.status))}>
                                        {selectedOrder.status}
                                    </span>
                                    {selectedOrder.queueNumber && (
                                        <span className="bg-[#D25026]/10 text-[#D25026] px-3 py-1.5 rounded-xl text-xs font-black italic border border-[#D25026]/20">
                                            No. Antrean: {selectedOrder.queueNumber}
                                        </span>
                                    )}
                                    {selectedOrder.status === "DESAIN" && (
                                        selectedOrder.isWorking ? (
                                            <span className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider animate-pulse border border-purple-200">
                                                Sedang Dikerjakan
                                            </span>
                                        ) : (
                                            <span className="bg-slate-100 text-slate-500 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border border-slate-200">
                                                Belum Mulai Kerja
                                            </span>
                                        )
                                    )}
                                </div>
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

                        <div className="p-10 bg-slate-50/50 space-y-12">
                            {/* Referensi Desain (Top) */}
                            <div>
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3 italic">
                                    <ImageIcon className="text-[#D25026]" size={16} />
                                    Referensi Desain
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
                                        <div className="w-full h-32 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                            <p className="text-xs font-bold text-slate-400 italic uppercase tracking-widest">Tidak ada referensi gambar</p>
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

                            {/* Mockup Hasil Desain Section */}
                            {selectedOrder.isWorking && (
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3 italic">
                                        <ImageIcon className="text-[#D25026]" size={16} />
                                        Mockup Hasil Desain
                                    </h3>
                                    {selectedOrder.mockupUrl ? (
                                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5 space-y-6">
                                             <div className="space-y-4">
                                                 {selectedOrder.status === "DESAIN" && selectedOrder.designStatus === "REVISI" ? (
                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                         {/* Kolom Kiri: Mockup Sebelumnya */}
                                                         <div className="space-y-3">
                                                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Mockup Sebelumnya</p>
                                                             <div className="relative w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-3 shadow-sm">
                                                                 {selectedOrder.mockupUrl.toLowerCase().endsWith('.pdf') ? (
                                                                     <div className="w-full h-48 bg-red-50 flex flex-col items-center justify-center rounded-xl">
                                                                         <FileText className="w-12 h-12 text-red-500 mb-3" />
                                                                         <a href={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} target="_blank" rel="noreferrer" className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">
                                                                             Buka Mockup (PDF)
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

                                                         {/* Kolom Kanan: Dropzone Baru */}
                                                         <div className="space-y-3">
                                                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Upload Mockup Baru</p>
                                                             <label 
                                                                 onDragOver={(e) => {
                                                                     e.preventDefault();
                                                                     setIsDragging(true);
                                                                 }}
                                                                 onDragLeave={() => setIsDragging(false)}
                                                                 onDrop={(e) => {
                                                                     e.preventDefault();
                                                                     setIsDragging(false);
                                                                     const file = e.dataTransfer.files?.[0];
                                                                     if (file) handleUploadMockup(file);
                                                                 }}
                                                                 className={cn(
                                                                     "flex flex-col items-center justify-center p-8 h-[300px] rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center",
                                                                     isDragging 
                                                                         ? "border-[#D25026] bg-[#D25026]/5 scale-[1.01]" 
                                                                         : "border-slate-200 bg-slate-50 hover:border-[#D25026] hover:bg-slate-100/50 shadow-sm"
                                                                 )}
                                                             >
                                                                 <input 
                                                                     type="file" 
                                                                     accept="image/*,application/pdf"
                                                                     onChange={handleUploadMockup}
                                                                     disabled={uploading}
                                                                     className="hidden"
                                                                     style={{ display: "none" }}
                                                                 />
                                                                 <div className="pointer-events-none w-10 h-10 rounded-xl bg-[#D25026]/10 flex items-center justify-center text-[#D25026] mb-3">
                                                                     <UploadCloud size={20} className="animate-pulse" />
                                                                 </div>
                                                                 <p className="pointer-events-none text-xs font-black uppercase tracking-widest text-slate-800">
                                                                     {uploading ? "Mengunggah..." : "Klik atau Tarik File Baru ke Sini"}
                                                                 </p>
                                                                 <p className="pointer-events-none text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                                                                     PNG, JPG, JPEG, atau PDF (Maks. 10MB)
                                                                 </p>
                                                             </label>
                                                         </div>
                                                     </div>
                                                 ) : (
                                                     <div className="relative w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-3 shadow-sm">
                                                         {selectedOrder.mockupUrl.toLowerCase().endsWith('.pdf') ? (
                                                             <div className="w-full h-48 bg-red-50 flex flex-col items-center justify-center rounded-xl">
                                                                 <FileText className="w-12 h-12 text-red-500 mb-3" />
                                                                 <a href={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} target="_blank" rel="noreferrer" className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">
                                                                     Buka Mockup (PDF)
                                                                 </a>
                                                             </div>
                                                         ) : (
                                                             <img 
                                                                 src={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} 
                                                                 alt="Mockup Design" 
                                                                 className="w-full h-auto max-h-[400px] object-contain mx-auto rounded-xl" 
                                                             />
                                                         )}
                                                     </div>
                                                 )}

                                                 {/* Action Buttons directly below the file mockup */}
                                                 {selectedOrder.status === "DESAIN" && selectedOrder.isWorking && (
                                                     <div className="flex flex-wrap items-center gap-3">
                                                         {selectedOrder.designStatus === "SENT" && (
                                                             <button 
                                                                 onClick={handleCancelMockup}
                                                                 className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-black uppercase tracking-widest italic border border-red-200 transition-colors"
                                                             >
                                                                 Batalkan Kirim Mockup
                                                             </button>
                                                         )}
                                                         {uploading && <p className="text-xs font-bold text-[#D25026] italic animate-pulse">Sedang mengupload...</p>}
                                                     </div>
                                                 )}

                                                 <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-50">
                                                     <div className="flex items-center gap-3">
                                                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic pr-1">Status Persetujuan:</span>
                                                         {selectedOrder.designStatus === "SENT" && (
                                                             <span className="bg-amber-50 text-amber-700 border-amber-200 border px-3 py-1 rounded-lg text-xs font-black italic pr-1">
                                                                 Menunggu Persetujuan Customer
                                                             </span>
                                                         )}
                                                         {selectedOrder.designStatus === "APPROVED" && (
                                                             <span className="bg-emerald-50 text-emerald-700 border-emerald-200 border px-3 py-1 rounded-lg text-xs font-black italic pr-1">
                                                                 Disetujui
                                                             </span>
                                                         )}
                                                         {selectedOrder.designStatus === "REVISI" && (
                                                             <span className="bg-red-50 text-red-700 border-red-200 border px-3 py-1 rounded-lg text-xs font-black italic pr-1">
                                                                 Revisi Diminta
                                                             </span>
                                                         )}
                                                     </div>
                                                 </div>
                                                 {selectedOrder.designStatus === "REVISI" && selectedOrder.designFeedback && (
                                                     <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 space-y-1">
                                                         <p className="text-[9px] font-black text-red-600 uppercase tracking-widest italic">Catatan Revisi Customer:</p>
                                                         <p className="text-xs text-red-700 font-bold leading-relaxed italic pr-1">{selectedOrder.designFeedback}</p>
                                                     </div>
                                                 )}
                                             </div>
                                        </div>
                                    ) : (
                                        selectedOrder.status === "DESAIN" && (selectedOrder.designStatus === "PENDING" || selectedOrder.designStatus === "REVISI") ? (
                                            <div className="space-y-2">
                                                <label 
                                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                                    onDragLeave={() => setIsDragging(false)}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging(false);
                                                        const file = e.dataTransfer.files?.[0];
                                                        if (file) handleUploadMockup(file);
                                                    }}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-12 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer text-center",
                                                        isDragging 
                                                            ? "border-[#D25026] bg-[#D25026]/5 scale-[1.01]" 
                                                            : "border-slate-200 bg-slate-50 hover:border-[#D25026] hover:bg-slate-100/50 shadow-sm ring-1 ring-black/5"
                                                    )}
                                                >
                                                    <input 
                                                        type="file" 
                                                        accept="image/*,application/pdf"
                                                        onChange={handleUploadMockup}
                                                        disabled={uploading}
                                                        className="hidden"
                                                        style={{ display: "none" }}
                                                    />
                                                    <div className="pointer-events-none w-12 h-12 rounded-2xl bg-[#D25026]/10 flex items-center justify-center text-[#D25026] mb-3 group-hover:scale-110 transition-transform">
                                                        <UploadCloud size={24} className="animate-pulse" />
                                                    </div>
                                                    <p className="pointer-events-none text-xs font-black uppercase tracking-widest text-slate-800">
                                                        {uploading ? "Mengunggah..." : "Klik atau Tarik File ke Sini untuk Upload Mockup"}
                                                    </p>
                                                    <p className="pointer-events-none text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                                                        PNG, JPG, JPEG, atau PDF (Maks. 10MB)
                                                    </p>
                                                </label>
                                                {uploading && <p className="text-xs font-bold text-[#D25026] italic mt-2 animate-pulse text-center">Sedang mengupload file...</p>}
                                            </div>
                                        ) : (
                                            <div className="w-full h-32 bg-slate-50 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-slate-200">
                                                <p className="text-xs font-bold text-slate-400 italic uppercase tracking-widest">Belum ada mockup diupload</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {/* Mockup Layout Pola Cetak Section */}
                            {(selectedOrder.status === "LAYOUT" || selectedOrder.layoutUrl) && (
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 mb-6 flex items-center gap-3 italic">
                                        <ImageIcon className="text-[#D25026]" size={16} />
                                        Mockup Layout Pola Cetak
                                    </h3>
                                    {selectedOrder.layoutUrl ? (
                                        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5 space-y-6">
                                             <div className="space-y-4">
                                                 {selectedOrder.status === "LAYOUT" && selectedOrder.layoutStatus === "REVISI" ? (
                                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                         {/* Kolom Kiri: Layout Sebelumnya */}
                                                         <div className="space-y-3">
                                                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Layout Sebelumnya</p>
                                                             <div className="relative w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-3 shadow-sm">
                                                                 {selectedOrder.layoutUrl.toLowerCase().endsWith('.pdf') ? (
                                                                     <div className="w-full h-48 bg-red-50 flex flex-col items-center justify-center rounded-xl">
                                                                         <FileText className="w-12 h-12 text-red-500 mb-3" />
                                                                         <a href={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} target="_blank" rel="noreferrer" className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">
                                                                             Buka Layout (PDF)
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

                                                         {/* Kolom Kanan: Dropzone Baru */}
                                                         <div className="space-y-3">
                                                             <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Upload Layout Baru</p>
                                                             <label 
                                                                 onDragOver={(e) => {
                                                                     e.preventDefault();
                                                                     setIsDragging(true);
                                                                 }}
                                                                 onDragLeave={() => setIsDragging(false)}
                                                                 onDrop={(e) => {
                                                                     e.preventDefault();
                                                                     setIsDragging(false);
                                                                     const file = e.dataTransfer.files?.[0];
                                                                     if (file) handleUploadLayout(file);
                                                                 }}
                                                                 className={cn(
                                                                     "flex flex-col items-center justify-center p-8 h-[300px] rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center",
                                                                     isDragging 
                                                                         ? "border-[#D25026] bg-[#D25026]/5 scale-[1.01]" 
                                                                         : "border-slate-200 bg-slate-50 hover:border-[#D25026] hover:bg-slate-100/50 shadow-sm"
                                                                 )}
                                                             >
                                                                 <input 
                                                                     type="file" 
                                                                     accept="image/*,application/pdf"
                                                                     onChange={handleUploadLayout}
                                                                     disabled={uploading}
                                                                     className="hidden"
                                                                     style={{ display: "none" }}
                                                                 />
                                                                 <div className="pointer-events-none w-10 h-10 rounded-xl bg-[#D25026]/10 flex items-center justify-center text-[#D25026] mb-3">
                                                                     <UploadCloud size={20} className="animate-pulse" />
                                                                 </div>
                                                                 <p className="pointer-events-none text-xs font-black uppercase tracking-widest text-slate-800">
                                                                     {uploading ? "Mengunggah..." : "Klik atau Tarik File Baru ke Sini"}
                                                                 </p>
                                                                 <p className="pointer-events-none text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                                                                     PNG, JPG, JPEG, atau PDF (Maks. 10MB)
                                                                 </p>
                                                             </label>
                                                         </div>
                                                     </div>
                                                 ) : (
                                                     <div className="relative w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-3 shadow-sm">
                                                         {selectedOrder.layoutUrl.toLowerCase().endsWith('.pdf') ? (
                                                             <div className="w-full h-48 bg-red-50 flex flex-col items-center justify-center rounded-xl">
                                                                 <FileText className="w-12 h-12 text-red-500 mb-3" />
                                                                 <a href={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} target="_blank" rel="noreferrer" className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">
                                                                     Buka Layout (PDF)
                                                                 </a>
                                                             </div>
                                                         ) : (
                                                             <img 
                                                                 src={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} 
                                                                 alt="Mockup Layout" 
                                                                 className="w-full h-auto max-h-[400px] object-contain mx-auto rounded-xl" 
                                                             />
                                                         )}
                                                     </div>
                                                 )}

                                                 {/* Action Buttons directly below the file layout */}
                                                 {selectedOrder.status === "LAYOUT" && (
                                                     <div className="flex flex-wrap items-center gap-3">
                                                         {selectedOrder.layoutStatus === "SENT" && (
                                                             <button 
                                                                 onClick={handleCancelLayout}
                                                                 className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-black uppercase tracking-widest italic border border-red-200 transition-colors"
                                                             >
                                                                 Batalkan Kirim Layout
                                                             </button>
                                                         )}
                                                         {uploading && <p className="text-xs font-bold text-[#D25026] italic animate-pulse">Sedang mengupload...</p>}
                                                     </div>
                                                 )}

                                                 <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-50">
                                                     <div className="flex items-center gap-3">
                                                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic pr-1">Status Persetujuan Layout:</span>
                                                         {selectedOrder.layoutStatus === "SENT" && (
                                                             <span className="bg-amber-50 text-amber-700 border-amber-200 border px-3 py-1 rounded-lg text-xs font-black italic pr-1">
                                                                 Menunggu Persetujuan Customer
                                                             </span>
                                                         )}
                                                         {selectedOrder.layoutStatus === "APPROVED" && (
                                                             <span className="bg-emerald-50 text-emerald-700 border-emerald-200 border px-3 py-1 rounded-lg text-xs font-black italic pr-1">
                                                                 Disetujui
                                                             </span>
                                                         )}
                                                         {selectedOrder.layoutStatus === "REVISI" && (
                                                             <span className="bg-red-50 text-red-700 border-red-200 border px-3 py-1 rounded-lg text-xs font-black italic pr-1">
                                                                 Revisi Diminta
                                                             </span>
                                                         )}
                                                     </div>
                                                 </div>
                                                 {selectedOrder.layoutStatus === "REVISI" && selectedOrder.layoutFeedback && (
                                                     <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 space-y-1">
                                                         <p className="text-[9px] font-black text-red-600 uppercase tracking-widest italic">Catatan Revisi Layout Customer:</p>
                                                         <p className="text-xs text-red-700 font-bold leading-relaxed italic pr-1">{selectedOrder.layoutFeedback}</p>
                                                     </div>
                                                 )}
                                             </div>
                                        </div>
                                    ) : (
                                        selectedOrder.status === "LAYOUT" && (selectedOrder.layoutStatus === "PENDING" || selectedOrder.layoutStatus === "REVISI") ? (
                                            <div className="space-y-2">
                                                <label 
                                                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                                                    onDragLeave={() => setIsDragging(false)}
                                                    onDrop={(e) => {
                                                        e.preventDefault();
                                                        setIsDragging(false);
                                                        const file = e.dataTransfer.files?.[0];
                                                        if (file) handleUploadLayout(file);
                                                    }}
                                                    className={cn(
                                                        "flex flex-col items-center justify-center p-12 rounded-[2rem] border-2 border-dashed transition-all cursor-pointer text-center",
                                                        isDragging 
                                                            ? "border-[#D25026] bg-[#D25026]/5 scale-[1.01]" 
                                                            : "border-slate-200 bg-slate-50 hover:border-[#D25026] hover:bg-slate-100/50 shadow-sm ring-1 ring-black/5"
                                                    )}
                                                >
                                                    <input 
                                                        type="file" 
                                                        accept="image/*,application/pdf"
                                                        onChange={handleUploadLayout}
                                                        disabled={uploading}
                                                        className="hidden"
                                                        style={{ display: "none" }}
                                                    />
                                                    <div className="pointer-events-none w-12 h-12 rounded-2xl bg-[#D25026]/10 flex items-center justify-center text-[#D25026] mb-3 group-hover:scale-110 transition-transform">
                                                        <UploadCloud size={24} className="animate-pulse" />
                                                    </div>
                                                    <p className="pointer-events-none text-xs font-black uppercase tracking-widest text-slate-800">
                                                        {uploading ? "Mengunggah..." : "Klik atau Tarik File ke Sini untuk Upload Layout"}
                                                    </p>
                                                    <p className="pointer-events-none text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                                                        PNG, JPG, JPEG, atau PDF (Maks. 10MB)
                                                    </p>
                                                </label>
                                                {uploading && <p className="text-xs font-bold text-[#D25026] italic mt-2 animate-pulse text-center">Sedang mengupload file...</p>}
                                            </div>
                                        ) : (
                                            <div className="w-full h-32 bg-slate-50 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-slate-200">
                                                <p className="text-xs font-bold text-slate-400 italic uppercase tracking-widest">Belum ada layout diupload</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}

                            {/* Daftar Nama & Nomor (Bottom) */}
                            <div>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                        <User className="text-[#D25026]" size={16} />
                                        Daftar Nama & Nomor
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
                                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Nama</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Nomor</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Ukuran</th>
                                                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Lengan</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-50 text-sm bg-white">
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
                                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                            <td className="px-6 py-4 font-black text-slate-800 uppercase italic">{player.name}</td>
                                                            <td className="px-6 py-4 text-center font-black text-[#D25026] text-lg">{player.number}</td>
                                                            <td className="px-6 py-4 text-center">
                                                                <span className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-black italic">{sizeOnly}</span>
                                                            </td>
                                                            <td className="px-6 py-4 text-center text-xs font-medium text-slate-600">
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

                        <div className="p-10 border-t border-slate-100 bg-white flex justify-end gap-4">
                            <button 
                                onClick={() => window.location.href = `/desain/chat?userId=${selectedOrder.customerId}&orderId=${selectedOrder.id}`}
                                className="px-8 py-5 bg-slate-900 text-white rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center gap-3 italic"
                            >
                                <MessageCircle size={16} />
                                Chat Customer
                            </button>
                            {selectedOrder.status === "DESAIN" && (
                                selectedOrder.isWorking ? (
                                    <button 
                                        onClick={() => handleUpdateStatus(selectedOrder.rawId, "LAYOUT")}
                                        disabled={selectedOrder.designStatus !== "APPROVED"}
                                        className="px-12 py-5 bg-amber-100 text-amber-800 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-amber-200 transition-all border border-amber-200 italic disabled:opacity-50 disabled:cursor-not-allowed"
                                        title={selectedOrder.designStatus !== "APPROVED" ? "Menunggu persetujuan mockup desain dari customer" : "Lanjut ke proses layout"}
                                    >
                                        Selesai Desain & Lanjut Layout
                                    </button>
                                ) : (
                                    <button 
                                        onClick={() => handleUpdateStatus(selectedOrder.rawId, "DESAIN", true)}
                                        className="px-12 py-5 bg-[#D25026] text-slate-900 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-[#B34320] transition-all shadow-xl shadow-[#D25026]/20 italic"
                                    >
                                        Mulai Kerja
                                    </button>
                                )
                            )}
                            {selectedOrder.status === "LAYOUT" && (
                                <button 
                                    onClick={() => handleUpdateStatus(selectedOrder.rawId, "PRINT")}
                                    disabled={selectedOrder.layoutStatus !== "APPROVED"}
                                    className="px-12 py-5 bg-cyan-100 text-cyan-800 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-cyan-200 transition-all border border-cyan-200 italic disabled:opacity-50 disabled:cursor-not-allowed"
                                    title={selectedOrder.layoutStatus !== "APPROVED" ? "Menunggu persetujuan layout dari customer" : "Lanjut ke proses cetak/print"}
                                >
                                    Selesai Layout & Lanjut Print
                                </button>
                            )}
                            {selectedOrder.status === "PRINT" && (
                                <button 
                                    onClick={() => handleUpdateStatus(selectedOrder.rawId, "FINISHING")}
                                    className="px-12 py-5 bg-blue-100 text-blue-800 rounded-[1.5rem] text-xs font-black uppercase tracking-widest hover:bg-blue-200 transition-all border border-blue-200 italic"
                                >
                                    Selesai Print & Lanjut Finishing
                                </button>
                            )}
                            {selectedOrder.status === "FINISHING" && (
                                <div className="px-8 py-5 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-[1.5rem] text-xs font-black uppercase tracking-widest italic flex items-center justify-center">
                                    Pesanan diserahkan ke tim gudang untuk packing & finishing
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                {/* Modals & Toasts */}
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
                                    className="px-6 py-3 bg-[#D25026] hover:bg-[#B34320] text-slate-900 rounded-xl text-xs font-semibold transition-all shadow-md shadow-[#D25026]/20"
                                >
                                    Ya, Lanjutkan
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {toast && (
                    <Toast 
                        title={toast.title} 
                        variant={toast.variant} 
                        onClose={() => setToast(null)} 
                    />
                )}
                {windowDragging && (
                    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[9999] flex flex-col items-center justify-center p-8 animate-in fade-in duration-300">
                        <div className="max-w-md w-full border-4 border-dashed border-[#D25026]/65 rounded-[2.5rem] p-12 bg-slate-900/50 flex flex-col items-center justify-center text-center space-y-6 transform scale-100 transition-transform animate-in zoom-in-95 duration-300">
                            <div className="w-20 h-20 rounded-full bg-[#D25026]/10 flex items-center justify-center text-[#D25026] animate-bounce">
                                <UploadCloud size={48} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black italic uppercase tracking-wider text-white">
                                    Lepaskan File {selectedOrder?.status === "LAYOUT" ? "Layout" : "Mockup"}
                                </h3>
                                <p className="text-sm font-medium text-slate-300">
                                    Tarik file Anda ke sini untuk langsung mengunggah {selectedOrder?.status === "LAYOUT" ? "layout" : "mockup"} jersey.
                                </p>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                PNG, JPG, JPEG, atau PDF (Maks. 10MB)
                            </p>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[87.5rem] mx-auto space-y-8 font-geist">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">Management Pesanan</h1>
                    <p className="text-slate-500 mt-2 font-medium">Kelola pesanan yang telah diserahkan admin ke Anda.</p>
                </div>
            </div>

            {/* Filter and Search Section */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    {(["ALL", "WAITING", "PROCESSING", "COMPLETED"] as const).map((tab) => {
                        const labelMap = {
                            ALL: "Semua",
                            WAITING: "Menunggu Kerja",
                            PROCESSING: "Sedang Diproses",
                            COMPLETED: "Selesai"
                        };
                        const countMap = {
                            ALL: orders.length,
                            WAITING: orders.filter(o => o.status === "DESAIN" && !o.isWorking).length,
                            PROCESSING: orders.filter(o => (o.status === "DESAIN" && o.isWorking) || ["LAYOUT", "PRINT", "FINISHING"].includes(o.status)).length,
                            COMPLETED: orders.filter(o => o.status === "SELESAI").length
                        };
                        const isActive = filterTab === tab;
                        return (
                            <button
                                key={tab}
                                onClick={() => setFilterTab(tab)}
                                className={cn(
                                    "px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider italic transition-all",
                                    isActive ? "bg-white text-[#D25026] shadow-sm" : "text-slate-400 hover:text-slate-700"
                                )}
                            >
                                {labelMap[tab]} ({countMap[tab]})
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <input 
                        type="text"
                        placeholder="Cari ID, pelanggan, produk..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-[#D25026] transition-colors w-full md:w-64"
                    />
                    <Button 
                        onClick={() => setSearchQuery(searchInput)}
                        className="bg-[#D25026] text-slate-900 font-bold italic uppercase tracking-widest text-xs h-[2.75rem] px-6 rounded-xl hover:bg-[#B34320] transition-colors"
                    >
                        Search
                    </Button>
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
                            ) : sortedOrders.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-16 text-center text-slate-400 font-medium">Tidak ada pesanan yang sesuai dengan filter/pencarian.</td>
                                </tr>
                            ) : (
                                sortedOrders.map((order) => (
                                    <tr key={order.rawId} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedOrder(order)}>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <p className="font-bold text-slate-900 font-mono text-sm group-hover:text-[#D25026] transition-colors">{order.id}</p>
                                                {order.queueNumber && (
                                                    <span className="bg-[#D25026]/10 text-[#D25026] px-2 py-0.5 rounded text-[10px] font-black uppercase italic border border-[#D25026]/20">
                                                        Antrean: {order.queueNumber}
                                                    </span>
                                                )}
                                            </div>
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
                                            <div className="flex flex-col items-center gap-1.5 justify-center">
                                                <span className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest border uppercase inline-block", getStatusStyle(order.status))}>
                                                    {order.status}
                                                </span>
                                                {order.status === "DESAIN" && (
                                                    order.isWorking ? (
                                                        <span className="bg-purple-100 text-purple-800 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider animate-pulse border border-purple-200">
                                                            Sedang Dikerjakan
                                                        </span>
                                                    ) : (
                                                        <span className="bg-slate-100 text-slate-500 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider border border-slate-200">
                                                            Belum Mulai Kerja
                                                        </span>
                                                    )
                                                )}
                                            </div>
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
            {/* Modals & Toasts */}
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
                                className="px-6 py-3 bg-[#D25026] hover:bg-[#B34320] text-slate-900 rounded-xl text-xs font-semibold transition-all shadow-md shadow-[#D25026]/20"
                            >
                                Ya, Lanjutkan
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {toast && (
                <Toast 
                    title={toast.title} 
                    variant={toast.variant} 
                    onClose={() => setToast(null)} 
                />
            )}
        </div>
    );
}
