import { Link, useLocation } from "react-router";
import { cn } from "~/lib/utils";

export function NavbarMobile() {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const activeStyle = "text-orange-600 border-b-2 border-orange-600 whitespace-nowrap";
    const inactiveStyle = "text-neutral-500 whitespace-nowrap hover:text-black transition-colors";

    const links = [
        { href: "/", label: "Home" },
        { href: "/category", label: "Koleksi Jersey" },
        { href: "/about", label: "Tentang Kami" },
        { href: "/visi-misi", label: "Visi & Misi" },
        { href: "/tracking", label: "Lacak Pesanan" },
    ];

    return (
        <div className="w-full overflow-x-auto border-b bg-white border-neutral-100 scrollbar-hide px-4 font-['Inter']">
            <div className="flex items-center gap-6 py-1">
                {links.map((link) => (
                    <Link 
                        key={link.href} 
                        to={link.href}
                        className={cn(
                            "py-3 text-[0.875rem] font-bold transition-all",
                            isActive(link.href) ? activeStyle : inactiveStyle
                        )}
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </div>
    );
}
