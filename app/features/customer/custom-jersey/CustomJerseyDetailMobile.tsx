import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { adminApi } from "~/api/admin";
import { ArrowLeft, Loader2, ImageIcon, Package, CreditCard, ShoppingBag, Info, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { UPLOADS_URL } from "~/api/client";
import { cn } from "~/lib/utils";

export function CustomJerseyDetailMobile() {
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
        navigate(`/customer/custom-jersey/detail/${bahanList[nextIdx].id}`, { replace: true });
    };

    const handlePrev = () => {
        const prevIdx = (currentIndex - 1 + bahanList.length) % bahanList.length;
        setCurrentIndex(prevIdx);
        navigate(`/customer/custom-jersey/detail/${bahanList[prevIdx].id}`, { replace: true });
    };

    const selectBahan = (idx: number) => {
        setCurrentIndex(idx);
        navigate(`/customer/custom-jersey/detail/${bahanList[idx].id}`, { replace: true });
    };

    const handleCustomize = () => {
        navigate(`/customer/custom-jersey/checkout?productId=${currentBahan.id}`);
    };

    if (loading) {
        return (
            <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-8 h-8 animate-spin text-[#D25026]" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse italic">Setting up store...</p>
            </div>
        );
    }

    if (bahanList.length === 0) {
        return (
            <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-8 text-center gap-6">
                <ShoppingBag className="w-12 h-12 text-slate-100" />
                <h2 className="text-xl font-bold text-slate-800 tracking-tight uppercase italic">Catalog Unavailable</h2>
                <Button onClick={() => navigate("/customer/custom-jersey")} variant="outline" className="w-full h-14 rounded-2xl">Return to Store</Button>
            </div>
        );
    }

    const currentBahan = bahanList[currentIndex];

    return (
        <div className="w-full min-h-screen bg-white font-geist pb-32">
            {/* Mobile Header */}
            <div className="p-4 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-40 border-b border-slate-50">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate("/customer/custom-jersey")}
                    className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-50 active:scale-90"
                >
                    <ArrowLeft className="w-5 h-5 text-slate-900" />
                </Button>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D25026] italic leading-none mb-1">Current Series</span>
                    <span className="text-[12px] font-black text-slate-900 italic uppercase">#{currentIndex + 1} of {bahanList.length}</span>
                </div>
                <Button 
                    variant="ghost" 
                    className="h-12 w-12 flex items-center justify-center rounded-2xl bg-slate-50 active:scale-90"
                >
                    <Heart className="w-5 h-5 text-slate-300" />
                </Button>
            </div>

            <div className="p-6 space-y-10">
                {/* Hero Image Section */}
                <div className="relative group">
                    <div className="absolute -inset-2 bg-slate-100 rounded-[3rem] blur-xl -z-10"></div>
                    <div className="w-full aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border-8 border-white ring-1 ring-slate-100 relative">
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

                        {/* High-Contrast Navigation Arrows */}
                        <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none">
                            <Button 
                                onClick={handlePrev}
                                className="h-14 w-14 rounded-[1.5rem] bg-slate-900/90 backdrop-blur-md text-white shadow-xl pointer-events-auto active:scale-75 flex items-center justify-center border border-white/10"
                            >
                                <ChevronLeft className="w-8 h-8" strokeWidth={2.5} />
                            </Button>
                            <Button 
                                onClick={handleNext}
                                className="h-14 w-14 rounded-[1.5rem] bg-slate-900/90 backdrop-blur-md text-white shadow-xl pointer-events-auto active:scale-75 flex items-center justify-center border border-white/10"
                            >
                                <ChevronRight className="w-8 h-8" strokeWidth={2.5} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Thumbnail Browser */}
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                    {bahanList.map((item, idx) => (
                        <button
                            key={item.id}
                            onClick={() => selectBahan(idx)}
                            className={cn(
                                "w-20 aspect-square rounded-[1.5rem] overflow-hidden shrink-0 transition-all border-4",
                                currentIndex === idx 
                                    ? "border-[#D25026] shadow-xl ring-4 ring-[#D25026]/10 scale-110" 
                                    : "border-transparent opacity-40"
                            )}
                        >
                            {item.imageUrl ? (
                                <img src={UPLOADS_URL + item.imageUrl} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Section */}
                <div className="space-y-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 text-[#D25026] text-[10px] font-black uppercase tracking-widest border border-orange-100 italic">
                            Premium Series
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9] italic uppercase">{currentBahan.nama}</h1>
                        <div className="flex items-baseline gap-2 pt-2">
                            <span className="text-3xl font-black text-slate-900">Rp 150.000</span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ Custom Order</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex flex-col gap-2">
                            <Package className="w-6 h-6 text-[#D25026]" strokeWidth={2.5} />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Availability</p>
                                <p className="text-lg font-black text-slate-900 italic uppercase">{currentBahan.stok} IN STOCK</p>
                            </div>
                        </div>
                        <div className="p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100 flex flex-col gap-2">
                            <ShoppingBag className="w-6 h-6 text-slate-400" strokeWidth={2.5} />
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Category</p>
                                <p className="text-lg font-black text-slate-900 italic uppercase">JERSEY</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-8 border-t border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 italic">
                            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                                <Info className="w-4 h-4" />
                            </div>
                            Product Story
                        </h3>
                        <p className="text-base text-slate-500 leading-relaxed font-medium italic border-l-4 border-slate-100 pl-6 py-1">
                            {currentBahan.deskripsi || "Experience the perfect blend of performance and style with our FSCV professional jersey series."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50">
                <Button 
                    onClick={handleCustomize}
                    className="w-full h-18 bg-[#D25026] hover:bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[12px] shadow-2xl shadow-[#D25026]/20 transition-all active:scale-95 italic flex items-center justify-center gap-4 py-8"
                >
                    <CreditCard className="w-6 h-6" />
                    Customize & Order Now
                </Button>
            </div>
        </div>
    );
}
