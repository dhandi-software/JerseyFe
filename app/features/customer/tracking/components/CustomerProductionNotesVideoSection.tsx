import { Video, ExternalLink, MessageSquareText, Package } from "lucide-react";
import { useCustomerProductionNotesVideo } from "~/hooks";
import type { CustomerProductionNotesVideoSectionProps } from "~/types";

export function CustomerProductionNotesVideoSection({
    order,
    variant = "desktop",
}: CustomerProductionNotesVideoSectionProps) {
    const { hasNote, hasVideo, embedUrl, noteParts } =
        useCustomerProductionNotesVideo(order);

    if (!hasNote && !hasVideo) {
        return null;
    }

    const isMobile = variant === "mobile";

    if (isMobile) {
        return (
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                        <Video className="text-[#D25026]" size={16} /> Catatan & Video Produksi Admin
                    </h3>
                    <span className="px-3 py-1 rounded-full bg-[#D25026]/10 border border-[#D25026]/20 text-xs font-black font-mono text-[#D25026] uppercase">
                        {order.orderId}
                    </span>
                </div>

                {hasNote && (
                    <div className="bg-orange-50/60 border border-orange-200/70 rounded-xl p-4 space-y-2">
                        <p className="text-xs font-black text-[#D25026] uppercase tracking-widest italic flex items-center gap-1.5">
                            <MessageSquareText size={14} /> Pesan dari Admin Produksi:
                        </p>
                        <div className="text-sm text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">
                            {noteParts.map((part, idx) =>
                                part.isLink ? (
                                    <a
                                        key={idx}
                                        href={part.text}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[#D25026] hover:underline font-bold inline-flex items-center gap-1 break-all"
                                    >
                                        {part.text}
                                        <ExternalLink size={12} className="inline shrink-0" />
                                    </a>
                                ) : (
                                    <span key={idx}>{part.text}</span>
                                )
                            )}
                        </div>
                    </div>
                )}

                {hasVideo && (
                    <div className="space-y-3">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic">
                            Dokumentasi Video Produksi ({order.orderId}):
                        </p>
                        {embedUrl ? (
                            <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                                <iframe
                                    src={embedUrl}
                                    title={`Video Produksi ${order.orderId}`}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : null}

                        <a
                            href={order.videoUrl || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full min-h-11 bg-slate-900 hover:bg-[#D25026] text-white px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest italic flex items-center justify-center gap-2 transition-colors shadow-sm"
                        >
                            <Video size={15} />
                            Buka Tautan Video Produksi
                            <ExternalLink size={13} />
                        </a>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#D25026]">
                        <Video size={20} />
                    </div>
                    <div>
                        <h3 className="text-base font-black uppercase tracking-widest text-slate-900 italic">
                            Catatan & Video Produksi Admin
                        </h3>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">
                            Informasi resmi progres pengerjaan khusus untuk pesanan Anda
                        </p>
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D25026]/10 border border-[#D25026]/20">
                    <Package size={16} className="text-[#D25026]" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                        Kode Pesanan:
                    </span>
                    <span className="text-sm font-black font-mono text-[#D25026]">
                        {order.orderId}
                    </span>
                </div>
            </div>

            <div
                className={
                    hasNote && hasVideo
                        ? "grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                        : "space-y-6"
                }
            >
                {hasNote && (
                    <div
                        className={
                            hasVideo
                                ? "lg:col-span-6 bg-orange-50/50 border border-orange-200/70 rounded-2xl p-6 space-y-3"
                                : "bg-orange-50/50 border border-orange-200/70 rounded-2xl p-6 space-y-3"
                        }
                    >
                        <p className="text-xs font-black text-[#D25026] uppercase tracking-widest italic flex items-center gap-2">
                            <MessageSquareText size={16} /> Pesan & Catatan Produksi ({order.orderId})
                        </p>
                        <div className="text-base text-slate-800 font-medium leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-xl border border-orange-100">
                            {noteParts.map((part, idx) =>
                                part.isLink ? (
                                    <a
                                        key={idx}
                                        href={part.text}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[#D25026] hover:underline font-bold inline-flex items-center gap-1 break-all"
                                    >
                                        {part.text}
                                        <ExternalLink size={12} className="inline shrink-0" />
                                    </a>
                                ) : (
                                    <span key={idx}>{part.text}</span>
                                )
                            )}
                        </div>
                    </div>
                )}

                {hasVideo && (
                    <div
                        className={
                            hasNote
                                ? "lg:col-span-6 bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-4"
                                : "bg-slate-50 border border-slate-200/80 rounded-2xl p-6 space-y-4"
                        }
                    >
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-black text-slate-600 uppercase tracking-widest italic flex items-center gap-2">
                                <Video size={16} className="text-[#D25026]" /> Video Dokumentasi Produksi
                            </p>
                            <a
                                href={order.videoUrl || "#"}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-[#D25026] text-white text-xs font-black uppercase tracking-widest italic transition-colors"
                            >
                                Buka Video
                                <ExternalLink size={13} />
                            </a>
                        </div>

                        {embedUrl ? (
                            <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-sm">
                                <iframe
                                    src={embedUrl}
                                    title={`Video Produksi ${order.orderId}`}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        ) : (
                            <div className="bg-white p-5 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-sm font-bold text-slate-900">
                                        Tautan Video Produksi Tersedia
                                    </p>
                                    <p className="text-xs text-slate-500 truncate mt-0.5">
                                        {order.videoUrl}
                                    </p>
                                </div>
                                <a
                                    href={order.videoUrl || "#"}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="shrink-0 bg-[#D25026] hover:bg-[#B34320] text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest italic inline-flex items-center gap-1.5 transition-colors"
                                >
                                    Tonton Video
                                    <ExternalLink size={13} />
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
