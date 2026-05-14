import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export function TrackingSectionMobile() {
    const [orderId, setOrderId] = useState("");
    const navigate = useNavigate();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderId.trim()) {
            navigate(`/tracking?id=${orderId.trim()}`);
        }
    };

    return (
        <section className="w-full bg-slate-900 px-4 py-10 mt-6 relative overflow-hidden font-['Inter']">
            <div className="flex flex-col items-center gap-4 relative z-10">
                <h2 className="text-white text-2xl font-black italic uppercase tracking-tighter text-center leading-tight">
                    Lacak Proses <br />Pesanan Anda
                </h2>
                <p className="text-white/60 text-xs text-center font-medium px-4">
                    Masukkan ID Pesanan (Contoh: JK-XXXXXX) untuk mengetahui status jersey Anda.
                </p>
                
                <form onSubmit={handleSearch} className="w-full mt-2 flex flex-col gap-3">
                    <input 
                        type="text" 
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                        placeholder="Masukkan Tracking ID..."
                        className="w-full h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-full px-6 text-white text-sm font-bold placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-[#D25026] transition-all uppercase tracking-widest text-center"
                    />
                    <button 
                        type="submit"
                        className="w-full h-12 bg-[#D25026] hover:bg-[#B34320] text-white rounded-full font-black italic uppercase tracking-widest text-xs transition-all shadow-lg flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Search size={16} />
                        Lacak Pesanan
                    </button>
                </form>
            </div>
            {/* Decorative Background */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] border-[15px] border-white rounded-full"></div>
            </div>
        </section>
    );
}
