import { useState } from "react";
import { Image as ImageIcon, FileText, Video, ExternalLink, Edit3, Loader2, ShoppingBag } from "lucide-react";
import { UPLOADS_URL } from "~/api/client";
import { formatRupiah, cn } from "~/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { resolveUploadImageUrl } from "../../utils";
import type { MonitoringOrder, BahanItem } from "~/types";

interface DesignReferenceSectionProps {
    order: MonitoringOrder;
    currentBahan?: BahanItem;
    onUpdateNotesAndVideo?: (orderId: number, data: { videoUrl?: string; adminNote?: string; designNote?: string }) => Promise<any>;
    variant?: "desktop" | "mobile";
    isMobile?: boolean;
}

function getEmbedVideoUrl(url?: string | null): string | null {
    if (!url) return null;
    try {
        const clean = url.trim();
        if (clean.includes("youtube.com/watch")) {
            const parsed = new URL(clean);
            const v = parsed.searchParams.get("v");
            if (v) return `https://www.youtube.com/embed/${v}`;
        }
        if (clean.includes("youtu.be/")) {
            const id = clean.split("youtu.be/")[1]?.split("?")[0];
            if (id) return `https://www.youtube.com/embed/${id}`;
        }
        if (clean.includes("drive.google.com/file/d/")) {
            const match = clean.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
            if (match && match[1]) return `https://drive.google.com/file/d/${match[1]}/preview`;
        }
    } catch {
        return null;
    }
    return null;
}

function renderLinkedText(text?: string | null) {
    if (!text) return null;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);
    return parts.map((part, index) => {
        if (part.match(urlRegex)) {
            return (
                <a 
                    key={index} 
                    href={part} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-[#D25026] hover:underline font-bold inline-flex items-center gap-1 break-all"
                >
                    {part}
                    <ExternalLink size={11} className="inline shrink-0" />
                </a>
            );
        }
        return part;
    });
}

