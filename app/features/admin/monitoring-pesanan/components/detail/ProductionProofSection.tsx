import { Printer, CheckCircle, Upload, Loader2 } from "lucide-react";
import { UPLOADS_URL } from "~/api/client";
import type { MonitoringOrder } from "~/types";

interface ProductionProofSectionProps {
    order: MonitoringOrder;
    isUploadingPrint: boolean;
    handleUploadPrint: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    isUploadingFinishing: boolean;
    handleUploadFinishing: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
    variant?: "desktop" | "mobile";
}

export function ProductionProofSection({
    order,
    isUploadingPrint,
    handleUploadPrint,
    isUploadingFinishing,
    handleUploadFinishing,
    variant = "desktop"
}: ProductionProofSectionProps) {
    const isMobile = variant === "mobile";

    const showPrint = ["PRINT", "FINISHING", "SELESAI"].includes(order.status) || order.printUrl;
    const showFinishing = ["FINISHING", "SELESAI"].includes(order.status) || order.finishingUrl;

    if (!showPrint && !showFinishing) return null;

    const printFullUrl = order.printUrl
        ? (order.printUrl.startsWith("http")
            ? order.printUrl
            : `${UPLOADS_URL}${order.printUrl.startsWith("/") ? "" : "/"}${order.printUrl}`)
        : null;

    const finishingFullUrl = order.finishingUrl
        ? (order.finishingUrl.startsWith("http")
            ? order.finishingUrl
            : `${UPLOADS_URL}${order.finishingUrl.startsWith("/") ? "" : "/"}${order.finishingUrl}`)
        : null;

    return (
        <div className="space-y-8">
            {/* Progress Print */}
            {showPrint && (
                <div className="space-y-4">
                    <h3 className={isMobile ? "text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic" : "text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic"}>
                        <div className="w-8 h-8 bg-white rounded-xl shadow-xs flex items-center justify-center border border-slate-100">
                            <Printer className="text-[#D25026]" size={16} />
                        </div>
                        Progress Cetak (Print)
                    </h3>
                    <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-xs ${isMobile ? "p-4" : "p-6"}`}>
                        {printFullUrl ? (
                            <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-2 flex items-center justify-center overflow-hidden">
                                <img
                                    src={printFullUrl}
                                    alt="Progress Print"
                                    className={`w-full h-auto object-contain mx-auto rounded-xl ${isMobile ? "max-h-[260px]" : "max-h-[340px]"}`}
                                />
                            </div>
                        ) : (
                            <div className="w-full min-h-[8rem] bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-6 text-center">
                                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center mb-2">
                                    <Printer className="w-5 h-5 text-cyan-600" />
                                </div>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic mb-3">
                                    Menunggu Foto Progres Print
                                </p>
                                <label className={`bg-[#D25026] text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all ${isUploadingPrint ? "opacity-50" : "hover:bg-[#B34320]"}`}>
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
                        )}
                    </div>
                </div>
            )}

            {/* Progress Finishing */}
            {showFinishing && (
                <div className="space-y-4">
                    <h3 className={isMobile ? "text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic" : "text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic"}>
                        <div className="w-8 h-8 bg-white rounded-xl shadow-xs flex items-center justify-center border border-slate-100">
                            <CheckCircle className="text-[#D25026]" size={16} />
                        </div>
                        Progress Finishing
                    </h3>
                    <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-xs ${isMobile ? "p-4" : "p-6"}`}>
                        {finishingFullUrl ? (
                            <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-2 flex items-center justify-center overflow-hidden">
                                <img
                                    src={finishingFullUrl}
                                    alt="Progress Finishing"
                                    className={`w-full h-auto object-contain mx-auto rounded-xl ${isMobile ? "max-h-[260px]" : "max-h-[340px]"}`}
                                />
                            </div>
                        ) : (
                            <div className="w-full min-h-[8rem] bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 p-6 text-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                </div>
                                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic mb-3">
                                    Menunggu Foto Progres Finishing
                                </p>
                                <label className={`bg-[#D25026] text-white px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer transition-all ${isUploadingFinishing ? "opacity-50" : "hover:bg-[#B34320]"}`}>
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
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
