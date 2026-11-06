import { Link, useNavigate } from "react-router";
import {
    ChevronLeft,
    ChevronRight,
    MapPin,
    Clock,
    Phone,
    Layers,
    AlertCircle,
    RefreshCw,
} from "lucide-react";
import { useAbout } from "~/hooks";

export function AboutSection() {
    const navigate = useNavigate();
    const {
        companyProfile,
        materials,
        loading,
        error,
        currentIndex,
        currentItem,
        currentImageSrc,
        currentProductHref,
        formattedCurrentPrice,
        productionStages,
        serviceSpecs,
        setCurrentIndex,
        handleNext,
        handlePrev,
        fetchMaterials,
    } = useAbout();

    return (
        <div className="w-full bg-[#F8F9FB] text-slate-900 py-5 overflow-x-hidden font-sans">
            <div className="max-w-[640px] mx-auto px-4 space-y-5">
                {/* Section 1: Mobile Hero Banner */}
                <section
                    aria-label="Profil FCSV Apparel Indonesia"
                    className="w-full rounded-[24px] overflow-hidden bg-gradient-to-b from-[#240B36] via-[#43125F] to-[#6A1B9A] text-white p-5 space-y-5"
                >
                    <div className="space-y-3">
                        <div className="inline-flex flex-wrap items-center gap-1.5 text-xs font-semibold text-purple-200">
                            <span>{companyProfile.tagline}</span>
                            <span aria-hidden="true" className="text-white/40">
                                •
                            </span>
                            <span>Konveksi & Sublimasi</span>
                        </div>

                        <h1 className="text-2xl font-extrabold tracking-tight leading-snug text-white">
                            Konveksi Custom Jersey untuk Tim, Komunitas, dan Instansi
                        </h1>

                        <p className="text-sm text-white/90 leading-relaxed">
                            {companyProfile.summaryQuote}
                        </p>
                    </div>

                    <div className="w-full max-w-[280px] mx-auto pt-1 flex items-end justify-center">
                        <img
                            src={companyProfile.heroImage}
                            alt="Koleksi Jersey FCSV Apparel Indonesia"
                            className="w-full h-auto max-h-[220px] object-contain object-bottom select-none"
                            loading="eager"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <Link
                            to="/customer/custom-jersey"
                            className="min-h-[44px] w-full px-5 py-2.5 rounded-xl bg-[#D25026] hover:bg-[#B8431E] text-white text-xs font-bold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Buat Pesanan Custom
                        </Link>
                        <Link
                            to="/category"
                            className="min-h-[44px] w-full px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-xs font-semibold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Lihat Katalog Bahan
                        </Link>
                    </div>
                </section>

                {/* Section 2: Tentang FCSV Apparel & Spesifikasi Layanan */}
                <section
                    aria-label="Tentang FCSV Apparel"
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-5"
                >
                    <div className="space-y-3">
                        <h2 className="text-lg font-extrabold text-slate-950 tracking-tight">
                            Tentang FCSV Apparel
                        </h2>
                        <p className="text-sm text-slate-700 leading-relaxed">
                            {companyProfile.servicesDescription}
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            {companyProfile.qualityCommitment}
                        </p>
                        <p className="text-xs text-slate-800 font-medium leading-relaxed">
                            Bagi kami, seragam olahraga bukan sekadar pakaian bertanding, melainkan identitas dan kebanggaan setiap anggota tim saat turun ke lapangan.
                        </p>
                    </div>

                    <dl className="divide-y divide-slate-200/80 border-t border-slate-200/80 pt-1">
                        {serviceSpecs.map((spec) => (
                            <div
                                key={spec.label}
                                className="py-2.5 space-y-0.5 text-xs"
                            >
                                <dt className="font-bold text-slate-900">
                                    {spec.label}
                                </dt>
                                <dd className="text-slate-600 leading-relaxed">
                                    {spec.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </section>

                {/* Section 3: Alur Pengerjaan di Workshop */}
                <section
                    aria-label="Alur Pengerjaan di Workshop"
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4"
                >
                    <div className="space-y-1">
                        <h2 className="text-lg font-extrabold text-slate-950 tracking-tight">
                            Alur Pengerjaan di Workshop
                        </h2>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Setiap pesanan melewati lima tahap produksi yang bisa dipantau langsung oleh pelanggan.
                        </p>
                    </div>

                    <ol className="divide-y divide-slate-200/80 border-t border-b border-slate-200/80">
                        {productionStages.map((stage) => (
                            <li
                                key={stage.step}
                                className="py-3 flex items-start gap-3"
                            >
                                <span className="text-xs font-extrabold text-[#5B1D99] tabular-nums pt-0.5 shrink-0 w-5">
                                    {stage.step}.
                                </span>
                                <div className="space-y-0.5 min-w-0">
                                    <h3 className="text-xs font-bold text-slate-950">
                                        {stage.title}
                                    </h3>
                                    <p className="text-xs text-slate-600 leading-relaxed">
                                        {stage.description}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                        <span className="text-xs text-slate-600">
                            Punya pesanan yang sedang diproduksi?
                        </span>
                        <Link
                            to="/tracking"
                            className="min-h-[44px] w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                        >
                            Cek Progres Pesanan
                        </Link>
                    </div>
                </section>

                {/* Section 4: Katalog Bahan Jersey (Mobile) */}
                <section
                    aria-label="Katalog Bahan Jersey"
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4"
                >
                    <div className="space-y-1 border-b border-slate-200/80 pb-3.5">
                        <h2 className="text-lg font-extrabold text-slate-950 tracking-tight">
                            Katalog Bahan Jersey
                        </h2>
                        <p className="text-xs text-slate-600 leading-relaxed">
                            Pilih salah satu bahan untuk melihat tampilan serat kain, harga dasar per setelan, dan karakteristiknya.
                        </p>
                    </div>

                    {loading ? (
                        <div
                            role="status"
                            aria-live="polite"
                            className="space-y-3 py-2"
                        >
                            <div className="h-11 w-full rounded-xl bg-slate-100 animate-pulse" />
                            <div className="aspect-square w-full rounded-xl bg-slate-100 animate-pulse flex items-center justify-center">
                                <span className="text-xs font-semibold text-slate-500">
                                    Memuat daftar bahan jersey...
                                </span>
                            </div>
                        </div>
                    ) : error ? (
                        <div
                            role="alert"
                            className="rounded-xl bg-red-50/70 border border-red-200 p-4 space-y-3"
                        >
                            <div className="flex items-start gap-2.5">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h3 className="text-xs font-bold text-slate-950">
                                        Gagal Memuat Daftar Bahan
                                    </h3>
                                    <p className="text-xs text-slate-700 leading-relaxed">
                                        {error}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={fetchMaterials}
                                className="min-h-[44px] w-full px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center justify-center gap-2 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Muat Ulang</span>
                            </button>
                        </div>
                    ) : materials.length === 0 ? (
                        <div className="rounded-xl bg-[#F8F9FB] border border-slate-200/80 p-4 space-y-3">
                            <div className="space-y-1">
                                <h3 className="text-xs font-bold text-slate-950">
                                    Belum Ada Data Bahan di Katalog
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Data bahan sedang diperbarui oleh tim gudang. Anda tetap bisa memesan atau menanyakan stok bahan langsung ke admin.
                                </p>
                            </div>
                            <Link
                                to="/customer/custom-jersey"
                                className="min-h-[44px] w-full px-4 py-2.5 rounded-xl bg-[#D25026] hover:bg-[#B8431E] text-white text-xs font-bold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D25026]"
                            >
                                Buat Pesanan Custom
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Horizontal Material Selector (44px+ touch targets) */}
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                                {materials.map((item, idx) => {
                                    const isSelected = idx === currentIndex;
                                    return (
                                        <button
                                            key={item.id || idx}
                                            type="button"
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`min-h-[44px] px-3.5 py-2 rounded-xl border text-xs font-bold whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1D99] ${
                                                isSelected
                                                    ? "bg-[#240B36] text-white border-[#240B36]"
                                                    : "bg-[#F8F9FB] text-slate-800 border-slate-200/90 hover:bg-slate-100"
                                            }`}
                                        >
                                            {item.nama}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Selected Material Detail */}
                            {currentItem && (
                                <div className="space-y-4 pt-1">
                                    <div className="aspect-square w-full rounded-xl bg-[#F8F9FB] border border-slate-200/80 overflow-hidden flex items-center justify-center p-4">
                                        {currentImageSrc ? (
                                            <img
                                                src={currentImageSrc}
                                                alt={currentItem.nama}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-2 text-slate-400 p-4 text-center">
                                                <Layers className="w-7 h-7 text-slate-400" />
                                                <span className="text-xs font-medium text-slate-500">
                                                    Foto kain belum tersedia
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-baseline justify-between gap-3 border-b border-slate-200/80 pb-3">
                                            <div>
                                                <h3 className="text-base font-extrabold text-slate-950">
                                                    {currentItem.nama}
                                                </h3>
                                                <span className="text-xs text-slate-500">
                                                    Status: {currentItem.status || "Tersedia"}
                                                </span>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <span className="text-lg font-extrabold text-[#D25026] tabular-nums block">
                                                    Rp {formattedCurrentPrice}
                                                </span>
                                                <span className="text-[11px] text-slate-500">
                                                    / setelan dasar
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            {currentItem.deskripsi &&
                                            currentItem.deskripsi.trim().length > 0
                                                ? currentItem.deskripsi
                                                : "Kain dryfit pilihan dengan pori sirkulasi udara yang adem di kulit serta mendukung hasil press sublimasi warna pekat."}
                                        </p>

                                        {materials.length > 1 && (
                                            <div className="flex items-center justify-between gap-2 pt-1">
                                                <button
                                                    type="button"
                                                    onClick={handlePrev}
                                                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold inline-flex items-center justify-center gap-1 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1D99]"
                                                >
                                                    <ChevronLeft className="w-4 h-4" />
                                                    <span>Sebelumnya</span>
                                                </button>
                                                <span className="text-xs text-slate-500 tabular-nums">
                                                    {currentIndex + 1} / {materials.length}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={handleNext}
                                                    className="min-h-[44px] px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold inline-flex items-center justify-center gap-1 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1D99]"
                                                >
                                                    <span>Selanjutnya</span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(currentProductHref)
                                                }
                                                className="min-h-[44px] w-full px-4 py-2.5 rounded-xl bg-[#D25026] hover:bg-[#B8431E] text-white text-xs font-bold inline-flex items-center justify-center transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D25026]"
                                            >
                                                Lihat Detail Bahan
                                            </button>
                                            <Link
                                                to="/category"
                                                className="min-h-[44px] w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1D99]"
                                            >
                                                Buka Halaman Katalog
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Section 5: Lokasi Workshop & Kontak (#lokasi-workshop) */}
                <section
                    id="lokasi-workshop"
                    aria-label="Lokasi Workshop dan Kontak FCSV Apparel"
                    className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4"
                >
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-950">
                            <MapPin className="w-4 h-4 text-[#5B1D99] shrink-0" />
                            <h2 className="text-base font-extrabold tracking-tight">
                                Workshop & Produksi FCSV Apparel
                            </h2>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed pl-6">
                            {companyProfile.workshopAddress}
                        </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-200/80 text-xs">
                        <div className="flex items-start gap-2.5">
                            <Clock className="w-4 h-4 text-[#5B1D99] shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-slate-900">
                                    Jam Operasional:{" "}
                                </span>
                                <span className="text-slate-600">
                                    Setiap Hari, 08:00 - 21:00 WIB
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                            <Phone className="w-4 h-4 text-[#5B1D99] shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-slate-900">
                                    WhatsApp Admin:{" "}
                                </span>
                                <span className="text-slate-600">
                                    +62 858-9272-0034
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        <a
                            href="https://wa.me/6285892720034"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="min-h-[44px] w-full px-4 py-2.5 rounded-xl bg-[#D25026] hover:bg-[#B8431E] text-white text-xs font-bold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D25026]"
                        >
                            Tanya Admin via WhatsApp
                        </a>
                        <Link
                            to="/visi-misi"
                            className="min-h-[44px] w-full px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1D99]"
                        >
                            Lihat Visi & Misi
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
