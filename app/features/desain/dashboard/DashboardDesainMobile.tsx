import { useState, useEffect, useRef } from "react";
import { Clock, Eye, Package, ChevronLeft, Image as ImageIcon, MessageCircle, FileText, User } from "lucide-react";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { UPLOADS_URL } from "~/api/client";
import { useAuth } from "~/hooks/useAuth";
import { sortPlayersBySize, downloadPlayersPDF } from "~/lib/sizeUtils";
import { Button } from "~/components/ui/button";
import { Toast } from "~/components/ui/toast";

export function DashboardDesainMobile() {
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
                    totalAmount: o.totalAmount,
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
                            <div className="flex items-center gap-2">
                                <span className={cn("px-3 py-1 rounded-lg text-[8px] font-black tracking-widest border uppercase w-fit", getStatusStyle(selectedOrder.status))}>
                                    {selectedOrder.status}
                                </span>
                                {selectedOrder.queueNumber && (
                                    <span className="bg-[#D25026]/10 text-[#D25026] px-2 py-0.5 rounded text-[8px] font-black uppercase italic border border-[#D25026]/20">
                                        Antrean: {selectedOrder.queueNumber}
                                    </span>
                                )}
                            </div>
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

                    {/* Mockup Hasil Desain Card Mobile */}
                    {selectedOrder.isWorking && (
                        <div className="space-y-3">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                                <ImageIcon className="text-[#D25026]" size={14} /> Mockup Hasil Desain
                            </h3>
                                {selectedOrder.mockupUrl ? (
                                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                                        <div className="space-y-3">
                                            <div 
                                                onDragOver={(e) => {
                                                    if (selectedOrder.status === "DESAIN" && selectedOrder.designStatus === "REVISI") {
                                                        e.preventDefault();
                                                        setIsDragging(true);
                                                    }
                                                }}
                                                onDragLeave={() => setIsDragging(false)}
                                                onDrop={(e) => {
                                                    if (selectedOrder.status === "DESAIN" && selectedOrder.designStatus === "REVISI") {
                                                        e.preventDefault();
                                                        setIsDragging(false);
                                                        const file = e.dataTransfer.files?.[0];
                                                        if (file) handleUploadMockup(file);
                                                    }
                                                }}
                                                className={cn(
                                                    "relative w-full bg-slate-550 rounded-2xl overflow-hidden border transition-all",
                                                    isDragging && selectedOrder.status === "DESAIN" && selectedOrder.designStatus === "REVISI"
                                                        ? "border-[#D25026] ring-2 ring-[#D25026]/20"
                                                        : "border-slate-100"
                                                )}
                                            >
                                                {/* Drag overlay for REVISI upload */}
                                                {isDragging && selectedOrder.status === "DESAIN" && selectedOrder.designStatus === "REVISI" && (
                                                    <div className="absolute inset-0 bg-[#D25026]/90 backdrop-blur-sm flex flex-col items-center justify-center text-slate-900 p-4 z-10 transition-all">
                                                        <ImageIcon className="w-10 h-10 mb-2 animate-bounce" />
                                                        <p className="text-[10px] font-black uppercase tracking-widest text-center">Lepaskan untuk Upload Baru</p>
                                                    </div>
                                                )}

                                                {selectedOrder.mockupUrl.toLowerCase().endsWith('.pdf') ? (
                                                    <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-100 gap-4">
                                                        <FileText size={32} className="text-red-500" />
                                                        <a 
                                                            href={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="px-6 py-3 bg-red-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 italic"
                                                        >
                                                            Buka Mockup (PDF)
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <img 
                                                        src={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl}`} 
                                                        alt="Mockup Design" 
                                                        className="w-full h-auto max-h-[250px] object-contain mx-auto" 
                                                    />
                                                )}
                                            </div>

                                            {/* Action Buttons directly below the file mockup */}
                                            {selectedOrder.status === "DESAIN" && selectedOrder.isWorking && (
                                                <div className="flex flex-col gap-2">
                                                    {selectedOrder.designStatus === "SENT" && (
                                                        <button 
                                                            onClick={handleCancelMockup}
                                                            className="w-full py-2.5 bg-red-50 active:bg-red-100 text-red-700 rounded-xl text-[9px] font-black uppercase tracking-widest italic border border-red-200 transition-colors"
                                                        >
                                                            Batalkan Kirim Mockup
                                                        </button>
                                                    )}
                                                    {selectedOrder.designStatus === "REVISI" && (
                                                        <>
                                                            <input 
                                                                type="file" 
                                                                ref={fileInputRef} 
                                                                onChange={handleUploadMockup} 
                                                                className="hidden" 
                                                                accept="image/*,application/pdf"
                                                            />
                                                            <button 
                                                                onClick={() => fileInputRef.current?.click()}
                                                                className="w-full py-2.5 bg-amber-500 active:bg-amber-600 text-slate-900 rounded-xl text-[9px] font-black uppercase tracking-widest italic transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-500/10"
                                                            >
                                                                <ImageIcon size={12} />
                                                                Upload Mockup Baru
                                                            </button>
                                                            {uploading && <p className="text-[9px] font-bold text-[#D25026] italic animate-pulse text-center">Sedang mengupload...</p>}
                                                        </>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex flex-col gap-3 pt-1 border-t border-slate-50">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic pr-1">Persetujuan:</span>
                                                    {selectedOrder.designStatus === "SENT" && (
                                                        <span className="bg-amber-50 text-amber-700 border-amber-200 border px-2 py-0.5 rounded text-[8px] font-black italic pr-1">
                                                            Menunggu Persetujuan Customer
                                                        </span>
                                                    )}
                                                    {selectedOrder.designStatus === "APPROVED" && (
                                                        <span className="bg-emerald-50 text-emerald-700 border-emerald-200 border px-2 py-0.5 rounded text-[8px] font-black italic pr-1">
                                                            Disetujui
                                                        </span>
                                                    )}
                                                    {selectedOrder.designStatus === "REVISI" && (
                                                        <span className="bg-red-50 text-red-700 border-red-200 border px-2 py-0.5 rounded text-[8px] font-black italic pr-1">
                                                            Revisi Diminta
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            {selectedOrder.designStatus === "REVISI" && selectedOrder.designFeedback && (
                                                <div className="bg-red-50/50 p-3 rounded-lg border border-red-100">
                                                    <p className="text-[7px] font-black text-red-600 uppercase tracking-widest italic mb-0.5">Catatan Revisi:</p>
                                                    <p className="text-[10px] text-red-700 font-bold leading-relaxed italic pr-1">{selectedOrder.designFeedback}</p>
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
                                                    "flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center",
                                                    isDragging 
                                                        ? "border-[#D25026] bg-[#D25026]/5" 
                                                        : "border-slate-200 bg-white active:border-[#D25026] active:bg-slate-50/50 shadow-sm"
                                                )}
                                            >
                                                <input 
                                                    type="file" 
                                                    accept="image/*,application/pdf"
                                                    onChange={handleUploadMockup}
                                                    disabled={uploading}
                                                    className="sr-only"
                                                />
                                                <div className="pointer-events-none w-10 h-10 rounded-xl bg-[#D25026]/10 flex items-center justify-center text-[#D25026] mb-2">
                                                    <ImageIcon size={20} />
                                                </div>
                                                <p className="pointer-events-none text-[10px] font-black uppercase tracking-widest text-slate-800">
                                                    {uploading ? "Mengunggah..." : "Klik / Tarik Mockup ke Sini untuk Upload"}
                                                </p>
                                                <p className="pointer-events-none text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                                                    PNG, JPG, JPEG, atau PDF (Maks. 10MB)
                                                </p>
                                            </label>
                                            {uploading && <p className="text-[9px] font-bold text-[#D25026] italic mt-1 animate-pulse text-center">Sedang mengupload...</p>}
                                        </div>
                                    ) : (
                                        <div className="w-full h-20 bg-slate-50 rounded-xl flex items-center justify-center border border-dashed border-slate-100">
                                            <p className="text-[8px] font-bold text-slate-300 italic uppercase">Belum ada mockup diupload</p>
                                        </div>
                                    )
                                )}
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                                <User className="text-[#D25026]" size={14} /> Daftar Nama & Nomor
                            </h3>
                            <button 
                                onClick={() => downloadPlayersPDF(selectedOrder)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-100 rounded-lg text-[7px] font-black uppercase tracking-widest italic shadow-sm"
                            >
                                <FileText size={10} className="text-[#D25026]" />
                                PDF
                            </button>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
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
                </div>

                <div className="p-6 bg-white border-t border-slate-100 flex flex-col gap-3 fixed bottom-0 left-0 right-0 z-50">
                    <button 
                        onClick={() => window.location.href = `/desain/chat?userId=${selectedOrder.customerId}`}
                        className="w-full h-12 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest italic flex items-center justify-center gap-2 shadow-lg"
                    >
                        <MessageCircle size={14} /> Chat Customer
                    </button>
                    {selectedOrder.status === "DESAIN" && selectedOrder.isWorking && selectedOrder.designStatus === "SENT" && (
                        <button 
                            onClick={handleCancelMockup}
                            className="w-full h-12 bg-red-100 text-red-800 rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-red-200"
                        >
                            Batalkan Kirim Mockup
                        </button>
                    )}
                    <div className="flex gap-2">
                        {selectedOrder.status === "DESAIN" && (
                            selectedOrder.isWorking ? (
                                <button 
                                    onClick={() => handleUpdateStatus(selectedOrder.rawId, "LAYOUT")}
                                    disabled={selectedOrder.designStatus !== "APPROVED"}
                                    className="flex-1 h-12 bg-amber-400 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-amber-500/20 disabled:opacity-50"
                                >
                                    Lanjut Layout
                                </button>
                            ) : (
                                <button 
                                    onClick={() => handleUpdateStatus(selectedOrder.rawId, "DESAIN", true)}
                                    className="flex-1 h-12 bg-[#D25026] text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-[#D25026]/20"
                                >
                                    Mulai Kerja
                                </button>
                            )
                        )}
                        {selectedOrder.status === "LAYOUT" && (
                            <button 
                                onClick={() => handleUpdateStatus(selectedOrder.rawId, "PRINT")}
                                className="flex-1 h-12 bg-cyan-400 text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest italic shadow-lg shadow-cyan-500/20"
                            >
                                Lanjut Print
                            </button>
                        )}
                        {selectedOrder.status === "PRINT" && (
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
                {/* Modals & Toasts */}
                {confirmModal.isOpen && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-[2rem] max-w-sm w-full p-6 border border-slate-100 shadow-2xl space-y-6 transform animate-in zoom-in-95 duration-200">
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-slate-900">{confirmModal.title}</h3>
                                <p className="text-xs font-normal text-slate-500 leading-relaxed">{confirmModal.message}</p>
                            </div>
                            <div className="flex justify-end gap-3 pt-2">
                                <button 
                                    onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-all"
                                >
                                    Batal
                                </button>
                                <button 
                                    onClick={confirmModal.onConfirm}
                                    className="px-4 py-2 bg-[#D25026] hover:bg-[#B34320] text-slate-900 rounded-lg text-xs font-semibold transition-all shadow-md shadow-[#D25026]/20"
                                >
                                    Ya
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

    return (
        <div className="min-h-screen bg-slate-50 font-geist pb-20">
            <div className="bg-white px-6 pt-12 pb-6 border-b border-slate-100 sticky top-0 z-40">
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">Management Pesanan</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Kelola tugas desain Anda</p>
            </div>

            {/* Mobile Filter & Search Section */}
            <div className="p-6 space-y-4 bg-white border-b border-slate-100 shadow-sm">
                <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none gap-1">
                    {(["ALL", "WAITING", "PROCESSING", "COMPLETED"] as const).map((tab) => {
                        const labelMap = {
                            ALL: "Semua",
                            WAITING: "Menunggu",
                            PROCESSING: "Diproses",
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
                                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider italic transition-all shrink-0",
                                    isActive ? "bg-white text-[#D25026] shadow-sm" : "text-slate-400 hover:text-slate-700"
                                )}
                            >
                                {labelMap[tab]} ({countMap[tab]})
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-2 w-full">
                    <input 
                        type="text"
                        placeholder="Cari ID, pelanggan..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-2 text-xs font-medium focus:outline-none focus:border-[#D25026] transition-colors flex-1"
                    />
                    <Button 
                        onClick={() => setSearchQuery(searchInput)}
                        className="bg-[#D25026] text-slate-900 font-bold italic uppercase tracking-widest text-[10px] h-[2.25rem] px-4 rounded-xl hover:bg-[#B34320] transition-colors"
                    >
                        Search
                    </Button>
                </div>
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
                ) : sortedOrders.length === 0 ? (
                    <div className="py-12 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <p className="text-sm font-bold text-slate-400">Tidak ada pesanan yang sesuai filter.</p>
                    </div>
                ) : (
                    sortedOrders.map(order => (
                        <div key={order.rawId} 
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm active:scale-[0.98] transition-transform"
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-slate-900 text-sm font-mono">{order.id}</p>
                                        {order.queueNumber && (
                                            <span className="bg-[#D25026]/10 text-[#D25026] px-1.5 py-0.5 rounded text-[8px] font-black uppercase italic border border-[#D25026]/20">
                                                Antrean: {order.queueNumber}
                                            </span>
                                        )}
                                    </div>
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
            {/* Modals & Toasts */}
            {confirmModal.isOpen && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] max-w-sm w-full p-6 border border-slate-100 shadow-2xl space-y-6 transform animate-in zoom-in-95 duration-200">
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-slate-900">{confirmModal.title}</h3>
                            <p className="text-xs font-normal text-slate-500 leading-relaxed">{confirmModal.message}</p>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button 
                                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-all"
                            >
                                Batal
                            </button>
                            <button 
                                onClick={confirmModal.onConfirm}
                                className="px-4 py-2 bg-[#D25026] hover:bg-[#B34320] text-slate-900 rounded-lg text-xs font-semibold transition-all shadow-md shadow-[#D25026]/20"
                            >
                                Ya
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
