import { Link } from "react-router";
import { MapPin } from "lucide-react";
import type { HomeCompanyStorySectionProps } from "~/types";

const SERVICE_LIST = [
    "Sepak Bola",
    "Futsal",
    "Basket",
    "Voli",
    "Badminton",
    "Running",
    "Esport",
];

export function HomeCompanyProfileBanner({
    companyProfile,
    variant = "desktop",
}: HomeCompanyStorySectionProps) {
    const isMobile = variant === "mobile";

    return (
        <section
            aria-label="Profil Perusahaan FCSV Apparel"
            className="w-full bg-white border border-slate-200/80 rounded-2xl p-6 sm:p-8 lg:px-10 lg:py-9"
        >
            <div
                className={
                    isMobile
                        ? "flex flex-col gap-6"
                        : "grid grid-cols-1 lg:grid-cols-[7fr_3fr] gap-8 lg:gap-12 items-start"
                }
            >
                {/* Kolom Kiri (70%): Tentang Perusahaan */}
                <div className="w-full space-y-4 min-w-0">
                    <div className="w-full space-y-1.5">
                        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#5B1D99]">
                            TENTANG FCSV APPAREL
                        </p>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight leading-snug">
                            Jersey Custom untuk Tim dan Komunitas
                        </h2>
                    </div>

                    <div className="w-full space-y-2.5">
                        <p className="w-full text-sm sm:text-[15px] font-medium text-slate-800 leading-relaxed">
                            {companyProfile.summaryQuote}
                        </p>
                        <p className="w-full text-xs sm:text-sm text-slate-600 leading-relaxed">
                            {companyProfile.servicesDescription}{" "}
                            {companyProfile.qualityCommitment}
                        </p>
                    </div>

                    <div className="w-full pt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-[13px]">
                        <span className="font-semibold text-slate-900 mr-1">
                            Layanan:
                        </span>
                        {SERVICE_LIST.map((service, index) => (
                            <span
                                key={service}
                                className="inline-flex items-center text-slate-600 font-medium"
                            >
                                <span>{service}</span>
                                {index < SERVICE_LIST.length - 1 && (
                                    <span
                                        aria-hidden="true"
                                        className="ml-2 text-slate-300 select-none"
                                    >
                                        /
                                    </span>
                                )}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Kolom Kanan (30%): Lokasi Workshop & Produksi */}
                <div
                    className={
                        isMobile
                            ? "w-full border-t border-slate-200/80 pt-5 flex flex-col justify-between gap-4"
                            : "w-full border-t border-slate-200/80 pt-6 lg:border-t-0 lg:pt-0 lg:border-l lg:border-slate-200/80 lg:pl-8 flex flex-col justify-between gap-5 h-full"
                    }
                >
                    <div className="w-full space-y-2">
                        <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#5B1D99] shrink-0" />
                            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-900">
                                WORKSHOP & PRODUKSI
                            </span>
                        </div>
                        <p className="w-full text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                            {companyProfile.workshopAddress}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                        <Link
                            to="/about"
                            className="min-h-[44px] inline-flex items-center gap-1 text-xs sm:text-[13px] font-semibold text-[#5B1D99] hover:text-[#3B1258] underline-offset-4 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1D99] rounded-xs"
                        >
                            <span>Lihat lokasi</span>
                            <span aria-hidden="true">↗</span>
                        </Link>
                        <Link
                            to="/visi-misi"
                            className="min-h-[44px] inline-flex items-center text-xs sm:text-[13px] font-medium text-slate-600 hover:text-[#5B1D99] underline-offset-4 hover:underline transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1D99] rounded-xs"
                        >
                            Visi & Misi FCSV
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

