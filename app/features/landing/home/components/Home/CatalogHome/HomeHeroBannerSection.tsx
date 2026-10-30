import { Link } from "react-router";
import { Info, Compass } from "lucide-react";
import type { HomeHeroSectionProps } from "~/types";

export function HomeHeroBannerSection({
    companyProfile,
    totalProducts,
    variant = "desktop",
    onScrollToCatalog,
}: HomeHeroSectionProps) {
    const isMobile = variant === "mobile";

    return (
        <section
            aria-label="Hero FCSV Apparel"
            className="w-full rounded-[28px] bg-gradient-to-r from-[#240B36] via-[#43125F] to-[#6A1B9A] text-white relative overflow-hidden shadow-lg"
        >
            <div
                className={
                    isMobile
                        ? "p-5 flex flex-col gap-5 relative z-10"
                        : "pl-8 lg:pl-10 pr-4 lg:pr-8 pt-8 pb-0 flex flex-col lg:flex-row items-stretch justify-between gap-6 relative z-10"
                }
            >
                <div
                    className={
                        isMobile
                            ? "flex flex-col gap-5 w-full"
                            : "flex-1 min-w-0 flex flex-col justify-between pb-8 gap-6"
                    }
                >
                    <div className="space-y-3 w-full max-w-[720px]">
                        <div className="inline-flex flex-wrap items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/12 border border-white/15 text-xs font-semibold tracking-wide text-purple-100 w-fit">
                            <span>{companyProfile.tagline}</span>
                            <span className="text-white/40">•</span>
                            <span>{totalProducts} Koleksi Katalog Aktif</span>
                        </div>
                        <h1
                            className={
                                isMobile
                                    ? "text-2xl font-extrabold leading-snug tracking-tight text-white"
                                    : "text-3xl xl:text-[34px] font-extrabold leading-[1.22] tracking-tight text-white"
                            }
                        >
                            {companyProfile.headline}
                        </h1>
                    </div>

                    <div
                        className={
                            isMobile
                                ? "grid grid-cols-1 gap-4 w-full"
                                : "grid grid-cols-1 md:grid-cols-2 gap-5 w-full"
                        }
                    >
                        <div className="bg-white/12 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between gap-4 min-w-0">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2 text-xs text-white/75 font-medium">
                                    <span>{companyProfile.leftCard.eyebrowLeft}</span>
                                    <span className="font-semibold text-white/95">
                                        {companyProfile.leftCard.eyebrowRight}
                                    </span>
                                </div>
                                <h2 className="text-lg font-bold text-white leading-snug">
                                    {companyProfile.leftCard.title}
                                </h2>
                                <p className="text-xs text-white/85 leading-relaxed line-clamp-2">
                                    {companyProfile.leftCard.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <Link
                                    to={companyProfile.leftCard.primaryCtaHref}
                                    className="min-h-[48px] px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center text-center transition-colors shadow-xs"
                                >
                                    {companyProfile.leftCard.primaryCtaLabel}
                                </Link>
                                <Link
                                    to={companyProfile.leftCard.secondaryCtaHref}
                                    className="min-h-[48px] px-4 rounded-xl border border-white/30 bg-white/5 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 text-center transition-colors"
                                >
                                    <Info className="w-4 h-4 shrink-0 text-white/85" />
                                    <span>{companyProfile.leftCard.secondaryCtaLabel}</span>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-white/12 backdrop-blur-md border border-white/15 rounded-2xl p-5 flex flex-col justify-between gap-4 min-w-0">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between gap-2 text-xs text-white/75 font-medium">
                                    <span>{companyProfile.rightCard.eyebrowLeft}</span>
                                    <span className="font-bold tracking-wider uppercase text-[#A3E635]">
                                        {companyProfile.rightCard.eyebrowRight}
                                    </span>
                                </div>
                                <h2 className="text-lg font-bold text-white leading-snug truncate">
                                    {companyProfile.rightCard.title}
                                </h2>
                                <p className="text-xs text-white/85 leading-relaxed line-clamp-2">
                                    {companyProfile.rightCard.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <button
                                    type="button"
                                    onClick={onScrollToCatalog}
                                    className="min-h-[48px] px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 text-center transition-colors cursor-pointer shadow-xs"
                                >
                                    <Compass className="w-4 h-4 shrink-0 text-purple-900" />
                                    <span>{companyProfile.rightCard.primaryCtaLabel}</span>
                                </button>
                                <Link
                                    to={companyProfile.rightCard.secondaryCtaHref}
                                    className="min-h-[48px] px-4 rounded-xl border border-white/30 bg-white/5 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold flex items-center justify-center text-center transition-colors"
                                >
                                    {companyProfile.rightCard.secondaryCtaLabel}
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        isMobile
                            ? "relative w-full max-w-[300px] mx-auto pt-2 flex items-end justify-center"
                            : "relative w-[320px] xl:w-[360px] shrink-0 flex items-end justify-center self-end"
                    }
                >
                    <div className="absolute inset-x-3 bottom-0 aspect-square rounded-full bg-white/15 pointer-events-none" />
                    <img
                        src={companyProfile.heroImage}
                        alt="FCSV Brand Custom Jersey"
                        className="relative z-10 w-full h-auto max-h-[340px] object-contain object-bottom drop-shadow-2xl select-none"
                    />
                </div>
            </div>
        </section>
    );
}
