import { Image as ImageIcon, FileText, Eye } from "lucide-react";
import { Button } from "~/components/ui/button";
import { UPLOADS_URL } from "~/api/client";
import type { MonitoringOrder } from "~/types";

interface LayoutProgressSectionProps {
    order: MonitoringOrder;
    handleApproveLayout: (id: number) => Promise<void>;
    handleRevisiLayout: (id: number, feedback: string) => Promise<void>;
    variant?: "desktop" | "mobile";
}

export function LayoutProgressSection({
    order,
    handleApproveLayout,
    handleRevisiLayout,
    variant = "desktop"
}: LayoutProgressSectionProps) {
    const isMobile = variant === "mobile";
    if (order.status !== "LAYOUT" && !order.layoutUrl) return null;

    const layoutFullUrl = order.layoutUrl
        ? (order.layoutUrl.startsWith("http")
            ? order.layoutUrl
            : `${UPLOADS_URL}${order.layoutUrl.startsWith("/") ? "" : "/"}${order.layoutUrl}`)
        : null;

    return (
        <div className="space-y-4">
            <h3 className={isMobile ? "text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic" : "text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic"}>
                <div className="w-8 h-8 bg-white rounded-xl shadow-xs flex items-center justify-center border border-slate-100">
                    <ImageIcon className="text-[#D25026]" size={16} />
                </div>
                Progress Layout Pola Cetak {order.designer ? `(Oleh: ${order.designer})` : ""}
            </h3>

            <div className={`bg-white rounded-[2rem] border border-slate-100 shadow-xs ${isMobile ? "p-4" : "p-6"}`}>
                {layoutFullUrl ? (
                    <div className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic">
                                    Persetujuan Layout:
                                </span>
                                {order.layoutStatus === "SENT" && (
                                    <span className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1 rounded-lg text-xs font-black italic">
                                        Menunggu Persetujuan Customer
                                    </span>
                                )}
                                {order.layoutStatus === "APPROVED" && (
                                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-lg text-xs font-black italic">
                                        Disetujui
                                    </span>
                                )}
                                {order.layoutStatus === "REVISI" && (
                                    <span className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-lg text-xs font-black italic">
                                        Revisi Diminta
                                    </span>
                                )}
                                {order.layoutStatus === "PENDING" && (
                                    <span className="bg-slate-50 text-slate-700 border border-slate-200 px-3 py-1 rounded-lg text-xs font-black italic">
                                        Belum Diupload
                                    </span>
                                )}
                            </div>
                        </div>

                        {order.layoutStatus === "REVISI" && order.layoutFeedback && (
                            <div className="bg-red-50/70 p-4 rounded-xl border border-red-100 space-y-1">
                                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest italic">
                                    Feedback Revisi Layout:
                                </p>
                                <p className="text-xs text-red-700 font-bold leading-relaxed italic">
                                    "{order.layoutFeedback}"
                                </p>
                            </div>
                        )}

                        <div className="w-full bg-slate-50 rounded-2xl border border-slate-200 p-3 flex items-center justify-center">
                            {layoutFullUrl.toLowerCase().endsWith(".pdf") ? (
                                <div className="w-full h-44 bg-red-50 flex flex-col items-center justify-center rounded-xl p-4">
                                    <FileText className="w-12 h-12 text-red-500 mb-2" />
                                    <a
                                        href={layoutFullUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs font-black uppercase tracking-wider text-red-600 hover:text-red-700 underline flex items-center gap-1.5"
                                    >
                                        <Eye size={14} /> Buka Layout Pola (PDF)
                                    </a>
                                </div>
                            ) : (
                                <img
                                    src={layoutFullUrl}
                                    alt="Mockup Layout"
                                    className={`w-full h-auto object-contain mx-auto rounded-xl ${isMobile ? "max-h-[260px]" : "max-h-[360px]"}`}
                                />
                            )}
                        </div>

                        {order.isAdminOrder && order.layoutStatus === "SENT" && (
                            <div className="flex gap-2 pt-3 border-t border-slate-100">
                                <Button
                                    type="button"
                                    onClick={() => {
                                        const feedback = prompt("Masukkan catatan revisi layout:");
                                        if (feedback) handleRevisiLayout(order.rawId, feedback);
                                    }}
                                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Minta Revisi (Admin)
                                </Button>
                                <Button
                                    type="button"
                                    onClick={() => handleApproveLayout(order.rawId)}
                                    className="flex-1 bg-[#D25026] text-white hover:bg-[#B34320] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                                >
                                    Setujui Layout (Admin)
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-full h-24 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200 p-4 text-center">
                        <p className="text-xs font-bold text-slate-400 italic uppercase tracking-wider">
                            Desainer belum mengunggah layout pola cetak
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