export function DesignReferenceSection({
    order,
    currentBahan,
    onUpdateNotesAndVideo,
    variant,
    isMobile = false
}: DesignReferenceSectionProps) {
    const mobileMode = variant === "mobile" || isMobile;
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [tempVideoUrl, setTempVideoUrl] = useState(order.videoUrl || "");
    const [tempAdminNote, setTempAdminNote] = useState(order.adminNote || "");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!onUpdateNotesAndVideo) return;
        setIsSaving(true);
        try {
            await onUpdateNotesAndVideo(order.rawId, {
                videoUrl: tempVideoUrl.trim() || "",
                adminNote: tempAdminNote.trim() || ""
            });
            setIsEditModalOpen(false);
        } finally {
            setIsSaving(false);
        }
    };

    const designUrl = order.designUrl
        ? (order.designUrl.startsWith("http") ? order.designUrl : `${UPLOADS_URL}${order.designUrl.startsWith("/") ? "" : "/"}${order.designUrl}`)
        : null;
    const productImageUrl = resolveUploadImageUrl(currentBahan?.imageUrl);
    const productName = order.product || currentBahan?.nama || "Custom Jersey";

    return (
        <div className="space-y-4">
            <h3 className={mobileMode ? "text-xs font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic" : "text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic"}>
                <div className="w-8 h-8 bg-white rounded-xl shadow-xs flex items-center justify-center border border-slate-100">
                    <ImageIcon className="text-[#D25026]" size={16} />
                </div>
                Produk, Referensi Desain & Catatan
            </h3>

            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                {/* Purchased Product & Photo */}
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">
                        Produk / Bahan yang Dibeli Pelanggan:
                    </p>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs">
                        {productImageUrl ? (
                            <a
                                href={productImageUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="Klik untuk melihat foto produk ukuran penuh"
                                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-slate-200 bg-white overflow-hidden shrink-0 block focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#D25026]/40 shadow-2xs group"
                            >
                                <img
                                    src={productImageUrl}
                                    alt={productName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                            </a>
                        ) : (
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-slate-200 bg-white flex flex-col items-center justify-center shrink-0 text-slate-400">
                                <ShoppingBag size={24} />
                                <span className="text-[9px] font-bold uppercase tracking-wider mt-1">Tanpa Foto</span>
                            </div>
                        )}

                        <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <h4 className="text-base font-black uppercase italic text-slate-900 tracking-tight">
                                    {productName}
                                </h4>
                                {currentBahan?.status && (
                                    <span className={cn(
                                        "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border",
                                        currentBahan.status === "Habis"
                                            ? "bg-rose-50 text-rose-700 border-rose-200"
                                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    )}>
                                        Stok: {currentBahan.status}
                                    </span>
                                )}
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-black text-slate-800">
                                    Jumlah: {order.qty} Unit
                                </span>
                                {currentBahan?.harga ? (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200/70 text-xs font-black text-[#D25026]">
                                        {formatRupiah(currentBahan.harga)} / pcs
                                    </span>
                                ) : null}
                            </div>

                            {currentBahan?.deskripsi ? (
                                <p className="text-xs text-slate-600 font-medium line-clamp-2">
                                    {currentBahan.deskripsi}
                                </p>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Reference Image or PDF */}
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">
                        Lampiran Referensi Desain Pelanggan:
                    </p>
                {designUrl ? (
                    <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 flex items-center justify-center p-3 shadow-xs">
                        {order.designUrl?.toLowerCase().endsWith(".pdf") ? (
                            <div className="w-full h-40 bg-red-50 flex flex-col items-center justify-center rounded-xl">
                                <FileText className="w-10 h-10 text-red-500 mb-2" />
                                <a 
                                    href={designUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700 underline"
                                >
                                    Buka Referensi (PDF)
                                </a>
                            </div>
                        ) : (
                            <img 
                                src={designUrl} 
                                alt="Design Reference" 
                                className="w-full h-auto max-h-[350px] object-contain mx-auto rounded-xl" 
                            />
                        )}
                    </div>
                ) : (
                    <div className="w-full h-24 bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                        <p className="text-xs font-bold text-slate-400 italic uppercase tracking-wider">Tidak ada referensi gambar</p>
                    </div>
                )}
                </div>

                {/* Customer Design Note */}
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Catatan Pelanggan / Desain:</p>
                    <div className="bg-slate-50 p-4 md:p-5 rounded-2xl border border-slate-100">
                        <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed italic">
                            {renderLinkedText(order.designNote) || "Tidak ada catatan tambahan dari pelanggan."}
                        </p>
                    </div>
                </div>

                {/* Admin Notes & Video Section */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic flex items-center gap-2">
                            <Video size={13} className="text-[#D25026]" />
                            Catatan Internal & Video Produksi
                        </p>
                        {onUpdateNotesAndVideo && (
                            <button
                                type="button"
                                onClick={() => {
                                    setTempVideoUrl(order.videoUrl || "");
                                    setTempAdminNote(order.adminNote || "");
                                    setIsEditModalOpen(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-orange-50 text-[#D25026] hover:bg-orange-100 transition-colors cursor-pointer"
                            >
                                <Edit3 size={11} />
                                Edit Catatan & Video
                            </button>
                        )}
                    </div>

                    <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Catatan Admin / Desainer:</span>
                        <p className="text-xs text-slate-800 font-medium leading-relaxed">
                            {order.adminNote ? renderLinkedText(order.adminNote) : <span className="italic text-slate-400">Belum ada catatan internal.</span>}
                        </p>
                    </div>

                    {/* Video Player or Box */}
                    {order.videoUrl ? (
                        <div className="bg-slate-900 rounded-2xl p-4 md:p-5 text-white space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-[#D25026] flex items-center gap-1.5">
                                    <Video size={13} /> Video Dokumentasi
                                </span>
                                <a
                                    href={order.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors"
                                >
                                    Buka Video <ExternalLink size={10} />
                                </a>
                            </div>
                            {getEmbedVideoUrl(order.videoUrl) ? (
                                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black border border-white/10 shadow-inner">
                                    <iframe
                                        src={getEmbedVideoUrl(order.videoUrl)!}
                                        title="Video Preview"
                                        className="w-full h-full"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                <a
                                    href={order.videoUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block p-3 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-orange-300 hover:underline truncate"
                                >
                                    {order.videoUrl}
                                </a>
                            )}
                        </div>
                    ) : (
                        <div className="p-3.5 rounded-2xl border border-dashed border-slate-200 text-center">
                            <p className="text-xs text-slate-400 font-medium italic">Belum ada link video yang ditambahkan.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Dialog for Editing Catatan & Video */}
            <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="max-w-lg bg-white rounded-3xl p-6 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-base font-black uppercase tracking-wider italic text-slate-900 flex items-center gap-2">
                            <Edit3 className="text-[#D25026]" size={18} />
                            Edit Catatan & Link Video
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-2">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                                Link Video (YouTube / Google Drive / TikTok / URL)
                            </label>
                            <input
                                type="url"
                                value={tempVideoUrl}
                                onChange={(e) => setTempVideoUrl(e.target.value)}
                                placeholder="https://youtube.com/watch?v=... atau link video lain"
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D25026]"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                                Catatan Internal Admin / Desainer
                            </label>
                            <textarea
                                rows={4}
                                value={tempAdminNote}
                                onChange={(e) => setTempAdminNote(e.target.value)}
                                placeholder="Tambahkan catatan khusus produksi, instruksi desainer, dll..."
                                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#D25026]"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 rounded-xl text-xs font-bold"
                            >
                                Batal
                            </Button>
                            <Button
                                type="button"
                                disabled={isSaving}
                                onClick={handleSave}
                                className="px-5 py-2 bg-[#D25026] hover:bg-[#B34320] text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                            >
                                {isSaving ? <Loader2 size={13} className="animate-spin" /> : null}
                                Simpan Perubahan
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
