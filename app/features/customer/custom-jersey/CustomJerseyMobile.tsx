import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, ShoppingBag, CreditCard, Eye } from "lucide-react";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";

export function CustomJerseyMobile({ title }: { title: string }) {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [jerseyProducts, setJerseyProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminApi.getBahanBaju().then(res => {
            if (res.status === "success") {
                const mapped = res.data.map((bahan: any) => ({
                    id: bahan.id,
                    title: bahan.nama,
                    category: "Jersey",
                    price: bahan.harga || 150000,
                    stock: bahan.stok,
                    image: bahan.imageUrl ? `${UPLOADS_URL}${bahan.imageUrl}` : "https://via.placeholder.com/300?text=No+Image"
                }));
                setJerseyProducts(mapped);
            }
        }).catch(console.error).finally(() => setLoading(false));
    }, []);

    const filteredProducts = jerseyProducts.filter(p => {
        return p.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const formatRupiah = (number: number) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-32 font-geist">
            {/* Header Area */}
            <div className="p-8 space-y-6">
                <div className="space-y-2">
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-[#D25026] text-[10px] font-black uppercase tracking-widest italic border border-orange-100">
                        Premium Store
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic uppercase leading-none">{title}</h1>
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                        type="text"
                        placeholder="Search Jersey..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-2xl text-sm font-bold shadow-sm focus:outline-none focus:ring-4 focus:ring-[#D25026]/5 transition-all"
                    />
                </div>
            </div>

            {/* Product Grid */}
            <div className="px-6 grid grid-cols-1 gap-8">
                {loading ? (
                    Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="aspect-[4/5] bg-white rounded-[2.5rem] animate-pulse border border-slate-50"></div>
                    ))
                ) : filteredProducts.length > 0 ? (
                    filteredProducts.map(product => (
                        <div 
                            key={product.id} 
                            className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-50 flex flex-col group"
                        >
                            <div className="aspect-square relative overflow-hidden bg-slate-50">
                                <img src={product.image} className="w-full h-full object-cover" />
                                <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-xl text-[10px] font-black text-slate-900 shadow-sm border border-white/50">
                                    {product.stock} STOK
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-[#D25026] uppercase tracking-widest italic">Jersey Series</div>
                                    <h3 className="text-xl font-black text-slate-900 italic uppercase tracking-tighter">{product.title}</h3>
                                    <p className="text-lg font-black text-slate-900/40 italic">{formatRupiah(product.price)}</p>
                                </div>
                                
                                <div className="flex gap-3">
                                    <button 
                                        onClick={() => navigate(`/customer/custom-jersey/checkout?productId=${product.id}`)}
                                        className="flex-1 h-14 bg-[#D25026] text-white rounded-2xl font-black uppercase italic tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-[#D25026]/10"
                                    >
                                        <CreditCard className="w-4 h-4" />
                                        Order Now
                                    </button>
                                    <button 
                                        onClick={() => navigate(`/customer/custom-jersey/detail/${product.id}`)}
                                        className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center active:scale-95 transition-all border border-slate-100"
                                    >
                                        <Eye className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 text-center">
                        <ShoppingBag className="w-10 h-10 text-slate-200" />
                        <span className="text-slate-400 font-black uppercase italic tracking-widest text-[10px]">No models available</span>
                    </div>
                )}
            </div>
        </div>
    );
}
