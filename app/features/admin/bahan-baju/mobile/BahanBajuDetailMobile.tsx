import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { adminApi } from "~/api/admin";
import { ArrowLeft, Loader2, ImageIcon, Package, Calendar, ChevronLeft, ChevronRight, Edit3 } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { UPLOADS_URL } from "~/api/client";
import { cn } from "~/lib/utils";

export function BahanBajuDetailMobile() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [bahanList, setBahanList] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchAllBahan = async () => {
            try {
                const res = await adminApi.getBahanBaju();
                if (res.status === "success") {
                    setBahanList(res.data);
                    const idx = res.data.findIndex((b: any) => b.id === Number(id));
                    if (idx !== -1) setCurrentIndex(idx);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAllBahan();
    }, [id]);

    const handleNext = () => {
        const nextIdx = (currentIndex + 1) % bahanList.length;
        setCurrentIndex(nextIdx);
        navigate(`/admin/bahan-baju/detail/${bahanList[nextIdx].id}`, { replace: true });
    };

    const handlePrev = () => {
        const prevIdx = (currentIndex - 1 + bahanList.length) % bahanList.length;
        setCurrentIndex(prevIdx);
        navigate(`/admin/bahan-baju/detail/${bahanList[prevIdx].id}`, { replace: true });
    };

    const selectBahan = (idx: number) => {
        setCurrentIndex(idx);
        navigate(`/admin/bahan-baju/detail/${bahanList[idx].id}`, { replace: true });
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-slate-200" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse italic">Catalog Syncing...</p>
            </div>
        );
    }

    if (bahanList.length === 0) {
        return (
            <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center gap-6">
                <Package className="w-12 h-12 text-slate-100" />
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Katalog Tidak Tersedia</h2>
                <Button onClick={() => navigate("/admin/bahan-baju")} variant="outline" className="w-full h-14 rounded-2xl">Kembali</Button>
            </div>
        );
    }

    const currentBahan = bahanList[currentIndex];

    return (
        <div className="w-full min-h-screen bg-white font-geist pb-32">
            {/* Mobile Header */}
            <div className="p-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-30 border-b border-slate-50">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate("/admin/bahan-baju")}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 active:scale-90"
                >
                    <ArrowLeft className="w-4 h-4 text-slate-900" />
                </Button>
                <div className="px-4 py-1.5 rounded-full bg-slate-900 text-[10px] font-black uppercase tracking-widest text-white italic">
                    {currentIndex + 1} / {bahanList.length}
                </div>
                <Button 
                    variant="ghost" 
                    onClick={() => navigate(`/admin/bahan-baju/edit/${currentBahan.id}`)}
                    className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 active:scale-90"
                >
                    <Edit3 className="w-4 h-4 text-slate-900" />
                </Button>
            </div>

            <div className="p-4 space-y-8">
                {/* Image Section */}
                <div className="relative group">
                    <div className="w-full aspect-[4/3] rounded-[2rem] overflow-hidden bg-white shadow-xl border-4 border-white ring-1 ring-slate-100 relative">
                        {currentBahan.imageUrl ? (
                            <img 
                                src={UPLOADS_URL + currentBahan.imageUrl} 
                                alt={currentBahan.nama} 
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                                <ImageIcon className="w-16 h-16" />
                            </div>
                        )}

                        {/* Arrows - Fixed contrast (Dark on Light background) */}
                        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none">
                            <Button 
                                onClick={handlePrev}
                                className="h-12 w-12 rounded-full bg-slate-900/90 backdrop-blur-md text-white shadow-lg pointer-events-auto active:scale-75 flex items-center justify-center"
                            >
                                <ChevronLeft className="w-6 h-6" strokeWidth={2.5} />
                            </Button>
                            <Button 
                                onClick={handleNext}
                                className="h-12 w-12 rounded-full bg-slate-900/90 backdrop-blur-md text-white shadow-lg pointer-events-auto active:scale-75 flex items-center justify-center"
                            >
                                <ChevronRight className="w-6 h-6" strokeWidth={2.5} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Thumbnails Browser */}
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {bahanList.map((item, idx) => (
                        <button
                            key={item.id}
                            onClick={() => selectBahan(idx)}
                            className={cn(
                                "w-16 aspect-square rounded-2xl overflow-hidden shrink-0 transition-all border-2",
                                currentIndex === idx 
                                    ? "border-slate-900 shadow-lg ring-2 ring-slate-50 scale-110" 
                                    : "border-transparent opacity-40"
                            )}
                        >
                            {item.imageUrl ? (
                                <img src={UPLOADS_URL + item.imageUrl} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                                    <ImageIcon className="w-5 h-5" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Section */}
                <div className="space-y-6 px-2">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight leading-[1.1]">{currentBahan.nama}</h1>
                        <div className="flex flex-wrap gap-2 pt-2">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl font-bold text-[10px] border border-blue-100 shadow-sm">
                                <span className="opacity-50 font-black">Rp</span>
                                {new Intl.NumberFormat('id-ID').format(currentBahan.harga || 0)}
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 text-orange-700 rounded-xl font-bold text-[10px] border border-orange-100 shadow-sm">
                                <Package className="w-4 h-4" strokeWidth={2.5} />
                                Stok: {currentBahan.stok}
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-xl font-bold text-[10px] border border-slate-100">
                                <Calendar className="w-4 h-4" strokeWidth={2.5} />
                                {new Date(currentBahan.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-6 border-t border-slate-50">
                        <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                                <Package className="w-4 h-4" strokeWidth={2} />
                            </div>
                            Deskripsi Produk
                        </h3>
                        <p className="text-sm text-slate-500 leading-relaxed font-medium italic border-l-4 border-slate-50 pl-4 py-1">
                            {currentBahan.deskripsi || "Tidak ada deskripsi."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Actions */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-30">
                <Button 
                    onClick={() => navigate(`/admin/bahan-baju/edit/${currentBahan.id}`)}
                    className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-xl active:scale-95"
                >
                    Edit Spesifikasi
                </Button>
            </div>
        </div>
    );
}
