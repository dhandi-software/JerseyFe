import {
    AlertCircle,
    CheckCircle2,
    Eye,
    FileText,
    Loader2,
    Package,
    Printer,
    Truck,
} from "lucide-react";
import { UPLOADS_URL } from "~/api/client";
import {
    STORE_PICKUP_ADDRESS,
    resolveCustomerUploadUrl,
    useCustomerAlternativeFabric,
} from "~/hooks";
import type {
    CustomerAlternativeFabricBannerProps,
    CustomerProgressMediaAndInfoSectionProps,
    CustomerTrackingSummaryGridProps,
} from "~/types";

export function CustomerAlternativeFabricBanner({
    order,
    bahanList,
    onSelectAlternative,
    variant = "desktop",
}: CustomerAlternativeFabricBannerProps) {
    const { hasRecommendations, recommendedItems } = useCustomerAlternativeFabric(
        order,
        bahanList
    );

    if (!hasRecommendations) {
        return null;
    }

    if (variant === "mobile") {
        return (
            <div className="bg-orange-50 border border-orange-200 p-6 rounded-[2rem] shadow-xl space-y-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                        <AlertCircle className="text-[#D25026] w-5 h-5" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 leading-none">
                            Bahan Jersey Habis!
                        </h3>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed mt-1.5">
                            Bahan pilihan jersey Anda saat ini sedang habis. Silakan pilih salah satu bahan alternatif di bawah ini untuk melanjutkan pesanan Anda:
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 pt-2">
                    {recommendedItems.map((b) => (
                        <div
                            key={b.id}
                            className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-col justify-between gap-3 group hover:border-[#D25026]/30 transition-all"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-lg bg-slate-100 overflow-hidden shrink-0 relative">
                                    {b.imageUrl ? (
                                        <img
                                            src={UPLOADS_URL + b.imageUrl}
                                            alt={b.nama}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-black text-slate-900 uppercase">
                                        {b.nama}
                                    </h4>
                                    <p className="text-xs font-bold text-[#D25026] mt-0.5">
                                        {new Intl.NumberFormat("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minimumFractionDigits: 0,
                                        }).format(b.harga || 150000)}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => onSelectAlternative(b.id)}
                                className="w-full bg-slate-900 text-white rounded-lg py-2.5 font-black text-xs uppercase tracking-widest hover:bg-[#D25026] transition-colors"
                            >
                                Pilih Bahan Ini
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-orange-50 border border-orange-200 p-8 rounded-[3rem] shadow-xl space-y-6">
            <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center shrink-0">
                    <AlertCircle className="text-[#D25026] w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-xl font-black uppercase tracking-wider text-slate-900 leading-none">
                        Bahan Jersey Habis!
                    </h3>
                    <p className="text-base text-slate-600 font-medium leading-relaxed mt-1.5">
                        Bahan pilihan jersey Anda saat ini sedang habis. Silakan pilih salah satu bahan alternatif di bawah ini untuk melanjutkan pesanan Anda:
                    </p>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                {recommendedItems.map((b) => (
                    <div
                        key={b.id}
                        className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between gap-4 group hover:border-[#D25026]/30 transition-all"
                    >
                        <div className="space-y-3">
                            <div className="w-full aspect-video rounded-xl bg-slate-100 overflow-hidden relative">
                                {b.imageUrl ? (
                                    <img
                                        src={UPLOADS_URL + b.imageUrl}
                                        alt={b.nama}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300 text-sm">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 className="text-base font-black text-slate-900 uppercase">
                                    {b.nama}
                                </h4>
                                <p className="text-sm font-bold text-[#D25026] mt-0.5">
                                    {new Intl.NumberFormat("id-ID", {
                                        style: "currency",
                                        currency: "IDR",
                                        minimumFractionDigits: 0,
                                    }).format(b.harga || 150000)}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => onSelectAlternative(b.id)}
                            className="w-full bg-slate-900 text-white rounded-xl py-3 font-black text-xs uppercase tracking-widest hover:bg-[#D25026] transition-colors"
                        >
                            Pilih Bahan Ini
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function CustomerProgressMediaAndInfoSection({
    order,
    isPrinting,
    onPrintInvoice,
    variant = "desktop",
}: CustomerProgressMediaAndInfoSectionProps) {
    if (variant === "mobile") {
        return (
            <>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                        <FileText className="text-[#D25026]" size={16} /> Referensi & Catatan
                    </h3>
                    {order.designUrl ? (
                        <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                            {order.designUrl.toLowerCase().endsWith(".pdf") ? (
                                <div className="flex flex-col items-center justify-center p-8 bg-white gap-4 group">
                                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm">
                                        <FileText size={32} />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-black text-slate-900 uppercase italic">
                                            Dokumen PDF
                                        </p>
                                    </div>
                                    <a
                                        href={resolveCustomerUploadUrl(order.designUrl)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-6 py-3 bg-red-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-700 transition-all flex items-center gap-2 italic shadow-lg shadow-red-600/20"
                                    >
                                        <Eye size={14} /> Buka PDF
                                    </a>
                                </div>
                            ) : (
                                <img
                                    src={resolveCustomerUploadUrl(order.designUrl)}
                                    alt="Design Reference"
                                    className="w-full h-auto max-h-[250px] object-contain mx-auto"
                                />
                            )}
                        </div>
                    ) : (
                        <div className="w-full h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                            <p className="text-xs font-bold text-slate-400 italic uppercase">
                                Tidak ada referensi
                            </p>
                        </div>
                    )}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic mb-1">
                            Catatan:
                        </p>
                        <p className="text-sm text-slate-700 font-medium italic leading-relaxed">
                            {order.designNote || "Tidak ada catatan."}
                        </p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <Package className="text-[#D25026]" size={16} /> Info Pembayaran
                        </h3>
                        {order.status !== "DITOLAK" && (
                            <button
                                onClick={onPrintInvoice}
                                disabled={isPrinting}
                                className="bg-[#D25026] hover:bg-[#B34320] text-white px-3.5 py-2 rounded-lg text-xs font-black uppercase tracking-widest italic flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                            >
                                {isPrinting ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                ) : (
                                    <Printer size={12} />
                                )}
                                Cetak
                            </button>
                        )}
                    </div>
                    {order.paymentUrl ? (
                        <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
                            <img
                                src={resolveCustomerUploadUrl(order.paymentUrl)}
                                alt="Payment Proof"
                                className="w-full h-auto max-h-[250px] object-contain mx-auto"
                            />
                        </div>
                    ) : (
                        <div className="w-full h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                            <p className="text-xs font-bold text-slate-400 italic uppercase">
                                Belum ada bukti bayar
                            </p>
                        </div>
                    )}
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 flex justify-between items-center">
                        <div>
                            <p className="text-xs font-black text-emerald-600 uppercase tracking-widest italic">
                                Total:
                            </p>
                            <p className="text-sm font-black text-emerald-800 italic uppercase">
                                Paid
                            </p>
                        </div>
                        <p className="text-xl font-black text-emerald-700 italic">
                            Rp {order.totalAmount?.toLocaleString("id-ID")}
                        </p>
                    </div>
                </div>

                {order.printUrl && (
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <Printer className="text-[#D25026]" size={16} /> Progress Cetak (Print)
                        </h3>
                        <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-2 flex items-center justify-center">
                            <img
                                src={resolveCustomerUploadUrl(order.printUrl)}
                                alt="Progress Print"
                                className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-xl"
                            />
                        </div>
                    </div>
                )}

                {order.finishingUrl && (
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <CheckCircle2 className="text-[#D25026]" size={16} /> Progress Finishing
                        </h3>
                        <div className="w-full bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 p-2 flex items-center justify-center">
                            <img
                                src={resolveCustomerUploadUrl(order.finishingUrl)}
                                alt="Progress Finishing"
                                className="w-full h-auto max-h-[300px] object-contain mx-auto rounded-xl"
                            />
                        </div>
                    </div>
                )}

                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                        <Truck className="text-[#D25026]" size={16} /> Informasi Pengiriman
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic mb-1">
                                Metode Pengiriman:
                            </p>
                            <p className="text-sm font-black text-slate-900 uppercase italic">
                                {order.shippingMethod === "COD"
                                    ? "COD (Penerima yang bayar)"
                                    : "Ambil di tempat"}
                            </p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest italic mb-1">
                                {order.shippingMethod === "COD"
                                    ? "Alamat Tujuan COD:"
                                    : "Alamat Toko (Kunjungi Toko):"}
                            </p>
                            <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                                {order.shippingMethod === "COD"
                                    ? order.shippingAddress || "Alamat tidak diisi."
                                    : STORE_PICKUP_ADDRESS}
                            </p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            {order.printUrl && (
                <div className="space-y-6 mt-16 pt-16 border-t border-slate-50">
                    <h3 className="text-base font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                        <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                            <Printer className="text-[#D25026]" size={18} />
                        </div>
                        Progress Cetak (Print)
                    </h3>
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5">
                        <div className="w-full bg-white rounded-2xl overflow-hidden border border-slate-200 p-2 flex items-center justify-center shadow-sm">
                            <img
                                src={resolveCustomerUploadUrl(order.printUrl)}
                                alt="Progress Print"
                                className="w-full h-auto max-h-[400px] object-contain mx-auto rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            )}

            {order.finishingUrl && (
                <div className="space-y-6 mt-16 pt-16 border-t border-slate-50">
                    <h3 className="text-base font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                        <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                            <CheckCircle2 className="text-[#D25026]" size={18} />
                        </div>
                        Progress Finishing
                    </h3>
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 shadow-sm ring-1 ring-black/5">
                        <div className="w-full bg-white rounded-2xl overflow-hidden border border-slate-200 p-2 flex items-center justify-center shadow-sm">
                            <img
                                src={resolveCustomerUploadUrl(order.finishingUrl)}
                                alt="Progress Finishing"
                                className="w-full h-auto max-h-[400px] object-contain mx-auto rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-6 mt-16 pt-16 border-t border-slate-50">
                <h3 className="text-base font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                    <div className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center border border-slate-100">
                        <Truck className="text-[#D25026]" size={18} />
                    </div>
                    Informasi Pengiriman
                </h3>
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 shadow-sm ring-1 ring-black/5 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                            Metode Pengiriman:
                        </p>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100">
                            <p className="text-base font-black text-slate-900 uppercase italic">
                                {order.shippingMethod === "COD"
                                    ? "COD (Penerima yang bayar)"
                                    : "Ambil di tempat (Self-Pickup)"}
                            </p>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                            {order.shippingMethod === "COD"
                                ? "Alamat Tujuan COD:"
                                : "Alamat Toko (Kunjungi Toko):"}
                        </p>
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 text-sm leading-relaxed text-slate-700 italic">
                            {order.shippingMethod === "COD"
                                ? order.shippingAddress || "Alamat tidak diisi."
                                : STORE_PICKUP_ADDRESS}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 border-t border-slate-50 pt-16">
                <div className="space-y-6">
                    <h3 className="text-base font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                        <FileText className="text-[#D25026]" size={18} /> Referensi Desain
                    </h3>
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                        {order.designUrl ? (
                            <div className="w-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                                {order.designUrl.toLowerCase().endsWith(".pdf") ? (
                                    <div className="flex flex-col items-center justify-center p-12 bg-slate-50 gap-6 group">
                                        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                            <FileText size={40} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-base font-black text-slate-900 uppercase italic">
                                                Dokumen PDF
                                            </p>
                                            <p className="text-xs font-bold text-slate-400 uppercase mt-1">
                                                Referensi Desain
                                            </p>
                                        </div>
                                        <a
                                            href={resolveCustomerUploadUrl(order.designUrl)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-6 py-3 bg-red-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 flex items-center gap-2 italic"
                                        >
                                            <Eye size={14} /> Lihat PDF
                                        </a>
                                    </div>
                                ) : (
                                    <img
                                        src={resolveCustomerUploadUrl(order.designUrl)}
                                        alt="Design Reference"
                                        className="w-full h-auto max-h-[300px] object-contain mx-auto"
                                    />
                                )}
                            </div>
                        ) : (
                            <div className="w-full h-32 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                <p className="text-xs font-bold text-slate-400 italic uppercase">
                                    Tidak ada referensi gambar
                                </p>
                            </div>
                        )}
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 italic">
                                Catatan:
                            </p>
                            <p className="text-base text-slate-700 font-medium italic leading-relaxed bg-white p-6 rounded-2xl border border-slate-100">
                                {order.designNote || "Tidak ada catatan tambahan."}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-base font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                            <Package className="text-[#D25026]" size={18} /> Bukti Pembayaran
                        </h3>
                        {order.status !== "DITOLAK" && (
                            <button
                                onClick={onPrintInvoice}
                                disabled={isPrinting}
                                className="bg-[#D25026] hover:bg-[#B34320] text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest italic flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                            >
                                {isPrinting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Printer size={14} />
                                )}
                                Cetak Invoice
                            </button>
                        )}
                    </div>
                    <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 space-y-6">
                        {order.paymentUrl ? (
                            <div className="w-full bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                                <img
                                    src={resolveCustomerUploadUrl(order.paymentUrl)}
                                    alt="Payment Proof"
                                    className="w-full h-auto max-h-[300px] object-contain mx-auto"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-32 bg-white rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                <p className="text-xs font-bold text-slate-400 italic uppercase">
                                    Belum ada bukti bayar
                                </p>
                            </div>
                        )}
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-xs font-black text-emerald-600 uppercase tracking-widest italic">
                                    Total Pembayaran:
                                </p>
                                <p className="text-sm font-black text-emerald-700 uppercase italic">
                                    Paid
                                </p>
                            </div>
                            <p className="text-2xl font-black text-emerald-800 tracking-tighter italic">
                                Rp {order.totalAmount?.toLocaleString("id-ID")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export function CustomerTrackingSummaryGrid({
    order,
    isPrinting = false,
    onPrintInvoice,
    sectionMode = "both",
    variant = "desktop",
}: CustomerTrackingSummaryGridProps) {
    if (variant === "mobile") {
        return (
            <>
                {(sectionMode === "both" || sectionMode === "orderSummaryOnly") && (
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 italic flex items-center gap-2">
                                <Package className="text-[#D25026]" size={16} /> Detail Pesanan
                            </h3>
                            {order.status !== "DITOLAK" && onPrintInvoice && (
                                <button
                                    onClick={onPrintInvoice}
                                    disabled={isPrinting}
                                    className="bg-[#D25026] hover:bg-[#B34320] text-white px-4 py-2.5 min-h-11 rounded-xl text-xs font-black uppercase tracking-widest italic flex items-center gap-1.5 transition-all shadow-sm disabled:opacity-50"
                                >
                                    {isPrinting ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    ) : (
                                        <Printer size={14} />
                                    )}
                                    Cetak Invoice
                                </button>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 border-b border-slate-100 pb-3">
                            <div>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic mb-1">
                                    Pemesan
                                </p>
                                <p className="text-sm font-bold text-slate-900 uppercase italic truncate">
                                    {order.customerName}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic mb-1">
                                    Produk
                                </p>
                                <p className="text-sm font-bold text-slate-900 uppercase italic truncate">
                                    {order.details?.[0]?.productTitle || "Custom Jersey"}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic mb-1">
                                    Total Unit
                                </p>
                                <p className="text-sm font-bold text-slate-900 uppercase italic">
                                    {order.details?.length || 0} Unit
                                </p>
                            </div>
                            <div>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic mb-1">
                                    Tanggal Order
                                </p>
                                <p className="text-sm font-bold text-slate-900 uppercase italic">
                                    {new Date(order.createdAt).toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {(sectionMode === "both" || sectionMode === "shippingOnly") && (
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2 italic">
                            <Truck className="text-[#D25026]" size={16} /> Informasi Pengiriman
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic mb-1">
                                    Metode Pengiriman:
                                </p>
                                <p className="text-sm font-black text-slate-900 uppercase italic">
                                    {order.shippingMethod === "COD"
                                        ? "COD (Penerima yang bayar)"
                                        : "Ambil di tempat"}
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic mb-1">
                                    {order.shippingMethod === "COD"
                                        ? "Alamat Tujuan COD:"
                                        : "Alamat Toko (Kunjungi Toko):"}
                                </p>
                                <p className="text-xs text-slate-700 font-medium italic leading-relaxed">
                                    {order.shippingMethod === "COD"
                                        ? order.shippingAddress || "Alamat tidak diisi."
                                        : STORE_PICKUP_ADDRESS}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                        <Package className="text-[#D25026]" size={18} /> Detail Pesanan
                    </h3>
                    {order.status !== "DITOLAK" && onPrintInvoice && (
                        <button
                            onClick={onPrintInvoice}
                            disabled={isPrinting}
                            className="bg-[#D25026] hover:bg-[#B34320] text-white px-5 py-2.5 min-h-11 rounded-xl text-xs font-black uppercase tracking-widest italic flex items-center gap-2 transition-all shadow-md disabled:opacity-50 cursor-pointer"
                        >
                            {isPrinting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Printer size={15} />
                            )}
                            Cetak Invoice
                        </button>
                    )}
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic">
                            Pemesan
                        </p>
                        <p className="text-base font-black text-slate-900 uppercase italic">
                            {order.customerName}
                        </p>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic">
                            Item
                        </p>
                        <p className="text-base font-black text-slate-900 uppercase italic">
                            {order.details?.[0]?.productTitle || "Custom Jersey"}
                        </p>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic">
                            Total Unit
                        </p>
                        <p className="text-base font-black text-slate-900 uppercase italic">
                            {order.details?.length || 0} Unit
                        </p>
                    </div>
                    <div className="flex justify-between items-center py-3">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic">
                            Tanggal Order
                        </p>
                        <p className="text-base font-black text-slate-900 uppercase italic">
                            {new Date(order.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 space-y-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-3 italic">
                    <Truck className="text-[#D25026]" size={18} /> Informasi Pengiriman
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic">
                            Metode Pengiriman
                        </p>
                        <p className="text-base font-black text-slate-900 uppercase italic">
                            {order.shippingMethod === "COD"
                                ? "COD (Penerima yang bayar)"
                                : "Ambil di tempat"}
                        </p>
                    </div>
                    <div className="pt-2">
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest italic mb-2">
                            {order.shippingMethod === "COD"
                                ? "Alamat Tujuan COD"
                                : "Alamat Toko (Kunjungi Toko)"}
                        </p>
                        <div className="text-sm text-slate-700 font-medium leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100 font-mono">
                            {order.shippingMethod === "COD"
                                ? order.shippingAddress || "Alamat tidak diisi."
                                : STORE_PICKUP_ADDRESS}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
