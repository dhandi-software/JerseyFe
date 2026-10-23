import { 
    ChevronLeft, 
    Copy, 
    Printer, 
    Loader2, 
    Clock, 
    AlertCircle, 
    Image as ImageIcon, 
    CreditCard, 
    FileText, 
    Upload, 
    Eye, 
    CheckCircle, 
    Truck, 
    User 
} from "lucide-react";
import { cn } from "~/lib/utils";
import { UPLOADS_URL } from "~/api/client";
import { Toast } from "~/components/ui/toast";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { CustomSelect } from "~/components/ui/custom-select";
import { downloadPlayersPDF } from "~/lib/sizeUtils";
import { getStatusStyle } from "../utils";
import type { MonitoringOrder, BahanItem, DesignerItem, ToastState } from "~/types";

interface OrderDetailViewMobileProps {
    selectedOrder: MonitoringOrder;
    onClose: () => void;
    toast: ToastState | null;
    onCloseToast: () => void;
    bahanList: BahanItem[];
    designers: DesignerItem[];
    isRecommendModalOpen: boolean;
    setIsRecommendModalOpen: (open: boolean) => void;
    tempRecommendedIds: number[];
    setTempRecommendedIds: React.Dispatch<React.SetStateAction<number[]>>;
    handleSendRecommendations: () => Promise<void>;
    isPrinting: boolean;
    handlePrintInvoice: () => Promise<void>;
    isUploadingProof: boolean;
    handleUploadProof: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    isUploadingPrint: boolean;
    handleUploadPrint: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    isUploadingFinishing: boolean;
    handleUploadFinishing: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    handleUpdateStatus: (id: number, newStatus: string, designerId?: number) => Promise<void>;
    handleApproveDesign: (id: number) => Promise<void>;
    handleRevisiDesign: (id: number, feedback: string) => Promise<void>;
    handleApproveLayout: (id: number) => Promise<void>;
    handleRevisiLayout: (id: number, feedback: string) => Promise<void>;
    isAssignModalOpen: boolean;
    setIsAssignModalOpen: (open: boolean) => void;
    selectedDesignerId: number | "";
    setSelectedDesignerId: (id: number | "") => void;
    orderToAssign: number | null;
    setOrderToAssign: (id: number | null) => void;
}

