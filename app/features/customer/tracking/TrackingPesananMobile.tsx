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

export function TrackingPesananMobile() {
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
            setError("ID tidak ditemukan");
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
            {/* Header */}
            <div className="bg-slate-900 pt-16 pb-24 px-6 relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">Lacak Jersey</h1>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Real-Time Production Tracking</p>
                    </div>

                    <form onSubmit={handleSearch} className="relative">
                        <input 
                            type="text" 
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                            placeholder="Tracking ID (JK-XXXXXX)"
                            className="w-full h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl px-6 text-white text-sm font-black placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D25026] text-center uppercase tracking-[0.2em]"
                        />
                        <button 
                            type="submit"
                            disabled={loading}
                            className="absolute right-2 top-2 bottom-2 bg-[#D25026] text-slate-900 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest italic flex items-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search size={16} />}
                        </button>
                    </form>
                </div>
            </div>

            <div className="px-6 -mt-10 relative z-20 space-y-6">
                {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-600">
                        <AlertCircle size={18} />
                        <p className="font-bold text-[10px] italic uppercase tracking-tight">{error}</p>
                    </div>
                )}

                {order && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-500">
                        {/* Alternative fabric selection banner */}
                        {order.recommendedBahanIds && order.recommendedBahanIds.length > 0 && (
                            <div className="bg-orange-50 border border-orange-200 p-6 rounded-[2rem] shadow-xl space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                                        <AlertCircle className="text-[#D25026] w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 leading-none">Bahan Jersey Habis!</h3>
                                        <p className="text-[10px] text-slate-600 font-medium leading-relaxed mt-1">
                                            Bahan pilihan jersey Anda saat ini sedang habis. Silakan pilih salah satu bahan alternatif di bawah ini untuk melanjutkan pesanan Anda:
                                        </p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 pt-2">
                                    {bahanList.filter(b => order.recommendedBahanIds.includes(b.id)).map(b => (
                                        <div key={b.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between gap-3 group hover:border-[#D25026]/30 transition-all">
                                            <div className="flex items-center gap-3">
                                                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative">
                                                    {b.imageUrl ? (
                                                        <img src={UPLOADS_URL + b.imageUrl} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-350 text-[8px]">
                                                            No Image
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-xs font-black text-slate-900 uppercase">{b.nama}</h4>
                                                    <p className="text-[10px] font-bold text-[#D25026] mt-0.5">
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
                                                className="w-full bg-slate-900 text-white rounded-lg py-2.5 font-black text-[9px] uppercase tracking-widest hover:bg-[#D25026] transition-colors"
                                            >
                                                Pilih Bahan Ini
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Main Status Card */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest italic mb-0.5">Order ID</p>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-black text-slate-900 font-mono tracking-tighter">{order.orderId}</h2>
                                        {order.queueNumber && (
                                            <span className="bg-[#D25026]/10 text-[#D25026] px-2 py-0.5 rounded-md text-[8px] font-black uppercase italic border border-[#D25026]/20">
                                                Antrean: {order.queueNumber}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className={cn("px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border bg-[#D25026] text-slate-900 border-[#D25026]/20")}>
                                        {getDisplayStatus(order.status, order.isWorking)}
                                    </div>
                                </div>
                            </div>

                            {/* Vertical Stepper */}
                            <div className="space-y-6">
                                {STAGES.map((stage, idx) => {
                                    const isCompleted = idx <= getCurrentStageIndex();
                                    const isActive = idx === getCurrentStageIndex();
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
                    {order.mockupUrl && (
                        <div className="bg-slate-900 text-white p-6 rounded-[2rem] border border-slate-800 shadow-xl space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#D25026] italic">
                                Hasil Desain Mockup
                            </h3>
                            <p className="text-[10px] text-slate-300 font-medium italic leading-relaxed">
                                Silakan tinjau mockup desain jersey Anda di bawah ini sebelum kami melanjutkan ke proses layout pola cetak.
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Status:</span>
                                {order.designStatus === "SENT" && (
                                    <span className="bg-amber-500 text-slate-955 px-2.5 py-0.5 rounded-lg text-[10px] font-black italic">
                                        Menunggu Persetujuan
                                    </span>
                                )}
                                {order.designStatus === "APPROVED" && (
                                    <span className="bg-emerald-500 text-slate-955 px-2.5 py-0.5 rounded-lg text-[10px] font-black italic">
                                        Disetujui
                                    </span>
                                )}
                                {order.designStatus === "REVISI" && (
                                    <span className="bg-red-500 text-white px-2.5 py-0.5 rounded-lg text-[10px] font-black italic">
                                        Revisi Diajukan
                                    </span>
                                )}
                            </div>

                            {/* Preview Mockup */}
                            <div className="bg-white rounded-2xl overflow-hidden border border-slate-800 shadow-md p-1.5">
                                {order.mockupUrl.toLowerCase().endsWith('.pdf') ? (
                                    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 gap-3 rounded-xl">
                                        <FileText size={28} className="text-red-500" />
                                        <p className="text-[10px] font-black text-slate-900 uppercase italic">Mockup PDF</p>
                                        <a 
                                            href={order.mockupUrl.startsWith('http') ? order.mockupUrl : `${UPLOADS_URL}${order.mockupUrl.startsWith('/') ? '' : '/'}${order.mockupUrl}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-1 italic"
                                        >
                                            <Eye size={10} /> Buka PDF
                                        </a>
                                    </div>
                                ) : (
                                    <img 
                                        src={order.mockupUrl.startsWith('http') ? order.mockupUrl : `${UPLOADS_URL}${order.mockupUrl.startsWith('/') ? '' : '/'}${order.mockupUrl}`} 
                                        className="w-full h-auto max-h-[200px] object-contain mx-auto rounded-xl" 
                                    />
                                )}
                            </div>

                            {/* Actions for SENT status or active REVISI editing */}
                            {order.designStatus === "SENT" && !showRevisiForm && (
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

                            {showRevisiForm && (order.designStatus === "SENT" || order.designStatus === "REVISI") && (
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

                            {order.designStatus === "REVISI" && order.designFeedback && !showRevisiForm && (
                                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl space-y-3">
                                    <div className="space-y-1">
                                        <p className="text-[8px] font-black text-red-400 uppercase tracking-widest italic">Catatan Revisi:</p>
                                        <p className="text-xs text-red-200 font-bold leading-relaxed italic">"{order.designFeedback}"</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-1">
                                        <p className="text-[8px] text-slate-400 italic">Menunggu update dari desainer.</p>
                                        <button 
                                            onClick={() => {
                                                setFeedbackInput(order.designFeedback);
                                                setShowRevisiForm(true);
                                            }}
                                            className="bg-[#D25026]/10 text-[#D25026] px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest italic"
                                        >
                                            Edit Catatan
                                        </button>
                                    </div>
                                </div>
                            )}

                            {order.designStatus === "APPROVED" && (
                                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                                    <p className="text-xs text-emerald-300 font-bold italic">
                                        Desain disetujui! Segera dilanjutkan ke tahap berikutnya.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Layout Pola Cetak Card Mobile */}
                    {order.layoutUrl && (
                        <div className="bg-slate-900 text-white p-6 rounded-[2rem] border border-slate-800 shadow-xl space-y-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-[#D25026] italic">
                                Layout Pola Cetak
                            </h3>
                            <p className="text-[10px] text-slate-300 font-medium italic leading-relaxed">
                                Layout pola cetak jersey Anda.
                            </p>
                            
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[8px] font-black uppercase tracking-widest text-slate-400 italic">Status:</span>
                                {order.layoutStatus === "SENT" && (
                                    <span className="bg-amber-500 text-slate-955 px-2.5 py-0.5 rounded-lg text-[10px] font-black italic">
                                        Menunggu Persetujuan
                                    </span>
                                )}
                                {order.layoutStatus === "APPROVED" && (
                                    <span className="bg-emerald-500 text-slate-955 px-2.5 py-0.5 rounded-lg text-[10px] font-black italic">
                                        Disetujui
                                    </span>
                                )}
                                {order.layoutStatus === "REVISI" && (
                                    <span className="bg-red-500 text-white px-2.5 py-0.5 rounded-lg text-[10px] font-black italic">
                                        Revisi Diajukan
                                    </span>
                                )}
                            </div>

                            {/* Preview Layout */}
                            <div className="bg-white rounded-2xl overflow-hidden border border-slate-800 shadow-md p-1.5">
                                {order.layoutUrl.toLowerCase().endsWith('.pdf') ? (
                                    <div className="flex flex-col items-center justify-center p-6 bg-slate-50 gap-3 rounded-xl">
                                        <FileText size={28} className="text-red-500" />
                                        <p className="text-[10px] font-black text-slate-900 uppercase italic">Layout PDF</p>
                                        <a 
                                            href={order.layoutUrl.startsWith('http') ? order.layoutUrl : `${UPLOADS_URL}${order.layoutUrl.startsWith('/') ? '' : '/'}${order.layoutUrl}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center gap-1 italic"
                                        >
                                            <Eye size={10} /> Buka PDF
                                        </a>
                                    </div>
                                ) : (
                                    <img 
                                        src={order.layoutUrl.startsWith('http') ? order.layoutUrl : `${UPLOADS_URL}${order.layoutUrl.startsWith('/') ? '' : '/'}${order.layoutUrl}`} 
                                        className="w-full h-auto max-h-[200px] object-contain mx-auto rounded-xl" 
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* Order Details Mini Card */}
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-[9px] font-black uppercase tracking-widest text-slate-900 italic flex items-center gap-2">
                                    <Package className="text-[#D25026]" size={12} /> Info Pesanan
                                </h3>
                                {order.status !== "DITOLAK" && (
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
                            <div className="grid grid-cols-2 gap-4 border-b border-slate-50 pb-3">
                                <div>
                                    <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest italic mb-0.5">Pemesan</p>
                                    <p className="text-[10px] font-bold text-slate-700 uppercase italic truncate">{order.customerName}</p>
                                </div>
                                <div>
                                    <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest italic mb-0.5">Produk</p>
                                    <p className="text-[10px] font-bold text-slate-700 uppercase italic truncate">{order.details?.[0]?.productTitle || "Custom Jersey"}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 border-b border-slate-50 pb-3">
                                <div>
                                    <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest italic mb-0.5">Jumlah</p>
                                    <p className="text-[10px] font-bold text-slate-700 uppercase italic">{order.details?.length} Unit</p>
                                </div>
                            </div>
                            <div className="pt-3">
                                <p className="text-[7px] font-black text-slate-300 uppercase tracking-widest italic mb-2">Daftar Pemain</p>
                                <div className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                        <table className="w-full text-left relative">
                                            <thead className="bg-slate-100 sticky top-0 z-10 shadow-sm">
                                                <tr>
                                                    <th className="px-3 py-2 text-[8px] font-black text-slate-500 uppercase tracking-widest italic">Nama</th>
                                                    <th className="px-3 py-2 text-[8px] font-black text-slate-500 uppercase tracking-widest italic text-center">No</th>
                                                    <th className="px-3 py-2 text-[8px] font-black text-slate-500 uppercase tracking-widest italic text-center">Size</th>
                                                    <th className="px-3 py-2 text-[8px] font-black text-slate-500 uppercase tracking-widest italic text-center">Lengan</th>
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
                                                            <td className="px-3 py-2 text-[10px] font-black text-slate-900 uppercase italic truncate max-w-[100px]">{item.playerName || "-"}</td>
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
                        </div>

                        {/* Shipping Information Card Mobile */}
                        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                                <Truck className="text-[#D25026]" size={14} /> Informasi Pengiriman
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Metode Pengiriman:</p>
                                    <p className="text-xs font-black text-slate-900 uppercase italic">
                                        {order.shippingMethod === "COD" ? "COD (Penerima yang bayar)" : "Ambil di tempat"}
                                    </p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest italic mb-1">
                                        {order.shippingMethod === "COD" ? "Alamat Tujuan COD:" : "Alamat Toko (Kunjungi Toko):"}
                                    </p>
                                    <p className="text-[10px] text-slate-700 font-medium italic leading-relaxed">
                                        {order.shippingMethod === "COD" 
                                            ? (order.shippingAddress || "Alamat tidak diisi.")
                                            : "Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178"
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Help Card */}
                        <div className="bg-slate-900 p-6 rounded-[2.5rem] text-white">
                            <h4 className="text-sm font-black uppercase italic tracking-tighter mb-2">Butuh Bantuan?</h4>
                            <p className="text-[9px] text-slate-400 font-medium italic leading-relaxed mb-4">
                                Hubungi admin jika kode pelacakan tidak valid atau bermasalah.
                            </p>
                            <button className="w-full bg-[#D25026] text-slate-900 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest italic">
                                Hubungi Support
                            </button>
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
