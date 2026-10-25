import React from "react";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Input } from "~/components/ui/input";
import { FileText, Upload, X, Info } from "lucide-react";
import { cn } from "~/lib/utils";
import { formatRupiah } from "../utils";
import { UPLOADS_URL } from "~/api/client";

interface DesignAndShippingSectionDesktopProps {
    designNote: string;
    onDesignNoteChange: (val: string) => void;
    designReferenceFile: File | null;
    onDesignReferenceFileChange: (file: File | null) => void;
    existingDesignUrl?: string;
    onRemoveExistingDesignUrl?: () => void;
    shippingMethod: string;
    onShippingMethodChange: (method: string) => void;
    shippingAddress: string;
    onShippingAddressChange: (address: string) => void;
    showValidation: boolean;
    paymentType: "FULL" | "DP";
    onPaymentTypeChange: (type: "FULL" | "DP") => void;
    dpAmountInput: number;
    onDpAmountInputChange: (amount: number) => void;
    totalCalculated: number;
    effectivePaidAmount: number;
    effectiveRemainingAmount: number;
    playerCount: number;
    onToast: (msg: string, variant: "success" | "destructive") => void;
}

export function DesignAndShippingSectionDesktop({
    designNote,
    onDesignNoteChange,
    designReferenceFile,
    onDesignReferenceFileChange,
    existingDesignUrl,
    onRemoveExistingDesignUrl,
    shippingMethod,
    onShippingMethodChange,
    shippingAddress,
    onShippingAddressChange,
    showValidation,
    paymentType,
    onPaymentTypeChange,
    dpAmountInput,
    onDpAmountInputChange,
    totalCalculated,
    effectivePaidAmount,
    effectiveRemainingAmount,
    playerCount,
    onToast
}: DesignAndShippingSectionDesktopProps) {
    const hasExistingDesign = !!existingDesignUrl;
    const resolvedDesignUrl = existingDesignUrl
        ? (existingDesignUrl.startsWith("http") ? existingDesignUrl : `${UPLOADS_URL}${existingDesignUrl.startsWith("/") ? "" : "/"}${existingDesignUrl}`)
        : "";

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div>
                <h2 className="text-3xl font-black text-neutral-900 italic uppercase tracking-tighter">
                    Design Reference
                </h2>
                <p className="text-neutral-400 font-medium mt-1">
                    Unggah referensi desain dan tambahkan catatan tambahan.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 space-y-3">
                    <Label className="text-[11px] font-black uppercase tracking-widest italic text-neutral-900">
                        Catatan Tambahan Desain
                    </Label>
                    <Textarea 
                        value={designNote}
                        onChange={(e) => onDesignNoteChange(e.target.value)}
                        placeholder="Jelaskan detail desain tambahan (warna logo, sponsor, posisi nomor, dll)..." 
                        className="min-h-[22rem] rounded-[2.5rem] border-neutral-100 p-8 focus:ring-[#D25026]/10 focus:border-[#D25026] bg-white shadow-sm ring-1 ring-black/5 text-sm font-medium leading-relaxed"
                    />
                </div>
                <div className="space-y-3">
                    <Label className="text-[11px] font-black uppercase tracking-widest italic text-neutral-900">
                        Upload Referensi
                    </Label>
                    <div className="h-[15.625rem] border-2 border-dashed border-neutral-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 bg-white hover:bg-neutral-50 hover:border-[#D25026]/30 transition-all cursor-pointer group relative overflow-hidden shadow-sm ring-1 ring-black/5">
                        {designReferenceFile || hasExistingDesign ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-4">
                                {designReferenceFile ? (
                                    (designReferenceFile.type.includes("pdf") || designReferenceFile.name.toLowerCase().endsWith(".pdf")) ? (
                                        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-3 border border-red-100">
                                            <FileText className="w-10 h-10 text-red-500" />
                                        </div>
                                    ) : (
                                        <img 
                                            src={URL.createObjectURL(designReferenceFile)} 
                                            alt="Preview"
                                            className="w-full h-full object-contain mb-2 rounded-xl" 
                                        />
                                    )
                                ) : (
                                    resolvedDesignUrl.toLowerCase().endsWith(".pdf") ? (
                                        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-3 border border-red-100">
                                            <FileText className="w-10 h-10 text-red-500" />
                                        </div>
                                    ) : (
                                        <img 
                                            src={resolvedDesignUrl} 
                                            alt="Existing Design"
                                            className="w-full h-full object-contain mb-2 rounded-xl" 
                                        />
                                    )
                                )}
                                <p className="text-[10px] font-black uppercase text-neutral-400 truncate w-full text-center px-4 italic">
                                    {designReferenceFile ? designReferenceFile.name : "Existing Design Reference"}
                                </p>
                                
                                <button 
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDesignReferenceFileChange(null);
                                        onRemoveExistingDesignUrl?.();
                                    }}
                                    className="absolute top-4 right-4 z-20 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-lg cursor-pointer"
                                    title="Remove File"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center group-hover:bg-[#FFF0EB] transition-colors">
                                    <Upload className="w-8 h-8 text-neutral-300 group-hover:text-[#D25026]" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-black italic uppercase text-neutral-900 tracking-tighter">Drop file here</p>
                                    <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">Image or PDF allowed</p>
                                </div>
                            </>
                        )}
                        <input 
                            type="file" 
                            accept="image/*,.pdf"
                            className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    onDesignReferenceFileChange(file);
                                    onToast("Design reference uploaded!", "success");
                                }
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Opsi Pengiriman */}
            <div className="bg-white rounded-[2.5rem] border border-neutral-100 p-8 shadow-sm ring-1 ring-black/5 space-y-6">
                <div>
                    <h3 className="text-lg font-black italic uppercase tracking-tighter text-neutral-900">Opsi Pengiriman</h3>
                    <p className="text-neutral-400 text-xs font-medium mt-1">Pilih metode pengiriman pesanan jersey Anda.</p>
                </div>

                <div className="flex gap-4">
                    {[
                        { value: "PICKUP", label: "Ambil di Tempat (Self-Pickup)" },
                        { value: "COD", label: "COD (Penerima Yang Bayar)" }
                    ].map((method) => (
                        <button
                            key={method.value}
                            type="button"
                            onClick={() => onShippingMethodChange(method.value)}
                            className={cn(
                                "flex-1 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest italic border transition-all duration-300 cursor-pointer",
                                shippingMethod === method.value
                                    ? "bg-black text-white border-black shadow-lg"
                                    : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-450 hover:text-black"
                            )}
                        >
                            {method.label}
                        </button>
                    ))}
                </div>

                {shippingMethod === "PICKUP" ? (
                    <div className="bg-orange-50/50 border border-orange-100/50 rounded-2xl p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="w-10 h-10 bg-[#D25026]/10 rounded-xl flex items-center justify-center shrink-0">
                            <Info className="text-[#D25026] w-5 h-5" />
                        </div>
                        <div className="text-xs leading-relaxed text-neutral-700">
                            <p className="font-black uppercase tracking-wider text-[#D25026] mb-1">Catatan Pengambilan:</p>
                            <p className="font-medium">Anda harus mengunjungi toko kami secara langsung untuk mengambil pesanan jersey Anda setelah selesai diproduksi.</p>
                            <p className="font-black uppercase tracking-wider text-neutral-900 mt-2 mb-0.5">Alamat Toko:</p>
                            <p className="font-bold font-mono text-neutral-900 bg-white/60 p-3 rounded-lg border border-orange-200/50">
                                Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Label className="text-[11px] font-black uppercase tracking-widest italic text-neutral-900">
                            Alamat yang Dituju (Penerima)
                        </Label>
                        <Textarea
                            value={shippingAddress}
                            onChange={(e) => onShippingAddressChange(e.target.value)}
                            placeholder="Tulis alamat pengiriman secara detail (Nama penerima, No HP, Nama Jalan, RT/RW, Kecamatan, Kabupaten, Kode Pos)..."
                            className={cn(
                                "min-h-[8rem] rounded-2xl border-neutral-100 p-6 focus:ring-[#D25026]/10 focus:border-[#D25026] bg-neutral-50/50 text-sm font-medium leading-relaxed",
                                showValidation && shippingAddress.trim() === "" && "border-red-500 bg-red-50/20"
                            )}
                        />
                    </div>
                )}
            </div>

            {/* Metode Pembayaran Admin (Full Cash vs DP) */}
            <div className="space-y-6 pt-6 border-t border-neutral-100">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-[11px] font-black uppercase tracking-widest italic text-neutral-400">
                            Metode Pembayaran Pesanan
                        </h3>
                        <p className="text-sm font-bold text-neutral-900 mt-0.5">Tentukan jenis pembayaran dari customer</p>
                    </div>
                    <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-50 text-[#D25026]">
                        {paymentType === "DP" ? "Status DP" : "Full Cash (100%)"}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => onPaymentTypeChange("FULL")}
                        className={cn(
                            "p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[90px] cursor-pointer",
                            paymentType === "FULL"
                                ? "border-[#D25026] bg-[#FFF0EB]/40 shadow-sm"
                                : "border-neutral-100 bg-neutral-50/50 hover:border-neutral-200"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-tight text-neutral-900">Bayar Full Cash</span>
                            <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", paymentType === "FULL" ? "border-[#D25026] bg-[#D25026]" : "border-neutral-300")}>
                                {paymentType === "FULL" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                        </div>
                        <p className="text-[11px] text-neutral-500 font-medium">Lunas 100% langsung dicatat</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onPaymentTypeChange("DP");
                            if (!dpAmountInput || dpAmountInput <= 0) {
                                onDpAmountInputChange(Math.round(totalCalculated * 0.5));
                            }
                        }}
                        className={cn(
                            "p-5 rounded-2xl border-2 text-left transition-all relative flex flex-col justify-between min-h-[90px] cursor-pointer",
                            paymentType === "DP"
                                ? "border-[#D25026] bg-[#FFF0EB]/40 shadow-sm"
                                : "border-neutral-100 bg-neutral-50/50 hover:border-neutral-200"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-black uppercase tracking-tight text-neutral-900">DP (Uang Muka)</span>
                            <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", paymentType === "DP" ? "border-[#D25026] bg-[#D25026]" : "border-neutral-300")}>
                                {paymentType === "DP" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                            </div>
                        </div>
                        <p className="text-[11px] text-neutral-500 font-medium">Input nominal DP yang dibayarkan</p>
                    </button>
                </div>

                {/* Input Nominal DP jika tipe DP */}
                {paymentType === "DP" && (
                    <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-3 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between">
                            <Label className="text-xs font-bold text-amber-900">Nominal DP Diterima (Rp)</Label>
                            <button
                                type="button"
                                onClick={() => onDpAmountInputChange(Math.round(totalCalculated * 0.5))}
                                className="text-[10px] font-bold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                                Preset 50% ({formatRupiah(Math.round(totalCalculated * 0.5))})
                            </button>
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-amber-800">Rp</span>
                            <Input
                                type="number"
                                min={0}
                                max={totalCalculated}
                                value={dpAmountInput || ""}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10) || 0;
                                    onDpAmountInputChange(val);
                                }}
                                placeholder={`Contoh: ${Math.round(totalCalculated * 0.5)}`}
                                className="w-full pl-12 pr-4 py-3 bg-white border border-amber-300/80 rounded-xl text-sm font-bold text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#D25026]/30"
                            />
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-amber-200/40">
                            <span className="text-amber-800 font-medium">Sisa Kekurangan Tagihan:</span>
                            <span className="font-black text-rose-600 text-sm">
                                {formatRupiah(effectiveRemainingAmount)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Summary Breakdown */}
                <div className="bg-black text-white rounded-[2rem] p-6 shadow-xl space-y-3">
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-400 font-medium">Total Pesanan ({playerCount} Pcs)</span>
                        <span className="font-bold text-white">{formatRupiah(totalCalculated)}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                        <span className="text-neutral-400 font-medium">Metode Pembayaran</span>
                        <span className="font-bold text-amber-400">{paymentType === "DP" ? "DP (Uang Muka)" : "Full Cash (100%)"}</span>
                    </div>
                    {paymentType === "DP" && (
                        <>
                            <div className="flex justify-between items-center text-xs pt-2 border-t border-white/10">
                                <span className="text-neutral-400 font-medium">Dibayar (DP):</span>
                                <span className="font-black text-[#D25026] text-sm">{formatRupiah(effectivePaidAmount)}</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-neutral-400 font-medium">Sisa Tagihan (Kurang):</span>
                                <span className="font-black text-rose-400 text-sm">{formatRupiah(effectiveRemainingAmount)}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
