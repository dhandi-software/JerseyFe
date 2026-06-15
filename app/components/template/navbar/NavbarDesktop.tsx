import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";
import { useState, useEffect } from "react";

export function NavbarDesktop() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;
    const [materials, setMaterials] = useState<any[]>([]);

    useEffect(() => {
        adminApi.getBahanBaju().then(res => {
            if (res.status === "success" && res.data.length > 0) {
                setMaterials(res.data);
            }
        }).catch(console.error);
    }, []);

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
                                "flex items-center gap-1.5 text-[0.8125rem] font-bold tracking-wider uppercase transition-all duration-200 hover:text-[#D25026] group cursor-pointer",
                                isActive(link.href) ? "text-[#D25026]" : "text-neutral-500"
                            )}
                        >
                            <span>{link.label}</span>
                            {link.hasDropdown && (
                                <ChevronDown className={cn(
                                    "w-3.5 h-3.5 transition-transform group-hover/nav:rotate-180",
                                    isActive(link.href) ? "text-[#D25026]" : "text-neutral-300"
                                )} />
                            )}
                        </Link>

                        {link.hasDropdown && (
                            <div className="absolute left-1/2 -translate-x-1/2 top-[100%] hidden group-hover/nav:block bg-white shadow-2xl border border-neutral-100 rounded-3xl p-4 min-w-[280px] z-50 mt-0 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex flex-col gap-1.5">
                                    <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-3 py-1 border-b border-neutral-50 mb-1 leading-none">
                                        Bahan Baku Pilihan
                                    </div>
                                    {materials.length > 0 ? (
                                        materials.slice(0, 5).map((m) => (
                                            <Link
                                                key={m.id}
                                                to={`/product/${m.id}`}
                                                className="flex items-center gap-3 p-2 rounded-2xl hover:bg-neutral-50 transition-colors text-neutral-700 hover:text-[#D25026]"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-neutral-100 overflow-hidden shrink-0 border border-neutral-50">
                                                    <img 
                                                        src={m.imageUrl ? `${UPLOADS_URL}${m.imageUrl}` : "https://via.placeholder.com/100?text=Jersey"} 
                                                        alt={m.nama} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-[12px] font-extrabold truncate leading-tight">{m.nama}</span>
                                                    <span className="text-[10px] font-black text-[#D25026] italic uppercase leading-none mt-1">
                                                        Rp {new Intl.NumberFormat('id-ID').format(m.harga || 150000)}
                                                    </span>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <div className="text-[11px] text-neutral-400 italic p-3 text-center">
                                            Tidak ada bahan baku
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
