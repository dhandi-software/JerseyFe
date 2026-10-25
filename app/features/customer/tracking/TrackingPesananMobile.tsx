import { Search, Package, Clock, CheckCircle2, Truck, FileText, AlertCircle, Loader2, ChevronRight, MapPin, Printer, User, Scissors, Palette, Ruler, Eye, MessageCircle, HelpCircle } from "lucide-react";
import { cn } from "~/lib/utils";
import { sortPlayersBySize } from "~/lib/sizeUtils";
import { UPLOADS_URL } from "~/api/client";
import { Toast } from "~/components/ui/toast";
import { useTrackingPesanan } from "~/hooks";

export function TrackingPesananMobile() {
    const {
        orderId,
        setOrderId,
        order,
        loading,
        error,
        feedbackInput,
        setFeedbackInput,
        showRevisiForm,
        setShowRevisiForm,
        submittingAction,
        toast,
        setToast,
        bahanList,
        isPrinting,
        handlePrintInvoice,
        handleApprove,
        handleUnapproveDesign,
        handleRevisi,
        handleSelectAlternative,
        handleSearch,
        getCurrentStageIndex,
        stages: STAGES,
        getDisplayStatus,
    } = useTrackingPesanan();


    return (
        <div className="min-h-screen bg-slate-50 font-sans pb-20 w-full overflow-x-hidden">
            {/* Header matching Reference */}
            <div className="bg-[#F4F6F8] border-b border-slate-200/80 pt-6 pb-6 px-4 relative overflow-hidden w-full">
                {/* Background decorative dots */}
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-70 pointer-events-none"></div>

                <div className="relative z-10 space-y-3 w-full">
                    <div className="inline-block bg-[#EFD33D] text-[#191C1F] text-[10px] font-black px-2.5 py-1 rounded uppercase tracking-wider shadow-xs">
                        HELP CENTER
                    </div>
                    <h1 className="text-2xl font-black text-[#191C1F] tracking-tight leading-tight">
                        How we can help you!
                    </h1>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        Lacak status pembuatan jersey custom FCSV secara real-time
                    </p>

                    <form onSubmit={handleSearch} className="w-full pt-1">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1.5 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#2DA5F3] focus-within:border-transparent transition-all">
                            <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                            <input 
                                type="text" 
                                value={orderId}
                                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                                placeholder="Masukkan Tracking ID (JK-XXXXXX)"
                                className="flex-1 bg-transparent border-none text-slate-800 text-xs font-bold placeholder:text-slate-400 focus:outline-none focus:ring-0 px-1 uppercase tracking-wider"
                            />
                            <button 
                                type="submit"
                                disabled={loading}
                                aria-label="Search"
                                className="h-9 px-4 bg-[#2DA5F3] hover:bg-[#1E94E0] text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center shrink-0 shadow-xs active:scale-95 cursor-pointer transition-all disabled:opacity-70"
                            >
                                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <span>SEARCH</span>}
                            </button>
                        </div>
                    </form>

                    {/* FCSV_Jersey Image showcase */}
                    <div className="pt-2 w-full">
                        <div className="w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-xs">
                            <img 
                                src="/images/FCSV_Jersey.webp" 
                                alt="FCSV Customer Support & Tracking" 
                                className="w-full h-44 object-cover object-center"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="px-4 pt-5 pb-16 relative z-20 space-y-4 w-full">
                {error && (
                    <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-600">
                        <AlertCircle size={18} />
                        <p className="font-bold text-xs">{error}</p>
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
                                                onClick={() => handleSelectAlternative(b.id)}
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
																{(order.status === 'DESAIN' || order.status === 'LAYOUT') && (
																	<button onClick={handleUnapproveDesign} disabled={submittingAction} className="mt-3 bg-red-500/90 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest italic w-fit active:scale-95 transition-all shadow-md disabled:opacity-50">Batal Setuju</button>
																)}
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
                                                    <th className="px-2 py-2 text-[8px] font-black text-slate-500 uppercase tracking-widest italic text-center">Baju</th>
                                                    <th className="px-2 py-2 text-[8px] font-black text-slate-500 uppercase tracking-widest italic text-center">Celana</th>
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
                                                            <td className="px-2 py-2 text-center">
                                                                <span className={cn(
                                                                    "inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                                                                    item.statusBaju
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : "bg-slate-200 text-slate-500"
                                                                )}>
                                                                    {item.statusBaju ? "Ready" : "Belum"}
                                                                </span>
                                                            </td>
                                                            <td className="px-2 py-2 text-center">
                                                                <span className={cn(
                                                                    "inline-block px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider",
                                                                    item.statusCelana
                                                                        ? "bg-emerald-100 text-emerald-700"
                                                                        : "bg-slate-200 text-slate-500"
                                                                )}>
                                                                    {item.statusCelana ? "Ready" : "Belum"}
                                                                </span>
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
                            <button 
                                onClick={() => window.open('https://wa.me/6285892720034?text=Halo%20Admin%20FCSV%2C%20saya%20ingin%20menanyakan%20status%20pesanan%20jersey', '_blank')}
                                className="w-full min-h-[44px] bg-[#D25026] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest italic flex items-center justify-center gap-2 active:scale-98 transition-transform cursor-pointer shadow-sm"
                            >
                                <MessageCircle size={14} />
                                Hubungi Support (+62 858-9272-0034)
                            </button>
                        </div>
                    </div>
                )}

                {/* Initial State / Panduan Mobile */}
                {!order && !error && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 w-full">
                        {/* 3 Steps Guide */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm w-full">
                            <div className="text-center mb-4">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D25026] block mb-1">
                                    Panduan Singkat
                                </span>
                                <h2 className="text-lg font-black text-slate-900 tracking-tight leading-snug">
                                    3 Langkah Cek Pesanan
                                </h2>
                                <p className="text-slate-500 text-xs font-medium mt-1">
                                    Ketahui progres pembuatan jersey custom Anda kapan saja.
                                </p>
                            </div>

                            <div className="space-y-2.5">
                                {/* Step 1 */}
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[#D25026]/10 text-[#D25026] flex items-center justify-center font-bold shrink-0">
                                        <FileText size={17} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="text-xs font-bold text-slate-900">
                                                1. Cek Kode ID
                                            </h3>
                                            <span className="text-[9px] font-mono font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">JK-XXXXXX</span>
                                        </div>
                                        <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                                            Lihat nomor tracking pada nota fisik atau konfirmasi chat admin FCSV.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 2 */}
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                                        <Search size={17} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xs font-bold text-slate-900">
                                            2. Masukkan ID & Lacak
                                        </h3>
                                        <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                                            Ketik kode di kolom atas lalu tekan tombol cari untuk memuat status terkini.
                                        </p>
                                    </div>
                                </div>

                                {/* Step 3 */}
                                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                                        <Eye size={17} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-xs font-bold text-slate-900">
                                            3. Pantau & Setujui
                                        </h3>
                                        <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                                            Tinjau foto produksi, preview desain 3D, dan konfirmasi persetujuan mockup.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 6 Stages Mobile */}
                        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm w-full">
                            <div className="mb-3.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#D25026] block mb-1">
                                    Alur Produksi
                                </span>
                                <h3 className="text-lg font-black text-slate-900 tracking-tight">
                                    6 Tahapan Pengerjaan
                                </h3>
                            </div>

                            <div className="grid grid-cols-2 gap-2.5">
                                {STAGES.map((stage, idx) => {
                                    const Icon = stage.icon;
                                    return (
                                        <div key={stage.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#D25026]">
                                                    <Icon size={14} />
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-400">
                                                    0{idx + 1}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-slate-900 leading-tight">
                                                    {stage.label}
                                                </h4>
                                                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                                                    {stage.id === "MENUNGGU" && "Cek DP & order"}
                                                    {stage.id === "DESAIN" && "Mockup 3D"}
                                                    {stage.id === "LAYOUT" && "Pola ukuran"}
                                                    {stage.id === "PRINT" && "Cetak sublim"}
                                                    {stage.id === "FINISHING" && "Jahit & QC"}
                                                    {stage.id === "SELESAI" && "Siap kirim"}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quality Highlight */}
                        <div className="bg-slate-900 p-5 rounded-2xl text-white w-full space-y-4">
                            <div>
                                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-[#D25026] block mb-1">
                                    Kualitas Terjamin
                                </span>
                                <h3 className="text-base font-black text-white tracking-tight">
                                    Standar Produksi FCSV
                                </h3>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                    <span>Kain Dryfit Premium berdaya serap tinggi</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                    <span>Tinta cetak sublimasi tajam dan anti luntur</span>
                                </div>
                                <div className="flex items-center gap-2.5 text-xs text-slate-300">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                                    <span>QC inspeksi jahitan rapi dan presisi ukuran</span>
                                </div>
                            </div>

                            <div className="pt-2 border-t border-white/10 space-y-2">
                                <a
                                    href="https://wa.me/6285892720034?text=Halo%20Admin%20FCSV%2C%20saya%20ingin%20menanyakan%20status%20pesanan%20jersey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full h-11 bg-[#D25026] hover:bg-[#B3411A] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm cursor-pointer"
                                >
                                    <MessageCircle size={15} />
                                    <span>Bantuan CS via WhatsApp</span>
                                </a>
                                <a
                                    href="/faq"
                                    className="w-full h-10 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                                >
                                    <span>Pusat Bantuan & FAQ</span>
                                </a>
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



