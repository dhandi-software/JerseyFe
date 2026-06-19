import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { adminApi } from "~/api/admin";
import { ArrowLeft, Loader2, ImageIcon, Package, Calendar, ChevronLeft, ChevronRight, Edit3, Fingerprint } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { UPLOADS_URL } from "~/api/client";
import { cn } from "~/lib/utils";

export function BahanBajuDetailDesktop() {
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
            <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-8">
                <Loader2 className="w-12 h-12 animate-spin text-slate-200" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">Initializing Catalog...</p>
            </div>
        );
    }

    if (bahanList.length === 0) {
        return (
            <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-6">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                    <Package className="w-10 h-10" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Katalog Kosong</h2>
                <Button onClick={() => navigate("/admin/bahan-baju")} variant="outline" className="rounded-xl">Kembali</Button>
            </div>
        );
    }

    const currentBahan = bahanList[currentIndex];

    return (
        <div className="w-full min-h-screen bg-[#F8FAFC] font-geist p-8 lg:p-16">
            <header className="flex items-center justify-between mb-12">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate("/admin/bahan-baju")}
                    className="text-slate-500 hover:text-slate-900 rounded-2xl px-6 bg-white shadow-sm border border-slate-100 group transition-all h-14"
                >
                    <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-bold text-sm tracking-tight uppercase">Kembali ke Daftar</span>
                </Button>

                <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Internal Reference</p>
                        <p className="text-sm font-bold text-slate-900">#BHN-{currentBahan.id.toString().padStart(4, '0')}</p>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                        <Fingerprint className="w-5 h-5 text-slate-300" />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start max-w-[1600px] mx-auto">
                {/* Left: Interactive Image Gallery */}
                <div className="space-y-8">
                    <div className="relative group">
                        <div className="w-full aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border-8 border-white ring-1 ring-slate-100 relative">
                            {currentBahan.imageUrl ? (
                                <img 
                                    src={UPLOADS_URL + currentBahan.imageUrl} 
                                    alt={currentBahan.nama} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                                    <ImageIcon className="w-24 h-24" />
                                </div>
                            )}

                            {/* Navigation Arrows */}
                            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                <Button 
                                    onClick={handlePrev}
                                    className="h-16 w-16 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white shadow-2xl hover:bg-slate-900 active:scale-95 transition-all pointer-events-auto border border-white/10"
                                >
                                    <ChevronLeft className="w-8 h-8" strokeWidth={2.5} />
                                </Button>
                                <Button 
                                    onClick={handleNext}
                                    className="h-16 w-16 rounded-2xl bg-slate-900/90 backdrop-blur-md text-white shadow-2xl hover:bg-slate-900 active:scale-95 transition-all pointer-events-auto border border-white/10"
                                >
                                    <ChevronRight className="w-8 h-8" strokeWidth={2.5} />
                                </Button>
                            </div>

                            {/* Counter Badge */}
                            <div className="absolute bottom-6 right-6">
                                <div className="px-5 py-2 bg-slate-900/90 backdrop-blur-md text-white rounded-full text-[11px] font-black tracking-widest shadow-2xl border border-white/10">
                                    {currentIndex + 1} / {bahanList.length}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thumbnails Browser */}
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                        {bahanList.map((item, idx) => (
                            <button
                                key={item.id}
                                onClick={() => selectBahan(idx)}
                                className={cn(
                                    "w-32 aspect-square rounded-3xl overflow-hidden shrink-0 transition-all duration-300 border-4",
                                    currentIndex === idx 
                                        ? "border-slate-900 scale-105 shadow-xl ring-4 ring-slate-100" 
                                        : "border-transparent opacity-50 hover:opacity-100 hover:scale-105"
                                )}
                            >
                                {item.imageUrl ? (
                                    <img src={UPLOADS_URL + item.imageUrl} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                                        <ImageIcon className="w-10 h-10 text-slate-400" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Dynamic Info Panel */}
                <div className="lg:pl-12 lg:pt-8 space-y-12">
                    <div className="space-y-6">
                        <h1 className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{currentBahan.nama}</h1>
                        <div className="flex flex-wrap items-center gap-4 pt-2">
                            <div className="flex items-center gap-2.5 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-2xl font-black text-xs border border-blue-100 shadow-sm">
                                <span className="text-[10px] opacity-50 uppercase tracking-widest mr-1">Harga:</span>
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(currentBahan.harga || 0)}
                            </div>
                            <div className="flex items-center gap-2.5 px-5 py-2.5 bg-orange-50 text-orange-700 rounded-2xl font-black text-xs border border-orange-100 shadow-sm">
                                <Package className="w-5 h-5" strokeWidth={2.5} />
                                Ketersediaan ({currentBahan.kuantitasKg} kg / {(currentBahan.kuantitasKg * (currentBahan.rasioKonversi || 2.5)).toFixed(1)} meter)
                            </div>
                            <div className="flex flex-col gap-0.5 px-5 py-2.5 bg-indigo-50 text-indigo-700 rounded-2xl font-black text-xs border border-indigo-100 shadow-sm">
                                <span>Pendek S-2XL: {Math.floor(currentBahan.kuantitasKg * ((currentBahan.rasioKonversi || 2.5) / 0.8333))} pcs</span>
                                <span>Pendek 3XL+: {Math.floor(currentBahan.kuantitasKg * ((currentBahan.rasioKonversi || 2.5) / 1.25))} pcs</span>
                                <span>Panjang S-2XL: {Math.floor(currentBahan.kuantitasKg * ((currentBahan.rasioKonversi || 2.5) / 1.25))} pcs</span>
                                <span>Panjang 3XL+: {Math.floor(currentBahan.kuantitasKg * ((currentBahan.rasioKonversi || 2.5) / 2.5))} pcs</span>
                            </div>
                            <div className={cn(
                                "flex items-center gap-2.5 px-5 py-2.5 rounded-2xl font-black text-xs border shadow-sm",
                                currentBahan.status === "Tersedia" ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"
                            )}>
                                Status: {currentBahan.status}
                            </div>
                            <div className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-50 text-slate-600 rounded-2xl font-bold text-xs border border-slate-100">
                                <Calendar className="w-5 h-5" strokeWidth={2.5} />
                                {new Date(currentBahan.createdAt).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6 pt-12 border-t border-slate-100">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <Package className="w-5 h-5" />
                            </div>
                            Deskripsi Produk
                        </h3>
                        <p className="text-lg text-slate-500 leading-relaxed font-medium italic border-l-4 border-slate-100 pl-8">
                            {currentBahan.deskripsi || "Tidak ada deskripsi tambahan untuk bahan ini. Silahkan hubungi admin untuk spesifikasi teknis lebih lanjut."}
                        </p>
                    </div>

                    <div className="pt-12 flex gap-4">
                        <Button 
                            onClick={() => navigate(`/admin/bahan-baju/edit/${currentBahan.id}`)}
                            className="h-16 flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-sm shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                        >
                            <Edit3 className="w-5 h-5" />
                            Edit Spesifikasi
                        </Button>
                        <Button 
                            onClick={() => navigate("/admin/bahan-baju")}
                            variant="outline"
                            className="h-16 px-8 rounded-2xl border-slate-200 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all font-bold"
                        >
                            Kembali ke List
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
