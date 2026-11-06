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
        formatPrice,
    } = useAbout();

    return (
        <div className="w-full bg-[#F8F9FB] text-slate-900 py-8 font-sans">
            <div className="container mx-auto px-4 md:px-6 max-w-[1440px] space-y-8">
                {/* Section 1: Hero Banner */}
                <section
                    aria-label="Profil FCSV Apparel Indonesia"
                    className="w-full rounded-[28px] overflow-hidden bg-gradient-to-r from-[#240B36] via-[#43125F] to-[#6A1B9A] text-white"
                >
                    <div className="pl-8 lg:pl-12 pr-6 lg:pr-10 pt-9 pb-9 lg:pb-0 flex flex-col lg:flex-row items-center lg:items-stretch justify-between gap-8">
                        <div className="flex-1 min-w-0 flex flex-col justify-between lg:pb-10 gap-6">
                            <div className="space-y-4 max-w-[680px]">
                                <div className="inline-flex flex-wrap items-center gap-2 text-xs font-semibold text-purple-200">
                                    <span>{companyProfile.tagline}</span>
                                    <span aria-hidden="true" className="text-white/40">
                                        •
                                    </span>
                                    <span>Konveksi & Sublimasi Jersey Olahraga</span>
                                </div>

                                <h1 className="text-3xl xl:text-[36px] font-extrabold tracking-tight leading-[1.2] text-white">
                                    Konveksi Custom Jersey untuk Tim, Komunitas, dan Instansi
                                </h1>

                                <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-[62ch]">
                                    {companyProfile.summaryQuote}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 pt-1">
                                <Link
                                    to="/customer/custom-jersey"
                                    className="min-h-[46px] px-6 py-2.5 rounded-xl bg-[#D25026] hover:bg-[#B8431E] text-white text-sm font-bold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    Buat Pesanan Custom
                                </Link>
                                <Link
                                    to="/category"
                                    className="min-h-[46px] px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-sm font-semibold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                                >
                                    Lihat Katalog Bahan
                                </Link>
                            </div>
                        </div>

                        <div className="relative w-full max-w-[340px] xl:max-w-[380px] shrink-0 flex items-end justify-center self-end">
                            <img
                                src={companyProfile.heroImage}
                                alt="Koleksi Jersey FCSV Apparel Indonesia"
                                className="w-full h-auto max-h-[320px] object-contain object-bottom select-none"
                                loading="eager"
                            />
                        </div>
                    </div>
                </section>

                {/* Section 2: Cerita Perusahaan & Alur Pengerjaan */}
                <section
                    aria-label="Tentang Perusahaan dan Alur Produksi"
                    className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch"
                >
                    {/* Left Column (7 cols): Cerita & Spesifikasi Layanan */}
                    <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-7 lg:p-9 flex flex-col justify-between gap-8 min-w-0">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                                Tentang FCSV Apparel
                            </h2>

                            <div className="space-y-3.5 text-[15px] text-slate-700 leading-relaxed max-w-[65ch]">
                                <p>{companyProfile.servicesDescription}</p>
                                <p>{companyProfile.qualityCommitment}</p>
                                <p className="text-slate-800 font-medium">
                                    Bagi kami, seragam olahraga bukan sekadar pakaian bertanding, melainkan identitas dan kebanggaan setiap anggota tim saat turun ke lapangan.
                                </p>
                            </div>
                        </div>

                        <dl className="divide-y divide-slate-200/80 border-t border-slate-200/80 pt-2">
                            {serviceSpecs.map((spec) => (
                                <div
                                    key={spec.label}
                                    className="py-3 grid grid-cols-1 sm:grid-cols-12 gap-1 sm:gap-4 text-sm"
                                >
                                    <dt className="sm:col-span-4 font-bold text-slate-900">
                                        {spec.label}
                                    </dt>
                                    <dd className="sm:col-span-8 text-slate-600">
                                        {spec.value}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {/* Right Column (5 cols): 5 Tahap Pengerjaan di Workshop */}
                    <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-7 lg:p-9 flex flex-col justify-between gap-6 min-w-0">
                        <div className="space-y-1.5">
                            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                                Alur Pengerjaan di Workshop
                            </h2>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                Setiap pesanan melewati lima tahap produksi yang bisa dipantau langsung oleh pelanggan.
                            </p>
                        </div>

                        <ol className="divide-y divide-slate-200/80 border-t border-b border-slate-200/80">
                            {productionStages.map((stage) => (
                                <li
                                    key={stage.step}
                                    className="py-3.5 flex items-start gap-3.5"
                                >
                                    <span className="text-xs font-extrabold text-[#5B1D99] tabular-nums pt-0.5 shrink-0 w-6">
                                        {stage.step}.
                                    </span>
                                    <div className="space-y-0.5 min-w-0">
                                        <h3 className="text-sm font-bold text-slate-950">
                                            {stage.title}
                                        </h3>
                                        <p className="text-xs text-slate-600 leading-relaxed">
                                            {stage.description}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ol>

                        <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-slate-600">
                                Punya pesanan yang sedang diproduksi?
                            </span>
                            <Link
                                to="/tracking"
                                className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 shrink-0"
                            >
                                Cek Progres Pesanan
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Section 3: Katalog Bahan Jersey */}
                <section
                    aria-label="Katalog Bahan Jersey"
                    className="bg-white border border-slate-200/80 rounded-2xl p-7 lg:p-9 space-y-6"
                >
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200/80 pb-5">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
                                Katalog Bahan Jersey
                            </h2>
                            <p className="text-sm text-slate-600 max-w-[65ch]">
                                Pilih salah satu bahan di bawah untuk melihat tampilan serat kain, harga dasar per setelan, dan karakteristiknya.
                            </p>
                        </div>

                        <Link
                            to="/category"
                            className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-slate-900 text-xs font-bold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1D99] shrink-0"
                        >
                            Buka Halaman Katalog
                        </Link>
                    </div>

                    {loading ? (
                        <div
                            role="status"
                            aria-live="polite"
                            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch py-2"
                        >
                            <div className="lg:col-span-5 space-y-2.5">
                                {[0, 1, 2, 3].map((skeletonIdx) => (
                                    <div
                                        key={skeletonIdx}
                                        className="h-14 w-full rounded-xl bg-slate-100 animate-pulse"
                                    />
                                ))}
                            </div>
                            <div className="lg:col-span-7 h-[320px] rounded-xl bg-slate-100 animate-pulse flex items-center justify-center">
                                <span className="text-xs font-semibold text-slate-500">
                                    Memuat daftar bahan jersey...
                                </span>
                            </div>
                        </div>
                    ) : error ? (
                        <div
                            role="alert"
                            className="rounded-xl bg-red-50/70 border border-red-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                        >
                            <div className="flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-slate-950">
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
                                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold inline-flex items-center gap-2 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 shrink-0"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>Muat Ulang</span>
                            </button>
                        </div>
                    ) : materials.length === 0 ? (
                        <div className="rounded-xl bg-[#F8F9FB] border border-slate-200/80 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h3 className="text-sm font-bold text-slate-950">
                                    Belum Ada Data Bahan di Katalog
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed max-w-[60ch]">
                                    Data bahan sedang diperbarui oleh tim gudang. Anda tetap bisa memesan atau menanyakan stok bahan langsung ke admin.
                                </p>
                            </div>
                            <Link
                                to="/customer/custom-jersey"
                                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#D25026] hover:bg-[#B8431E] text-white text-xs font-bold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D25026] shrink-0"
                            >
                                Buat Pesanan Custom
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                            {/* Left Side (5 cols): Daftar Pilihan Bahan */}
                            <div className="lg:col-span-5 flex flex-col gap-2 min-w-0">
                                <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
                                    {materials.map((item, idx) => {
                                        const isSelected = idx === currentIndex;
                                        return (
                                            <button
                                                key={item.id || idx}
                                                type="button"
                                                onClick={() =>
                                                    setCurrentIndex(idx)
                                                }
                                                className={`w-full min-h-[54px] px-4 py-3 rounded-xl border text-left transition-colors duration-150 cursor-pointer flex items-center justify-between gap-3 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1D99] ${
                                                    isSelected
                                                        ? "bg-[#240B36] text-white border-[#240B36]"
                                                        : "bg-[#F8F9FB] hover:bg-slate-100 text-slate-900 border-slate-200/80"
                                                }`}
                                            >
                                                <div className="min-w-0">
                                                    <p
                                                        className={`text-sm font-bold truncate ${
                                                            isSelected
                                                                ? "text-white"
                                                                : "text-slate-950"
                                                        }`}
                                                    >
                                                        {item.nama}
                                                    </p>
                                                    <p
                                                        className={`text-xs ${
                                                            isSelected
                                                                ? "text-purple-200"
                                                                : "text-slate-500"
                                                        }`}
                                                    >
                                                        {item.status || "Tersedia"}
                                                    </p>
                                                </div>

                                                <span
                                                    className={`text-sm font-extrabold tabular-nums shrink-0 ${
                                                        isSelected
                                                            ? "text-white"
                                                            : "text-[#D25026]"
                                                    }`}
                                                >
                                                    Rp {formatPrice(item.harga)}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>

                                {materials.length > 1 && (
                                    <div className="flex items-center justify-between gap-2 pt-2">
                                        <button
                                            type="button"
                                            onClick={handlePrev}
                                            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1D99]"
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
                                            className="min-h-[44px] px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-800 text-xs font-bold inline-flex items-center gap-1.5 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1D99]"
                                        >
                                            <span>Selanjutnya</span>
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Right Side (7 cols): Detail Bahan Terpilih */}
                            {currentItem && (
                                <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-12 gap-6 items-center min-w-0 lg:pl-4 lg:border-l lg:border-slate-200/80">
                                    <div className="md:col-span-6 aspect-square w-full rounded-xl bg-[#F8F9FB] border border-slate-200/80 overflow-hidden flex items-center justify-center p-4">
                                        {currentImageSrc ? (
                                            <img
                                                src={currentImageSrc}
                                                alt={currentItem.nama}
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center gap-2 text-slate-400 p-6 text-center">
                                                <Layers className="w-8 h-8 text-slate-400" />
                                                <span className="text-xs font-medium text-slate-500">
                                                    Foto kain belum tersedia
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="md:col-span-6 flex flex-col justify-between gap-5 min-w-0">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between gap-2">
                                                <span className="text-xs font-semibold text-slate-500">
                                                    Status: {currentItem.status || "Tersedia"}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-extrabold text-slate-950 tracking-tight">
                                                {currentItem.nama}
                                            </h3>

                                            <div className="pb-3 border-b border-slate-200/80">
                                                <span className="text-2xl font-extrabold text-[#D25026] tabular-nums">
                                                    Rp {formattedCurrentPrice}
                                                </span>
                                                <span className="text-xs text-slate-500 ml-1.5">
                                                    / setelan dasar
                                                </span>
                                            </div>

                                            <p className="text-sm text-slate-600 leading-relaxed">
                                                {currentItem.deskripsi &&
                                                currentItem.deskripsi.trim().length > 0
                                                    ? currentItem.deskripsi
                                                    : "Kain dryfit pilihan dengan pori sirkulasi udara yang adem di kulit serta mendukung hasil press sublimasi warna pekat."}
                                            </p>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-3 pt-1">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    navigate(currentProductHref)
                                                }
                                                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#D25026] hover:bg-[#B8431E] text-white text-xs font-bold inline-flex items-center justify-center transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D25026]"
                                            >
                                                Lihat Detail Bahan
                                            </button>
                                            <Link
                                                to="/customer/custom-jersey"
                                                className="min-h-[44px] px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1D99]"
                                            >
                                                Pesan dengan Bahan Ini
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {/* Section 4: Lokasi Workshop & Kontak (#lokasi-workshop) */}
                <section
                    id="lokasi-workshop"
                    aria-label="Lokasi Workshop dan Kontak FCSV Apparel"
                    className="bg-white border border-slate-200/80 rounded-2xl p-7 lg:p-9"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        <div className="lg:col-span-5 space-y-2 min-w-0">
                            <div className="flex items-center gap-2 text-slate-900">
                                <MapPin className="w-4 h-4 text-[#5B1D99] shrink-0" />
                                <h2 className="text-lg font-extrabold tracking-tight">
                                    Workshop & Produksi FCSV Apparel
                                </h2>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed pl-6">
                                {companyProfile.workshopAddress}
                            </p>
                        </div>

                        <div className="lg:col-span-4 space-y-3 lg:border-l lg:border-slate-200/80 lg:pl-8 min-w-0">
                            <div className="flex items-start gap-2.5">
                                <Clock className="w-4 h-4 text-[#5B1D99] shrink-0 mt-0.5" />
                                <div className="text-sm">
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
                                <div className="text-sm">
                                    <span className="font-bold text-slate-900">
                                        WhatsApp Admin:{" "}
                                    </span>
                                    <span className="text-slate-600">
                                        +62 858-9272-0034
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3 flex flex-wrap lg:flex-col justify-end gap-2.5 min-w-0">
                            <a
                                href="https://wa.me/6285892720034"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#D25026] hover:bg-[#B8431E] text-white text-xs font-bold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D25026]"
                            >
                                Tanya Admin via WhatsApp
                            </a>
                            <Link
                                to="/visi-misi"
                                className="min-h-[44px] px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs font-semibold inline-flex items-center justify-center transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B1D99]"
                            >
                                Lihat Visi & Misi
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
