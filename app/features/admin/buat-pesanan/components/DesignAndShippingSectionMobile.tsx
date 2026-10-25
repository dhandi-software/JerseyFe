import React from "react";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { FileText, FileUp, X, Info } from "lucide-react";
import { cn } from "~/lib/utils";
import { formatRupiah } from "../utils";
import { UPLOADS_URL } from "~/api/client";

interface DesignAndShippingSectionMobileProps {
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
    onToast: (msg: string, variant: "success" | "destructive") => void;
}

export function DesignAndShippingSectionMobile({
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
    onToast
}: DesignAndShippingSectionMobileProps) {
    const hasExistingDesign = !!existingDesignUrl;
    const resolvedDesignUrl = existingDesignUrl
        ? (existingDesignUrl.startsWith("http") ? existingDesignUrl : `${UPLOADS_URL}${existingDesignUrl.startsWith("/") ? "" : "/"}${existingDesignUrl}`)
        : "";

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-black italic uppercase tracking-tighter">
                Design Reference
            </h2>
            
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase italic text-neutral-400">Catatan Desain</Label>
                    <Textarea 
                        value={designNote}
                        onChange={(e) => onDesignNoteChange(e.target.value)}
                        placeholder="Warna logo, sponsor, dll..." 
                        className="min-h-[180px] rounded-2xl border-neutral-100 p-4 text-sm"
                    />
                </div>
                
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase italic text-neutral-400">Referensi Gambar</Label>
                    <div className="h-48 border-2 border-dashed border-neutral-100 rounded-3xl bg-white flex flex-col items-center justify-center gap-3 relative overflow-hidden group transition-all active:scale-95">
                        {designReferenceFile || hasExistingDesign ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-4">
                                {designReferenceFile ? (
                                    (designReferenceFile.type.includes("pdf") || designReferenceFile.name.toLowerCase().endsWith(".pdf")) ? (
                                        <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mb-2 border border-red-100">
                                            <FileText className="w-8 h-8 text-red-500" />
                                        </div>
                                    ) : (
                                        <img 
                                            src={URL.createObjectURL(designReferenceFile)} 
                                            alt="Preview"
                                            className="w-full h-full object-contain mb-1 rounded-xl" 
                                        />
                                    )
                                ) : (
                                    resolvedDesignUrl.toLowerCase().endsWith(".pdf") ? (
                                        <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mb-2 border border-red-100">
                                            <FileText className="w-8 h-8 text-red-500" />
                                        </div>
                                    ) : (
                                        <img 
                                            src={resolvedDesignUrl} 
                                            alt="Existing Design"
                                            className="w-full h-full object-contain mb-1 rounded-xl" 
                                        />
                                    )
                                )}
                                <p className="text-[9px] font-black uppercase text-neutral-400 truncate w-full text-center px-4 italic">
                                    {designReferenceFile ? designReferenceFile.name : "Existing Design"}
                                </p>
                                
                                <button 
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDesignReferenceFileChange(null);
                                        onRemoveExistingDesignUrl?.();
                                    }}
                                    className="absolute top-2 right-2 z-20 w-7 h-7 bg-white text-red-500 rounded-full flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-md cursor-pointer"
                                    title="Remove File"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="w-12 h-12 bg-neutral-50 rounded-xl flex items-center justify-center">
                                    <FileUp className="w-6 h-6 text-neutral-300" />
                                </div>
                                <span className="text-[10px] font-black uppercase italic text-neutral-400">Click to Upload</span>
                            </>
                        )}
                        <input 
                            type="file" 
                            accept="image/*,.pdf"
                            className="absolute inset-0 opacity-0 z-10 cursor-pointer" 
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

                {/* Opsi Pengiriman Mobile */}
                <div className="bg-white p-6 rounded-[2rem] border border-neutral-100 shadow-sm space-y-4">
                    <div>
                        <h3 className="text-xs font-black uppercase italic tracking-tighter text-neutral-900">Opsi Pengiriman</h3>
                        <p className="text-neutral-400 text-[9px] font-bold mt-1">Pilih metode pengiriman pesanan jersey Anda.</p>
                    </div>

                    <div className="flex gap-2">
                        {[
                            { value: "PICKUP", label: "Ambil di Toko" },
                            { value: "COD", label: "COD" }
                        ].map((method) => (
                            <button
                                key={method.value}
                                type="button"
                                onClick={() => onShippingMethodChange(method.value)}
                                className={cn(
                                    "flex-1 py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-wider italic border transition-all duration-300 cursor-pointer",
                                    shippingMethod === method.value
                                        ? "bg-black text-white border-black shadow-md"
                                        : "bg-white text-neutral-600 border-neutral-200"
                                )}
                            >
                                {method.label}
                            </button>
                        ))}
                    </div>

                    {shippingMethod === "PICKUP" ? (
                        <div className="bg-orange-50/50 border border-orange-100/50 rounded-xl p-4 flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-300">
                            <Info className="text-[#D25026] w-4 h-4 mt-0.5 shrink-0" />
                            <div className="text-[10px] leading-relaxed text-neutral-600">
                                <p className="font-bold text-[#D25026] mb-0.5">Ambil di Tempat:</p>
                                <p>Kunjungi toko kami secara langsung setelah pesanan selesai diproduksi.</p>
                                <p className="font-bold text-neutral-900 mt-1.5">Alamat:</p>
                                <p className="font-mono text-neutral-800 bg-white/70 p-2 rounded border border-orange-100 mt-0.5">
                                    Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-300">
                            <Label className="text-[9px] font-black uppercase tracking-wider text-neutral-400 italic">Alamat Tujuan COD</Label>
                            <Textarea
                                value={shippingAddress}
                                onChange={(e) => onShippingAddressChange(e.target.value)}
                                placeholder="Tulis alamat pengiriman secara detail..."
                                className={cn(
                                    "min-h-[80px] rounded-xl border-neutral-150 p-4 bg-neutral-50/50 text-xs font-medium leading-normal",
                                    showValidation && shippingAddress.trim() === "" && "border-red-500 bg-red-50/20"
                                )}
                            />
                        </div>
                    )}
                </div>

                {/* Metode Pembayaran Admin Mobile (Full Cash vs DP) */}
                <div className="bg-white p-5 rounded-[2rem] border border-neutral-100 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 className="text-xs font-black uppercase italic tracking-tighter text-neutral-900">Metode Pembayaran</h3>
                            <p className="text-neutral-400 text-[9px] font-bold mt-0.5">Tentukan jenis pembayaran dari customer</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-orange-50 text-[#D25026]">
                            {paymentType === "DP" ? "Status DP" : "Full 100%"}
                        </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        <button
                            type="button"
                            onClick={() => onPaymentTypeChange("FULL")}
                            className={cn(
                                "min-h-[50px] p-3 rounded-xl border-2 text-left transition-all relative flex flex-col justify-between active:scale-98 cursor-pointer",
                                paymentType === "FULL"
                                    ? "border-[#D25026] bg-[#FFF0EB]/40 shadow-xs"
                                    : "border-neutral-100 bg-neutral-50/50"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black uppercase tracking-tight text-neutral-900">Full Cash</span>
                                <div className={cn("w-3.5 h-3.5 rounded-full border flex items-center justify-center", paymentType === "FULL" ? "border-[#D25026] bg-[#D25026]" : "border-neutral-300")}>
                                    {paymentType === "FULL" && <div className="w-1 h-1 rounded-full bg-white" />}
                                </div>
                            </div>
                            <p className="text-[10px] text-neutral-500 font-medium mt-1">Lunas langsung</p>
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
                                "min-h-[50px] p-3 rounded-xl border-2 text-left transition-all relative flex flex-col justify-between active:scale-98 cursor-pointer",
                                paymentType === "DP"
                                    ? "border-[#D25026] bg-[#FFF0EB]/40 shadow-xs"
                                    : "border-neutral-100 bg-neutral-50/50"
                            )}
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-black uppercase tracking-tight text-neutral-900">DP (Uang Muka)</span>
                                <div className={cn("w-3.5 h-3.5 rounded-full border flex items-center justify-center", paymentType === "DP" ? "border-[#D25026] bg-[#D25026]" : "border-neutral-300")}>
                                    {paymentType === "DP" && <div className="w-1 h-1 rounded-full bg-white" />}
                                </div>
                            </div>
                            <p className="text-[10px] text-neutral-500 font-medium mt-1">Input nominal DP</p>
                        </button>
                    </div>

                    {paymentType === "DP" && (
                        <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/60 space-y-2.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[11px] font-bold text-amber-900">Nominal DP Diterima</label>
                                <button
                                    type="button"
                                    onClick={() => onDpAmountInputChange(Math.round(totalCalculated * 0.5))}
                                    className="text-[9px] font-black uppercase tracking-wider text-[#D25026] bg-white px-2 py-1 rounded-lg border border-orange-200 shadow-2xs active:bg-orange-50 cursor-pointer"
                                >
                                    Preset 50%
                                </button>
                            </div>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-neutral-400 text-xs">Rp</span>
                                <input
                                    type="number"
                                    min={1}
                                    max={totalCalculated}
                                    value={dpAmountInput || ""}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value, 10) || 0;
                                        onDpAmountInputChange(val);
                                    }}
                                    placeholder={`Contoh: ${Math.round(totalCalculated * 0.5)}`}
                                    className="w-full pl-9 pr-3 py-2 bg-white border border-amber-300/80 rounded-xl text-xs font-bold text-neutral-900 focus:outline-hidden focus:ring-2 focus:ring-[#D25026]/30"
                                />
                            </div>
                            <div className="flex items-center justify-between text-[11px] pt-1 border-t border-amber-200/40">
                                <span className="text-amber-800 font-medium">Sisa Tagihan (Kurang):</span>
                                <span className="font-black text-rose-600">
                                    {formatRupiah(effectiveRemainingAmount)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Breakdown Mini */}
                    <div className="bg-black text-white rounded-xl p-4 space-y-2">
                        <div className="flex justify-between items-center text-[11px]">
                            <span className="text-neutral-400 font-medium">Total Pesanan</span>
                            <span className="font-bold text-white">{formatRupiah(totalCalculated)}</span>
                        </div>
                        <div className="flex justify-between items-center text-[11px]">
                            <span className="text-neutral-400 font-medium">Metode</span>
                            <span className="font-bold text-amber-400">{paymentType === "DP" ? "DP (Uang Muka)" : "Full Cash"}</span>
                        </div>
                        {paymentType === "DP" && (
                            <>
                                <div className="flex justify-between items-center text-[11px] pt-1 border-t border-white/10">
                                    <span className="text-neutral-400 font-medium">Dibayar (DP):</span>
                                    <span className="font-black text-[#D25026]">{formatRupiah(effectivePaidAmount)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[11px]">
                                    <span className="text-neutral-400 font-medium">Sisa Tagihan:</span>
                                    <span className="font-black text-rose-400">{formatRupiah(effectiveRemainingAmount)}</span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
