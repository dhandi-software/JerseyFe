import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle2, Truck, FileText, Loader2, ChevronLeft, ShoppingBag, ChevronRight, Eye, Printer, Scissors, Palette, Ruler, Layers, User } from "lucide-react";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { UPLOADS_URL } from "~/api/client";
import { useAuth } from "~/context/AuthContext";
import { sortPlayersBySize } from "~/lib/sizeUtils";
import { Link } from "react-router";
import { Toast } from "~/components/ui/toast";
import { generateInvoicePDF } from '~/lib/pdfHelper';
import { InvoiceTemplate } from '~/components/template/Invoice/InvoiceTemplate';

const STAGES = [
    { id: "MENUNGGU", label: "Verifikasi", icon: Clock, desc: "Cek bayar" },
    { id: "DESAIN", label: "Desain", icon: Palette, desc: "Mockup" },
    { id: "LAYOUT", label: "Layout", icon: Ruler, desc: "Pola" },
    { id: "PRINT", label: "Print", icon: Printer, desc: "Cetak" },
    { id: "FINISHING", label: "Finishing", icon: Scissors, desc: "Jahit & QC" },
    { id: "SELESAI", label: "Selesai", icon: CheckCircle2, desc: "Diterima" }
];

const getDisplayStatus = (status: string, isWorking: boolean) => {
    if (status === "MENUNGGU") return "Verifikasi Pembayaran";
    if (status === "DESAIN") {
        return isWorking ? "Pesanan Sedang Diproses" : "Pembayaran Diterima";
    }
    if (["LAYOUT", "PRINT", "FINISHING"].includes(status)) {
        return "Pesanan Sedang Diproses";
    }
    if (status === "SELESAI") return "Selesai";
    if (status === "DITOLAK") return "Ditolak";
    return status;
};

