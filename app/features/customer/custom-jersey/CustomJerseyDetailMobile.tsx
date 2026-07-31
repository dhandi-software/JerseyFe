import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { adminApi } from "~/api/admin";
import { ArrowLeft, Loader2, ImageIcon, Package, CreditCard, ShoppingBag, Info, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router";
import { UPLOADS_URL } from "~/api/client";
import { cn } from "~/lib/utils";

export function CustomJerseyDetailMobile() {
    const navigate = useNavigate();
    const { id } = useParams();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [bahanList, setBahanList] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedSleeve, setSelectedSleeve] = useState("Lengan Pendek");
    const [selectedSize, setSelectedSize] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [playerNumber, setPlayerNumber] = useState("");

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    const getSizeSurcharge = (size: string): number => {
        if (!size) return 0;
        const s = size.toUpperCase().trim();
        // Sizes S through 2XL have no surcharge
        if (["XXS", "XS", "S", "M", "L", "XL", "2XL", "XXL"].includes(s)) {
            return 0;
        }
        // 3XL = +Rp10.000, 4XL = +Rp20.000, 5XL = +Rp30.000, etc.
        const numXlMatch = s.match(/^(\d+)XL$/);
        if (numXlMatch) {
            const xCount = parseInt(numXlMatch[1], 10);
            if (xCount >= 3) {
                return (xCount - 2) * 10000;
            }
        }
        // Handle XXXL, XXXXL formats
        const xMatches = s.match(/^(X+)L$/);
        if (xMatches) {
            const xCount = xMatches[1].length;
            if (xCount >= 3) {
                return (xCount - 2) * 10000;
            }
        }
        return 0;
    };

    // Determines if a size is a "big size" (3XL or larger)
    const isBigSize = (size: string): boolean => {
        const s = size.toUpperCase().trim();
        const numXlMatch = s.match(/^(\d+)XL$/);
        if (numXlMatch) return parseInt(numXlMatch[1], 10) >= 3;
        const xMatches = s.match(/^(X+)L$/);
        if (xMatches) return xMatches[1].length >= 3;
        return false;
    };

    const getMaxOrderPcs = (kuantitasKg: number, size: string, sleeve: string): number | string => {
        if (!size) return "-";
        const isLongSleeve = sleeve === "Lengan Panjang";
        const big = isBigSize(size);

        if (isLongSleeve) {
            return Math.floor(kuantitasKg * (big ? 1 : 2));
        } else {
            return Math.floor(kuantitasKg * (big ? 2 : 3));
        }
    };

    const isPublicView = location.pathname.startsWith("/product/");
    const basePath = isPublicView ? "/product" : "/customer/custom-jersey/detail";

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
        navigate(`${basePath}/${bahanList[nextIdx].id}`, { replace: true });
    };

    const handlePrev = () => {
        const prevIdx = (currentIndex - 1 + bahanList.length) % bahanList.length;
        setCurrentIndex(prevIdx);
        navigate(`${basePath}/${bahanList[prevIdx].id}`, { replace: true });
    };

    const selectBahan = (idx: number) => {
        setCurrentIndex(idx);
        navigate(`${basePath}/${bahanList[idx].id}`, { replace: true });
    };

    const handleCustomize = () => {
        if (!selectedSize) {
            alert("Silakan pilih ukuran terlebih dahulu");
            return;
        }
        navigate(`/customer/custom-jersey/checkout?productId=${currentBahan.id}&size=${selectedSize}&sleeve=${selectedSleeve}&name=${playerName}&number=${playerNumber}`);
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
                    onClick={() => navigate(isPublicView ? "/" : "/customer/custom-jersey")}
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
                                <p className={cn(
                                    "text-sm font-black italic uppercase",
                                    currentBahan.status === "Habis" ? "text-red-500" : "text-emerald-600"
                                )}>
                                    {currentBahan.status === "Habis" ? "Habis" : "Tersedia"}
                                </p>
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
                            {currentBahan.deskripsi || "Experience the perfect blend of performance and style with our FCSV professional jersey series."}
                        </p>
                    </div>

                    {/* Size & Sleeve Selectors for Estimating Availability */}
                    <div className="space-y-4 pt-6 border-t border-slate-100">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 italic">
                            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                                <Info className="w-4 h-4" />
                            </div>
                            Simulasi Ketersediaan Pesanan
                        </h3>
                        
                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Nama Pemain (Opsional)</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan Nama Pemain"
                                    value={playerName}
                                    onChange={(e) => setPlayerName(e.target.value)}
                                    className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-3 text-[11px] font-black focus:outline-none focus:border-[#D25026] transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Nomor Punggung (Opsional)</label>
                                <input
                                    type="text"
                                    placeholder="Masukkan Nomor"
                                    value={playerNumber}
                                    onChange={(e) => setPlayerNumber(e.target.value)}
                                    className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-3 text-[11px] font-black focus:outline-none focus:border-[#D25026] transition-colors"
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Pilih Tipe Lengan</label>
                                <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-100 gap-1.5">
                                    {[
                                        { value: "Lengan Pendek", label: "Pendek" },
                                        { value: "Lengan Panjang", label: "Panjang" }
                                    ].map((sleeve) => (
                                        <button
                                            key={sleeve.value}
                                            onClick={() => setSelectedSleeve(sleeve.value)}
                                            className={cn(
                                                "flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all",
                                                selectedSleeve === sleeve.value
                                                    ? "bg-[#D25026] text-white shadow-sm"
                                                    : "text-slate-650 hover:bg-slate-100"
                                            )}
                                        >
                                            {sleeve.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Pilih Ukuran</label>
                                <select
                                    value={selectedSize}
                                    onChange={(e) => setSelectedSize(e.target.value)}
                                    className="w-full h-10 bg-slate-50 border border-slate-100 rounded-xl px-3 text-[11px] font-black focus:outline-none focus:border-[#D25026] transition-colors"
                                >
                                    <option value="" disabled>Pilih Ukuran</option>
                                    {["S", "M", "L", "XL", "2XL", "3XL", "4XL"].map((size) => (
                                        <option key={size} value={size}>
                                            Ukuran {size}{getSizeSurcharge(size) > 0 ? ` — +${new Intl.NumberFormat('id-ID').format(getSizeSurcharge(size))}` : " — Harga Normal"}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        
                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col gap-2 shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Stok Bahan Tersedia</span>
                                        <span className="text-sm font-black text-slate-600">
                                            {currentBahan.kuantitasKg} kg ~ {(currentBahan.kuantitasKg * (currentBahan.rasioKonversi || 2.5)).toFixed(1)} m
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-slate-100/50 pt-2">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Harga Satuan Varian</span>
                                        <span className="text-base font-black text-[#D25026]">
                                            {formatRupiah((currentBahan.harga || 150000) + getSizeSurcharge(selectedSize))}
                                        </span>
                                    </div>
                                    {selectedSize && (
                                        <div className="flex justify-between items-center border-t border-slate-100/50 pt-2">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Maks. Pesanan ({selectedSize})</span>
                                            <span className="text-lg font-black text-slate-900 italic uppercase">
                                                {getMaxOrderPcs(currentBahan.kuantitasKg || 0, selectedSize, selectedSleeve)} pcs
                                            </span>
                                        </div>
                                    )}
                                    {!selectedSize && (
                                        <div className="border-t border-slate-100/50 pt-2 text-center">
                                            <span className="text-[10px] font-bold text-slate-400 italic">Pilih ukuran untuk estimasi pesanan</span>
                                        </div>
                                    )}
                                    {getSizeSurcharge(selectedSize) > 0 && (
                                        <div className="flex justify-between items-center border-t border-slate-100/50 pt-2">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Biaya Tambahan Ukuran</span>
                                            <span className="text-sm font-black text-amber-600">+ {formatRupiah(getSizeSurcharge(selectedSize))}</span>
                                        </div>
                                    )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Floating Action Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-50 flex flex-col gap-3">
                {currentBahan.status === "Habis" && (
                    <div className="p-3 bg-orange-50 border border-orange-200 text-orange-800 rounded-xl flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-[#D25026] shrink-0 mt-0.5" />
                        <div className="text-[10px] font-bold uppercase tracking-tight leading-relaxed">
                            Bahan sedang tidak tersedia. Admin akan merekomendasikan alternatif setelah checkout.
                        </div>
                    </div>
                )}
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
