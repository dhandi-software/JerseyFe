import { ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

export function NavbarDesktop() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const navLinks = [
        { href: "/category", label: "Koleksi Jersey", hasDropdown: true },
        { href: "/about", label: "Tentang Kami" },
        { href: "/visi-misi", label: "Visi & Misi" },
        { href: "/tracking", label: "Lacak Pesanan" },
        { href: "/faq", label: "Bantuan & FAQ" },
        { href: "/contact", label: "Hubungi Kami" },
    ];

    return (
        <nav className="w-full h-14 bg-[#FAFAFA] border-b border-neutral-100 flex items-center justify-center font-['Inter']">
            <div className="container mx-auto px-6 flex items-center justify-center gap-10">
                {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        to={link.href}
                        className={cn(
                            "flex items-center gap-1.5 text-[0.8125rem] font-bold tracking-wider uppercase transition-all duration-200 hover:text-[#D25026] group",
                            isActive(link.href) ? "text-[#D25026]" : "text-neutral-500"
                        )}
                    >
                        <span>{link.label}</span>
                        {link.hasDropdown && (
                            <ChevronDown className={cn(
                                "w-3.5 h-3.5 transition-transform group-hover:rotate-180",
                                isActive(link.href) ? "text-[#D25026]" : "text-neutral-300"
                            )} />
                        )}
                    </Link>
                ))}
            </div>
        </nav>
    );
}
