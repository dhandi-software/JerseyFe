import { motion } from "motion/react";
import { useState, useEffect } from "react";

import { products } from "~/data/catalog";

export function InfoSection() {
    const [favorites, setFavorites] = useState<number[]>([]);

    useEffect(() => {
        // Load favorites from localStorage on mount
        const stored = localStorage.getItem("wishlist_ids");
        if (stored) {
            try {
                const ids = JSON.parse(stored);
                setFavorites(ids);
                const favoriteProducts = ids.map((id: number) => products.find(p => p.id === id)).filter(Boolean);
                window.dispatchEvent(new CustomEvent('wishlist_update', { detail: favoriteProducts }));
            } catch (e) {
                console.error("Failed to parse wishlist from localStorage", e);
            }
        }
    }, []);

    const toggleFavorite = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newFavs = favorites.includes(id) 
            ? favorites.filter(favId => favId !== id)
            : [...favorites, id];
        
        setFavorites(newFavs);
        localStorage.setItem("wishlist_ids", JSON.stringify(newFavs));
        
        const favoriteProducts = newFavs.map(id => products.find(p => p.id === id)).filter(Boolean);
        window.dispatchEvent(new CustomEvent('wishlist_update', { detail: favoriteProducts }));
    };

    return (
        <section className="w-full flex justify-center py-8 px-[1rem] font-['Inter']">
            <div className="inline-flex flex-col justify-start items-center gap-1 w-full max-w-[90rem]">
                <div className="self-stretch flex flex-col justify-start items-start gap-1">
                    <div className="w-full py-4 border-t-[0.49px] border-black/10 flex flex-col justify-start items-start gap-3">
                        {/* Header & Filters */}
                        <div className="self-stretch flex flex-col gap-3">
                            <div className="justify-start text-neutral-900 text-sm font-normal leading-5">Trending</div>
                            <div className="flex justify-start items-center gap-[4.94px] overflow-x-auto pb-2 scrollbar-hide whitespace-nowrap">
                                {["SHORTS", "HAT", "JACKETS"].map(cat => (
                                    <div key={cat} className="px-[14px] h-6 shrink-0 rounded-[98.76px] outline outline-[0.49px] outline-offset-[-0.49px] outline-neutral-200 flex justify-center items-center cursor-pointer hover:bg-neutral-50 transition-colors">
                                        <div className="text-center justify-start text-neutral-900/80 text-[6.91px] font-medium leading-3 tracking-wide">{cat}</div>
                                    </div>
                                ))}
                                <div className="w-12 h-6 shrink-0 bg-neutral-900 rounded-[98.76px] outline outline-[0.49px] outline-offset-[-0.49px] flex justify-center items-center cursor-pointer">
                                    <div className="text-center justify-start text-white text-[6.91px] font-medium leading-3 tracking-wide">SHOES</div>
                                </div>
                                <div className="px-[14px] h-6 shrink-0 rounded-[98.76px] outline outline-[0.49px] outline-offset-[-0.49px] outline-neutral-200 flex justify-center items-center cursor-pointer hover:bg-neutral-50 transition-colors">
                                    <div className="text-center justify-start text-neutral-900/80 text-[6.91px] font-medium leading-3 tracking-wide">T-SHIRT</div>
                                </div>
                            </div>
                        </div>

                        {/* Grid Produk */}
                        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
                            {products.map((product) => (
                                <motion.div 
                                    key={product.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    className="flex flex-col gap-3 group cursor-pointer w-full"
                                >
                                    <div className="relative aspect-[4/5] rounded-[20px] bg-neutral-100 overflow-hidden shadow-sm">
                                        <img 
                                            src={product.image} 
                                            alt={product.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        {/* Favorit button */}
                                        <div 
                                            onClick={(e) => toggleFavorite(product.id, e)}
                                            className={`absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full overflow-hidden transition-all z-10 ${
                                                favorites.includes(product.id) ? "bg-red-500" : "bg-neutral-900/20 backdrop-blur-sm"
                                            }`}
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill={favorites.includes(product.id) ? "white" : "white"} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 px-1">
                                        <div className="text-neutral-900 text-sm font-semibold leading-tight line-clamp-1">{product.title}</div>
                                        <div className="text-neutral-500 text-xs font-medium">{product.price}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
