import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, Filter, ShoppingBag } from "lucide-react";
import { CardProduct } from "~/components/template/CardProduct";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";

export function CustomJerseyDesktop({ title }: { title: string }) {
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
                    status: bahan.status,
                    image: bahan.imageUrl ? `${UPLOADS_URL}${bahan.imageUrl}` : "https://via.placeholder.com/300?text=No+Image"
                }));
                setJerseyProducts(mapped);
            }
        }).catch(console.error).finally(() => setLoading(false));
    }, []);
    
    const filteredProducts = jerseyProducts.filter(p => {
        return p.title.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handlePreview = (product: any) => {
        navigate(`/customer/custom-jersey/detail/${product.id}`);
    };

    const handleCustomize = (product: any) => {
        navigate(`/customer/custom-jersey/checkout?productId=${product.id}`);
    };

    return (
        <div className="min-h-screen bg-[#FAFAFA] p-8 md:p-12 font-geist flex flex-col gap-12 max-w-[1600px] mx-auto w-full">
            {/* Page Header */}
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-[#D25026] text-[10px] font-black uppercase tracking-widest border border-orange-100 rounded-full italic">
                        Authentic Gear
                    </div>
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter italic uppercase leading-[0.8]">{title}</h1>
                    <p className="text-slate-400 text-sm font-medium tracking-tight">Select your professional base model and launch the customizer.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-[#D25026] animate-pulse"></div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest italic">Service Online</span>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-10">
                {/* Search & Filter Bar */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1 relative w-full group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#D25026] transition-colors" />
                        <input 
                            type="text"
                            placeholder="Search Jersey Collection..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-16 pr-8 py-6 bg-white border border-slate-100 rounded-[2rem] text-sm font-bold shadow-sm focus:outline-none focus:ring-8 focus:ring-slate-900/5 focus:border-slate-200 transition-all placeholder:text-slate-200"
                        />
                    </div>
                    <button className="h-20 px-10 bg-white border border-slate-100 rounded-[2rem] flex items-center gap-4 text-slate-400 hover:text-slate-900 transition-all font-black text-xs shadow-sm uppercase tracking-widest italic">
                        <Filter className="w-5 h-5" />
                        Collection Filter
                    </button>
                </div>

                {/* Product Grid - Full Width */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="aspect-[4/5] bg-white rounded-[2.5rem] animate-pulse border border-slate-50"></div>
                        ))
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <CardProduct 
                                key={product.id} 
                                product={product as any} 
                                onPreview={handlePreview}
                                onCustomize={handleCustomize}
                                className="transition-all hover:-translate-y-2"
                            />
                        ))
                    ) : (
                        <div className="col-span-full py-32 bg-white rounded-[3.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center gap-6">
                            <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center">
                                <ShoppingBag className="w-12 h-12 text-slate-200" />
                            </div>
                            <span className="text-slate-400 font-black italic uppercase tracking-[0.2em] text-xs">No models found in this collection</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
