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

interface OrderDetailViewDesktopProps {
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

export function OrderDetailViewDesktop({
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
}: OrderDetailViewDesktopProps) {
    const currentBahan = bahanList.find(b => b.id === selectedOrder.productId);
    const isBahanHabis = currentBahan?.status === "Habis";

    return (
        <div className="min-h-screen bg-slate-50 font-geist">
            {toast && <Toast title={toast.title} variant={toast.variant} onClose={onCloseToast} />}
            <div className="w-full px-8 py-10">
                <button 
                    onClick={onClose}
                    className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-sm mb-8 group cursor-pointer"
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
                                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-[#D25026] transition-colors cursor-pointer"
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
                                className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest italic flex items-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
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
                        {isBahanHabis && (
                            <div className="bg-red-50 border border-red-200 p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center shrink-0">
                                        <AlertCircle className="text-red-600 w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black uppercase tracking-wider text-red-900">Bahan Terpilih Habis!</h4>
                                        <p className="text-xs text-red-600 font-medium leading-relaxed mt-1">
                                            Bahan "{currentBahan?.nama}" saat ini habis/tidak tersedia. Berikan rekomendasi bahan alternatif agar customer dapat memilih bahan pengganti.
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
                                        <Button className="bg-slate-900 text-white rounded-2xl px-6 h-14 font-black uppercase tracking-widest text-xs hover:bg-[#D25026] active:scale-95 transition-all shadow-md shrink-0 cursor-pointer">
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
                                                className="px-6 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                                            >
                                                Batal
                                            </Button>
                                            <Button
                                                onClick={handleSendRecommendations}
                                                className="px-6 py-3 bg-[#D25026] text-white font-bold rounded-xl hover:bg-[#B34320] transition-colors cursor-pointer"
                                            >
                                                Kirim Rekomendasi
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        )}

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

                        {/* Mockup Hasil Desain */}
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
                                                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                                    >
                                                        Minta Revisi (Admin)
                                                    </Button>
                                                    <Button 
                                                        onClick={() => handleApproveDesign(selectedOrder.rawId)}
                                                        className="bg-[#D25026] text-white hover:bg-[#B34320] px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
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

                        {/* Mockup Layout Pola Cetak */}
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
                                                        className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                                    >
                                                        Minta Revisi (Admin)
                                                    </Button>
                                                    <Button 
                                                        onClick={() => handleApproveLayout(selectedOrder.rawId)}
                                                        className="bg-[#D25026] text-white hover:bg-[#B34320] px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
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

                        {/* Progress Cetak (Print) */}
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

                        {/* Progress Finishing */}
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

                        {/* Player List */}
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
                                    className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest italic hover:bg-slate-50 transition-all shadow-sm group cursor-pointer"
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
                            onClick={onClose} 
                            className="px-10 py-7 h-auto bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-[1.5rem] text-xs font-bold uppercase tracking-widest transition-colors italic cursor-pointer"
                        >
                            Kembali ke Daftar
                        </Button>
                    </div>
                </div>

                {/* Handover Modal */}
                <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                    <DialogContent className="sm:max-w-[580px] font-geist border-slate-100 shadow-xl rounded-3xl p-10 bg-white">
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