export function OrderDetailViewMobile({
    selectedOrder,
    onClose,
    toast,
    onCloseToast,
    bahanList,
    designers,
    isRecommendModalOpen,
    setIsRecommendModalOpen,
    tempRecommendedIds,
    setTempRecommendedIds,
    handleSendRecommendations,
    isPrinting,
    handlePrintInvoice,
    isUploadingProof,
    handleUploadProof,
    isUploadingPrint,
    handleUploadPrint,
    isUploadingFinishing,
    handleUploadFinishing,
    handleUpdateStatus,
    handleApproveDesign,
    handleRevisiDesign,
    handleApproveLayout,
    handleRevisiLayout,
    isAssignModalOpen,
    setIsAssignModalOpen,
    selectedDesignerId,
    setSelectedDesignerId,
    orderToAssign,
    setOrderToAssign
}: OrderDetailViewMobileProps) {
    const currentBahan = bahanList.find(b => b.id === selectedOrder.productId);
    const isBahanHabis = currentBahan?.status === "Habis";

    return (
        <div className="min-h-screen bg-white font-geist flex flex-col">
            {toast && (
                <div className="fixed top-4 left-4 right-4 z-[9999]">
                    <Toast title={toast.title} variant={toast.variant} onClose={onCloseToast} />
                </div>
            )}
            <div className="p-6 bg-white border-b border-slate-100 sticky top-0 z-50">
                <button 
                    onClick={onClose}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest italic mb-4 cursor-pointer"
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
                                className="p-1 text-slate-400 active:text-[#D25026] cursor-pointer"
                                title="Salin ID"
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
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Detail Pesanan</h1>
                    <button 
                        onClick={handlePrintInvoice}
                        disabled={isPrinting}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest italic flex items-center gap-1.5 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                    >
                        {isPrinting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Printer size={12} />}
                        Cetak
                    </button>
                </div>
                <div className="flex flex-col gap-1 mt-2">
                    <p className="text-[10px] font-bold text-[#D25026] uppercase italic">{selectedOrder.customer}</p>
                    {selectedOrder.isAdminOrder && (
                        <span className="bg-[#D25026]/10 text-[#D25026] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 w-max mt-2">
                            <User size={10} />
                            Dibuat oleh: Admin
                        </span>
                    )}
                </div>
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
                {isBahanHabis && (
                    <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex flex-col gap-4 shadow-sm">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
                                <AlertCircle className="text-red-600 w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-xs font-black uppercase tracking-wider text-red-900 leading-none mb-1">Bahan Terpilih Habis!</h4>
                                <p className="text-[10px] text-red-600 font-medium leading-relaxed">
                                    Bahan "{currentBahan?.nama}" saat ini habis/tidak tersedia. Berikan rekomendasi bahan alternatif agar customer dapat memilih bahan pengganti.
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
                                <Button className="w-full bg-slate-900 text-white rounded-xl h-12 font-black uppercase tracking-widest text-[10px] hover:bg-[#D25026] active:scale-95 transition-all shadow-md cursor-pointer">
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
                                        className="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg text-xs cursor-pointer"
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        onClick={handleSendRecommendations}
                                        className="px-4 py-2 bg-[#D25026] text-white font-bold rounded-lg text-xs cursor-pointer"
                                    >
                                        Kirim Rekomendasi
                                    </Button>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}

                {/* Referensi Desain */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                        <ImageIcon className="text-[#D25026]" size={14} /> Referensi Desain
                    </h3>
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                        {selectedOrder.designUrl ? (
                            <div className="w-full bg-slate-50 rounded-xl overflow-hidden relative border border-slate-200 flex items-center justify-center p-3 shadow-sm">
                                {selectedOrder.designUrl.toLowerCase().endsWith('.pdf') ? (
                                    <div className="w-full h-32 bg-red-50 flex flex-col items-center justify-center rounded-lg">
                                        <FileText className="w-10 h-10 text-red-500 mb-2" />
                                        <a href={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl.startsWith('/') ? '' : '/'}${selectedOrder.designUrl}`} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">
                                            Buka Referensi (PDF)
                                        </a>
                                    </div>
                                ) : (
                                    <img 
                                        src={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl.startsWith('/') ? '' : '/'}${selectedOrder.designUrl}`} 
                                        className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-lg" 
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

                {/* Bukti Pembayaran */}
                <div className="space-y-3">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                        <CreditCard className="text-[#D25026]" size={14} /> Bukti Pembayaran
                    </h3>
                    {selectedOrder.paymentProofUrl && selectedOrder.paymentProofUrl !== "MENUNGGU_PEMBAYARAN_ADMIN" ? (
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <div className="w-full bg-slate-50 rounded-xl overflow-hidden relative border border-slate-200 flex flex-col items-center justify-center p-3 shadow-sm group">
                                {selectedOrder.paymentProofUrl.toLowerCase().endsWith('.pdf') ? (
                                    <div className="w-full h-32 bg-emerald-50 flex flex-col items-center justify-center rounded-lg">
                                        <FileText className="w-10 h-10 text-emerald-500 mb-2" />
                                        <a href={selectedOrder.paymentProofUrl.startsWith('http') ? selectedOrder.paymentProofUrl : `${UPLOADS_URL}${selectedOrder.paymentProofUrl.startsWith('/') ? '' : '/'}${selectedOrder.paymentProofUrl}`} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700 underline">
                                            Buka Bukti (PDF)
                                        </a>
                                    </div>
                                ) : (
                                    <img 
                                        src={selectedOrder.paymentProofUrl.startsWith('http') ? selectedOrder.paymentProofUrl : `${UPLOADS_URL}${selectedOrder.paymentProofUrl.startsWith('/') ? '' : '/'}${selectedOrder.paymentProofUrl}`} 
                                        className="w-full h-auto max-h-[400px] object-contain mx-auto rounded-lg" 
                                    />
                                )}
                                {selectedOrder.status === "MENUNGGU" && (
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-active:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                                        <label className={`w-full bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform cursor-pointer ${isUploadingProof ? 'opacity-50' : 'hover:scale-105'}`}>
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
                        </div>
                    ) : (
                        <div className="w-full min-h-[6rem] bg-slate-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-100 p-4">
                            {selectedOrder.paymentProofUrl === "MENUNGGU_PEMBAYARAN_ADMIN" ? (
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                                        <Clock className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <p className="text-[8px] font-bold text-slate-600 italic uppercase tracking-widest mb-3">Menunggu Unggahan Admin</p>
                                    <label className={`w-full bg-[#D25026] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${isUploadingProof ? 'opacity-50' : 'hover:bg-[#B34320]'}`}>
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
                                <p className="text-[8px] font-bold text-slate-300 italic uppercase">Belum ada bukti bayar</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Progress Mockup Desain */}
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

                                    <div className="w-full bg-slate-50 rounded-xl overflow-hidden relative border border-slate-200 flex items-center justify-center p-3 shadow-sm">
                                        {selectedOrder.mockupUrl.toLowerCase().endsWith('.pdf') ? (
                                            <div className="w-full h-32 bg-red-50 flex flex-col items-center justify-center rounded-lg">
                                                <FileText className="w-10 h-10 text-red-500 mb-2" />
                                                <a href={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">
                                                    Buka Mockup (PDF)
                                                </a>
                                            </div>
                                        ) : (
                                            <img 
                                                src={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} 
                                                className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-lg" 
                                            />
                                        )}
                                    </div>
                                    {selectedOrder.isAdminOrder && selectedOrder.designStatus === "SENT" && (
                                        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                                            <Button 
                                                onClick={() => {
                                                    const feedback = prompt("Masukkan catatan revisi desain:");
                                                    if (feedback) handleRevisiDesign(selectedOrder.rawId, feedback);
                                                }}
                                                className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-2 py-2 rounded-lg text-[9px] font-bold transition-colors cursor-pointer"
                                            >
                                                Revisi (Admin)
                                            </Button>
                                            <Button 
                                                onClick={() => handleApproveDesign(selectedOrder.rawId)}
                                                className="flex-1 bg-[#D25026] text-white hover:bg-[#B34320] px-2 py-2 rounded-lg text-[9px] font-bold transition-colors cursor-pointer"
                                            >
                                                Setuju (Admin)
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-16 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-100">
                                    <p className="text-[8px] font-bold text-slate-300 italic uppercase">Belum ada mockup diupload</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Progress Layout Pola Cetak */}
                {(selectedOrder.status === "LAYOUT" || selectedOrder.layoutUrl) && (
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <ImageIcon className="text-[#D25026]" size={14} /> Progress Layout Pola Cetak
                        </h3>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            {selectedOrder.layoutUrl ? (
                                <div className="space-y-3">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Persetujuan Layout:</span>
                                        {selectedOrder.layoutStatus === "SENT" && (
                                            <span className="bg-amber-50 text-amber-700 border-amber-200 border px-2 py-0.5 rounded text-[8px] font-black italic">
                                                Menunggu Persetujuan Customer
                                            </span>
                                        )}
                                        {selectedOrder.layoutStatus === "APPROVED" && (
                                            <span className="bg-emerald-50 text-emerald-700 border-emerald-200 border px-2 py-0.5 rounded text-[8px] font-black italic">
                                                Disetujui
                                            </span>
                                        )}
                                        {selectedOrder.layoutStatus === "REVISI" && (
                                            <span className="bg-red-50 text-red-700 border-red-200 border px-2 py-0.5 rounded text-[8px] font-black italic">
                                                Revisi Diminta
                                            </span>
                                        )}
                                        {selectedOrder.layoutStatus === "PENDING" && (
                                            <span className="bg-slate-50 text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[8px] font-black italic">
                                                Belum Diupload
                                            </span>
                                        )}
                                    </div>

                                    {selectedOrder.layoutStatus === "REVISI" && selectedOrder.layoutFeedback && (
                                        <div className="bg-red-50/50 p-3 rounded-lg border border-red-100">
                                            <p className="text-[7px] font-black text-red-600 uppercase tracking-widest italic mb-0.5">Catatan Revisi Layout:</p>
                                            <p className="text-[10px] text-red-700 font-bold leading-relaxed italic">"{selectedOrder.layoutFeedback}"</p>
                                        </div>
                                    )}

                                    <div className="w-full bg-slate-50 rounded-xl overflow-hidden relative border border-slate-200 flex items-center justify-center p-3 shadow-sm">
                                        {selectedOrder.layoutUrl.toLowerCase().endsWith('.pdf') ? (
                                            <div className="w-full h-32 bg-red-50 flex flex-col items-center justify-center rounded-lg">
                                                <FileText className="w-10 h-10 text-red-500 mb-2" />
                                                <a href={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} target="_blank" rel="noreferrer" className="text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline">
                                                    Buka Layout (PDF)
                                                </a>
                                            </div>
                                        ) : (
                                            <img 
                                                src={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} 
                                                className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-lg" 
                                            />
                                        )}
                                    </div>
                                    {selectedOrder.isAdminOrder && selectedOrder.layoutStatus === "SENT" && (
                                        <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
                                            <Button 
                                                onClick={() => {
                                                    const feedback = prompt("Masukkan catatan revisi layout:");
                                                    if (feedback) handleRevisiLayout(selectedOrder.rawId, feedback);
                                                }}
                                                className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-2 py-2 rounded-lg text-[9px] font-bold transition-colors cursor-pointer"
                                            >
                                                Revisi (Admin)
                                            </Button>
                                            <Button 
                                                onClick={() => handleApproveLayout(selectedOrder.rawId)}
                                                className="flex-1 bg-[#D25026] text-white hover:bg-[#B34320] px-2 py-2 rounded-lg text-[9px] font-bold transition-colors cursor-pointer"
                                            >
                                                Setuju (Admin)
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="w-full h-16 bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-100">
                                    <p className="text-[8px] font-bold text-slate-300 italic uppercase">Belum ada layout diupload</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Progress Cetak (Print) */}
                {(["PRINT", "FINISHING", "SELESAI"].includes(selectedOrder.status) || selectedOrder.printUrl) && (
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <Printer className="text-[#D25026]" size={14} /> Progress Cetak (Print)
                        </h3>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            {selectedOrder.printUrl ? (
                                <div className="w-full bg-slate-50 rounded-xl overflow-hidden relative border border-slate-200 flex items-center justify-center p-3 shadow-sm">
                                    <img 
                                        src={selectedOrder.printUrl.startsWith('http') ? selectedOrder.printUrl : `${UPLOADS_URL}${selectedOrder.printUrl.startsWith('/') ? '' : '/'}${selectedOrder.printUrl}`} 
                                        className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-lg" 
                                    />
                                </div>
                            ) : (
                                <div className="w-full min-h-[6rem] bg-slate-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-4">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mb-2">
                                            <Printer className="w-5 h-5 text-cyan-600" />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-600 italic uppercase tracking-widest mb-3">Menunggu Foto Print</p>
                                        <label className={`bg-[#D25026] text-white px-4 py-2 rounded-lg font-bold text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-md cursor-pointer ${isUploadingPrint ? 'opacity-50' : ''}`}>
                                            {isUploadingPrint ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload size={12} />}
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

                {/* Progress Finishing */}
                {(["FINISHING", "SELESAI"].includes(selectedOrder.status) || selectedOrder.finishingUrl) && (
                    <div className="space-y-3">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <CheckCircle className="text-[#D25026]" size={14} /> Progress Finishing
                        </h3>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
                            {selectedOrder.finishingUrl ? (
                                <div className="w-full bg-slate-50 rounded-xl overflow-hidden relative border border-slate-200 flex items-center justify-center p-3 shadow-sm">
                                    <img 
                                        src={selectedOrder.finishingUrl.startsWith('http') ? selectedOrder.finishingUrl : `${UPLOADS_URL}${selectedOrder.finishingUrl.startsWith('/') ? '' : '/'}${selectedOrder.finishingUrl}`} 
                                        className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-lg" 
                                    />
                                </div>
                            ) : (
                                <div className="w-full min-h-[6rem] bg-slate-50 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-4">
                                    <div className="flex flex-col items-center text-center">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                            <CheckCircle className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-600 italic uppercase tracking-widest mb-3">Menunggu Foto Finishing</p>
                                        <label className={`bg-[#D25026] text-white px-4 py-2 rounded-lg font-bold text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all shadow-md cursor-pointer ${isUploadingFinishing ? 'opacity-50' : ''}`}>
                                            {isUploadingFinishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload size={12} />}
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

                {/* Shipping Info */}
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

                {/* Player Info */}
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
                </div>
            </div>

            {/* Handover Modal */}
            <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                <DialogContent className="sm:max-w-[500px] font-geist border-slate-100 shadow-xl rounded-3xl p-8 w-11/12 mx-auto bg-white">
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
