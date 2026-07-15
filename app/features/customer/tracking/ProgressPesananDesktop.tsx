import { useState, useEffect } from "react";
import { Package, Clock, CheckCircle2, Truck, FileText, Loader2, ChevronLeft, ShoppingBag, Eye, Printer, Scissors, User } from "lucide-react";
import { Link } from "react-router";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { UPLOADS_URL } from "~/api/client";
import { useAuth } from "~/context/AuthContext";
import { sortPlayersBySize } from "~/lib/sizeUtils";
import { Toast } from "~/components/ui/toast";
import { generateInvoicePDF } from '~/lib/pdfHelper';

const STAGES = [
    { id: "MENUNGGU", label: "Verifikasi", icon: Clock, desc: "Cek pembayaran" },
    { id: "DESAIN", label: "Desain", icon: FileText, desc: "Mockup desain" },
    { id: "LAYOUT", label: "Layout", icon: FileText, desc: "Pola & Layout" },
    { id: "PRINT", label: "Print", icon: Printer, desc: "Cetak kain" },
    { id: "FINISHING", label: "Finishing", icon: Scissors, desc: "Jahit & QC" },
    { id: "SELESAI", label: "Selesai", icon: CheckCircle2, desc: "Selesai" }
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

export function ProgressPesananDesktop() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<any[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);

    const [feedbackInput, setFeedbackInput] = useState("");
    const [showRevisiForm, setShowRevisiForm] = useState(false);
    const [showLayoutRevisiForm, setShowLayoutRevisiForm] = useState(false);
    const [layoutFeedbackInput, setLayoutFeedbackInput] = useState("");
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

    const handleUnapproveDesign = async () => {
        if (!selectedOrder) return;
        setSubmittingAction(true);
        try {
            await orderService.unapproveDesign(selectedOrder.id);
            const updatedStatus = "SENT";
            setSelectedOrder((prev: any) => ({
                ...prev,
                designStatus: updatedStatus
            }));
            setOrders(prev => prev.map((o: any) => o.id === selectedOrder.id ? {
                ...o,
                designStatus: updatedStatus
            } : o));
            setToast({ title: "Persetujuan desain dibatalkan!", variant: "success" });
        } catch (error) {
            console.error("Gagal membatalkan persetujuan desain:", error);
            setToast({ title: "Gagal membatalkan persetujuan desain", variant: "destructive" });
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

    const handleApproveLayout = async () => {
        if (!selectedOrder) return;
        setSubmittingAction(true);
        try {
            await orderService.approveLayout(selectedOrder.id);
            const updatedStatus = "APPROVED";
            setSelectedOrder((prev: any) => ({
                ...prev,
                layoutStatus: updatedStatus,
                layoutFeedback: null
            }));
            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? {
                ...o,
                layoutStatus: updatedStatus,
                layoutFeedback: null
            } : o));
            setToast({ title: "Layout berhasil disetujui!", variant: "success" });
        } catch (error) {
            console.error("Gagal menyetujui layout:", error);
            setToast({ title: "Gagal menyetujui layout", variant: "destructive" });
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleUnapproveLayout = async () => {
        if (!selectedOrder) return;
        setSubmittingAction(true);
        try {
            await orderService.unapproveLayout(selectedOrder.id);
            const updatedStatus = "SENT";
            setSelectedOrder((prev: any) => ({
                ...prev,
                layoutStatus: updatedStatus
            }));
            setOrders(prev => prev.map((o: any) => o.id === selectedOrder.id ? {
                ...o,
                layoutStatus: updatedStatus
            } : o));
            setToast({ title: "Persetujuan layout dibatalkan!", variant: "success" });
        } catch (error) {
            console.error("Gagal membatalkan persetujuan layout:", error);
            setToast({ title: "Gagal membatalkan persetujuan layout", variant: "destructive" });
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleRevisiLayout = async () => {
        if (!selectedOrder || !layoutFeedbackInput.trim()) return;
        setSubmittingAction(true);
        try {
            await orderService.revisiLayout(selectedOrder.id, layoutFeedbackInput);
            const updatedStatus = "REVISI";
            const feedbackVal = layoutFeedbackInput;
            setSelectedOrder((prev: any) => ({
                ...prev,
                layoutStatus: updatedStatus,
                layoutFeedback: feedbackVal
            }));
            setOrders(prev => prev.map(o => o.id === selectedOrder.id ? {
                ...o,
                layoutStatus: updatedStatus,
                layoutFeedback: feedbackVal
            } : o));
            setShowLayoutRevisiForm(false);
            setLayoutFeedbackInput("");
            setToast({ title: "Revisi layout berhasil diajukan!", variant: "success" });
        } catch (error) {
            console.error("Gagal mengajukan revisi layout:", error);
            setToast({ title: "Gagal mengajukan revisi layout", variant: "destructive" });
        } finally {
            setSubmittingAction(false);
        }
    };

    const getCurrentStageIndex = (status: string) => {
        return STAGES.findIndex(s => s.id === status);
    };

    if (selectedOrder) {
        return (
            <div className="p-10 space-y-8 animate-in fade-in duration-500 font-geist">
                <div className="flex justify-between items-center w-full mb-4">
                    <button 
                        onClick={() => setSelectedOrder(null)}
                        className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors font-bold text-xs uppercase tracking-widest italic"
                    >
                        <ChevronLeft size={16} /> Kembali ke Daftar
                    </button>

                    {selectedOrder.status === "MENUNGGU" && (
                        <Link 
                            to={`/customer/custom-jersey/checkout?editOrderId=${selectedOrder.orderId}`}
                            className="bg-amber-500 hover:bg-amber-600 text-slate-900 hover:text-black px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest italic flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95 transition-all duration-300"
                        >
                            Edit Pesanan
                        </Link>
                    )}
                </div>

                <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                    <div className="flex justify-between items-start mb-16">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Order Identity</p>
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{selectedOrder.orderId}</h2>
                                {selectedOrder.queueNumber && (
                                    <span className="bg-[#D25026]/10 text-[#D25026] px-3 py-1 rounded-xl text-xs font-black italic border border-[#D25026]/20">
                                        No. Antrean: {selectedOrder.queueNumber}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Current Status</p>
                            <div className="flex items-center gap-2 justify-end">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                                <p className="text-xl font-black text-[#D25026] uppercase italic">
                                    {getDisplayStatus(selectedOrder.status, selectedOrder.isWorking)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute top-8 left-0 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[#D25026] transition-all duration-1000 ease-out" 
                                style={{ width: `${(getCurrentStageIndex(selectedOrder.status) / (STAGES.length - 1)) * 100}%` }}
                            ></div>
                        </div>

                        <div className="relative flex justify-between">
                            {STAGES.map((stage, idx) => {
                                const isCompleted = idx <= getCurrentStageIndex(selectedOrder.status);
                                const isActive = idx === getCurrentStageIndex(selectedOrder.status);
                                const Icon = stage.icon;

                                return (
                                    <div key={stage.id} className="flex flex-col items-center group w-40 text-center">
                                        <div className={cn(
                                            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 relative z-10 border-4",
                                            isCompleted ? "bg-[#D25026] border-white text-slate-900 shadow-xl shadow-[#D25026]/30" : "bg-white border-slate-50 text-slate-200"
                                        )}>
                                            <Icon size={24} className={cn(isActive && "animate-bounce")} />
                                        </div>
                                        <div className="mt-4 space-y-1">
                                            <p className={cn(
                                                "text-[11px] font-black uppercase tracking-widest italic",
                                                isCompleted ? "text-slate-900" : "text-slate-300"
                                            )}>
                                                {stage.label}
                                            </p>
                                            <p className="text-[9px] font-medium text-slate-400 leading-tight">
                                                {stage.desc}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mockup Hasil Desain Section */}
                    {selectedOrder.mockupUrl && (
                        <div className="mt-16 bg-slate-900 text-white rounded-[3rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
                            <div className="relative z-10 flex flex-col lg:flex-row gap-10">
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-black uppercase tracking-widest text-[#D25026] italic">
                                            Hasil Desain Mockup Jersey Anda
                                        </h3>
                                    </div>
                                    <p className="text-sm text-slate-300 font-medium italic leading-relaxed">
                                        Tim desainer kami telah mengunggah mockup desain jersey Anda. Silakan tinjau desain di bawah ini sebelum kami melanjutkan ke proses Layout Pola Cetak.
                                    </p>
                                    
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Status Desain:</span>
                                        {selectedOrder.designStatus === "SENT" && (
                                            <span className="bg-amber-500 text-slate-950 px-3 py-1 rounded-xl text-xs font-black italic">
                                                Menunggu Persetujuan Anda
                                            </span>
                                        )}
                                        {selectedOrder.designStatus === "APPROVED" && (
                                            <span className="bg-emerald-500 text-slate-950 px-3 py-1 rounded-xl text-xs font-black italic">
                                                Disetujui
                                            </span>
                                        )}
                                        {selectedOrder.designStatus === "REVISI" && (
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-xl text-xs font-black italic">
                                                Revisi Diajukan
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Panel for SENT status */}
                                    {selectedOrder.designStatus === "SENT" && !showRevisiForm && (
                                        <div className="space-y-4 pt-4 border-t border-slate-800">
                                            <div className="flex gap-4">
                                                <button 
                                                    onClick={handleApprove}
                                                    disabled={submittingAction}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-955 px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest italic flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                                >
                                                    Setujui Desain
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setFeedbackInput("");
                                                        setShowRevisiForm(true);
                                                    }}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest italic flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-red-500/20"
                                                >
                                                    Ajukan Revisi
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {showRevisiForm && (selectedOrder.designStatus === "SENT" || selectedOrder.designStatus === "REVISI") && (
                                        <div className="space-y-4 pt-4 border-t border-slate-800">
                                            <div className="space-y-3">
                                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest italic">
                                                    Detail Revisi yang Diinginkan:
                                                </label>
                                                <textarea
                                                    value={feedbackInput}
                                                    onChange={(e) => setFeedbackInput(e.target.value)}
                                                    placeholder="Contoh: Tolong warna tulisan sponsor diubah menjadi putih, dan logo tim digeser sedikit ke atas."
                                                    rows={3}
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#D25026] focus:border-transparent"
                                                />
                                                <div className="flex gap-3">
                                                    <button 
                                                        onClick={handleRevisi}
                                                        disabled={submittingAction || !feedbackInput.trim()}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest italic disabled:opacity-50"
                                                    >
                                                        Kirim Revisi
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setShowRevisiForm(false);
                                                             setFeedbackInput("");
                                                        }}
                                                        className="bg-slate-800 text-slate-400 hover:text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest italic"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedOrder.designStatus === "REVISI" && selectedOrder.designFeedback && !showRevisiForm && (
                                        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest italic">Catatan Revisi Anda:</p>
                                                <p className="text-sm text-red-200 font-bold leading-relaxed italic">"{selectedOrder.designFeedback}"</p>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <p className="text-[9px] text-slate-400 italic">Menunggu desainer memperbarui mockup berdasarkan feedback Anda.</p>
                                                <button 
                                                    onClick={() => {
                                                        setFeedbackInput(selectedOrder.designFeedback);
                                                        setShowRevisiForm(true);
                                                    }}
                                                    className="bg-[#D25026]/10 text-[#D25026] hover:bg-[#D25026]/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all"
                                                >
                                                    Edit Catatan Revisi
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {selectedOrder.designStatus === "APPROVED" && (
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
                                            <p className="text-sm text-emerald-300 font-bold italic">
                                                Desain telah disetujui! Pesanan akan segera dilanjutkan ke tahap Layout Pola & Cetak.
                                            </p>
																{(selectedOrder.status === 'DESAIN' || selectedOrder.status === 'LAYOUT') && (
																	<button onClick={handleUnapproveDesign} disabled={submittingAction} className="mt-3 bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest italic w-fit active:scale-95 transition-all shadow-md disabled:opacity-50">Batal Setuju</button>
																)}
                                        </div>
                                    )}
                                </div>

                                <div className="w-full lg:w-96 space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Preview Mockup:</p>
                                    <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center p-3">
                                        {selectedOrder.mockupUrl.toLowerCase().endsWith('.pdf') ? (
                                            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 gap-4 w-full rounded-2xl">
                                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
                                                    <FileText size={32} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs font-black text-slate-900 uppercase italic">Dokumen PDF</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Mockup Desain</p>
                                                </div>
                                                <a 
                                                    href={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-2.5 bg-red-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2 italic shadow-md shadow-red-500/20"
                                                >
                                                    <Eye size={12} /> Buka PDF
                                                </a>
                                            </div>
                                        ) : (
                                            <img 
                                                src={selectedOrder.mockupUrl.startsWith('http') ? selectedOrder.mockupUrl : `${UPLOADS_URL}${selectedOrder.mockupUrl.startsWith('/') ? '' : '/'}${selectedOrder.mockupUrl}`} 
                                                alt="Mockup Design" 
                                                className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-2xl" 
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Layout Pola Cetak Section */}
                    {selectedOrder.layoutUrl && (
                        <div className="mt-16 bg-slate-900 text-white rounded-[3rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
                            <div className="relative z-10 flex flex-col lg:flex-row gap-10">
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-black uppercase tracking-widest text-[#D25026] italic">
                                            Layout Pola Cetak Jersey Anda
                                        </h3>
                                    </div>
                                    <p className="text-sm text-slate-300 font-medium italic leading-relaxed">
                                        Tim desainer kami telah mengunggah layout pola cetak jersey Anda. Silakan tinjau layout di bawah ini sebelum kami melanjutkan ke proses print cetak kain.
                                    </p>
                                    
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Status Layout:</span>
                                        {selectedOrder.layoutStatus === "SENT" && (
                                            <span className="bg-amber-500 text-slate-955 px-3 py-1 rounded-xl text-xs font-black italic">
                                                Menunggu Persetujuan Anda
                                            </span>
                                        )}
                                        {selectedOrder.layoutStatus === "APPROVED" && (
                                            <span className="bg-emerald-500 text-slate-955 px-3 py-1 rounded-xl text-xs font-black italic">
                                                Disetujui
                                            </span>
                                        )}
                                        {selectedOrder.layoutStatus === "REVISI" && (
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-xl text-xs font-black italic">
                                                Revisi Diajukan
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Panel for SENT status */}
                                    {selectedOrder.layoutStatus === "SENT" && !showLayoutRevisiForm && (
                                        <div className="space-y-4 pt-4 border-t border-slate-800">
                                            <div className="flex gap-4">
                                                <button 
                                                    onClick={handleApproveLayout}
                                                    disabled={submittingAction}
                                                    className="bg-emerald-500 hover:bg-emerald-600 text-slate-955 px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest italic flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50"
                                                >
                                                    Setujui Layout
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        setLayoutFeedbackInput("");
                                                        setShowLayoutRevisiForm(true);
                                                    }}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest italic flex items-center gap-2 active:scale-95 transition-all shadow-lg shadow-red-500/20"
                                                >
                                                    Ajukan Revisi
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {showLayoutRevisiForm && (selectedOrder.layoutStatus === "SENT" || selectedOrder.layoutStatus === "REVISI") && (
                                        <div className="space-y-4 pt-4 border-t border-slate-800">
                                            <div className="space-y-3">
                                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest italic">
                                                    Detail Revisi Layout yang Diinginkan:
                                                </label>
                                                <textarea
                                                    value={layoutFeedbackInput}
                                                    onChange={(e) => setLayoutFeedbackInput(e.target.value)}
                                                    placeholder="Contoh: Tolong penempatan nama pemain dan nomor punggung diselaraskan kembali."
                                                    rows={3}
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-[#D25026] focus:border-transparent"
                                                />
                                                <div className="flex gap-3">
                                                    <button 
                                                        onClick={handleRevisiLayout}
                                                        disabled={submittingAction || !layoutFeedbackInput.trim()}
                                                        className="bg-red-500 hover:bg-red-600 text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest italic disabled:opacity-50"
                                                    >
                                                        Kirim Revisi Layout
                                                    </button>
                                                    <button 
                                                        onClick={() => {
                                                            setShowLayoutRevisiForm(false);
                                                            setLayoutFeedbackInput("");
                                                        }}
                                                        className="bg-slate-800 text-slate-400 hover:text-white px-6 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest italic"
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {selectedOrder.layoutStatus === "REVISI" && selectedOrder.layoutFeedback && !showLayoutRevisiForm && (
                                        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest italic">Catatan Revisi Layout Anda:</p>
                                                <p className="text-sm text-red-200 font-bold leading-relaxed italic">"{selectedOrder.layoutFeedback}"</p>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <p className="text-[9px] text-slate-400 italic">Menunggu desainer memperbarui layout berdasarkan feedback Anda.</p>
                                                <button 
                                                    onClick={() => {
                                                        setLayoutFeedbackInput(selectedOrder.layoutFeedback);
                                                        setShowLayoutRevisiForm(true);
                                                    }}
                                                    className="bg-[#D25026]/10 text-[#D25026] hover:bg-[#D25026]/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all"
                                                >
                                                    Edit Catatan Revisi
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {selectedOrder.layoutStatus === "APPROVED" && (
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
                                            <p className="text-sm text-emerald-300 font-bold italic">
                                                Layout telah disetujui! Pesanan akan segera dilanjutkan ke tahap Print Cetak Kain.
                                            </p>
																{selectedOrder.status === 'LAYOUT' && (
																	<button onClick={handleUnapproveLayout} disabled={submittingAction} className="mt-3 bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest italic w-fit active:scale-95 transition-all shadow-md disabled:opacity-50">Batal Setuju</button>
																)}
                                        </div>
                                    )}
                                </div>

                                <div className="w-full lg:w-96 space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Preview Layout:</p>
                                    <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center p-3">
                                        {selectedOrder.layoutUrl.toLowerCase().endsWith('.pdf') ? (
                                            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 gap-4 w-full rounded-2xl">
                                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
                                                    <FileText size={32} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs font-black text-slate-900 uppercase italic">Dokumen PDF</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Mockup Layout</p>
                                                </div>
                                                <a 
                                                    href={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-2.5 bg-red-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2 italic shadow-md shadow-red-500/20"
                                                >
                                                    <Eye size={12} /> Buka PDF
                                                </a>
                                            </div>
                                        ) : (
                                            <img 
                                                src={selectedOrder.layoutUrl.startsWith('http') ? selectedOrder.layoutUrl : `${UPLOADS_URL}${selectedOrder.layoutUrl.startsWith('/') ? '' : '/'}${selectedOrder.layoutUrl}`} 
                                                alt="Mockup Layout" 
                                                className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-2xl" 
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Progress Print (Customer View) */}
                    {selectedOrder.printUrl && (
                        <div className="space-y-6 mt-16 pt-16 border-t border-slate-50">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                    <Printer className="text-[#D25026]" size={16} />
                                </div>
                                Progress Cetak (Print)
                            </h3>
                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5">
                                <div className="w-full bg-white rounded-2xl overflow-hidden border border-slate-200 p-2 flex items-center justify-center shadow-sm">
                                    <img 
                                        src={selectedOrder.printUrl.startsWith('http') ? selectedOrder.printUrl : `${UPLOADS_URL}${selectedOrder.printUrl.startsWith('/') ? '' : '/'}${selectedOrder.printUrl}`} 
                                        alt="Progress Print" 
                                        className="w-full h-auto max-h-[400px] object-contain mx-auto rounded-xl" 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Progress Finishing (Customer View) */}
                    {selectedOrder.finishingUrl && (
                        <div className="space-y-6 mt-16 pt-16 border-t border-slate-50">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                    <CheckCircle2 className="text-[#D25026]" size={16} />
                                </div>
                                Progress Finishing
                            </h3>
                            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5">
                                <div className="w-full bg-white rounded-2xl overflow-hidden border border-slate-200 p-2 flex items-center justify-center shadow-sm">
                                    <img 
                                        src={selectedOrder.finishingUrl.startsWith('http') ? selectedOrder.finishingUrl : `${UPLOADS_URL}${selectedOrder.finishingUrl.startsWith('/') ? '' : '/'}${selectedOrder.finishingUrl}`} 
                                        alt="Progress Finishing" 
                                        className="w-full h-auto max-h-[400px] object-contain mx-auto rounded-xl" 
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Shipping Information */}
                    <div className="space-y-6 mt-16 pt-16 border-t border-slate-50">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                            <div className="w-8 h-8 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                                <Truck className="text-[#D25026]" size={16} />
                            </div>
                            Informasi Pengiriman
                        </h3>
                        <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm ring-1 ring-black/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Metode Pengiriman:</p>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100">
                                    <p className="text-sm font-black text-slate-900 uppercase italic">
                                        {selectedOrder.shippingMethod === "COD" ? "COD (Penerima yang bayar)" : "Ambil di tempat (Self-Pickup)"}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                                    {selectedOrder.shippingMethod === "COD" ? "Alamat Tujuan COD:" : "Alamat Toko (Kunjungi Toko):"}
                                </p>
                                <div className="bg-white p-6 rounded-2xl border border-slate-100 text-sm leading-relaxed text-slate-700 italic">
                                    {selectedOrder.shippingMethod === "COD"
                                        ? (selectedOrder.shippingAddress || "Alamat tidak diisi.")
                                        : "Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178"
                                    }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-50 pt-16">
                        <div className="space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                <FileText className="text-[#D25026]" size={16} /> Referensi Desain
                            </h3>
                            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                                {selectedOrder.designUrl ? (
                                    <div className="w-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                                        {selectedOrder.designUrl.toLowerCase().endsWith('.pdf') ? (
                                            <div className="flex flex-col items-center justify-center p-12 bg-slate-50 gap-6 group">
                                                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                                    <FileText size={40} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-black text-slate-900 uppercase italic">Dokumen PDF</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Referensi Desain</p>
                                                </div>
                                                <a 
                                                    href={selectedOrder.designUrl.startsWith('http') ? selectedOrder.designUrl : `${UPLOADS_URL}${selectedOrder.designUrl.startsWith('/') ? '' : '/'}${selectedOrder.designUrl}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-3 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 italic"
                                                >
                                                    <Eye size={14} /> Lihat PDF
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
                                    <div className="w-full h-32 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                        <p className="text-[10px] font-bold text-slate-400 italic uppercase">Tidak ada referensi gambar</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 italic">Catatan:</p>
                                    <p className="text-sm text-slate-700 font-medium italic leading-relaxed bg-white p-6 rounded-2xl border border-slate-100">
                                        {selectedOrder.designNote || "Tidak ada catatan tambahan."}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                    <Package className="text-[#D25026]" size={16} /> Bukti Pembayaran
                                </h3>
                                {selectedOrder.status !== "DITOLAK" && (
                                    <button 
                                        onClick={handlePrintInvoice}
                                        disabled={isPrinting}
                                        className="bg-[#D25026] hover:bg-[#B34320] text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                                    >
                                        {isPrinting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer size={14} />}
                                        Cetak Invoice
                                    </button>
                                )}
                            </div>
                            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                                {selectedOrder.paymentUrl ? (
                                    <div className="w-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                                        <img 
                                            src={selectedOrder.paymentUrl.startsWith('http') ? selectedOrder.paymentUrl : `${UPLOADS_URL}${selectedOrder.paymentUrl.startsWith('/') ? '' : '/'}${selectedOrder.paymentUrl}`} 
                                            alt="Payment Proof" 
                                            className="w-full h-auto max-h-[300px] object-contain mx-auto" 
                                        />
                                    </div>
                                ) : (
                                    <div className="w-full h-32 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                        <p className="text-[10px] font-bold text-slate-400 italic uppercase">Belum ada bukti bayar</p>
                                    </div>
                                )}
                                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest italic">Total Pembayaran:</p>
                                        <p className="text-xs font-black text-emerald-700 uppercase italic">Paid</p>
                                    </div>
                                    <p className="text-2xl font-black text-emerald-800 tracking-tighter italic">Rp {selectedOrder.totalAmount?.toLocaleString('id-ID')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-10 space-y-6">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                            <User className="text-[#D25026]" size={16} /> Data Pemain
                        </h3>
                        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                <table className="w-full text-left relative">
                                    <thead className="bg-slate-50 sticky top-0 z-10 border-b border-slate-100 shadow-sm">
                                        <tr>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Nama Pemain</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">No. Punggung</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">Ukuran (Size)</th>
                                            <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest italic text-center">Lengan</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50 bg-white">
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
                                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-8 py-4 text-sm font-black text-slate-900 uppercase italic">{item.playerName || "-"}</td>
                                                    <td className="px-8 py-4 text-sm font-black text-[#D25026] text-center font-mono">{item.playerNumber || "-"}</td>
                                                    <td className="px-8 py-4 text-center">
                                                        <span className="bg-slate-100 px-3 py-1 rounded-lg text-[10px] font-black italic">{sizeOnly}</span>
                                                    </td>
                                                    <td className="px-8 py-4 text-center text-sm font-medium text-slate-600">
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

                <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white flex justify-between items-center relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Butuh Bantuan?</h3>
                        <p className="text-sm text-slate-400 font-medium italic">Tim admin kami siap membantu Anda 24/7 untuk pertanyaan seputar pesanan.</p>
                    </div>
                    <button className="relative z-10 bg-[#D25026] text-slate-900 px-8 py-4 rounded-xl font-black italic uppercase tracking-widest text-xs">Hubungi Admin</button>
                    <div className="absolute -right-10 -bottom-10 opacity-5">
                        <Truck size={200} />
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
        <div className="p-10 space-y-10 animate-in fade-in duration-500 font-geist">
            <div>
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Progress Pesanan</h1>
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] mt-2 italic">Pantau status produksi jersey kamu</p>
            </div>

            {loading ? (
                <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-[#D25026]" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Memuat pesanan Anda...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="bg-white p-20 rounded-[2.5rem] border border-slate-100 text-center space-y-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                        <ShoppingBag className="text-slate-200" size={40} />
                    </div>
                    <div className="space-y-2">
                        <p className="text-lg font-black uppercase italic tracking-tight text-slate-900">Belum ada pesanan aktif</p>
                        <p className="text-xs font-medium text-slate-400 italic">Mulai buat jersey custom kamu sekarang dan pantau progressnya di sini.</p>
                    </div>
                    <Link to="/customer/custom-jersey" className="inline-block bg-[#D25026] text-slate-900 px-8 py-4 rounded-xl font-black italic uppercase tracking-widest text-xs">Order Sekarang</Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <div 
                            key={order.id}
                            onClick={() => setSelectedOrder(order)}
                            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-[#D25026]/10 transition-colors">
                                    <Package className="text-slate-300 group-hover:text-[#D25026]" size={24} />
                                </div>
                                <span className={cn(
                                    "px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                                    order.status === "SELESAI" ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-orange-50 text-[#D25026] border-orange-100"
                                )}>
                                    {getDisplayStatus(order.status, order.isWorking)}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                    <p className="text-[10px] font-bold text-slate-400 font-mono tracking-tighter">{order.orderId}</p>
                                    {order.queueNumber && (
                                        <span className="bg-[#D25026]/10 text-[#D25026] px-2 py-0.5 rounded text-[8px] font-black uppercase italic border border-[#D25026]/20">
                                            No. Antrean: {order.queueNumber}
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-xl font-black italic uppercase tracking-tighter text-slate-900">
                                    {order.details?.[0]?.productTitle || "Custom Jersey"}
                                </h3>
                                <p className="text-[10px] font-black text-[#D25026] uppercase italic tracking-widest">
                                    {order.details?.length} Units • {new Date(order.createdAt).toLocaleDateString('id-ID')}
                                </p>
                            </div>
                            <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between text-[10px] font-black uppercase tracking-widest italic text-slate-400 group-hover:text-[#D25026] transition-colors">
                                Lihat Progress
                                <Truck size={14} />
                            </div>
                        </div>
                    ))}
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


