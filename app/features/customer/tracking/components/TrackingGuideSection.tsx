import {
    Eye,
    FileText,
    HelpCircle,
    Loader2,
    MessageCircle,
    Scissors,
    Search,
} from "lucide-react";
import type { TrackingGuideSectionProps, TrackingHeroHeaderProps } from "~/types";

export function TrackingHeroHeader({
    orderId,
    onOrderIdChange,
    loading,
    onSearch,
    variant = "desktop",
}: TrackingHeroHeaderProps) {
    if (variant === "mobile") {
        return (
            <div className="bg-[#F4F6F8] border-b border-slate-200/80 pt-6 pb-6 px-4 relative overflow-hidden w-full">
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px] opacity-70 pointer-events-none" />

                <div className="relative z-10 space-y-3 w-full">
                    <div className="inline-block bg-[#EFD33D] text-[#191C1F] text-xs font-black px-3 py-1 rounded uppercase tracking-wider shadow-xs">
                        HELP CENTER
                    </div>
                    <h1 className="text-2xl font-black text-[#191C1F] tracking-tight leading-tight">
                        How we can help you!
                    </h1>
                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        Lacak status pembuatan jersey custom FCSV secara real-time
                    </p>

                    <form onSubmit={onSearch} className="w-full pt-1">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-1.5 flex items-center gap-2 focus-within:ring-2 focus-within:ring-[#2DA5F3] focus-within:border-transparent transition-all">
                            <Search className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => onOrderIdChange(e.target.value.toUpperCase())}
                                placeholder="Masukkan Tracking ID (JK-XXXXXX)"
                                className="flex-1 bg-transparent border-none text-slate-800 text-sm font-bold placeholder:text-slate-400 focus:outline-none focus:ring-0 px-1 uppercase tracking-wider"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                aria-label="Search"
                                className="h-10 px-4 bg-[#2DA5F3] hover:bg-[#1E94E0] text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center shrink-0 shadow-xs active:scale-95 cursor-pointer transition-all disabled:opacity-70"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <span>SEARCH</span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="pt-2 w-full">
                        <div className="w-full rounded-2xl overflow-hidden border border-slate-200/80 bg-white shadow-xs">
                            <img
                                src="/images/FCSV_Jersey.webp"
                                alt="FCSV Customer Support & Tracking"
                                className="w-full h-44 object-cover object-center"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full bg-[#F4F6F8] border-b border-slate-200/80 pt-12 pb-14 px-8 lg:px-16 xl:px-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-70 pointer-events-none" />

            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center relative z-10">
                <div className="lg:col-span-7 w-full min-w-0 space-y-5">
                    <div className="inline-block bg-[#EFD33D] text-[#191C1F] text-xs font-black px-3.5 py-1.5 rounded uppercase tracking-wider shadow-xs">
                        HELP CENTER
                    </div>
                    <h1 className="text-4xl lg:text-5xl xl:text-6xl font-black text-[#191C1F] tracking-tight leading-tight">
                        How we can help you!
                    </h1>
                    <p className="text-slate-600 font-medium text-base leading-relaxed w-full">
                        Lacak status progres produksi dan pengiriman jersey custom FCSV Anda secara real-time dengan memasukkan Tracking ID.
                    </p>

                    <form onSubmit={onSearch} className="w-full pt-2">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-2 flex items-center gap-3 w-full focus-within:ring-2 focus-within:ring-[#2DA5F3] focus-within:border-transparent transition-all">
                            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
                            <input
                                type="text"
                                value={orderId}
                                onChange={(e) => onOrderIdChange(e.target.value.toUpperCase())}
                                placeholder="Masukkan Tracking ID (Contoh: JK-XXXXXX)..."
                                className="flex-1 bg-transparent border-none text-slate-800 text-base font-bold placeholder:text-slate-400 focus:outline-none focus:ring-0 px-2 uppercase tracking-wider"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#2DA5F3] hover:bg-[#1E94E0] active:scale-95 transition-all text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider shrink-0 flex items-center justify-center gap-2 shadow-sm cursor-pointer disabled:opacity-70"
                            >
                                {loading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <span>SEARCH</span>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-5 w-full min-w-0 flex justify-center lg:justify-end items-center relative">
                    <div className="relative w-full max-w-[500px]">
                        <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-16 h-28 bg-[radial-gradient(#94a3b8_2px,transparent_2px)] [background-size:12px_12px] opacity-40 pointer-events-none hidden sm:block" />
                        <img
                            src="/images/FCSV_Jersey.webp"
                            alt="FCSV Customer Support & Tracking"
                            className="w-full h-auto max-h-[380px] lg:max-h-[420px] object-contain drop-shadow-xl rounded-2xl"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function TrackingGuideSection({
    stages,
    variant = "desktop",
}: TrackingGuideSectionProps) {
    if (variant === "mobile") {
        return (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 w-full">
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm w-full">
                    <div className="text-center mb-4">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#D25026] block mb-1">
                            Panduan Singkat
                        </span>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight leading-snug">
                            3 Langkah Cek Pesanan
                        </h2>
                        <p className="text-slate-500 text-xs font-medium mt-1">
                            Ketahui progres pembuatan jersey custom Anda kapan saja.
                        </p>
                    </div>

                    <div className="space-y-2.5">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#D25026]/10 text-[#D25026] flex items-center justify-center font-bold shrink-0">
                                <FileText size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="text-sm font-bold text-slate-900">
                                        1. Cek Kode ID
                                    </h3>
                                    <span className="text-xs font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">
                                        JK-XXXXXX
                                    </span>
                                </div>
                                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                                    Lihat nomor tracking pada nota fisik atau konfirmasi chat admin FCSV.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                                <Search size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-slate-900">
                                    2. Masukkan ID & Lacak
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                                    Ketik kode di kolom atas lalu tekan tombol cari untuk memuat status terkini.
                                </p>
                            </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
                                <Eye size={18} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-bold text-slate-900">
                                    3. Pantau & Setujui
                                </h3>
                                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                                    Tinjau foto produksi, preview desain 3D, dan konfirmasi persetujuan mockup.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm w-full">
                    <div className="mb-3.5">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-[#D25026] block mb-1">
                            Alur Produksi
                        </span>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">
                            6 Tahapan Pengerjaan
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        {stages.map((stage, idx) => {
                            const Icon = stage.icon;
                            return (
                                <div
                                    key={stage.id}
                                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-[#D25026]">
                                            <Icon size={16} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-400">
                                            0{idx + 1}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                            {stage.label}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                                            {stage.id === "MENUNGGU" && "Cek DP & order"}
                                            {stage.id === "DESAIN" && "Mockup 3D"}
                                            {stage.id === "LAYOUT" && "Pola ukuran"}
                                            {stage.id === "PRINT" && "Cetak sublim"}
                                            {stage.id === "FINISHING" && "Jahit & QC"}
                                            {stage.id === "SELESAI" && "Siap kirim"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-slate-900 p-5 rounded-2xl text-white w-full space-y-4">
                    <div>
                        <span className="text-xs font-black uppercase tracking-[0.2em] text-[#D25026] block mb-1">
                            Kualitas Terjamin
                        </span>
                        <h3 className="text-lg font-black text-white tracking-tight">
                            Standar Produksi FCSV
                        </h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2.5 text-sm text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                            <span>Kain Dryfit Premium berdaya serap tinggi</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                            <span>Tinta cetak sublimasi tajam dan anti luntur</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-sm text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0" />
                            <span>QC inspeksi jahitan rapi dan presisi ukuran</span>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-2">
                        <a
                            href="https://wa.me/6285892720034?text=Halo%20Admin%20FCSV%2C%20saya%20ingin%20menanyakan%20status%20pesanan%20jersey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-11 bg-[#D25026] hover:bg-[#B3411A] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-sm cursor-pointer"
                        >
                            <MessageCircle size={15} />
                            <span>Bantuan CS via WhatsApp</span>
                        </a>
                        <a
                            href="/faq"
                            className="w-full h-11 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
                        >
                            <span>Pusat Bantuan & FAQ</span>
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-500 w-full mx-auto">
            <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-slate-150 shadow-2xl shadow-slate-200/60">
                <div className="text-center w-full mb-12">
                    <span className="text-xs font-black uppercase tracking-[0.25em] text-[#D25026] block mb-2">
                        Cara Kerja Sistem Pelacakan
                    </span>
                    <h2 className="text-3xl font-black italic uppercase tracking-tight text-slate-900">
                        3 Langkah Mudah Cek Status Jersey
                    </h2>
                    <p className="text-slate-500 text-base font-medium mt-2 leading-relaxed">
                        Pantau setiap progres produksi jersey custom Anda secara transparan dan akurat.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#D25026]/40 transition-all flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-[#D25026]/10 text-[#D25026] flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                                    <FileText size={22} />
                                </div>
                                <span className="text-3xl font-black italic text-slate-300 font-mono">
                                    01
                                </span>
                            </div>
                            <h3 className="text-xl font-black uppercase italic tracking-tight text-slate-900 mb-2">
                                Cek ID Pesanan
                            </h3>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                Dapatkan kode tracking berformat{" "}
                                <span className="font-mono font-bold text-slate-900">JK-XXXXXX</span>{" "}
                                yang tercantum pada nota pemesanan atau konfirmasi pesan WhatsApp Anda.
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-slate-500">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Format kode resmi FCSV
                        </div>
                    </div>

                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#D25026]/40 transition-all flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                                    <Search size={22} />
                                </div>
                                <span className="text-3xl font-black italic text-slate-300 font-mono">
                                    02
                                </span>
                            </div>
                            <h3 className="text-xl font-black uppercase italic tracking-tight text-slate-900 mb-2">
                                Ketik & Cari
                            </h3>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                Ketikkan ID pesanan pada kolom pencarian di atas, lalu klik tombol{" "}
                                <strong className="text-slate-900">Lacak</strong> untuk memuat data pengerjaan terkini.
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-slate-500">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            Pencarian instan real-time
                        </div>
                    </div>

                    <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-[#D25026]/40 transition-all flex flex-col justify-between group">
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black group-hover:scale-110 transition-transform">
                                    <Eye size={22} />
                                </div>
                                <span className="text-3xl font-black italic text-slate-300 font-mono">
                                    03
                                </span>
                            </div>
                            <h3 className="text-xl font-black uppercase italic tracking-tight text-slate-900 mb-2">
                                Pantau & Setujui
                            </h3>
                            <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                Lihat status tahapan pengerjaan, tinjau mockup desain 3D, ajukan revisi, atau konfirmasi persetujuan desain langsung di halaman ini.
                            </p>
                        </div>
                        <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center gap-2 text-xs font-bold text-slate-500">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Fitur approval mandiri
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-10 md:p-12 rounded-[3rem] border border-slate-150 shadow-2xl shadow-slate-200/60">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-10 pb-6 border-b border-slate-100">
                    <div className="md:col-span-7">
                        <span className="text-xs font-black uppercase tracking-[0.25em] text-[#D25026] block mb-2">
                            Alur Workshop FCSV
                        </span>
                        <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tight text-slate-900">
                            6 Tahap Produksi Jersey Custom
                        </h2>
                    </div>
                    <div className="md:col-span-5 md:text-right">
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Setiap pesanan melewati standar operasional ketat untuk menjamin presisi warna, ukuran, dan kenyamanan kain saat digunakan bertanding.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {stages.map((stage, idx) => {
                        const Icon = stage.icon;
                        return (
                            <div
                                key={stage.id}
                                className="p-6 rounded-2xl bg-slate-50 border border-slate-100/80 hover:bg-white hover:border-[#D25026]/30 transition-all flex items-start gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 text-[#D25026] shadow-sm">
                                    <Icon size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-black uppercase tracking-wider text-[#D25026] bg-[#D25026]/10 px-2.5 py-0.5 rounded-full font-mono">
                                            Tahap 0{idx + 1}
                                        </span>
                                        <h4 className="text-base font-black text-slate-900 uppercase italic">
                                            {stage.label}
                                        </h4>
                                    </div>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                                        {stage.id === "MENUNGGU" &&
                                            "Verifikasi kelengkapan DP dan daftar pemain oleh tim admin."}
                                        {stage.id === "DESAIN" &&
                                            "Pembuatan mockup visual jersey 3D dan proses approval customer."}
                                        {stage.id === "LAYOUT" &&
                                            "Penataan file pola potong, nomor punggung, dan size chart jersey."}
                                        {stage.id === "PRINT" &&
                                            "Pencetakan tinta sublimasi berkualitas tinggi ke atas kain jersey."}
                                        {stage.id === "FINISHING" &&
                                            "Proses penjahitan presisi, obras, pembersihan benang, dan QC."}
                                        {stage.id === "SELESAI" &&
                                            "Pengepakan eksklusif siap diambil di workshop atau dikirimkan."}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
                    <div className="relative z-10 space-y-4">
                        <span className="text-xs font-black uppercase tracking-[0.25em] text-[#D25026]">
                            Standar Produksi Terpercaya
                        </span>
                        <h3 className="text-2xl font-black italic uppercase tracking-tight">
                            Komitmen Kualitas FCSV Apparel
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                <div className="text-emerald-400 font-black text-xl mb-1">100%</div>
                                <div className="text-sm font-bold text-white uppercase">
                                    Kain Original
                                </div>
                                <div className="text-xs text-slate-300 mt-1">
                                    Dryfit Milano, Brazil, & Serena premium.
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                <div className="text-amber-400 font-black text-xl mb-1">
                                    HD Print
                                </div>
                                <div className="text-sm font-bold text-white uppercase">
                                    Tinta Anti Luntur
                                </div>
                                <div className="text-xs text-slate-300 mt-1">
                                    Warna tajam beresolusi tinggi dan tahan cuci.
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                                <div className="text-blue-400 font-black text-xl mb-1">
                                    QC Ketat
                                </div>
                                <div className="text-sm font-bold text-white uppercase">
                                    Jahitan Rapi
                                </div>
                                <div className="text-xs text-slate-300 mt-1">
                                    Pemeriksaan detail ukuran sebelum dikemas.
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                        <Scissors size={240} />
                    </div>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-150 shadow-2xl shadow-slate-200/60 flex flex-col justify-between">
                    <div>
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#D25026] flex items-center justify-center font-black mb-4">
                            <HelpCircle size={24} />
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tight text-slate-900 mb-2">
                            Lupa ID Pesanan?
                        </h3>
                        <p className="text-sm text-slate-600 font-medium leading-relaxed">
                            Jika Anda kehilangan nota atau membutuhkan konfirmasi status pesanan, tim layanan pelanggan kami siap membantu memeriksa data Anda.
                        </p>
                    </div>

                    <div className="mt-8 space-y-3">
                        <a
                            href="https://wa.me/6285892720034?text=Halo%20Admin%20FCSV%2C%20saya%20ingin%20menanyakan%20status%20pesanan%20jersey"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full bg-[#D25026] hover:bg-[#B34320] text-slate-900 font-black uppercase italic text-xs tracking-wider py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                        >
                            <MessageCircle size={16} />
                            Bantuan WhatsApp
                        </a>
                        <a
                            href="/faq"
                            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold uppercase text-xs tracking-wider py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all"
                        >
                            Bantuan & FAQ
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
