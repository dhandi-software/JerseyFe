import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export function TrackingSection() {
    const [orderId, setOrderId] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderId.trim()) {
            navigate(`/tracking?id=${orderId.trim()}`);
        }
    };

    return (
        <section className="w-full flex justify-center py-12 px-[1rem] sm:px-[1.85rem] font-['Inter'] bg-slate-900 mt-12 relative overflow-hidden rounded-[2.5rem] mx-auto shadow-2xl">
            <div className="w-full flex flex-col items-center gap-6 relative z-10 py-10">
                <h2 className="text-white text-3xl md:text-5xl font-black italic uppercase tracking-tighter text-center">
                    Lacak Proses <br className="md:hidden" />Pesanan Anda
                </h2>
                <p className="text-white/60 text-sm md:text-base text-center font-medium">
                    Masukkan ID Pesanan (Contoh: JK-XXXXXX) yang diberikan oleh admin untuk mengetahui status produksi jersey custom Anda.
                </p>
                
                <form onSubmit={handleSearch} className="w-full relative mt-4">
                    <input 
                        type="text" 
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                        placeholder="Masukkan Tracking ID..."
                        className="w-full h-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-8 text-white text-lg font-bold placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D25026] transition-all uppercase tracking-widest"
                    />
                    <button 
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 bg-[#D25026] hover:bg-[#B34320] text-slate-900 px-8 rounded-full font-black italic uppercase tracking-widest text-xs transition-all shadow-lg flex items-center gap-2 active:scale-95"
                    >
                        <Search size={16} />
                        Lacak
                    </button>
                </form>
            </div>
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border-[30px] border-white rounded-full"></div>
            </div>
        </section>
    );
}
