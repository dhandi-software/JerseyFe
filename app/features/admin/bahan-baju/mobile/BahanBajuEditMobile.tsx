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
    const [stok, setStok] = useState<number | "">("");
    const [harga, setHarga] = useState<number | "">("");
    const [keteranganUbah, setKeteranganUbah] = useState("");
    
    // Image state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [deleteImage, setDeleteImage] = useState(false);

    useEffect(() => {
        const fetchBahan = async () => {
            try {
                const res = await adminApi.getBahanBaju();
                if (res.status === "success") {
                    const bahan = res.data.find((b: any) => b.id === Number(id));
                    if (bahan) {
                        setNama(bahan.nama);
                        setDeskripsi(bahan.deskripsi || "");
                        setStok(bahan.stok);
                        setHarga(bahan.harga || 0);
                        if (bahan.imageUrl) {
                            setImagePreview(UPLOADS_URL + bahan.imageUrl);
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

    const formatThousands = (value: number | string) => {
        if (!value) return "";
        const num = typeof value === "string" ? value.replace(/[^0-9]/g, "") : value.toString();
        return new Intl.NumberFormat('id-ID').format(Number(num));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("nama", nama);
            formData.append("deskripsi", deskripsi);
            formData.append("stok", String(stok));
            formData.append("harga", String(harga));
            formData.append("keterangan_ubah", keteranganUbah);
            if (deleteImage) {
                formData.append("deleteImage", "true");
            }
            if (imageFile) {
                formData.append("image", imageFile);
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
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic ml-1">Stok Saat Ini</label>
                                <input 
                                    required
                                    type="number" 
                                    min="0"
                                    value={stok}
                                    onChange={(e) => setStok(e.target.value === "" ? "" : Number(e.target.value))}
                                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                                />
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
