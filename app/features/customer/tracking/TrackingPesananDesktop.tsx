import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Search, Package, Clock, CheckCircle2, Truck, FileText, AlertCircle, Loader2, ChevronRight, MapPin, Printer, User, Scissors, Palette, Ruler, Eye } from "lucide-react";
import { cn } from "~/lib/utils";
import { orderService } from "~/services/orderService";
import { sortPlayersBySize } from "~/lib/sizeUtils";
import { UPLOADS_URL } from "~/api/client";
import { Toast } from "~/components/ui/toast";
import { generateInvoicePDF } from '~/lib/pdfHelper';
import { adminApi } from "~/api/admin";

const STAGES = [
    { id: "MENUNGGU", label: "Verifikasi", icon: Clock, desc: "Cek pembayaran" },
    { id: "DESAIN", label: "Desain", icon: Palette, desc: "Mockup desain" },
    { id: "LAYOUT", label: "Layout", icon: Ruler, desc: "Pola & Layout" },
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

export function TrackingPesananDesktop() {
    const [searchParams] = useSearchParams();
    const [orderId, setOrderId] = useState(searchParams.get("id") || "");
    const [order, setOrder] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [feedbackInput, setFeedbackInput] = useState("");
    const [showRevisiForm, setShowRevisiForm] = useState(false);
    const [submittingAction, setSubmittingAction] = useState(false);
    const [toast, setToast] = useState<{ title: string; variant: "success" | "destructive" } | null>(null);
    const [bahanList, setBahanList] = useState<any[]>([]);

    useEffect(() => {
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
        fetchBahan();
    }, []);

    const [isPrinting, setIsPrinting] = useState(false);

    const handlePrintInvoice = async () => {
        if (!order) return;
        setIsPrinting(true);
        try {
            await generateInvoicePDF(order);
        } catch (error) {
            console.error("Failed to generate PDF", error);
            setToast({ title: "Gagal mencetak invoice", variant: "destructive" });
        } finally {
            setIsPrinting(false);
        }
    };

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            setOrderId(id);
            executeSearch(id);
        }
    }, [searchParams]);

    const executeSearch = async (idToSearch: string) => {
        if (!idToSearch.trim()) return;

        setLoading(true);
        setError("");
        try {
            const data = await orderService.trackOrder(idToSearch.trim());
            setOrder(data);
        } catch (err: any) {
            setError("ID Pesanan tidak ditemukan. Pastikan kode yang Anda masukkan benar.");
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!order) return;
        setSubmittingAction(true);
        try {
            await orderService.approveDesign(order.id);
            const updatedStatus = "APPROVED";
            setOrder((prev: any) => ({
                ...prev,
                designStatus: updatedStatus,
                designFeedback: null
            }));
            setToast({ title: "Desain berhasil disetujui!", variant: "success" });
        } catch (error) {
            console.error("Gagal menyetujui desain:", error);
            setToast({ title: "Gagal menyetujui desain", variant: "destructive" });
        } finally {
            setSubmittingAction(false);
        }
    };

    const handleRevisi = async () => {
        if (!order || !feedbackInput.trim()) return;
        setSubmittingAction(true);
        try {
            await orderService.revisiDesign(order.id, feedbackInput);
            const updatedStatus = "REVISI";
            const feedbackVal = feedbackInput;
            setOrder((prev: any) => ({
                ...prev,
                designStatus: updatedStatus,
                designFeedback: feedbackVal
            }));
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

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        executeSearch(orderId);
    };

    const getCurrentStageIndex = () => {
        if (!order) return -1;
        return STAGES.findIndex(s => s.id === order.status);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-geist pb-20">
            {/* Hero Header */}
            <div className="bg-slate-900 pt-24 pb-40 px-10 relative overflow-hidden">
                <div className="w-full mx-auto relative z-10 text-center">
                    <h1 className="text-5xl font-black italic uppercase tracking-tighter text-white mb-4 leading-none">Lacak Pesanan Anda</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.4em] text-xs mb-12 italic">Cek Progress Pembuatan Jersey Custom Secara Real-Time</p>
                    
                    <form onSubmit={handleSearch} className="relative w-full mx-auto">
                        <input 
                            type="text" 
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                            placeholder="Masukkan Tracking ID (Contoh: JK-XXXXXX)"
                            className="w-full h-20 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] px-10 text-white text-xl font-black placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-[#D25026] transition-all text-center uppercase tracking-widest"
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="absolute right-3 top-3 bottom-3 bg-[#D25026] hover:bg-[#B34320] text-slate-900 px-8 rounded-[2rem] font-black italic uppercase tracking-widest text-xs transition-all shadow-lg flex items-center gap-3 active:scale-95"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search size={20} />}
                            Lacak
                        </button>
                    </form>
                </div>
                {/* Decorative Background */}
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border-[40px] border-white rounded-full"></div>
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full mx-auto -mt-20 px-10 relative z-20">
                {error && (
                    <div className="bg-red-50 border border-red-100 p-6 rounded-[2rem] flex items-center gap-4 text-red-600 animate-in fade-in slide-in-from-top-4">
                        <AlertCircle size={24} />
                        <p className="font-bold text-sm italic uppercase tracking-tight">{error}</p>
                    </div>
                )}

                {order && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        {/* Alternative fabric selection banner */}
                        {order.recommendedBahanIds && order.recommendedBahanIds.length > 0 && (
                            <div className="bg-orange-50 border border-orange-200 p-8 rounded-[3rem] shadow-xl space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center shrink-0">
                                        <AlertCircle className="text-[#D25026] w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-wider text-slate-900 leading-none">Bahan Jersey Habis!</h3>
                                        <p className="text-sm text-slate-600 font-medium leading-relaxed mt-1">
                                            Bahan pilihan jersey Anda saat ini sedang habis. Silakan pilih salah satu bahan alternatif di bawah ini untuk melanjutkan pesanan Anda:
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                                    {bahanList.filter(b => order.recommendedBahanIds.includes(b.id)).map(b => (
                                        <div key={b.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between gap-4 group hover:border-[#D25026]/30 transition-all">
                                            <div className="space-y-3">
                                                <div className="w-full aspect-video rounded-xl bg-slate-100 overflow-hidden relative">
                                                    {b.imageUrl ? (
                                                        <img src={UPLOADS_URL + b.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-slate-900 uppercase">{b.nama}</h4>
                                                    <p className="text-xs font-bold text-[#D25026] mt-0.5">
                                                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(b.harga || 150000)}
                                                    </p>
                                                </div>
                                            </div>
                                            <button 
                                                onClick={async () => {
                                                    try {
                                                        await orderService.selectAlternative(order.id, b.id);
                                                        setToast({ title: "Bahan berhasil diganti ke alternatif!", variant: "success" });
                                                        executeSearch(order.orderId);
                                                    } catch (error) {
                                                        console.error("Gagal memilih bahan alternatif:", error);
                                                        setToast({ title: "Gagal mengganti bahan", variant: "destructive" });
                                                    }
                                                }}
                                                className="w-full bg-slate-900 text-white rounded-xl py-3 font-black text-[10px] uppercase tracking-widest hover:bg-[#D25026] transition-colors"
                                            >
                                                Pilih Bahan Ini
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Status Stepper */}
                        <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50">
                            <div className="flex justify-between items-start mb-16">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Order Identity</p>
                                    <div className="flex items-center gap-3">
                                        <h2 className="text-3xl font-black text-slate-900 font-mono tracking-tighter">{order.orderId}</h2>
                                        {order.queueNumber && (
                                            <span className="bg-[#D25026]/10 text-[#D25026] px-3 py-1 rounded-xl text-xs font-black italic border border-[#D25026]/20">
                                                No. Antrean: {order.queueNumber}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">Current Status</p>
                                    <div className="flex items-center gap-2 justify-end">
                                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                                        <p className="text-xl font-black text-[#D25026] uppercase italic">
                                            {getDisplayStatus(order.status, order.isWorking)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                {/* Connector Line */}
                                <div className="absolute top-8 left-0 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-[#D25026] transition-all duration-1000 ease-out" 
                                        style={{ width: `${(getCurrentStageIndex() / (STAGES.length - 1)) * 100}%` }}
                                    ></div>
                                </div>

                                {/* Steps */}
                                <div className="relative flex justify-between">
                                    {STAGES.map((stage, idx) => {
                                        const isCompleted = idx <= getCurrentStageIndex();
                                        const isActive = idx === getCurrentStageIndex();
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
                    </div>

                    {/* Mockup Hasil Desain Section */}
                    {order.mockupUrl && (
                        <div className="bg-slate-900 text-white rounded-[3rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden">
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
                                        {order.designStatus === "SENT" && (
                                            <span className="bg-amber-500 text-slate-955 px-3 py-1 rounded-xl text-xs font-black italic">
                                                Menunggu Persetujuan Anda
                                            </span>
                                        )}
                                        {order.designStatus === "APPROVED" && (
                                            <span className="bg-emerald-500 text-slate-955 px-3 py-1 rounded-xl text-xs font-black italic">
                                                Disetujui
                                            </span>
                                        )}
                                        {order.designStatus === "REVISI" && (
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-xl text-xs font-black italic">
                                                Revisi Diajukan
                                            </span>
                                        )}
                                    </div>

                                    {/* Action Panel for SENT status or active REVISI editing */}
                                    {order.designStatus === "SENT" && !showRevisiForm && (
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

                                    {showRevisiForm && (order.designStatus === "SENT" || order.designStatus === "REVISI") && (
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

                                    {order.designStatus === "REVISI" && order.designFeedback && !showRevisiForm && (
                                        <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl space-y-4">
                                            <div className="space-y-1">
                                                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest italic">Catatan Revisi Anda:</p>
                                                <p className="text-sm text-red-200 font-bold leading-relaxed italic">"{order.designFeedback}"</p>
                                            </div>
                                            <div className="flex justify-between items-center pt-2">
                                                <p className="text-[9px] text-slate-400 italic">Menunggu desainer memperbarui mockup berdasarkan feedback Anda.</p>
                                                <button 
                                                    onClick={() => {
                                                        setFeedbackInput(order.designFeedback);
                                                        setShowRevisiForm(true);
                                                    }}
                                                    className="bg-[#D25026]/10 text-[#D25026] hover:bg-[#D25026]/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic transition-all"
                                                >
                                                    Edit Catatan Revisi
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {order.designStatus === "APPROVED" && (
                                        <div className="bg-emerald-500/10 border border-emerald-500/20 p-6 rounded-2xl">
                                            <p className="text-sm text-emerald-300 font-bold italic">
                                                Desain telah disetujui! Pesanan akan segera dilanjutkan ke tahap Layout Pola & Cetak.
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="w-full lg:w-96 space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Preview Mockup:</p>
                                    <div className="bg-white rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex items-center justify-center p-2">
                                        {order.mockupUrl.toLowerCase().endsWith('.pdf') ? (
                                            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 gap-4 w-full rounded-2xl">
                                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
                                                    <FileText size={32} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs font-black text-slate-900 uppercase italic">Dokumen PDF</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Mockup Desain</p>
                                                </div>
                                                <a 
                                                    href={order.mockupUrl.startsWith('http') ? order.mockupUrl : `${UPLOADS_URL}${order.mockupUrl.startsWith('/') ? '' : '/'}${order.mockupUrl}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-2.5 bg-red-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2 italic shadow-md shadow-red-500/20"
                                                >
                                                    <Eye size={12} /> Buka PDF
                                                </a>
                                            </div>
                                        ) : (
                                            <img 
                                                src={order.mockupUrl.startsWith('http') ? order.mockupUrl : `${UPLOADS_URL}${order.mockupUrl.startsWith('/') ? '' : '/'}${order.mockupUrl}`} 
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
                    {order.layoutUrl && (
                        <div className="bg-slate-900 text-white rounded-[3rem] p-10 border border-slate-800 shadow-2xl relative overflow-hidden mt-8">
                            <div className="relative z-10 flex flex-col lg:flex-row gap-10">
                                <div className="flex-1 space-y-6">
                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-black uppercase tracking-widest text-[#D25026] italic">
                                            Layout Pola Cetak Jersey Anda
                                        </h3>
                                    </div>
                                    <p className="text-sm text-slate-300 font-medium italic leading-relaxed">
                                        Layout pola cetak jersey Anda.
                                    </p>
                                    
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">Status Layout:</span>
                                        {order.layoutStatus === "SENT" && (
                                            <span className="bg-amber-500 text-slate-955 px-3 py-1 rounded-xl text-xs font-black italic">
                                                Menunggu Persetujuan
                                            </span>
                                        )}
                                        {order.layoutStatus === "APPROVED" && (
                                            <span className="bg-emerald-500 text-slate-955 px-3 py-1 rounded-xl text-xs font-black italic">
                                                Disetujui
                                            </span>
                                        )}
                                        {order.layoutStatus === "REVISI" && (
                                            <span className="bg-red-500 text-white px-3 py-1 rounded-xl text-xs font-black italic">
                                                Revisi Diajukan
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="w-full lg:w-96 space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">Preview Layout:</p>
                                    <div className="bg-white rounded-3xl overflow-hidden border border-slate-800 shadow-xl flex items-center justify-center p-2">
                                        {order.layoutUrl.toLowerCase().endsWith('.pdf') ? (
                                            <div className="flex flex-col items-center justify-center p-8 bg-slate-50 gap-4 w-full rounded-2xl">
                                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
                                                    <FileText size={32} />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-xs font-black text-slate-900 uppercase italic">Dokumen PDF</p>
                                                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Mockup Layout</p>
                                                </div>
                                                <a 
                                                    href={order.layoutUrl.startsWith('http') ? order.layoutUrl : `${UPLOADS_URL}${order.layoutUrl.startsWith('/') ? '' : '/'}${order.layoutUrl}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="px-6 py-2.5 bg-red-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-2 italic shadow-md shadow-red-500/20"
                                                >
                                                    <Eye size={12} /> Buka PDF
                                                </a>
                                            </div>
                                        ) : (
                                            <img 
                                                src={order.layoutUrl.startsWith('http') ? order.layoutUrl : `${UPLOADS_URL}${order.layoutUrl.startsWith('/') ? '' : '/'}${order.layoutUrl}`} 
                                                alt="Mockup Layout" 
                                                className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-2xl" 
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                        {/* Order Info Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                        <Package className="text-[#D25026]" size={16} /> Detail Pesanan
                                    </h3>
                                    {order.status !== "DITOLAK" && (
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
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Pemesan</p>
                                        <p className="text-sm font-black text-slate-900 uppercase italic">{order.customerName}</p>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Item</p>
                                        <p className="text-sm font-black text-slate-900 uppercase italic">{order.details?.[0]?.productTitle || "Custom Jersey"}</p>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Total Unit</p>
                                        <p className="text-sm font-black text-slate-900 uppercase italic">{order.details?.length} Unit</p>
                                    </div>
                                    <div className="pt-4 border-t border-slate-50 mt-4">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-4">Daftar Pemain</p>
                                        <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                                <table className="w-full text-left relative">
                                                    <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm">
                                                        <tr>
                                                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest italic">Nama</th>
                                                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest italic text-center">No</th>
                                                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest italic text-center">Size</th>
                                                            <th className="px-4 py-3 text-[9px] font-black text-slate-500 uppercase tracking-widest italic text-center">Lengan</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100 bg-slate-50">
                                                        {sortPlayersBySize(order.details || []).map((item: any, idx: number) => {
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
                                                                <tr key={idx} className="hover:bg-white transition-colors">
                                                                    <td className="px-4 py-3 text-[11px] font-black text-slate-900 uppercase italic">{item.playerName || "-"}</td>
                                                                    <td className="px-4 py-3 text-[11px] font-black text-[#D25026] text-center">{item.playerNumber || "-"}</td>
                                                                    <td className="px-4 py-3 text-center">
                                                                        <span className="bg-white px-2 py-1 rounded text-[9px] font-black italic border border-slate-200">{sizeOnly}</span>
                                                                    </td>
                                                                    <td className="px-4 py-3 text-center text-[11px] font-medium text-slate-600">
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
                                    <div className="flex justify-between items-center py-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Tanggal Order</p>
                                        <p className="text-sm font-black text-slate-900 uppercase italic">
                                            {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Information Card */}
                            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-6">
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                                    <Truck className="text-[#D25026]" size={16} /> Informasi Pengiriman
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-slate-50">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Metode Pengiriman</p>
                                        <p className="text-sm font-black text-slate-900 uppercase italic">
                                            {order.shippingMethod === "COD" ? "COD (Penerima yang bayar)" : "Ambil di tempat"}
                                        </p>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic mb-2">
                                            {order.shippingMethod === "COD" ? "Alamat Tujuan COD" : "Alamat Toko (Kunjungi Toko)"}
                                        </p>
                                        <div className="text-sm text-slate-700 font-medium leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono">
                                            {order.shippingMethod === "COD"
                                                ? (order.shippingAddress || "Alamat tidak diisi.")
                                                : "Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178"
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-[#D25026] mb-6 italic">Butuh Bantuan?</h3>
                                    <p className="text-sm text-slate-400 font-medium leading-relaxed italic mb-8">
                                        Jika Anda memiliki pertanyaan mengenai status pesanan Anda, silakan hubungi tim dukungan kami melalui chat atau WhatsApp.
                                    </p>
                                    <button className="bg-white text-slate-900 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest italic hover:bg-[#D25026] transition-colors">
                                        Hubungi Admin
                                    </button>
                                </div>
                                <div className="absolute -right-6 -bottom-6 opacity-5 transform rotate-12">
                                    <Truck size={120} />
                                </div>
                            </div>
                        </div>
                    </div>
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
