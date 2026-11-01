import { ChevronDown, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";
import { useState, useEffect } from "react";

const MAX_POPUP_ITEMS = 5;

export function NavbarDesktop() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const [materials, setMaterials] = useState<any[]>([]);

    useEffect(() => {
        adminApi.getBahanBaju().then(res => {
            if (res.status === "success" && Array.isArray(res.data)) {
                setMaterials(res.data);
            }
        }).catch(console.error);
    }, [location.pathname]);

    const displayedMaterials = materials.slice(0, MAX_POPUP_ITEMS);
    const remainingCount = Math.max(0, materials.length - MAX_POPUP_ITEMS);

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/category", label: "Koleksi Jersey", hasDropdown: true },
        { href: "/about", label: "Tentang Kami" },
        { href: "/visi-misi", label: "Visi & Misi" },
        { href: "/tracking", label: "Lacak Pesanan" },
        { href: "/faq", label: "Bantuan & FAQ" },
        { href: "/contact", label: "Hubungi Kami" },
    ];

    return (
        <nav className="w-full h-14 bg-[#FAFAFA] border-b border-neutral-100 flex items-center justify-center font-['Inter'] z-50 relative">
            <div className="container mx-auto px-6 flex items-center justify-center gap-10 h-full">
                {navLinks.map((link) => (
                    <div key={link.href} className="relative group/nav h-full flex items-center py-2">
                        <Link
                            to={link.href}
                            className={cn(
                                "flex items-center gap-1.5 text-[0.8125rem] font-bold tracking-wider uppercase transition-all duration-200 hover:text-[#B83B14] group cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B83B14]",
                                isActive(link.href) ? "text-[#B83B14]" : "text-neutral-600"
                            )}
                        >
                            <span>{link.label}</span>
                            {link.hasDropdown && (
                                <ChevronDown className={cn(
                                    "w-3.5 h-3.5 transition-transform group-hover/nav:rotate-180",
                                    isActive(link.href) ? "text-[#B83B14]" : "text-neutral-400"
                                )} />
                            )}
                        </Link>

                        {link.hasDropdown && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-[100%] hidden group-hover/nav:block bg-white shadow-xl border border-neutral-200/80 rounded-2xl p-4 min-w-[280px] z-50 mt-0 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex flex-col gap-1">
                                    <div className="px-2.5 py-1.5 border-b border-neutral-100 mb-1">
                                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider leading-none">
                                            Bahan Baku Pilihan
                                        </span>
                                    </div>
                                    {displayedMaterials.length > 0 ? (
                                        <>
                                            {displayedMaterials.map((m) => (
                                                <Link
                                                    key={m.id}
                                                    to={`/product/${m.uuid || m.id}`}
                                                    className="flex items-center gap-3 p-2 min-h-[44px] rounded-xl hover:bg-neutral-50 transition-colors text-neutral-800 hover:text-[#B83B14] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B83B14]"
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200/60">
                                                        <img 
                                                            src={m.imageUrl ? `${UPLOADS_URL}${m.imageUrl}` : "/images/GambarBaju.png"} 
                                                            alt={m.nama} 
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col min-w-0 flex-1">
                                                        <span className="text-[12px] font-bold truncate leading-tight text-neutral-900">
                                                            {m.nama}
                                                        </span>
                                                        <span className="text-[11px] font-medium text-neutral-500 leading-none mt-1">
                                                            Stok {m.kuantitasKg ?? 0} kg
                                                        </span>
                                                    </div>
                                                </Link>
                                            ))}

                                            <Link
                                                to="/category"
                                                className="mt-1 pt-2.5 px-2.5 min-h-[44px] border-t border-neutral-100 flex items-center justify-between text-[11px] font-bold text-[#B83B14] hover:text-neutral-900 transition-colors rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B83B14]"
                                            >
                                                <span>
                                                    {remainingCount > 0
                                                        ? `Lihat Semua (+${remainingCount} Lainnya)`
                                                        : "Lihat Semua Koleksi"}
                                                </span>
                                                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                                            </Link>
                                        </>
                                    ) : (
                                        <div className="text-[11px] text-neutral-500 font-medium p-4 text-center">
                                            Belum ada produk katalog dari Admin
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </nav>
    );
}
