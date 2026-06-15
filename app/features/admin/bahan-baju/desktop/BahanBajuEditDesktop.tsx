import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { adminApi } from "~/api/admin";
import { Save, X, Loader2, ArrowLeft, ImagePlus } from "lucide-react";
import { Toast } from "~/components/ui/toast";
import { useNavigate, useParams } from "react-router";
import { UPLOADS_URL } from "~/api/client";

export function BahanBajuEditDesktop() {
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
            <div className="w-full min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center gap-6">
                <div className="relative">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-100 border-t-blue-500 animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-10 h-10 bg-white rounded-full shadow-sm"></div>
                    </div>
                </div>
                <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em] italic animate-pulse">Syncing Data...</p>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] font-geist p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[120px] -mr-80 -mt-80"></div>
            
            {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
            
            <div className="w-full relative z-10">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate("/admin/bahan-baju")}
                    className="mb-10 text-slate-500 hover:text-slate-900 rounded-2xl px-6 bg-white shadow-sm border border-slate-100 group transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-sm tracking-tight uppercase">Kembali</span>
                </Button>

                <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="mb-8">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[9px] font-black uppercase tracking-[0.2em] mb-3">
                            Inventory Management / Update
                        </div>
                        <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Edit Bahan Baku</h1>
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-2 italic leading-relaxed">Perbarui informasi spesifikasi atau sesuaikan stok fisik di gudang.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-12 gap-8">
                            {/* Image Upload Area */}
                            <div className="col-span-4 space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                    Katalog Visual
                                </label>
                                <div className="relative group w-full aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-orange-400 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer">
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-550 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                                                <Button 
                                                    type="button"
                                                    variant="destructive"
                                                    onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }}
                                                    className="rounded-xl font-bold uppercase tracking-widest text-[10px] px-6 h-10 shadow-lg"
                                                >
                                                    Ganti Gambar
                                                </Button>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-6 text-center space-y-4">
                                            <div className="w-16 h-16 rounded-2xl bg-white shadow flex items-center justify-center text-slate-300 group-hover:text-orange-500 group-hover:scale-105 transition-all duration-300">
                                                <ImagePlus className="w-6 h-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="block text-xs font-black text-slate-900 uppercase">Upload Katalog</span>
                                                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Max file size: 5MB</span>
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
                            <div className="col-span-8 space-y-6">
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest italic ml-1">Nama Bahan</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={nama}
                                            onChange={(e) => setNama(e.target.value)}
                                            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest italic ml-1">Harga Satuan (Rp)</label>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-black italic">Rp</span>
                                            <input 
                                                required
                                                type="text" 
                                                value={formatThousands(harga)}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9]/g, "");
                                                    setHarga(val === "" ? "" : Number(val));
                                                }}
                                                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest italic ml-1">Stok Saat Ini</label>
                                        <input 
                                            required
                                            type="number" 
                                            min="0"
                                            value={stok}
                                            onChange={(e) => setStok(e.target.value === "" ? "" : Number(e.target.value))}
                                            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all shadow-sm"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest italic ml-1">Karakteristik Bahan</label>
                                    <textarea 
                                        value={deskripsi}
                                        onChange={(e) => setDeskripsi(e.target.value)}
                                        className="w-full min-h-[120px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all leading-relaxed shadow-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black text-orange-655 uppercase tracking-widest italic ml-1">Log Catatan Perubahan (Wajib)</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={keteranganUbah}
                                        onChange={(e) => setKeteranganUbah(e.target.value)}
                                        placeholder="Alasan perubahan (contoh: Penambahan stok dari supplier baru, revisi deskripsi)"
                                        className="w-full h-11 px-4 bg-orange-50 border border-orange-100 rounded-xl text-sm font-semibold text-orange-850 focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-400 focus:bg-white transition-all placeholder:text-orange-200 shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
                            <Button 
                                type="button"
                                variant="outline"
                                onClick={() => navigate("/admin/bahan-baju")}
                                className="h-11 px-6 border-slate-200 hover:bg-slate-50 text-slate-500 rounded-xl font-bold uppercase tracking-widest text-[10px] transition-all flex items-center group"
                            >
                                <X className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" /> 
                                Batal
                            </Button>
                            <Button 
                                type="submit"
                                disabled={isSubmitting || !keteranganUbah}
                                className="h-11 px-8 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-md transition-all active:scale-95 flex items-center justify-center group"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> 
                                        Simpan Perubahan
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
