import { Link } from "react-router";
import { Building2, CheckCircle2, MapPin, ArrowUpRight } from "lucide-react";
import type { HomeCompanyStorySectionProps } from "~/types";

export function HomeCompanyProfileBanner({
    companyProfile,
    variant = "desktop",
}: HomeCompanyStorySectionProps) {
    const isMobile = variant === "mobile";

    return (
        <section
            aria-label="Profil Perusahaan FCSV Apparel"
            className="w-full bg-white border border-slate-200/80 rounded-3xl p-5 md:p-7 shadow-2xs"
        >
            <div
                className={
                    isMobile
                        ? "flex flex-col gap-4"
                        : "grid grid-cols-1 lg:grid-cols-12 gap-6 items-center"
                }
            >
                <div className="lg:col-span-8 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-900 text-xs font-bold">
                            <Building2 className="w-3.5 h-3.5 text-purple-700" />
                            <span>Tentang Perusahaan</span>
                        </span>
                        {companyProfile.serviceTags.map((tag) => (
                            <span
                                key={tag}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
                            >
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                <span>{tag}</span>
                            </span>
                        ))}
                    </div>

                    <p className="text-sm md:text-base font-semibold text-slate-900 leading-relaxed">
                        {companyProfile.summaryQuote}
                    </p>
                    <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                        {companyProfile.servicesDescription}{" "}
                        {companyProfile.qualityCommitment}
                    </p>
                </div>

                <div className="lg:col-span-4 bg-slate-50 border border-slate-200/70 rounded-2xl p-4 space-y-3 flex flex-col justify-between h-full">
                    <div className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-[#D25026] shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-800 block">
                                Lokasi Workshop & Produksi
                            </span>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                {companyProfile.workshopAddress}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/70">
                        <Link
                            to="/about"
                            className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-800 inline-flex items-center gap-1.5 transition-colors"
                        >
                            <span>Selengkapnya</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                            to="/visi-misi"
                            className="min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-semibold text-purple-800 hover:bg-purple-50 inline-flex items-center transition-colors"
                        >
                            Visi & Misi FCSV
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

