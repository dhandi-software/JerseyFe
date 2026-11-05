import { Link } from "react-router";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { SOCIAL_LINKS } from "~/config/socialLinks";

export default function NewFooter() {
    return (
        <footer className="w-full bg-white border-t border-zinc-200 py-12">
            <div className="container mx-auto px-4 md:px-6 flex flex-col gap-12">
                {/* Top Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="bg-slate-900 p-2 rounded-lg shadow-sm">
                            <img
                                src="/images/FCSV.png"
                                alt="Logo FCSV"
                                className="h-8 w-auto"
                            />
                        </div>
                        <span className="text-xl font-bold text-zinc-950">
                            FCSV
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-8 text-sm font-medium text-gray-500">
                        <Link
                            to="/about"
                            className="hover:text-orange-500 transition-colors"
                        >
                            About Us
                        </Link>
                        <Link
                            to="/contact"
                            className="hover:text-orange-500 transition-colors"
                        >
                            Contact
                        </Link>
                        <Link
                            to="/privacy"
                            className="hover:text-orange-500 transition-colors"
                        >
                            Terms & Privacy
                        </Link>
                    </div>
                </div>

                {/* Partners/Copyright Section */}
                <div className="flex flex-col md:flex-row justify-between items-end border-t border-zinc-100 pt-8 gap-6">
                    <div className="text-xs text-gray-400">
                        © 2026 FCSV. All
                        rights reserved.
                    </div>

                    <div className="flex flex-col items-start gap-2">
                        <span className="text-sm font-medium text-zinc-900">
                            Follow us on
                        </span>
                        <div className="flex gap-3">
                            <a
                                href={SOCIAL_LINKS.instagram.url || "https://instagram.com/fcsvapparel"}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram FCSV Apparel"
                                className="w-11 h-11 md:w-9 md:h-9 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-orange-100 hover:text-orange-600 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none text-zinc-700"
                            >
                                <Instagram className="w-5 h-5 md:w-4 md:h-4" />
                            </a>
                            <a
                                href={SOCIAL_LINKS.facebook.url || "https://facebook.com/fcsvapparel"}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook FCSV Apparel"
                                className="w-11 h-11 md:w-9 md:h-9 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-orange-100 hover:text-orange-600 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none text-zinc-700"
                            >
                                <Facebook className="w-5 h-5 md:w-4 md:h-4" />
                            </a>
                            <a
                                href={SOCIAL_LINKS.twitter.url || "https://x.com/fcsvapparel"}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Twitter FCSV Apparel"
                                className="w-11 h-11 md:w-9 md:h-9 rounded-lg bg-slate-50 flex items-center justify-center hover:bg-orange-100 hover:text-orange-600 transition-colors focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:outline-none text-zinc-700"
                            >
                                <Twitter className="w-5 h-5 md:w-4 md:h-4" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
