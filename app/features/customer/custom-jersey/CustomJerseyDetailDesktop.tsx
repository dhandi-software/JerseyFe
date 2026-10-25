import { Button } from "~/components/ui/button";
import { ArrowLeft, Loader2, ImageIcon, Package, Calendar, ChevronLeft, ChevronRight, CreditCard, ShoppingBag, Info, Ruler, Heart } from "lucide-react";
import { useNavigate } from "react-router";
import { UPLOADS_URL } from "~/api/client";
import { cn } from "~/lib/utils";
import { useCustomJerseyDetail } from "~/hooks";

export function CustomJerseyDetailDesktop() {
    const navigate = useNavigate();
    const {
        loading,
        bahanList,
        currentBahan,
        currentIndex,
        selectedSleeve,
        setSelectedSleeve,
        selectedSize,
        setSelectedSize,
        playerName,
        setPlayerName,
        playerNumber,
        setPlayerNumber,
        formatRupiah,
        getSizeSurcharge,
        getMaxOrderPcs,
        isPublicView,
        handleNext,
        handlePrev,
        selectBahan,
        handleCustomize,
    } = useCustomJerseyDetail();


    if (loading) {
        return (
            <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-8">
                <Loader2 className="w-12 h-12 animate-spin text-[#D25026]" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse italic">Loading Collection...</p>
            </div>
        );
    }

    if (bahanList.length === 0) {
        return (
            <div className="w-full min-h-screen bg-white flex flex-col items-center justify-center gap-6">
                <ShoppingBag className="w-16 h-16 text-slate-100" />
                <h2 className="text-xl font-bold text-slate-800 tracking-tight italic uppercase">Collection Empty</h2>
                <Button onClick={() => navigate("/customer/custom-jersey")} variant="outline" className="rounded-2xl h-14 px-8 font-bold">Back to Store</Button>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen bg-white font-geist p-8 lg:p-12 overflow-x-hidden">
            <div className="max-w-[1600px] mx-auto">
                <header className="flex items-center justify-between mb-16">
                    <Button 
                        variant="ghost" 
                        onClick={() => navigate(isPublicView ? "/" : "/customer/custom-jersey")}
                        className="text-slate-500 hover:text-slate-900 rounded-2xl px-6 bg-slate-50 border border-slate-100 group transition-all h-14"
                    >
                        <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold text-xs tracking-widest uppercase">Explore More</span>
                    </Button>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] leading-none mb-1">Authentic Gear</p>
                            <p className="text-sm font-black text-slate-900 italic uppercase">FCSV Professional Series</p>
                        </div>
                        <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center shadow-lg">
                            <ShoppingBag className="w-6 h-6 text-white" />
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Left: Gallery (7 Cols) */}
                    <div className="lg:col-span-7 space-y-10">
                        <div className="relative group">
                            <div className="absolute -inset-4 bg-slate-50 rounded-[4rem] -z-10 blur-2xl opacity-50"></div>
                            <div className="w-full aspect-[16/10] rounded-[3.5rem] overflow-hidden bg-white shadow-2xl border-[12px] border-white ring-1 ring-slate-100 relative group">
                                {currentBahan.imageUrl ? (
                                    <img 
                                        src={UPLOADS_URL + currentBahan.imageUrl} 
                                        alt={currentBahan.nama} 
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-200">
                                        <ImageIcon className="w-24 h-24" />
                                    </div>
                                )}

                                <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                                    <Button 
                                        onClick={handlePrev}
                                        className="h-20 w-20 rounded-3xl bg-slate-900/90 backdrop-blur-md text-white shadow-2xl hover:bg-slate-900 active:scale-90 transition-all pointer-events-auto border border-white/10"
                                    >
                                        <ChevronLeft className="w-10 h-10" strokeWidth={2.5} />
                                    </Button>
                                    <Button 
                                        onClick={handleNext}
                                        className="h-20 w-20 rounded-3xl bg-slate-900/90 backdrop-blur-md text-white shadow-2xl hover:bg-slate-900 active:scale-90 transition-all pointer-events-auto border border-white/10"
                                    >
                                        <ChevronRight className="w-10 h-10" strokeWidth={2.5} />
                                    </Button>
                                </div>

                                {/* Counter */}
                                <div className="absolute top-8 right-8">
                                    <div className="px-6 py-2.5 bg-slate-900/90 backdrop-blur-xl text-white rounded-2xl text-[12px] font-black tracking-[0.2em] shadow-2xl border border-white/10 italic">
                                        {currentIndex + 1} / {bahanList.length}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Grid */}
                        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide px-4">
                            {bahanList.map((item, idx) => (
                                <button
                                    key={item.id}
                                    onClick={() => selectBahan(idx)}
                                    className={cn(
                                        "w-28 aspect-square rounded-[2rem] overflow-hidden shrink-0 transition-all duration-500 border-4",
                                        currentIndex === idx 
                                            ? "border-[#D25026] scale-110 shadow-2xl ring-4 ring-[#D25026]/10" 
                                            : "border-transparent opacity-40 hover:opacity-100 hover:scale-105"
                                    )}
                                >
                                    {item.imageUrl ? (
                                        <img src={UPLOADS_URL + item.imageUrl} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-300">
                                            <ImageIcon className="w-8 h-8" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Info (5 Cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-between py-4">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-orange-50 text-[#D25026] text-[10px] font-black uppercase tracking-[0.2em] border border-orange-100 shadow-sm">
                                    <div className="w-2 h-2 rounded-full bg-[#D25026] animate-pulse"></div>
                                    Ready for Customization
                                </div>
                                <h1 className="text-7xl font-black text-slate-900 tracking-tighter leading-[0.9] italic uppercase">{currentBahan.nama}</h1>
                                
                                <div className="flex flex-wrap items-center gap-8 pt-4">
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Base Price</p>
                                        <p className="text-4xl font-black text-slate-900 tracking-tighter">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(currentBahan.harga || 150000)}
                                        </p>
                                    </div>
                                    <div className="w-px h-12 bg-slate-100"></div>
                                    <div className="space-y-1">
                                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Availability</p>
                                        <div className="flex items-center gap-2">
                                            <Package className="w-5 h-5 text-[#D25026]" strokeWidth={2.5} />
                                            <span className={cn(
                                                "text-xl font-bold uppercase tracking-wider",
                                                currentBahan.status === "Habis" ? "text-red-500" : "text-emerald-600"
                                            )}>
                                                {currentBahan.status === "Habis" ? "Tidak Tersedia / Habis" : "Tersedia"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 pt-12 border-t border-slate-100">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 italic">
                                        <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                                            <Info className="w-4 h-4" />
                                        </div>
                                        Product Story
                                    </h3>
                                    <Button variant="ghost" className="h-8 px-3 rounded-lg text-[10px] font-bold text-slate-400 hover:text-slate-900 uppercase">
                                        <Ruler className="w-3 h-3 mr-2" />
                                        Size Guide
                                    </Button>
                                </div>
                                <p className="text-lg text-slate-500 leading-relaxed font-medium italic border-l-4 border-slate-100 pl-8">
                                    {currentBahan.deskripsi || "Experience the perfect blend of performance and style with our FCSV professional jersey series. Crafted from premium moisture-wicking fabric designed for champions."}
                                </p>
                            </div>

                            {/* Size & Sleeve Selectors for Estimating Availability */}
                            <div className="space-y-6 pt-10 border-t border-slate-100">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3 italic">
                                    <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white">
                                        <Ruler className="w-4 h-4" />
                                    </div>
                                    Simulasi Ketersediaan Pesanan
                                </h3>
                                
                                <div className="grid grid-cols-2 gap-6 mb-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Nama Pemain (Opsional)</label>
                                        <input
                                            type="text"
                                            placeholder="Masukkan Nama Pemain"
                                            value={playerName}
                                            onChange={(e) => setPlayerName(e.target.value)}
                                            className="w-full h-[54px] bg-slate-50 border border-slate-100 rounded-2xl px-4 text-xs font-black focus:outline-none focus:border-[#D25026] transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Nomor Punggung (Opsional)</label>
                                        <input
                                            type="text"
                                            placeholder="Masukkan Nomor"
                                            value={playerNumber}
                                            onChange={(e) => setPlayerNumber(e.target.value)}
                                            className="w-full h-[54px] bg-slate-50 border border-slate-100 rounded-2xl px-4 text-xs font-black focus:outline-none focus:border-[#D25026] transition-colors"
                                        />
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Pilih Tipe Lengan</label>
                                        <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100 gap-2">
                                            {[
                                                { value: "Lengan Pendek", label: "Pendek" },
                                                { value: "Lengan Panjang", label: "Panjang" }
                                            ].map((sleeve) => (
                                                <button
                                                    key={sleeve.value}
                                                    onClick={() => setSelectedSleeve(sleeve.value)}
                                                    className={cn(
                                                        "flex-1 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all",
                                                        selectedSleeve === sleeve.value
                                                            ? "bg-[#D25026] text-white shadow-md shadow-[#D25026]/10"
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
                                            className="w-full h-[54px] bg-slate-50 border border-slate-100 rounded-2xl px-4 text-xs font-black focus:outline-none focus:border-[#D25026] transition-colors"
                                        >
                                            <option value="" disabled>Pilih Ukuran</option>
                                            {["S", "M", "L", "XL", "2XL", "3XL", "4XL"].map((size) => (
                                                <option key={size} value={size}>
                                                    Ukuran {size}{getSizeSurcharge(size) > 0 ? ` — + ${new Intl.NumberFormat('id-ID').format(getSizeSurcharge(size))}` : " — Harga Normal"}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Stok Bahan Tersedia</span>
                                            <span className="text-sm font-black text-slate-600">
                                                {currentBahan.kuantitasKg} kg ~ {(currentBahan.kuantitasKg * (currentBahan.rasioKonversi || 2.5)).toFixed(1)} meter
                                            </span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Harga Satuan Varian</span>
                                            <span className="text-xl font-black text-[#D25026]">
                                                {formatRupiah((currentBahan.harga || 150000) + getSizeSurcharge(selectedSize))}
                                            </span>
                                        </div>
                                    </div>
                                    {selectedSize && (
                                        <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                                            <div>
                                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Maks. Pesanan ({selectedSleeve}, {selectedSize})</span>
                                                <span className="text-2xl font-black text-slate-900 italic uppercase">
                                                    {getMaxOrderPcs(currentBahan.kuantitasKg || 0, selectedSize, selectedSleeve)} pcs
                                                </span>
                                            </div>
                                            {getSizeSurcharge(selectedSize) > 0 && (
                                                <div className="text-right">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Biaya Tambahan Ukuran</span>
                                                    <span className="text-sm font-black text-amber-600">+ {formatRupiah(getSizeSurcharge(selectedSize))}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                    {!selectedSize && (
                                        <div className="border-t border-slate-100 pt-3 text-center">
                                            <span className="text-[10px] font-bold text-slate-400 italic">← Pilih tipe lengan & ukuran untuk melihat estimasi ketersediaan pesanan</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="pt-16 flex flex-col gap-4">
                            {currentBahan.status === "Habis" && (
                                <div className="p-4 bg-orange-50 border border-orange-200 text-orange-800 rounded-2xl flex items-start gap-3">
                                    <Info className="w-5 h-5 text-[#D25026] shrink-0 mt-0.5" />
                                    <div className="text-xs font-bold uppercase tracking-tight">
                                        Pemberitahuan: Bahan ini sedang tidak tersedia. Jika Anda tetap melanjutkan pemesanan, Admin akan menghubungi Anda untuk merekomendasikan bahan alternatif yang tersedia.
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-4">
                                <Button 
                                    onClick={handleCustomize}
                                    className="h-20 flex-1 bg-[#D25026] hover:bg-slate-900 text-white rounded-[2rem] font-black text-[14px] shadow-2xl shadow-[#D25026]/20 transition-all active:scale-95 flex items-center justify-center gap-4 uppercase tracking-[0.2em] italic"
                                >
                                    <CreditCard className="w-6 h-6" />
                                    Customize & Order Now
                                </Button>
                                <Button 
                                    variant="outline"
                                    className="h-20 w-20 rounded-[2rem] border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center"
                                >
                                    <Heart className="w-6 h-6" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
