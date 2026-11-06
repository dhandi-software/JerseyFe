import { X, Loader2, ImagePlus, FileText, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { UseCustomMaterialModalReturn } from "~/hooks/useCustomMaterialModal";

interface CustomMaterialModalDesktopProps {
    form: UseCustomMaterialModalReturn;
}

export function CustomMaterialModalDesktop({ form }: CustomMaterialModalDesktopProps) {
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
            className="fixed inset-0 z-[10020] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-6 font-['Inter'] animate-in fade-in duration-200"
            onClick={handleClose}
        >
            <div
                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl border border-slate-100 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between shrink-0">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h2 className="text-lg font-black italic uppercase tracking-tight text-slate-900">
                                Tambah Bahan Kustom Baru
                            </h2>
                            <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#D25026] border border-orange-200/70 text-[10px] font-black uppercase tracking-wider">
                                Sinkron Katalog
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 font-medium mt-0.5">
                            Daftarkan spesifikasi bahan baru, otomatis tersimpan ke katalog dan langsung terpilih pada pesanan ini.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
                        aria-label="Tutup popup"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    {errorMsg && (
                        <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold flex items-center gap-2.5">
                            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                            <span>{errorMsg}</span>
                        </div>
                    )}

                    <div className="grid grid-cols-12 gap-7">
                        {/* Left Column: Visual Reference & Bukti Nota */}
                        <div className="col-span-4 space-y-5">
                            {/* Upload Katalog Visual */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                                    Upload Katalog Visual
                                </label>
                                <div className="relative group w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-400 transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer">
                                    {imagePreview ? (
                                        <>
                                            <img
                                                src={imagePreview}
                                                alt="Preview Katalog"
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveImage();
                                                    }}
                                                    className="rounded-xl font-bold uppercase tracking-wider text-[10px] px-4 h-9 shadow-lg"
                                                >
                                                    Ganti Gambar
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-4 text-center space-y-2.5">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors">
                                                <ImagePlus className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="block text-xs font-black text-slate-800 uppercase">
                                                    Pilih Foto Katalog
                                                </span>
                                                <span className="block text-[10px] font-semibold text-slate-400 mt-0.5">
                                                    PNG atau JPG (Maks. 5MB)
                                                </span>
                                            </div>
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

                            {/* Upload Bukti Nota */}
                            <div className="space-y-2">
                                <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-[#D25026]" />
                                        Bukti Nota Pembelian
                                    </span>
                                    <span className="text-[10px] font-bold text-[#D25026]">Wajib</span>
                                </label>
                                <div className="relative group w-full aspect-[4/3] rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 hover:bg-white hover:border-[#D25026] transition-all flex flex-col items-center justify-center overflow-hidden cursor-pointer">
                                    {buktiNotaPreview ? (
                                        <>
                                            <img
                                                src={buktiNotaPreview}
                                                alt="Preview Bukti Nota"
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveBuktiNota();
                                                    }}
                                                    className="rounded-xl font-bold uppercase tracking-wider text-[10px] px-4 h-9 shadow-lg"
                                                >
                                                    Ganti Nota
                                                </Button>
                                            </div>
                                        </>
                                    ) : buktiNota && buktiNotaType === "application/pdf" ? (
                                        <>
                                            <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                                                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#D25026] flex items-center justify-center">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <span className="block text-xs font-bold text-slate-700 truncate max-w-[180px]">
                                                    {buktiNota.name}
                                                </span>
                                                <span className="text-[10px] font-semibold text-emerald-600">
                                                    Dokumen PDF Siap Diunggah
                                                </span>
                                            </div>
                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveBuktiNota();
                                                    }}
                                                    className="rounded-xl font-bold uppercase tracking-wider text-[10px] px-4 h-9 shadow-lg"
                                                >
                                                    Ganti Nota
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-4 text-center space-y-2.5">
                                            <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 group-hover:text-[#D25026] transition-colors">
                                                <ImagePlus className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className="block text-xs font-black text-slate-800 uppercase">
                                                    Upload Bukti Nota
                                                </span>
                                                <span className="block text-[10px] font-semibold text-slate-400 mt-0.5">
                                                    JPG, PNG, atau PDF (Maks. 5MB)
                                                </span>
                                            </div>
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

                        {/* Right Column: Form Inputs */}
                        <div className="col-span-8 space-y-5">
                            {/* Row 1: Nama Bahan & Harga Satuan */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 block">
                                        Nama Bahan <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        value={nama}
                                        onChange={(e) => setNama(e.target.value)}
                                        placeholder="Contoh: Dryfit Milano Emboss Premium"
                                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] focus:bg-white transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 block">
                                        Harga Satuan Jual (Rp) <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-black">
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
                                            className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] focus:bg-white transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Ketersediaan Stok, Rasio Konversi, Status */}
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 block">
                                        Ketersediaan Stok (kg) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        inputMode="decimal"
                                        value={kuantitasKg}
                                        onChange={(e) => setKuantitasKg(e.target.value.replace(/[^0-9,.]/g, ""))}
                                        placeholder="Contoh: 15,0"
                                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] focus:bg-white transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                        <span>Rasio (m/kg)</span>
                                        <span className="text-[10px] font-bold text-[#D25026] bg-orange-50 px-1.5 py-0.5 rounded border border-orange-200/60">
                                            {parsedKuantitas > 0 ? kuantitasKg : "1"} kg ={" "}
                                            {String((parsedKuantitas > 0 ? parsedKuantitas * parsedRasio : parsedRasio).toFixed(1)).replace(".", ",")} m
                                        </span>
                                    </label>
                                    <input
                                        required
                                        type="text"
                                        inputMode="decimal"
                                        value={rasioKonversi}
                                        onChange={(e) => setRasioKonversi(e.target.value.replace(/[^0-9,.]/g, ""))}
                                        placeholder="2,5"
                                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] focus:bg-white transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700 block">
                                        Status Ketersediaan
                                    </label>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                        className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] focus:bg-white transition-all cursor-pointer"
                                    >
                                        <option value="Tersedia">Tersedia</option>
                                        <option value="Habis">Habis</option>
                                    </select>
                                </div>
                            </div>

                            {/* Row 3: Total Harga Beli / Modal Nota */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-orange-700 flex items-center justify-between">
                                    <span>Total Harga Beli / Modal Keseluruhan Sesuai Nota (Rp)</span>
                                    <span className="text-[10px] font-semibold text-slate-400">Untuk pencatatan inventaris</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-orange-500 text-xs font-black">
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
                                        className="w-full h-11 pl-10 pr-4 bg-orange-50/50 border border-orange-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-400 focus:bg-white transition-all"
                                    />
                                </div>
                            </div>

                            {/* Estimasi Kapasitas Produksi Ringkas */}
                            {parsedKuantitas > 0 && (
                                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4">
                                    <div className="bg-[#D25026] text-white px-4 py-2.5 rounded-xl shrink-0">
                                        <span className="text-[9px] font-black uppercase tracking-wider block opacity-90">
                                            Total Meter Tersedia
                                        </span>
                                        <span className="text-lg font-black">
                                            {(parsedKuantitas * parsedRasio).toFixed(1)} m
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 flex-1 text-center">
                                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                                            <span className="text-[9px] font-bold text-slate-400 block">Pendek S-2XL</span>
                                            <span className="text-xs font-black text-blue-700">
                                                ~{Math.floor(parsedKuantitas * (parsedRasio / 0.8333))} pcs
                                            </span>
                                        </div>
                                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                                            <span className="text-[9px] font-bold text-slate-400 block">Pendek 3XL+</span>
                                            <span className="text-xs font-black text-blue-600">
                                                ~{Math.floor(parsedKuantitas * (parsedRasio / 1.25))} pcs
                                            </span>
                                        </div>
                                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                                            <span className="text-[9px] font-bold text-slate-400 block">Panjang S-2XL</span>
                                            <span className="text-xs font-black text-indigo-700">
                                                ~{Math.floor(parsedKuantitas * (parsedRasio / 1.25))} pcs
                                            </span>
                                        </div>
                                        <div className="bg-white p-2 rounded-xl border border-slate-100">
                                            <span className="text-[9px] font-bold text-slate-400 block">Panjang 3XL+</span>
                                            <span className="text-xs font-black text-indigo-600">
                                                ~{Math.floor(parsedKuantitas * (parsedRasio / 2.5))} pcs
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Row 4: Karakteristik Bahan */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700 block">
                                    Karakteristik Bahan
                                </label>
                                <textarea
                                    value={deskripsi}
                                    onChange={(e) => setDeskripsi(e.target.value)}
                                    rows={3}
                                    placeholder="Tuliskan karakteristik bahan (contoh: tekstur pori zig-zag, adem, menyerap keringat, cocok untuk jersey futsal/sepakbola)..."
                                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] focus:bg-white transition-all leading-relaxed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                            className="h-11 px-6 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider cursor-pointer"
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-11 px-7 rounded-xl bg-[#0F172A] hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider shadow-md flex items-center gap-2 cursor-pointer"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Menyimpan...
                                </>
                            ) : (
                                "Simpan & Gunakan Bahan"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

