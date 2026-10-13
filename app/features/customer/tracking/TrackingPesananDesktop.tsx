import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { Search, Package, Clock, CheckCircle2, Truck, FileText, AlertCircle, Loader2, ChevronRight, MapPin, Printer, User, Scissors, Palette, Ruler, Eye, HelpCircle, MessageCircle } from "lucide-react";
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

    const handleUnapproveDesign = async () => {
        if (!order) return;
        setSubmittingAction(true);
        try {
            await orderService.unapproveDesign(order.id);
            const updatedStatus = "SENT";
            setOrder((prev: any) => ({
                ...prev,
                designStatus: updatedStatus
            }));
            setToast({ title: "Persetujuan desain dibatalkan!", variant: "success" });
        } catch (error) {
            console.error("Gagal membatalkan persetujuan desain:", error);
            setToast({ title: "Gagal membatalkan persetujuan desain", variant: "destructive" });
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
            {/* Hero Header matching Reference */}
            <div className="w-full bg-[#F4F6F8] border-b border-slate-200/80 pt-12 pb-14 px-8 lg:px-16 xl:px-24 relative overflow-hidden">
                {/* Background decorative dots */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-70 pointer-events-none"></div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
                    {/* Left Column: Help Center + Title + Subtitle + Search */}
                    <div className="lg:col-span-7 w-full min-w-0 space-y-5">
                        <div className="inline-block bg-[#EFD33D] text-[#191C1F] text-xs font-black px-3.5 py-1.5 rounded uppercase tracking-wider shadow-xs">
                            HELP CENTER
                        </div>
                        <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-[#191C1F] tracking-tight leading-tight">
                            How we can help you!
                        </h1>
                        <p className="text-slate-600 font-medium text-sm lg:text-base leading-relaxed w-full">
                            Lacak status progres produksi dan pengiriman jersey custom FCSV Anda secara real-time dengan memasukkan Tracking ID.
                        </p>

                        <form onSubmit={handleSearch} className="w-full pt-2">
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-2 flex items-center gap-3 w-full focus-within:ring-2 focus-within:ring-[#2DA5F3] focus-within:border-transparent transition-all">
                                <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                                <input 
                                    type="text" 
                                    value={orderId}
                                    onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                                    placeholder="Masukkan Tracking ID (Contoh: JK-XXXXXX)..."
                                    className="flex-1 bg-transparent border-none text-slate-800 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-0 px-2 uppercase tracking-wider"
                                />
                                <button 
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#2DA5F3] hover:bg-[#1E94E0] active:scale-95 transition-all text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shrink-0 flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>SEARCH</span>}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: FCSV_Jersey Image */}
                    <div className="lg:col-span-5 w-full min-w-0 flex justify-center lg:justify-end items-center relative">
                        <div className="relative w-full max-w-[500px]">
                            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-16 h-28 bg-[radial-gradient(#94a3b8_2px,transparent_2px)] [background-size:12px_12px] opacity-40 pointer-events-none hidden sm:block"></div>
                            <img 
                                src="/images/FCSV_Jersey.webp" 
                                alt="FCSV Customer Support & Tracking" 
                                className="w-full h-auto max-h-[380px] lg:max-h-[420px] object-contain drop-shadow-xl rounded-2xl"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="w-full pt-10 pb-20 px-8 lg:px-16 xl:px-24 relative z-20">
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
																{(order.status === 'DESAIN' || order.status === 'LAYOUT') && (
																	<button onClick={handleUnapproveDesign} disabled={submittingAction} className="mt-3 bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest italic w-fit active:scale-95 transition-all shadow-md disabled:opacity-50">Batal Setuju</button>
																)}
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
                                    <button 
                                        onClick={() => window.open('https://wa.me/6285892720034?text=Halo%20Admin%20FCSV%2C%20saya%20ingin%20menanyakan%20status%20pesanan%20jersey', '_blank')}
                                        className="bg-white text-slate-900 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest italic hover:bg-[#D25026] hover:text-white transition-colors cursor-pointer"
                                    >
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

                {/* Initial State / Panduan Pelacakan Pesanan */}
                {!order && !error && (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500 w-full mx-auto">
                        {/* 3 Steps Guide Card */}
                        <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-slate-150 shadow-2xl shadow-slate-200/60">
                            <div className="text-center w-full mb-12">
                                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#D25026] block mb-2">
                                    Cara Kerja Sistem Pelacakan
                                </span>
                                <h2 className="text-3xl font-black italic uppercase tracking-tight text-slate-900">
                                    3 Langkah Mudah Cek Status Jersey
                                </h2>
                                <p className="text-slate-500 text-sm font-medium mt-2 leading-relaxed">
                                    Pantau setiap progres produksi jersey custom Anda secara transparan dan akurat.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Step 1 */}
                                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#D25026]/40 transition-all flex flex-col justify-between group">
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-[#D25026]/10 text-[#D25026] flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                                                <FileText size={22} />
                                            </div>
                                            <span className="text-3xl font-black italic text-slate-300 font-mono">01</span>
                                        </div>
                                        <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-900 mb-2">
                                            Cek ID Pesanan
                                        </h3>
                                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                            Dapatkan kode tracking berformat <span className="font-mono font-bold text-slate-900">JK-XXXXXX</span> yang tercantum pada nota pemesanan atau konfirmasi pesan WhatsApp Anda.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        Format kode resmi FCSV
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#D25026]/40 transition-all flex flex-col justify-between group">
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                                                <Search size={22} />
                                            </div>
                                            <span className="text-3xl font-black italic text-slate-300 font-mono">02</span>
                                        </div>
                                        <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-900 mb-2">
                                            Ketik & Cari
                                        </h3>
                                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                            Ketikkan ID pesanan pada kolom pencarian di atas, lalu klik tombol <strong className="text-slate-900">Lacak</strong> untuk memuat data pengerjaan terkini.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        Pencarian instan real-time
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#D25026]/40 transition-all flex flex-col justify-between group">
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                                                <Eye size={22} />
                                            </div>
                                            <span className="text-3xl font-black italic text-slate-300 font-mono">03</span>
                                        </div>
                                        <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-900 mb-2">
                                            Pantau & Setujui
                                        </h3>
                                        <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                            Lihat status tahapan pengerjaan, tinjau mockup desain 3D, ajukan revisi, atau konfirmasi persetujuan desain langsung di halaman ini.
                                        </p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-[11px] font-bold text-slate-400">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        Fitur approval mandiri
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 6 Production Stages Card */}
                        <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-slate-150 shadow-2xl shadow-slate-200/60">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-10 pb-6 border-b border-slate-100">
                                <div className="md:col-span-7">
                                    <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#D25026] block mb-2">
                                        Alur Workshop FCSV
                                    </span>
                                    <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-slate-900">
                                        6 Tahap Produksi Jersey Custom
                                    </h2>
                                </div>
                                <div className="md:col-span-5 md:text-right">
                                    <p className="text-xs md:text-sm text-slate-500 font-medium leading-relaxed">
                                        Setiap pesanan melewati standar operasional ketat untuk menjamin presisi warna, ukuran, dan kenyamanan kain saat digunakan bertanding.
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {STAGES.map((stage, idx) => {
                                    const Icon = stage.icon;
                                    return (
                                        <div key={stage.id} className="p-6 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-white hover:border-[#D25026]/30 transition-all flex items-start gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#D25026] shadow-sm">
                                                <Icon size={20} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D25026] bg-[#D25026]/10 px-2 py-0.5 rounded-full font-mono">
                                                        Tahap 0{idx + 1}
                                                    </span>
                                                    <h4 className="text-sm font-black text-slate-900 uppercase italic">
                                                        {stage.label}
                                                    </h4>
                                                </div>
                                                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                                    {stage.id === "MENUNGGU" && "Verifikasi kelengkapan DP dan daftar pemain oleh tim admin."}
                                                    {stage.id === "DESAIN" && "Pembuatan mockup visual jersey 3D dan proses approval customer."}
                                                    {stage.id === "LAYOUT" && "Penataan file pola potong, nomor punggung, dan size chart jersey."}
                                                    {stage.id === "PRINT" && "Pencetakan tinta sublimasi berkualitas tinggi ke atas kain jersey."}
                                                    {stage.id === "FINISHING" && "Proses penjahitan presisi, obras, pembersihan benang, dan QC."}
                                                    {stage.id === "SELESAI" && "Pengepakan eksklusif siap diambil di workshop atau dikirimkan."}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Guarantee & Help Banner */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Quality Pillars */}
                            <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                                <div className="relative z-10 space-y-4">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D25026]">
                                        Standar Produksi Terpercaya
                                    </span>
                                    <h3 className="text-2xl font-black italic uppercase tracking-tight">
                                        Komitmen Kualitas FCSV Apparel
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                            <div className="text-emerald-400 font-black text-lg mb-1">100%</div>
                                            <div className="text-xs font-bold text-white uppercase">Kain Original</div>
                                            <div className="text-[11px] text-slate-400 mt-1">Dryfit Milano, Brazil, & Serena premium.</div>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                            <div className="text-amber-400 font-black text-lg mb-1">HD Print</div>
                                            <div className="text-xs font-bold text-white uppercase">Tinta Anti Luntur</div>
                                            <div className="text-[11px] text-slate-400 mt-1">Warna tajam beresolusi tinggi dan tahan cuci.</div>
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                            <div className="text-blue-400 font-black text-lg mb-1">QC Ketat</div>
                                            <div className="text-xs font-bold text-white uppercase">Jahitan Rapi</div>
                                            <div className="text-[11px] text-slate-400 mt-1">Pemeriksaan detail ukuran sebelum dikemas.</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                                    <Scissors size={240} />
                                </div>
                            </div>

                            {/* Help & Support Card */}
                            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-150 shadow-2xl shadow-slate-200/60 flex flex-col justify-between">
                                <div>
                                    <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#D25026] flex items-center justify-center font-black mb-4">
                                        <HelpCircle size={24} />
                                    </div>
                                    <h3 className="text-lg font-black uppercase italic tracking-tight text-slate-900 mb-2">
                                        Lupa ID Pesanan?
                                    </h3>
                                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                                        Jika Anda kehilangan nota atau membutuhkan konfirmasi status pesanan, tim layanan pelanggan kami siap membantu memeriksa data Anda.
                                    </p>
                                </div>

                                <div className="mt-8 space-y-3">
                                    <a
                                        href="https://wa.me/6285892720034?text=Halo%20Admin%20FCSV%2C%20saya%20ingin%20menanyakan%20status%20pesanan%20jersey"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-[#D25026] hover:bg-[#B34320] text-slate-900 font-black uppercase italic text-xs tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                                    >
                                        <MessageCircle size={16} />
                                        Bantuan WhatsApp
                                    </a>
                                    <a
                                        href="/faq"
                                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold uppercase text-[11px] tracking-wider py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all"
                                    >
                                        Bantuan & FAQ
                                    </a>
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