export function ProgressPesananMobile() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const [feedbackInput, setFeedbackInput] = useState("");
    const [showRevisiForm, setShowRevisiForm] = useState(false);
    const [submittingAction, setSubmittingAction] = useState(false);
    const [toast, setToast] = useState<{ title: string; variant: "success" | "destructive" } | null>(null);

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

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) return;
            try {
                const data = await orderService.getCustomerOrders(user.id);
                setOrders(data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, [user]);

    const handleApprove = async () => {
        if (!selectedOrder) return;
        setSubmittingAction(true);
        try {
            await orderService.approveDesign(selectedOrder.id);
            const updatedStatus = "APPROVED";
            setSelectedOrder((prev: any) => ({
                ...prev,
                designStatus: updatedStatus,
                designFeedback: null
            }));
            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? {
                ...o,
                designStatus: updatedStatus,
                designFeedback: null
            } : o));
            setToast({ title: "Desain berhasil disetujui!", variant: "success" });
        } catch (error) {
            console.error("Gagal menyetujui desain:", error);
            setToast({ title: "Gagal menyetujui desain", variant: "destructive" });
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleRevisi = async () => {
        if (!selectedOrder || !feedbackInput.trim()) return;
        setSubmittingAction(true);
        try {
            await orderService.revisiDesign(selectedOrder.id, feedbackInput);
            const updatedStatus = "REVISI";
            const feedbackVal = feedbackInput;
            setSelectedOrder((prev: any) => ({
                ...prev,
                designStatus: updatedStatus,
                designFeedback: feedbackVal
            }));
            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? {
                ...o,
                designStatus: updatedStatus,
                designFeedback: feedbackVal
            } : o));
            setShowRevisiForm(false);
            setFeedbackInput("");
            setToast({ title: "Revisi berhasil diajukan!", variant: "success" });
        } catch (error) {
            console.error("Gagal mengajukan revisi:", error);
            setToast({ title: "Gagal mengajukan revisi", variant: "destructive" });
        } finally {
            setSubmittingAction(false);
        }
    };

    const getCurrentStageIndex = (status: string) => {
        return STAGES.findIndex(s => s.id === status);
    };

    if (selectedOrder) {
        return (
            <div className="min-h-screen bg-slate-50 font-geist pb-24">
                <div className="bg-white p-6 border-b border-slate-100 sticky top-0 z-50 flex justify-between items-center">
                    <div>
                        <button 
                            onClick={() => setSelectedOrder(null)}
                            className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest italic mb-2"
                        >
                            <ChevronLeft size={16} /> Kembali
                        </button>
                        <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Progress Pesanan</h1>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-[10px] font-bold text-[#D25026] uppercase italic font-mono">{selectedOrder.orderId}</p>
                            {selectedOrder.queueNumber && (
                                <span className="bg-[#D25026]/10 text-[#D25026] px-2 py-0.5 rounded-md text-[8px] font-black uppercase italic border border-[#D25026]/20">
                                    Antrean: {selectedOrder.queueNumber}
                                </span>
                            )}
                        </div>
                    </div>
                    {selectedOrder.status === "MENUNGGU" && (
                        <Link 
                            to={`/customer/custom-jersey/checkout?editOrderId=${selectedOrder.orderId}`}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-900 hover:text-black px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest italic shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-300"
                        >
                            Edit
                        </Link>
                    )}
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                        <div className="flex justify-between items-start mb-10">
                            <div>
                                <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic mb-0.5">Produk</p>
                                <h2 className="text-sm font-black text-slate-900 uppercase italic">{selectedOrder.details?.[0]?.productTitle || "Custom Jersey"}</h2>
                            </div>
                            <div className="text-right">
                                <div className={cn("px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border bg-[#D25026] text-slate-900 border-[#D25026]/20")}>
                                    {getDisplayStatus(selectedOrder.status, selectedOrder.isWorking)}
                                </div>
                            </div>
                        </div>

                        {/* Vertical Stepper */}
                        <div className="space-y-6">
                            {STAGES.map((stage, idx) => {
                                const isCompleted = idx <= getCurrentStageIndex(selectedOrder.status);
                                const isActive = idx === getCurrentStageIndex(selectedOrder.status);
                                const Icon = stage.icon;

                                return (
                                    <div key={stage.id} className="flex gap-4 group">
                                        <div className="flex flex-col items-center">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 border-2 relative z-10",
                                                isCompleted ? "bg-[#D25026] border-white text-slate-900 shadow-lg shadow-[#D25026]/20" : "bg-white border-slate-50 text-slate-200"
                                            )}>
                                                <Icon size={18} className={cn(isActive && "animate-pulse")} />
                                            </div>
                                            {idx !== STAGES.length - 1 && (
                                                <div className={cn(
                                                    "w-0.5 h-10 -my-1",
                                                    isCompleted ? "bg-[#D25026]" : "bg-slate-100"
                                                )}></div>
                                            )}
                                        </div>
                                        <div className="pt-1">
                                            <p className={cn(
                                                "text-[10px] font-black uppercase tracking-widest italic",
                                                isCompleted ? "text-slate-900" : "text-slate-300"
                                            )}>
                                                {stage.label}
                                            </p>
                                            <p className="text-[9px] font-medium text-slate-400 mt-0.5 leading-tight italic">
                                                {stage.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mockup Hasil Desain Card Mobile */}
                    {selectedOrder.mockupUrl && (
                        <div className="bg-slate-900 text-white p-6 rounded-[2rem] border border-slate-800 shadow-xl space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#D25026] italic">
                                Hasil Desain Mockup
                            </h3>
                            <p className="text-[10px] text-slate-300 font-medium italic leading-relaxed">
                                Silakan tinjau mockup desain jersey Anda di bawah ini sebelum kami melanjutkan ke proses layout pola cetak.
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Status:</span>
                                {selectedOrder.designStatus === "SENT" && (
                                    <span className="bg-amber-500 text-slate-955 px-2.5 py-0.5 rounded-lg text-[10px] font-black italic">
                                        Menunggu Persetujuan
                                    </span>
                                )}
                                {selectedOrder.designStatus === "APPROVED" && (
                                    <span className="bg-emerald-500 text-slate-955 px-2.5 py-0.5 rounded-lg text-[10px] font-black italic">
                                        Disetujui
                                    </span>
                                )}
                                {selectedOrder.designStatus === "REVISI" && (
                                    <span className="bg-red-500 text-white px-2.5 py-0.5 rounded-lg text-[10px] font-black italic">
                                        Revisi Diajukan
                                    </span>
                                )}
                            </div>

                            {/* Preview Mockup */}
                            <div className="bg-white rounded-2xl overflow-hidden border border-slate-800 shadow-md p-1.5">
                                {selectedOrder.mockupUrl.toLowerCase().endsWith('.pdf') ? (
                                    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 gap-3 rounded-xl">
                                        <FileText size={28} className="text-red-500" />
                                        <p className="text-[10px] font-black text-slate-900 uppercase italic">Mockup PDF</p>
                                        <a 
                                            href={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-1 italic"
                                        >
                                            <Eye size={10} /> Buka PDF
                                        </a>
                                    </div>
                                ) : (
                                    <img 
                                        src={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} 
                                        className="w-full h-auto max-h-[200px] object-contain mx-auto rounded-xl" 
                                    />
                                )}
                            </div>

                            {/* Actions for SENT status or active REVISI editing */}
                            {selectedOrder.designStatus === "SENT" && !showRevisiForm && (
                                <div className="space-y-4 pt-4 border-t border-slate-800">
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={handleApprove}
                                            disabled={submittingAction}
                                            className="flex-1 bg-emerald-500 text-slate-955 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest italic flex items-center justify-center gap-1.5 active:scale-95 disabled:opacity-50"
                                        >
                                            Setujui
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setFeedbackInput("");
                                                setShowRevisiForm(true);
                                            }}
                                            className="flex-1 bg-red-500 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-widest italic flex items-center justify-center gap-1.5 active:scale-95"
                                        >
                                            Ajukan Revisi
                                        </button>
                                    </div>
                                </div>
                            )}

                            {showRevisiForm && (selectedOrder.designStatus === "SENT" || selectedOrder.designStatus === "REVISI") && (
                                <div className="space-y-4 pt-4 border-t border-slate-800">
                                    <div className="space-y-2">
                                        <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest italic">
                                            Detail Revisi:
                                        </label>
                                        <textarea
                                            value={feedbackInput}
                                            onChange={(e) => setFeedbackInput(e.target.value)}
                                            placeholder="Contoh: Tolong ganti warna..."
                                            rows={3}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white placeholder:text-slate-600 text-xs focus:outline-none focus:ring-1 focus:ring-[#D25026]"
                                        />
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={handleRevisi}
                                                disabled={submittingAction || !feedbackInput.trim()}
                                                className="flex-1 bg-red-500 text-white py-2 rounded-lg font-black text-[9px] uppercase tracking-widest italic disabled:opacity-50"
                                            >
                                                Kirim
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setShowRevisiForm(false);
                                                    setFeedbackInput("");
                                                }}
                                                className="flex-1 bg-slate-800 text-slate-400 py-2 rounded-lg font-black text-[9px] uppercase tracking-widest italic"
                                            >
                                                Batal
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedOrder.designStatus === "REVISI" && selectedOrder.designFeedback && !showRevisiForm && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl space-y-3">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-red-400 uppercase tracking-widest italic">Catatan Revisi:</p>
                                        <p className="text-xs text-red-200 font-bold leading-relaxed italic">"{selectedOrder.designFeedback}"</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <p className="text-[8px] text-slate-400 italic">Menunggu update dari desainer.</p>
                                        <button 
                                            onClick={() => {
                                                setFeedbackInput(selectedOrder.designFeedback);
                                                setShowRevisiForm(true);
                                            }}
                                            className="bg-[#D25026]/10 text-[#D25026] px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest italic"
                                        >
                                            Edit Catatan
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedOrder.designStatus === "APPROVED" && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                                    <p className="text-xs text-emerald-300 font-bold italic">
                                        Desain disetujui! Segera dilanjutkan ke tahap berikutnya.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* New Design Reference Card Mobile */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <FileText className="text-[#D25026]" size={14} /> Referensi & Catatan
                        </h3>
                        {selectedOrder.designUrl ? (
                            <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                {selectedOrder.designUrl.toLowerCase().endsWith('.pdf') ? (
                                    <div className="flex flex-col items-center justify-center p-8 bg-white gap-4 group">
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
                                            className="px-6 py-3 bg-red-600 text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 italic shadow-lg shadow-red-600/20"
                                        >
                                            <Eye size={12} /> Buka PDF
                                        </a>
                                    </div>
                                ) : (
                                    <img 
                                        src={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl.startsWith('/') ? '' : '/'}${selectedOrder.designUrl}`} 
                                        className="w-full h-auto max-h-[250px] object-contain mx-auto" 
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-100">
                                <p className="text-[8px] font-bold text-slate-300 italic uppercase">Tidak ada referensi</p>
                            </div>
                        )}
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Catatan:</p>
                            <p className="text-[10px] text-slate-700 font-medium italic leading-relaxed">{selectedOrder.designNote || "Tidak ada catatan."}</p>
                        </div>
                    </div>

                    {/* New Payment Detail Card Mobile */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                        <div className="flex justify-between items-center">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                                <Package className="text-[#D25026]" size={14} /> Info Pembayaran
                            </h3>
                            {selectedOrder.status !== "DITOLAK" && (
                                <button 
                                    onClick={handlePrintInvoice}
                                    disabled={isPrinting}
                                    className="bg-[#D25026] hover:bg-[#B34320] text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest italic flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                                >
                                    {isPrinting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Printer size={10} />}
                                    Cetak
                                </button>
                            )}
                        </div>
                        {selectedOrder.paymentUrl ? (
                            <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                <img 
                                    src={selectedOrder.paymentUrl.startsWith('http') ? selectedOrder.paymentUrl : `${UPLOADS_URL}${selectedOrder.paymentUrl.startsWith('/') ? '' : '/'}${selectedOrder.paymentUrl}`} 
                                    className="w-full h-auto max-h-[250px] object-contain mx-auto" 
                                />
                            </div>
                        ) : (
                            <div className="w-full h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-100">
                                <p className="text-[8px] font-bold text-slate-300 italic uppercase">Belum ada bukti bayar</p>
                            </div>
                        )}
                        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
                            <div>
                                <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest italic">Total:</p>
                                <p className="text-sm font-black text-emerald-800 italic uppercase">Paid</p>
                            </div>
                            <p className="text-lg font-black text-emerald-700 italic">Rp {selectedOrder.totalAmount?.toLocaleString('id-ID')}</p>
                        </div>
                    </div>

                    {/* Informasi Pengiriman Mobile */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <Truck className="text-[#D25026]" size={14} /> Informasi Pengiriman
                        </h3>
                        <div className="space-y-4">
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
                                <p className="text-[10px] text-slate-700 font-medium italic leading-relaxed">
                                    {selectedOrder.shippingMethod === "COD" 
                                        ? (selectedOrder.shippingAddress || "Alamat tidak diisi.")
                                        : "Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178"
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Data Pemain Card Mobile */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <User className="text-[#D25026]" size={14} /> Data Pemain
                        </h3>
                        <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                            <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left relative">
                                    <thead className="bg-slate-100 sticky top-0 z-10 border-b border-slate-200 shadow-sm">
                                        <tr>
                                            <th className="px-3 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest italic">Nama</th>
                                            <th className="px-3 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest italic text-center">No</th>
                                            <th className="px-3 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest italic text-center">Size</th>
                                            <th className="px-3 py-2 text-[8px] font-black text-slate-400 uppercase tracking-widest italic text-center">Lengan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 bg-slate-50">
                                        {sortPlayersBySize(selectedOrder.details || []).map((item: any, idx: number) => {
                                            let sizeOnly = item.playerSize || "-";
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
                                                    <td className="px-3 py-2 text-[10px] font-black text-slate-700 uppercase italic truncate max-w-[100px]">{item.playerName || "-"}</td>
                                                    <td className="px-3 py-2 text-[10px] font-black text-[#D25026] text-center">{item.playerNumber || "-"}</td>
                                                    <td className="px-3 py-2 text-center text-[10px] font-black italic text-slate-500">{sizeOnly}</td>
                                                    <td className="px-3 py-2 text-center text-[10px] font-black italic text-slate-500">{sleeve}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white">
                        <h4 className="text-sm font-black uppercase italic tracking-tighter mb-2">Butuh Bantuan?</h4>
                        <p className="text-[9px] text-slate-400 font-medium italic leading-relaxed mb-4">
                            Hubungi admin jika Anda memiliki pertanyaan seputar progress produksi.
                        </p>
                        <button className="w-full bg-[#D25026] text-slate-900 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest italic">
                            Hubungi Support
                        </button>
                    </div>
                </div>
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
        <div className="min-h-screen bg-slate-50 font-geist pb-24">
            <div className="bg-white px-6 pt-12, pb-6 border-b border-slate-100 sticky top-0 z-40">
                <h1 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Daftar Progress</h1>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 italic">Pantau Semua Pesanan Aktif</p>
            </div>

            <div className="p-6 space-y-4">
                {loading ? (
                    <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center flex flex-col items-center gap-3">
                        <Loader2 className="w-6 h-6 animate-spin text-[#D25026]" />
                        <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Memuat...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white p-10 rounded-[2rem] border border-slate-100 text-center space-y-3">
                        <ShoppingBag className="mx-auto text-slate-100" size={32} />
                        <p className="text-[10px] font-bold text-slate-400 italic uppercase">Belum ada pesanan aktif</p>
                        <Link to="/customer/custom-jersey" className="block text-[#D25026] text-[8px] font-black uppercase tracking-widest">Order Sekarang &rarr;</Link>
                    </div>
                ) : (
                    orders.map((order) => (
                        <div 
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform"
                        >
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="text-[8px] font-black text-slate-400 font-mono">{order.orderId}</span>
                                    {order.queueNumber && (
                                        <span className="bg-[#D25026]/10 text-[#D25026] px-1.5 py-0.5 rounded text-[7px] font-black uppercase italic border border-[#D25026]/20">
                                            Antrean: {order.queueNumber}
                                        </span>
                                    )}
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-widest border",
                                        order.status === "SELESAI" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-[#D25026] border-[#D25026]/20"
                                    )}>
                                        {getDisplayStatus(order.status, order.isWorking)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-900 uppercase italic leading-tight">{order.details?.[0]?.productTitle || "Custom Jersey"}</p>
                                    <p className="text-[8px] font-bold text-slate-400 italic">{order.details?.length} Unit • {new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                                </div>
                            </div>
                            <div className="bg-slate-50 p-2 rounded-xl">
                                <ChevronRight size={16} className="text-slate-300" />
                            </div>
                        </div>
                    ))
                )}
            </div>
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
