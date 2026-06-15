import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, Shirt, ImageOff } from "lucide-react";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";

export function AboutSection() {
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

    const activeList = materials;
    const currentItem = activeList.length > 0 ? activeList[currentIndex] : null;

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

    // Auto rotate slides every 5 seconds
    useEffect(() => {
        if (activeList.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % activeList.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [activeList]);

    return (
        <section className="w-full py-20 relative overflow-hidden flex justify-center">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="/images/jpg1.jpg" 
                    alt="Background" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col gap-10 w-full text-center md:text-left items-center">
                    
                    {/* Header */}
                    <div className="w-full max-w-[500px] flex flex-col gap-6 text-left">
                        <h2 className="text-white text-3xl sm:text-4xl font-black leading-[1.1] italic uppercase tracking-tighter">
                            KUALITAS PREMIUM <br/>
                            UNTUK TIM <br/>
                            <span className="text-[#D25026]">TERBAIK ANDA</span>
                        </h2>
                    </div>

                    {/* Fabric Close Up Banner - Dynamic Image or Empty State Banner */}
                    <div className="w-full max-w-[500px] h-[200px] relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                        {currentItem && currentItem.imageUrl ? (
                            <img 
                                src={currentItem.imageUrl.startsWith("http") || currentItem.imageUrl.startsWith("/") ? currentItem.imageUrl : `${UPLOADS_URL}${currentItem.imageUrl}`} 
                                alt={currentItem.nama} 
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-700 animate-in fade-in"
                            />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#1C1C1E] to-[#2C2C2E] flex flex-col items-center justify-center gap-2 p-6">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-inner">
                                    <Shirt className="w-6 h-6 text-neutral-500" />
                                </div>
                                <p className="text-white/40 font-bold uppercase tracking-widest text-[10px] text-center">FCSV Premium Apparel</p>
                            </div>
                        )}
                    </div>

                    {/* Image Carousel / Loading / Empty State */}
                    <div className="w-full max-w-[400px] flex flex-col items-center justify-center gap-4">
                        {loading ? (
                            <div className="relative w-full aspect-square flex items-center justify-center bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 p-5 shadow-2xl animate-pulse">
                                <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10" />
                            </div>
                        ) : activeList.length === 0 ? (
                            <div className="relative w-full aspect-square flex flex-col items-center justify-center gap-3 bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 p-5 shadow-2xl text-center">
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center border border-white/10 shadow-md">
                                    <ImageOff className="w-6 h-6 text-neutral-400" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Koleksi Belum Tersedia</h4>
                                    <p className="text-white/50 text-[10px] max-w-[180px] leading-relaxed">Koleksi bahan dan jersey premium kami sedang diperbarui.</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="relative w-full aspect-square flex items-center justify-center group bg-white/5 backdrop-blur-md rounded-[2rem] border border-white/10 p-5 shadow-2xl overflow-visible">
                                    {/* Decorative Glow */}
                                    <div className="absolute w-[80%] h-[80%] bg-[#D25026]/20 rounded-full blur-[80px]" />
                                    
                                    <img 
                                        onClick={() => navigate(currentItem?.id ? `/product/${currentItem.id}` : "/category")}
                                        key={currentItem?.id || currentIndex}
                                        className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)] cursor-pointer" 
                                        src={currentItem?.imageUrl ? (currentItem.imageUrl.startsWith("http") || currentItem.imageUrl.startsWith("/") ? currentItem.imageUrl : `${UPLOADS_URL}${currentItem.imageUrl}`) : "/images/jersey_hero.png"} 
                                        alt={currentItem?.nama} 
                                    />

                                    {/* Arrow Controls */}
                                    {activeList.length > 1 && (
                                        <>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handlePrev(); }}
                                                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center transition-all z-30 border border-white/10 shadow-md cursor-pointer"
                                                title="Sebelumnya"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleNext(); }}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center transition-all z-30 border border-white/10 shadow-md cursor-pointer"
                                                title="Selanjutnya"
                                            >
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}

                                    {/* Floating Price Badge */}
                                    {currentItem && (
                                        <div className="absolute -right-2 top-4 z-20 bg-white p-3 rounded-2xl shadow-xl rotate-12 border border-neutral-100">
                                            <div className="flex flex-col items-center">
                                                <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest leading-none mb-1">Mulai Dari</span>
                                                <span className="text-sm font-black text-[#D25026] italic uppercase tracking-tighter">
                                                    Rp {new Intl.NumberFormat('id-ID').format(currentItem.harga || 150000)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Bullet Pagination */}
                                {activeList.length > 1 && (
                                    <div className="flex gap-2 z-30">
                                        {activeList.map((_, idx) => (
                                            <button 
                                                key={idx}
                                                onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
                                                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${idx === currentIndex ? "bg-[#D25026] w-5" : "bg-white/40 hover:bg-white"}`}
                                                title={activeList[idx].nama}
                                            />
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Brand Profile Paragraphs - Restored & Styled cleanly for mobile */}
                    <div className="w-full max-w-[500px] flex flex-col gap-6 text-white/80 text-sm leading-relaxed text-left">
                        {/* Paragraph 1 - Styled as a quote */}
                        <blockquote className="border-l-4 border-[#D25026] pl-4 text-white text-base font-bold italic leading-relaxed">
                            "FCSV Apparel adalah brand custom jersey yang bergerak di bidang produksi dan penjualan jersey olahraga berkualitas dengan konsep desain modern, nyaman digunakan, dan dapat disesuaikan dengan identitas tim maupun komunitas."
                        </blockquote>

                        {/* Paragraph 2 */}
                        <div className="space-y-2">
                            <p className="font-medium text-white/90">
                                FCSV Apparel melayani pembuatan berbagai jenis jersey custom seperti sepak bola, futsal, badminton, voli, esport, running, dan kebutuhan apparel komunitas lainnya.
                            </p>
                        </div>

                        {/* Paragraph 3 - Philosophy Card */}
                        <div className="flex flex-col gap-4">
                            <p className="font-medium text-white/90">
                                Dengan mengutamakan kualitas bahan, detail printing, serta ketepatan produksi, FCSV Apparel hadir untuk membantu tim, komunitas, sekolah, instansi, hingga brand lokal mendapatkan jersey yang tampil eksklusif dan profesional.
                            </p>
                            <div className="p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 shadow-lg relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#D25026]" />
                                <p className="italic text-[#D25026] font-bold text-xs pl-2 leading-relaxed">
                                    "Kami percaya bahwa jersey bukan hanya pakaian olahraga, tetapi juga identitas, kebanggaan, dan semangat kebersamaan sebuah tim."
                                </p>
                            </div>
                        </div>

                        {/* Paragraph 4 */}
                        <p className="font-medium text-white/70">
                            FCSV Apparel berkomitmen untuk terus menghadirkan inovasi desain, pelayanan terbaik, dan produk apparel custom yang nyaman dipakai dalam setiap aktivitas olahraga maupun casual sportwear. Inspirasi profil ini mengikuti standar industri custom jersey modern di Indonesia.
                        </p>
                    </div>

                    {/* CTA Button */}
                    <div className="w-full max-w-[500px] text-left pt-2">
                        <button 
                            onClick={() => navigate("/category")}
                            className="px-8 py-3.5 bg-[#D25026] hover:bg-[#B13F1D] text-white font-black italic uppercase tracking-widest text-[10px] rounded-full shadow-2xl transition-all scale-100 active:scale-95 flex items-center justify-center gap-2 group/btn cursor-pointer w-full sm:w-auto font-bold"
                        >
                            <span>LIHAT DETAIL BAHAN</span>
                        </button>
                    </div>

                </div>
             </div>
        </section>
    );
}
