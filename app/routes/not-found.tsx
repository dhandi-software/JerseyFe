import { Link } from "react-router";
import { Home, Compass } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center font-sans">
            <div className="w-20 h-20 bg-orange-100 text-[#D25026] rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                <span className="text-3xl font-black">404</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">Halaman Tidak Ditemukan</h1>
            <p className="text-slate-500 text-sm max-w-md mb-8">
                Halaman yang Anda tuju tidak tersedia atau tautan yang dimasukkan salah.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 bg-[#D25026] hover:bg-[#B34320] text-slate-900 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
                >
                    <Home className="w-4 h-4" />
                    <span>Kembali ke Beranda</span>
                </Link>
                <Link
                    to="/tracking"
                    className="inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
                >
                    <Compass className="w-4 h-4 text-[#D25026]" />
                    <span>Lacak Pesanan</span>
                </Link>
            </div>
        </div>
    );
}

