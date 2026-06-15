import { useState } from "react";
import { Button } from "~/components/ui/button";
import { adminApi } from "~/api/admin";
import { Save, X, Loader2, ArrowLeft, ImagePlus } from "lucide-react";
import { Toast } from "~/components/ui/toast";
import { useNavigate } from "react-router";

export function BahanBajuCreateDesktop() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<{ title: string; variant: "success" | "destructive" } | null>(null);

    // Form state
    const [nama, setNama] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [stok, setStok] = useState<number | "">("");
    const [harga, setHarga] = useState<number | "">("");
    
    // Image state
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
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
            if (image) {
                formData.append("image", image);
            }

            await adminApi.createBahanBaju(formData);
            setToast({ title: "Bahan baju berhasil ditambahkan!", variant: "success" });
            setTimeout(() => navigate("/admin/bahan-baju"), 1500);
        } catch (error) {
            console.error(error);
            setToast({ title: "Gagal menyimpan data", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] font-geist p-12 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -ml-48 -mb-48"></div>

            {toast && <Toast title={toast.title} variant={toast.variant} onClose={() => setToast(null)} />}
            
            <div className="w-full relative z-10">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate("/admin/bahan-baju")}
                    className="mb-10 text-slate-500 hover:text-slate-900 rounded-2xl px-6 bg-white shadow-sm border border-slate-100 group transition-all"
                >
                    <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-sm tracking-tight uppercase">Kembali ke Katalog</span>
                </Button>

                <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/40">
                    <div className="mb-8 flex justify-between items-center">
                        <div className="space-y-2">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-[0.2em]">
                                Administration / New Entry
                            </div>
                            <h1 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 leading-none">Tambah Bahan Baku</h1>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest italic leading-relaxed">Pendaftaran material kain baru untuk sinkronisasi inventaris & pilihan pelanggan.</p>
                        </div>
                        <div className="hidden lg:block">
                            <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                                <Save className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-12 gap-8">
                            {/* Image Upload Area */}
                            <div className="col-span-4 space-y-4">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest italic ml-1 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                    Visual Reference
                                </label>
                                <div className="relative group w-full aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 flex flex-col items-center justify-center overflow-hidden cursor-pointer">
                                    {imagePreview ? (
                                        <>
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
                                            <div className="w-16 h-16 rounded-2xl bg-white shadow flex items-center justify-center text-slate-350 group-hover:text-blue-500 group-hover:scale-105 transition-all duration-300">
                                                <ImagePlus className="w-6 h-6" />
                                            </div>
                                            <div className="space-y-1">
                                                <span className="block text-xs font-black text-slate-900 uppercase">Upload Katalog</span>
                                                <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">High-Res PNG or JPG preferred<br/>Max file size: 5MB</span>
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
                                    <div className="space-y-2 col-span-1">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest italic ml-1">Nama Bahan</label>
                                        <input 
                                            required
                                            type="text" 
                                            value={nama}
                                            onChange={(e) => setNama(e.target.value)}
                                            placeholder="Contoh: Milano Premium Drifit"
                                            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
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
                                                placeholder="150.000"
                                                className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest italic ml-1">Stok Awal</label>
                                        <input 
                                            required
                                            type="number" 
                                            min="0"
                                            value={stok}
                                            onChange={(e) => setStok(e.target.value === "" ? "" : Number(e.target.value))}
                                            placeholder="0"
                                            className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-300 shadow-sm"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest italic ml-1">Karakteristik & Deskripsi Bahan</label>
                                    <textarea 
                                        value={deskripsi}
                                        onChange={(e) => setDeskripsi(e.target.value)}
                                        placeholder="Jelaskan tekstur, ketebalan, dan kenyamanan bahan untuk informasi pelanggan..."
                                        className="w-full min-h-[160px] p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 resize-none focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-400 focus:bg-white transition-all placeholder:text-slate-300 leading-relaxed shadow-sm"
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
                                disabled={isSubmitting}
                                className="h-11 px-8 bg-[#0F172A] hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-md transition-all active:scale-95 flex items-center justify-center group"
                            >
                                {isSubmitting ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> 
                                        Simpan Bahan
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
