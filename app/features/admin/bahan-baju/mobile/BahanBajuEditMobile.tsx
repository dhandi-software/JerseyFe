import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { adminApi } from "~/api/admin";
import { Save, X, Loader2, ArrowLeft, ImagePlus } from "lucide-react";
import { Toast } from "~/components/ui/toast";
import { useNavigate, useParams } from "react-router";
import { UPLOADS_URL } from "~/api/client";

export function BahanBajuEditMobile() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ title: string; variant: "success" | "destructive" } | null>(null);

    // Form state
    const [nama, setNama] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [kuantitasKg, setKuantitasKg] = useState<string>("");
    const [rasioKonversi, setRasioKonversi] = useState<string>("");
    const [status, setStatus] = useState("Tersedia");
    const [harga, setHarga] = useState<number | "">("");
    const [hargaBeli, setHargaBeli] = useState<number | "">("");
    const [keteranganUbah, setKeteranganUbah] = useState("");

    const [rusakPcs, setRusakPcs] = useState("");
    const [keteranganRusak, setKeteranganRusak] = useState("");

    const parsedKuantitas = parseFloat(String(kuantitasKg).replace(',', '.')) || 0;
    const parsedRasio = parseFloat(String(rasioKonversi).replace(',', '.')) || 2.5;
    
    // Image state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [deleteImage, setDeleteImage] = useState(false);

    const [buktiNotaFile, setBuktiNotaFile] = useState<File | null>(null);
    const [buktiNotaPreview, setBuktiNotaPreview] = useState<string | null>(null);
    const [deleteBuktiNota, setDeleteBuktiNota] = useState(false);

    useEffect(() => {
        const fetchBahan = async () => {
            try {
                const res = await adminApi.getBahanBaju();
                if (res.status === "success") {
                    const bahan = res.data.find((b: any) => b.id === Number(id));
                    if (bahan) {
                        setNama(bahan.nama);
                        setDeskripsi(bahan.deskripsi || "");
                        setKuantitasKg(bahan.kuantitasKg ? String(bahan.kuantitasKg).replace('.', ',') : "");
                        setRasioKonversi(bahan.rasioKonversi ? String(bahan.rasioKonversi).replace('.', ',') : "");
                        setStatus(bahan.status || "Tersedia");
                        setHarga(bahan.harga || 0);
                        setHargaBeli(bahan.hargaBeli || 0);
                        if (bahan.imageUrl) {
                            setImagePreview(UPLOADS_URL + bahan.imageUrl);
                        }
                        if (bahan.buktiNotaUrl) {
                            setBuktiNotaPreview(UPLOADS_URL + bahan.buktiNotaUrl);
                        }
                    } else {
                        setToast({ title: "Bahan tidak ditemukan", variant: "destructive" });
                        navigate("/admin/bahan-baju");
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBahan();
    }, [id, navigate]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setDeleteImage(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setDeleteImage(true);
    };

    const handleBuktiNotaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBuktiNotaFile(file);
            setDeleteBuktiNota(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBuktiNotaPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveBuktiNota = () => {
        setBuktiNotaFile(null);
        setBuktiNotaPreview(null);
        setDeleteBuktiNota(true);
    };

    const formatThousands = (value: number | string) => {
        if (!value) return "";
        const num = typeof value === "string" ? value.replace(/[^0-9]/g, "") : value.toString();
        return new Intl.NumberFormat('id-ID').format(Number(num));
    };

    const handleKurangiRusak = () => {
        let pcs = parseInt(rusakPcs);
        if (isNaN(pcs)) return;
        pcs = Math.abs(pcs); // Handle negative inputs gracefully
        if (pcs === 0) return;
        
        // Menggunakan standar konversi Pendek S-2XL (0.8333)
        const pengali = 0.8333;
        const kgDikurangi = pcs * (pengali / parsedRasio);
        
        const newKuantitas = Math.max(0, parsedKuantitas - kgDikurangi);
        const roundedKuantitas = Math.round(newKuantitas * 10000) / 10000;
        setKuantitasKg(roundedKuantitas.toString().replace('.', ','));
        setKeteranganRusak(`Dikurangi ${kgDikurangi.toFixed(2)} kg (Konversi dari ${pcs} pcs).`);
        setKeteranganUbah(`Pengurangan barang rusak: ${pcs} pcs (${kgDikurangi.toFixed(2)} kg)`);
        setRusakPcs("");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("nama", nama);
            formData.append("deskripsi", deskripsi);
            formData.append("kuantitasKg", String(parsedKuantitas));
            formData.append("rasioKonversi", String(parsedRasio));
            formData.append("status", status);
            formData.append("harga", String(harga));
            formData.append("hargaBeli", String(hargaBeli));
            formData.append("keterangan_ubah", keteranganUbah);
            if (deleteImage) {
                formData.append("deleteImage", "true");
            }
            if (imageFile) {
                formData.append("image", imageFile);
            }
            if (deleteBuktiNota) {
                formData.append("deleteBuktiNota", "true");
            }
            if (buktiNotaFile) {
                formData.append("buktiNota", buktiNotaFile);
            }

            await adminApi.updateBahanBaju(Number(id), formData);
            setToast({ title: "Bahan baju berhasil diperbarui!", variant: "success" });
            setTimeout(() => navigate("/admin/bahan-baju"), 1500);
        } catch (error) {
            console.error(error);
            setToast({ title: "Gagal menyimpan data", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic animate-pulse">Memuat Data...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] font-geist p-4 relative">
            {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
            
            <div className="w-full">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate("/admin/bahan-baju")}
                    className="mb-4 text-slate-500 hover:text-slate-900 rounded-xl px-0 hover:bg-transparent transition-all"
                >
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-3 active:scale-90 transition-transform">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-xs tracking-tight uppercase">Kembali</span>
                </Button>

                <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="mb-6">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[9px] font-black uppercase tracking-widest mb-3">
                            Update Material
                        </div>
                        <h1 className="text-2xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Edit Bahan</h1>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic leading-relaxed">Update spesifikasi atau stok bahan baku.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Image Upload Area */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                Foto Katalog
                            </label>
                            <div className="relative group w-full aspect-[4/3] rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center overflow-hidden cursor-pointer">
                                {imagePreview ? (
                                    <>
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[2px]">
                                            <Button 
                                                type="button"
                                                variant="destructive"
                                                size="sm"
                                                onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                                                className="rounded-lg font-bold uppercase tracking-widest text-[9px] px-4 h-8 shadow-lg"
                                            >
                                                Ganti Foto
                                            </Button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center p-6 text-center space-y-3">
                                        <div className="w-12 h-12 rounded-xl bg-white shadow flex items-center justify-center text-slate-350 group-hover:text-orange-500 group-hover:scale-105 transition-all duration-300">
                                            <ImagePlus className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-0.5">
                                            <span className="block text-[10px] font-black text-slate-900 uppercase">Upload Foto</span>
                                            <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Max 5MB</span>
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

                        {/* Text Inputs Area */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Nama Bahan</label>
                                <input 
                                    required
                                    type="text" 
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Harga Satuan (Rp)</label>
                                <div className="relative">
                                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-extrabold italic">Rp</span>
                                    <input 
                                        required
                                        type="text" 
                                        value={formatThousands(harga)}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, "");
                                            setHarga(val === "" ? "" : Number(val));
                                        }}
                                        className="w-full h-11 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Ketersediaan Saat Ini (kg)</label>
                                <input 
                                    required
                                    type="text" 
                                    value={kuantitasKg}
                                    onChange={(e) => setKuantitasKg(e.target.value.replace(/[^0-9,.]/g, ""))}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 flex items-center gap-1">
                                    Rasio Konversi ({kuantitasKg || "0"} kg = {String((parsedKuantitas * parsedRasio).toFixed(1)).replace('.', ',')} meter)
                                    <span className="text-slate-350 cursor-help" title="Rasio konversi kain dari kilogram ke meter. Misalnya 1 kg = 2,5 meter.">ⓘ</span>
                                </label>
                                <input 
                                    required
                                    type="text" 
                                    value={rasioKonversi}
                                    onChange={(e) => setRasioKonversi(e.target.value.replace(/[^0-9,.]/g, ""))}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Status Ketersediaan</label>
                                <select 
                                    required
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                                >
                                    <option value="Tersedia">Tersedia</option>
                                    <option value="Habis">Habis</option>
                                </select>
                            </div>
                            
                            {parsedKuantitas > 0 && (
                                <div className="space-y-3 mt-2">
                                    <div className="flex items-center justify-between bg-[#D25026] p-3.5 rounded-xl text-white shadow-sm">
                                        <div>
                                            <h4 className="text-[9px] font-black uppercase tracking-wider opacity-90 leading-tight">Total Meter Tersedia</h4>
                                            <p className="text-[8px] font-medium opacity-90 mt-0.5">Berdasarkan Rasio: 1 kg = {parsedRasio} m</p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-black">{(parsedKuantitas * parsedRasio).toFixed(1)} <span className="text-[10px] font-bold uppercase">meter</span></span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {/* Card 2: Legend Card */}
                                        <div className="bg-white border border-slate-150 rounded-xl p-3 shadow-sm text-left col-span-2">
                                            <div className="text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                                                Keterangan Estimasi Hasil
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 font-medium">
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-slate-800 text-[11px] leading-tight">Lengan Pendek:</p>
                                                    <p className="flex items-center gap-1 leading-none">👕 S-2XL: <span className="text-slate-900 font-bold">{Math.floor(parsedRasio / 0.8333)} pcs</span></p>
                                                    <p className="flex items-center gap-1 leading-none">👕 3XL-4XL: <span className="text-slate-900 font-bold">{Math.floor(parsedRasio / 1.25)} pcs</span></p>
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="font-bold text-slate-800 text-[11px] leading-tight">Lengan Panjang:</p>
                                                    <p className="flex items-center gap-1 leading-none">👕 S-2XL: <span className="text-slate-900 font-bold">{Math.floor(parsedRasio / 1.25)} pcs</span></p>
                                                    <p className="flex items-center gap-1 leading-none">👕 3XL-4XL: <span className="text-slate-900 font-bold">{Math.floor(parsedRasio / 2.5)} pcs</span></p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Card 3: Lengan Pendek S-2XL */}
                                        <div className="bg-white border border-slate-150 rounded-xl p-3 text-center shadow-sm flex flex-col justify-between min-h-[80px]">
                                            <div>
                                                <div className="text-[8px] font-black text-blue-500 uppercase tracking-wider leading-none">Lengan Pendek S-2XL</div>
                                                <div className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Size S, M, L, XL, 2XL</div>
                                            </div>
                                            <div className="text-base font-black text-blue-700 my-1">~{Math.floor(parsedKuantitas * (parsedRasio / 0.8333))} <span className="text-[9px] font-bold">pcs</span></div>
                                            <div className="text-[7.5px] font-semibold text-slate-400 uppercase border-t border-slate-100 pt-1 mt-0.5">1 KG - {Math.floor(parsedRasio / 0.8333)} PCS</div>
                                        </div>

                                        {/* Card 4: Lengan Pendek 3XL-4XL */}
                                        <div className="bg-white border border-slate-150 rounded-xl p-3 text-center shadow-sm flex flex-col justify-between min-h-[80px]">
                                            <div>
                                                <div className="text-[8px] font-black text-blue-500 uppercase tracking-wider leading-none">Lengan Pendek 3XL-4XL</div>
                                                <div className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Size 3XL, 4XL</div>
                                            </div>
                                            <div className="text-base font-black text-blue-600 my-1">~{Math.floor(parsedKuantitas * (parsedRasio / 1.25))} <span className="text-[9px] font-bold">pcs</span></div>
                                            <div className="text-[7.5px] font-semibold text-slate-400 uppercase border-t border-slate-100 pt-1 mt-0.5">1 KG - {Math.floor(parsedRasio / 1.25)} PCS</div>
                                        </div>

                                        {/* Card 5: Lengan Panjang S-2XL */}
                                        <div className="bg-white border border-slate-150 rounded-xl p-3 text-center shadow-sm flex flex-col justify-between min-h-[80px]">
                                            <div>
                                                <div className="text-[8px] font-black text-indigo-500 uppercase tracking-wider leading-none">Lengan Panjang S-2XL</div>
                                                <div className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Size S, M, L, XL, 2XL</div>
                                            </div>
                                            <div className="text-base font-black text-indigo-750 my-1">~{Math.floor(parsedKuantitas * (parsedRasio / 1.25))} <span className="text-[9px] font-bold">pcs</span></div>
                                            <div className="text-[7.5px] font-semibold text-slate-400 uppercase border-t border-slate-100 pt-1 mt-0.5">1 KG - {Math.floor(parsedRasio / 1.25)} PCS</div>
                                        </div>

                                        {/* Card 6: Lengan Panjang 3XL-4XL */}
                                        <div className="bg-white border border-slate-150 rounded-xl p-3 text-center shadow-sm flex flex-col justify-between min-h-[80px]">
                                            <div>
                                                <div className="text-[8px] font-black text-indigo-500 uppercase tracking-wider leading-none">Lengan Panjang 3XL-4XL</div>
                                                <div className="text-[6.5px] font-bold text-slate-400 uppercase tracking-wide mt-0.5">Size 3XL, 4XL</div>
                                            </div>
                                            <div className="text-base font-black text-indigo-650 my-1">~{Math.floor(parsedKuantitas * (parsedRasio / 2.5))} <span className="text-[9px] font-bold">pcs</span></div>
                                            <div className="text-[7.5px] font-semibold text-slate-400 uppercase border-t border-slate-100 pt-1 mt-0.5">1 KG - {Math.floor(parsedRasio / 2.5)} PCS</div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Modals & Bukti Nota Section */}
                            <div className="space-y-4 bg-orange-50/50 p-4 rounded-xl border border-orange-100/50 shadow-sm mt-2">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-orange-600 italic flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                    Harga Modal & Bukti Nota
                               </h3>
                               
                               <div className="space-y-2">
                                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1 flex items-center justify-between">
                                       <span>Upload Bukti Nota</span>
                                       {buktiNotaPreview && !deleteBuktiNota && (
                                           <button type="button" onClick={handleRemoveBuktiNota} className="text-[9px] text-red-500 hover:text-red-600 font-bold normal-case tracking-normal">Hapus Lama</button>
                                       )}
                                   </label>
                                   <div className="relative group w-full aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center overflow-hidden cursor-pointer">
                                       {buktiNotaPreview && !deleteBuktiNota && !buktiNotaFile ? (
                                           <>
                                               {buktiNotaPreview.endsWith('.pdf') ? (
                                                   <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                                                       <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                                           <span className="font-black text-sm">PDF</span>
                                                       </div>
                                                       <span className="block text-[9px] font-bold text-slate-600 truncate w-full px-2">Nota Lama Tersimpan</span>
                                                   </div>
                                               ) : (
                                                   <img src={buktiNotaPreview} alt="Preview Nota" className="w-full h-full object-cover" />
                                               )}
                                               <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center backdrop-blur-sm gap-2">
                                                   <a href={buktiNotaPreview} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="px-6 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg">Lihat Nota</a>
                                                   <Button 
                                                       type="button"
                                                       variant="destructive"
                                                       onClick={(e) => { e.stopPropagation(); handleRemoveBuktiNota(); }}
                                                       className="rounded-xl font-bold uppercase tracking-widest text-[10px] px-6 h-9 shadow-lg mt-2"
                                                   >
                                                       Ganti Nota
                                                   </Button>
                                               </div>
                                           </>
                                       ) : buktiNotaPreview && buktiNotaFile ? (
                                           <>
                                               <img src={buktiNotaPreview} alt="Preview Nota Baru" className="w-full h-full object-cover" />
                                               <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[2px]">
                                                   <Button 
                                                       type="button"
                                                       variant="destructive"
                                                       size="sm"
                                                       onClick={(e) => { e.stopPropagation(); handleRemoveBuktiNota(); }}
                                                       className="rounded-lg font-bold uppercase tracking-widest text-[9px] px-4 h-8 shadow-lg"
                                                   >
                                                       Batal Ganti
                                                   </Button>
                                               </div>
                                           </>
                                       ) : buktiNotaFile && buktiNotaFile.type === 'application/pdf' ? (
                                           <>
                                               <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                                                   <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500">
                                                       <span className="font-black text-sm">PDF</span>
                                                   </div>
                                                   <span className="block text-[9px] font-bold text-slate-600 truncate w-full px-2">{buktiNotaFile.name}</span>
                                               </div>
                                               <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center backdrop-blur-[2px]">
                                                   <Button 
                                                       type="button"
                                                       variant="destructive"
                                                       size="sm"
                                                       onClick={(e) => { e.stopPropagation(); handleRemoveBuktiNota(); }}
                                                       className="rounded-lg font-bold uppercase tracking-widest text-[9px] px-4 h-8 shadow-lg"
                                                   >
                                                       Batal Ganti
                                                   </Button>
                                               </div>
                                           </>
                                       ) : (
                                           <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                                               <div className="w-10 h-10 rounded-xl bg-slate-50 shadow flex items-center justify-center text-slate-350">
                                                   <ImagePlus className="w-4 h-4" />
                                               </div>
                                               <div className="space-y-0.5">
                                                   <span className="block text-[9px] font-black text-slate-900 uppercase">Upload Nota</span>
                                                   <span className="block text-[7.5px] font-bold text-slate-400 uppercase tracking-widest">JPG/PNG/PDF Max 5MB</span>
                                               </div>
                                           </div>
                                       )}
                                       {(!buktiNotaPreview || deleteBuktiNota || buktiNotaFile) && (
                                           <input 
                                               type="file" 
                                               accept=".jpg,.jpeg,.png,.pdf"
                                               onChange={handleBuktiNotaChange}
                                               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                           />
                                       )}
                                   </div>
                               </div>

                                {/* Widget Pengurangan Barang Rusak */}
                                <div className="bg-red-50/50 p-4 rounded-xl border border-red-100 shadow-sm space-y-3">
                                    <label className="text-xs font-black text-red-500 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                                        Pengurangan Barang Rusak (Pcs)
                                    </label>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex gap-3">
                                            <input 
                                                type="number"
                                                placeholder="Jml Pcs"
                                                value={rusakPcs}
                                                onChange={(e) => setRusakPcs(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        e.preventDefault();
                                                        handleKurangiRusak();
                                                    }
                                                }}
                                                className="flex-1 h-11 px-4 bg-white border border-red-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-400 placeholder:text-red-300"
                                            />
                                            <Button 
                                                type="button" 
                                                onClick={handleKurangiRusak}
                                                className={`h-11 px-4 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all duration-300 ${
                                                    parseInt(rusakPcs) > 0 
                                                        ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 ring-2 ring-red-500/50" 
                                                        : "bg-red-100 text-red-600 hover:bg-red-200"
                                                }`}
                                            >Kurangi</Button>
                                        </div>
                                    </div>
                                    <p className="text-[9px] font-medium text-red-400 italic mt-1">*Masukkan jumlah pcs, stok kg otomatis berkurang saat klik tombol</p>
                                    {keteranganRusak && <p className="text-xs text-red-600 italic font-medium mt-1">{keteranganRusak}</p>}
                                </div>
                               
                               <div className="space-y-2">
                                   <label className="text-[10px] font-black text-orange-600 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                                       <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                                       Total Harga Beli / Modal Keseluruhan (Rp)
                                   </label>
                                   <div className="relative">
                                       <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-extrabold italic">Rp</span>
                                       <input 
                                           required
                                           type="text" 
                                           value={formatThousands(hargaBeli)}
                                           onChange={(e) => {
                                               const val = e.target.value.replace(/[^0-9]/g, "");
                                               setHargaBeli(val === "" ? "" : Number(val));
                                           }}
                                           placeholder="100.000"
                                           className="w-full h-12 pl-9 pr-4 bg-white border border-slate-200 rounded-xl text-sm font-black text-orange-600 focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-400 transition-all shadow-sm"
                                       />
                                   </div>
                               </div>
                            </div>
                            


                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Deskripsi</label>
                                <textarea 
                                    value={deskripsi}
                                    onChange={(e) => setDeskripsi(e.target.value)}
                                    className="w-full min-h-[90px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-650 resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all leading-relaxed shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-orange-655 uppercase tracking-widest italic ml-1">Keterangan Perubahan</label>
                                <input 
                                    required
                                    type="text" 
                                    value={keteranganUbah}
                                    onChange={(e) => setKeteranganUbah(e.target.value)}
                                    placeholder="Alasan perubahan data..."
                                    className="w-full h-11 px-4 bg-orange-50 border border-orange-100 rounded-xl text-sm font-semibold text-orange-850 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-400 focus:bg-white transition-all placeholder:text-orange-200 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 pt-4 border-t border-slate-50">
                            <Button 
                                type="submit"
                                disabled={isSubmitting || !keteranganUbah}
                                className="w-full h-11 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow transition-all active:scale-95 flex items-center justify-center group"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" /> 
                                        Simpan Perubahan
                                    </>
                                )}
                            </Button>
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/admin/bahan-baju")}
                                className="w-full h-11 border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all"
                            >
                                <X className="w-4 h-4 mr-2" /> Batal
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
