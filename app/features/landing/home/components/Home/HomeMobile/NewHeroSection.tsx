import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";

export function NewHeroSection() {
    const navigate = useNavigate();
    const [materials, setMaterials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        adminApi.getBahanBaju().then(res => {
            if (res.status === "success" && res.data.length > 0) {
                setMaterials(res.data);
            }
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const handleNext = () => {
        if (activeList.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % activeList.length);
        }
    };

    const handlePrev = () => {
        if (activeList.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + activeList.length) % activeList.length);
        }
    };

    const activeList = materials.map(item => ({
        id: item.id,
        nama: item.nama,
        deskripsi: item.deskripsi || "Premium FCSV Jersey series designed for champions.",
        imageUrl: item.imageUrl ? `${UPLOADS_URL}${item.imageUrl}` : "https://via.placeholder.com/1200?text=Premium+Jersey"
    }));

    if (loading) {
        return (
            <section className="w-full flex justify-center py-4 px-[1rem] sm:px-[1.85rem] font-['Inter']">
                <div className="w-full max-w-[90rem] flex flex-col gap-4">
                    <div className="w-full h-[25rem] bg-neutral-100 rounded-[2.5rem] animate-pulse" />
                </div>
            </section>
        );
    }

    const currentItem = activeList.length > 0 ? activeList[currentIndex] : null;
    
    // Helper to truncate text description dynamically
    const truncateText = (text: string, maxLen: number = 130) => {
        if (!text) return "";
        return text.length > maxLen ? text.substring(0, maxLen) + "..." : text;
    };
    
    // Auxiliary slide items for surrounding slots
    const getSlotItem = (offset: number) => {
        if (activeList.length === 0) return null;
        const idx = (currentIndex + offset) % activeList.length;
        return activeList[idx];
    };

    const slot1 = getSlotItem(1);
    const slot2 = getSlotItem(2);
    const slot3 = getSlotItem(3);
    const slot4 = getSlotItem(4);

    return (
        <section className="w-full flex justify-center py-4 px-[1rem] sm:px-[1.85rem] font-['Inter']">
            <div className="w-full max-w-[90rem] flex flex-col gap-4">
                {activeList.length === 0 ? (
                    <div className="w-full h-[25rem] bg-neutral-50 rounded-[2.5rem] flex items-center justify-center border border-neutral-200">
                        <div className="text-neutral-400 italic font-medium">Belum ada bahan baju tersedia</div>
                    </div>
                ) : (
                    <>
                        {/* Upper Row - Split into multiple elements for mobile */}
                <div className="w-full flex items-stretch gap-4 flex-col lg:flex-row">
                    {/* Main Banner */}
                    <div 
                        onClick={() => navigate(`/product/${currentItem?.id}`)}
                        className="flex-[2] relative overflow-hidden bg-[#E5E7EB] rounded-[2rem] h-[25rem] md:h-[35rem] group cursor-pointer"
                    >
                        <img 
                            key={currentItem?.id} // force remount animation on slide change
                            className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                            src={currentItem?.imageUrl} 
                            alt={currentItem?.nama} 
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent transition-opacity group-hover:from-black" />
                        
                        {/* Slide Arrows */}
                        {activeList.length > 1 && (
                            <>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all z-30 border border-white/10"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm flex items-center justify-center transition-all z-30 border border-white/10"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </>
                        )}

                        <div className="absolute left-[1rem] top-[2rem] flex flex-col items-start gap-6 max-w-[85%] z-20">
                            <div className="flex flex-col gap-3">
                                <h1 className="text-white text-[2.2rem] font-bold leading-[1.1] drop-shadow-2xl italic uppercase tracking-tighter line-clamp-2">
                                    {currentItem?.nama}
                                </h1>
                                <p className="text-white/90 text-[0.95rem] font-medium leading-relaxed drop-shadow-lg">
                                    {truncateText(currentItem?.deskripsi || "", 130)}
                                </p>
                            </div>
                            <button className="px-6 py-3 bg-neutral-950 hover:bg-[#D25026] text-white hover:text-white group/btn transition-all rounded-full flex justify-center items-center shadow-xl font-black italic uppercase tracking-widest text-[9px]">
                                <span>VIEW COLLECTIONS</span>
                            </button>
                        </div>

                        {/* Bullet indicators */}
                        {activeList.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                                {activeList.map((_, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? "bg-[#D25026] w-5" : "bg-white/40 hover:bg-white"}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Side Stacked Covers */}
                    <div className="flex-1 flex flex-col gap-4">
                        <div 
                            onClick={() => navigate(`/product/${slot1?.id}`)}
                            className="relative overflow-hidden bg-[#F3F4F6] rounded-[2rem] h-[12rem] group cursor-pointer"
                        >
                            <img 
                                className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                                src={slot1?.imageUrl} 
                                alt={slot1?.nama} 
                            />
                            <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-black/80 via-black/20 to-transparent transition-opacity group-hover:from-black" />
                            <div className="absolute left-[1.25rem] top-[1.25rem]">
                                <div className="text-white text-[1.25rem] font-black italic uppercase leading-[1.1] tracking-tighter drop-shadow-lg line-clamp-2">
                                    {slot1?.nama}
                                </div>
                            </div>
                        </div>
                        <div 
                            onClick={() => navigate(`/product/${slot2?.id}`)}
                            className="relative overflow-hidden bg-[#F3F4F6] rounded-[2rem] h-[12rem] group cursor-pointer"
                        >
                            <img 
                                className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                                src={slot2?.imageUrl} 
                                alt={slot2?.nama} 
                            />
                            <div className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-black/80 via-black/20 to-transparent transition-opacity group-hover:from-black" />
                            <div className="absolute left-[1.25rem] top-[1.25rem]">
                                <div className="text-white text-[1.25rem] font-black italic uppercase leading-[1.1] tracking-tighter drop-shadow-lg line-clamp-2">
                                    {slot2?.nama}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lower Row */}
                <div className="w-full flex flex-col lg:flex-row items-stretch gap-4 mt-2">
                    {/* Left Text Block */}
                    <div className="flex-[0.8] flex flex-col justify-center items-start gap-4 md:gap-6 px-4 md:px-8 py-4 md:py-8 w-full">
                        <div className="flex flex-col items-start gap-3 md:gap-4">
                            <h2 className="text-[#111111] text-[2rem] md:text-[3.5rem] font-black italic uppercase leading-[1] tracking-tighter">
                                Casual<br/>Inspirations
                            </h2>
                            <p className="text-[#111111]/60 text-[0.8rem] md:text-[1rem] leading-relaxed max-w-[22rem] font-medium">
                                Our favorite combinations for casual outfit that can inspire you to apply on your daily activity.
                            </p>
                        </div>
                        <button className="px-6 md:px-10 py-2 md:py-3 border-[1px] border-[#111111]/20 rounded-full hover:bg-[#111111] hover:border-[#111111] transition-all flex justify-center items-center group/btn mt-2 font-black italic uppercase tracking-widest text-[9px]">
                            <span className="text-[#111111] group-hover/btn:text-white transition-colors">BROWSE INSPIRATIONS</span>
                        </button>
                    </div>

                    {/* Right Images */}
                    <div className="flex-[2] flex gap-4 flex-col sm:flex-row">
                        <div 
                            onClick={() => navigate(`/product/${slot3?.id}`)}
                            className="flex-1 relative overflow-hidden bg-[#F3F4F6] rounded-[2rem] h-[18rem] group cursor-pointer"
                        >
                            <img 
                                className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                                src={slot3?.imageUrl} 
                                alt={slot3?.nama} 
                            />
                            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:from-black" />
                            <div className="absolute left-[1.25rem] bottom-[1.25rem] text-white text-[1.5rem] font-black italic uppercase leading-[1.1] tracking-tighter drop-shadow-lg line-clamp-2 pr-12">
                                {slot3?.nama}
                            </div>
                            <div className="absolute right-[1.25rem] bottom-[1.25rem] w-10 h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-all">
                                <ArrowUpRight className="w-5 h-5 text-white" strokeWidth={1.5} />
                            </div>
                        </div>
                        <div 
                            onClick={() => navigate(`/product/${slot4?.id}`)}
                            className="flex-1 relative overflow-hidden bg-[#F3F4F6] rounded-[2rem] h-[18rem] group cursor-pointer"
                        >
                            <img 
                                className="w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-105" 
                                src={slot4?.imageUrl} 
                                alt={slot4?.nama} 
                            />
                            <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:from-black" />
                            <div className="absolute left-[1.25rem] bottom-[1.25rem] text-white text-[1.5rem] font-black italic uppercase leading-[1.1] tracking-tighter drop-shadow-lg line-clamp-2 pr-12">
                                {slot4?.nama}
                            </div>
                            <div className="absolute right-[1.25rem] bottom-[1.25rem] w-10 h-10 rounded-full border border-white/30 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/20 transition-all">
                                <ArrowUpRight className="w-5 h-5 text-white" strokeWidth={1.5} />
                            </div>
                        </div>
                    </div>
                </div>
                </>
                )}
            </div>
        </section>
    );
}
