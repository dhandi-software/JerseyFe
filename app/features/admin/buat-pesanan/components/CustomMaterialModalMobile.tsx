import { X, Loader2, ImagePlus, FileText, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { UseCustomMaterialModalReturn } from "~/hooks/useCustomMaterialModal";

interface CustomMaterialModalMobileProps {
    form: UseCustomMaterialModalReturn;
}

export function CustomMaterialModalMobile({ form }: CustomMaterialModalMobileProps) {
    const {
        isSubmitting,
        errorMsg,
        nama,
        setNama,
        harga,
        setHarga,
        kuantitasKg,
        setKuantitasKg,
        rasioKonversi,
        setRasioKonversi,
        status,
        setStatus,
        hargaBeli,
        setHargaBeli,
        deskripsi,
        setDeskripsi,
        imagePreview,
        handleImageChange,
        handleRemoveImage,
        buktiNota,
        buktiNotaPreview,
        buktiNotaType,
        handleBuktiNotaChange,
        handleRemoveBuktiNota,
        parsedKuantitas,
        parsedRasio,
        formatThousands,
        handleClose,
        handleSubmit
    } = form;

    return (
        <div
            className="fixed inset-0 z-[10020] bg-slate-900/60 backdrop-blur-sm flex items-end justify-center font-['Inter'] animate-in fade-in duration-200"
            onClick={handleClose}
        >
            <div
                className="bg-white w-full max-h-[92dvh] rounded-t-3xl border-t border-slate-100 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 duration-250"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Handle Indicator & Header */}
                <div className="pt-2.5 pb-3.5 px-5 border-b border-slate-100 bg-slate-50/80 shrink-0">
                    <div className="w-10 h-1 rounded-full bg-slate-300 mx-auto mb-3" />
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <h2 className="text-sm font-black italic uppercase tracking-tight text-slate-900 truncate">
                                Tambah Bahan Kustom
                            </h2>
                            <p className="text-[11px] text-slate-500 font-medium truncate">
                                Otomatis masuk katalog & langsung dipilih
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="w-11 h-11 rounded-xl text-slate-400 active:bg-slate-200/70 flex items-center justify-center shrink-0"
                            aria-label="Tutup popup"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Scrollable Form Content */}
                <form
                    id="custom-material-mobile-form"
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar"
                >
                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    {/* 2-Column Compact Upload Cards: Katalog Visual & Bukti Nota */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Katalog Visual */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                Katalog Visual
                            </label>
                            <div className="relative w-full aspect-[4/3] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 flex flex-col items-center justify-center overflow-hidden">
                                {imagePreview ? (
                                    <>
                                        <img
                                            src={imagePreview}
                                            alt="Preview Katalog"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveImage();
                                            }}
                                            className="absolute top-1.5 right-1.5 z-10 w-8 h-8 rounded-lg bg-red-600/90 text-white flex items-center justify-center shadow"
                                            aria-label="Hapus foto katalog"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-2.5 text-center space-y-1">
                                        <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-blue-500">
                                            <ImagePlus className="w-4 h-4" />
                                        </div>
                                        <span className="block text-[10px] font-black text-slate-800 uppercase leading-tight">
                                            Foto Bahan
                                        </span>
                                        <span className="block text-[9px] font-medium text-slate-400">
                                            JPG / PNG
                                        </span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Bukti Nota */}
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#D25026]" />
                                    Bukti Nota
                                </span>
                                <span className="text-[9px] font-bold text-[#D25026]">Wajib</span>
                            </label>
                            <div className="relative w-full aspect-[4/3] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 flex flex-col items-center justify-center overflow-hidden">
                                {buktiNotaPreview ? (
                                    <>
                                        <img
                                            src={buktiNotaPreview}
                                            alt="Preview Nota"
                                            className="w-full h-full object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveBuktiNota();
                                            }}
                                            className="absolute top-1.5 right-1.5 z-10 w-8 h-8 rounded-lg bg-red-600/90 text-white flex items-center justify-center shadow"
                                            aria-label="Hapus bukti nota"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : buktiNota && buktiNotaType === "application/pdf" ? (
                                    <>
                                        <div className="flex flex-col items-center justify-center p-2.5 text-center space-y-1">
                                            <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#D25026] flex items-center justify-center">
                                                <FileText className="w-4 h-4" />
                                            </div>
                                            <span className="block text-[10px] font-bold text-slate-700 truncate max-w-[110px]">
                                                {buktiNota.name}
                                            </span>
                                            <span className="text-[9px] font-semibold text-emerald-600">
                                                PDF Terpilih
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveBuktiNota();
                                            }}
                                            className="absolute top-1.5 right-1.5 z-10 w-8 h-8 rounded-lg bg-red-600/90 text-white flex items-center justify-center shadow"
                                            aria-label="Hapus PDF nota"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-2.5 text-center space-y-1">
                                        <div className="w-9 h-9 rounded-xl bg-white shadow-xs border border-slate-100 flex items-center justify-center text-[#D25026]">
                                            <ImagePlus className="w-4 h-4" />
                                        </div>
                                        <span className="block text-[10px] font-black text-slate-800 uppercase leading-tight">
                                            Upload Nota
                                        </span>
                                        <span className="block text-[9px] font-medium text-slate-400">
                                            Foto / PDF
                                        </span>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    accept=".jpg,.jpeg,.png,.pdf"
                                    onChange={handleBuktiNotaChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nama Bahan */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">
                            Nama Bahan <span className="text-red-500">*</span>
                        </label>
                        <input
                            required
                            type="text"
                            value={nama}
                            onChange={(e) => setNama(e.target.value)}
                            placeholder="Contoh: Dryfit Milano Emboss"
                            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] focus:bg-white transition-all"
                        />
                    </div>

                    {/* Harga Satuan & Status Ketersediaan */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block">
                                Harga Satuan (Rp) <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[11px] font-black">
                                    Rp
                                </span>
                                <input
                                    required
                                    type="text"
                                    inputMode="numeric"
                                    value={formatThousands(harga)}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/[^0-9]/g, "");
                                        setHarga(val === "" ? "" : Number(val));
                                    }}
                                    placeholder="150.000"
                                    className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] focus:bg-white transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block">
                                Status Stok
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] focus:bg-white transition-all"
                            >
                                <option value="Tersedia">Tersedia</option>
                                <option value="Habis">Habis</option>
                            </select>
                        </div>
                    </div>

                    {/* Ketersediaan Stok (kg) & Rasio Konversi */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 block">
                                Stok Awal (kg) <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                inputMode="decimal"
                                value={kuantitasKg}
                                onChange={(e) => setKuantitasKg(e.target.value.replace(/[^0-9,.]/g, ""))}
                                placeholder="Contoh: 10,0"
                                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] focus:bg-white transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                <span>Rasio (m/kg)</span>
                                <span className="text-[10px] font-bold text-[#D25026]">
                                    = {String((parsedKuantitas > 0 ? parsedKuantitas * parsedRasio : parsedRasio).toFixed(1)).replace(".", ",")} m
                                </span>
                            </label>
                            <input
                                required
                                type="text"
                                inputMode="decimal"
                                value={rasioKonversi}
                                onChange={(e) => setRasioKonversi(e.target.value.replace(/[^0-9,.]/g, ""))}
                                placeholder="2,5"
                                className="w-full h-11 px-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Harga Modal / Beli Nota */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-orange-700 block">
                            Total Harga Beli / Modal Nota (Rp)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500 text-[11px] font-black">
                                Rp
                            </span>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={formatThousands(hargaBeli)}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, "");
                                    setHargaBeli(val === "" ? "" : Number(val));
                                }}
                                placeholder="100.000"
                                className="w-full h-11 pl-9 pr-3.5 bg-orange-50/50 border border-orange-200 rounded-xl text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
                            />
                        </div>
                    </div>

                    {/* Estimasi Produksi Ringkas */}
                    {parsedKuantitas > 0 && (
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                                    Estimasi Kapasitas Produksi
                                </span>
                                <span className="text-xs font-black text-[#D25026]">
                                    Total {(parsedKuantitas * parsedRasio).toFixed(1)} meter
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                <div className="bg-white p-2 rounded-lg border border-slate-100 flex justify-between">
                                    <span className="text-slate-500 font-medium">Pendek S-2XL:</span>
                                    <span className="font-bold text-blue-700">
                                        ~{Math.floor(parsedKuantitas * (parsedRasio / 0.8333))} pcs
                                    </span>
                                </div>
                                <div className="bg-white p-2 rounded-lg border border-slate-100 flex justify-between">
                                    <span className="text-slate-500 font-medium">Panjang S-2XL:</span>
                                    <span className="font-bold text-indigo-700">
                                        ~{Math.floor(parsedKuantitas * (parsedRasio / 1.25))} pcs
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Karakteristik Bahan */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700 block">
                            Karakteristik Bahan
                        </label>
                        <textarea
                            value={deskripsi}
                            onChange={(e) => setDeskripsi(e.target.value)}
                            rows={3}
                            placeholder="Contoh: Tekstur zig-zag adem, menyerap keringat, gramasi 180 gsm..."
                            className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] focus:bg-white transition-all leading-relaxed"
                        />
                    </div>
                </form>

                {/* Sticky Footer Actions */}
                <div className="p-4 border-t border-slate-100 bg-white grid grid-cols-2 gap-3 shrink-0">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="h-11 rounded-xl border-slate-200 text-slate-600 font-bold text-xs uppercase tracking-wider"
                    >
                        Batal
                    </Button>
                    <Button
                        type="submit"
                        form="custom-material-mobile-form"
                        disabled={isSubmitting}
                        className="h-11 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow flex items-center justify-center gap-1.5"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Menyimpan...
                            </>
                        ) : (
                            "Simpan Bahan"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}

