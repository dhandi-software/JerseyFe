import { PackageOpen, SearchX, RotateCcw, AlertCircle } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface CategoryEmptyStateProps {
    type: "no-data" | "not-found" | "error";
    searchQuery?: string;
    errorMessage?: string | null;
    onReset?: () => void;
    onRetry?: () => void;
    className?: string;
}

export function CategoryEmptyState({
    type,
    searchQuery,
    errorMessage,
    onReset,
    onRetry,
    className,
}: CategoryEmptyStateProps) {
    if (type === "error") {
        return (
            <div
                className={cn(
                    "w-full py-16 md:py-20 px-6 bg-white rounded-3xl border border-rose-200 shadow-xs flex flex-col items-center justify-center text-center gap-4",
                    className,
                )}
            >
                <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
                    <AlertCircle className="w-8 h-8 stroke-[1.75]" />
                </div>
                <div className="space-y-1.5 max-w-md">
                    <h3 className="text-lg md:text-xl font-extrabold text-slate-900 uppercase tracking-tight">
                        Gagal Memuat Katalog Bahan
                    </h3>
                    <p className="text-xs md:text-sm font-medium text-slate-600 leading-relaxed">
                        {errorMessage ||
                            "Terjadi gangguan saat mengambil daftar bahan dari server. Silakan muat ulang halaman."}
                    </p>
                </div>
                {onRetry && (
                    <Button
                        type="button"
                        onClick={onRetry}
                        className="mt-2 min-h-[44px] px-6 rounded-xl text-xs font-extrabold uppercase tracking-wider bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-2 cursor-pointer transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                    >
                        <RotateCcw className="w-4 h-4" />
                        <span>Muat Ulang Data</span>
                    </Button>
                )}
            </div>
        );
    }

    if (type === "no-data") {
        return (
            <div
                className={cn(
                    "w-full py-20 md:py-24 px-6 bg-white rounded-3xl border border-dashed border-slate-300 shadow-xs flex flex-col items-center justify-center text-center gap-5",
                    className,
                )}
            >
                <div className="w-20 h-20 rounded-3xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                    <PackageOpen className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div className="space-y-2 max-w-md">
                    <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 uppercase tracking-tight">
                        Belum Ada Produk Katalog
                    </h3>
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                        Saat ini belum ada produk atau bahan jersey yang dibuat oleh admin. Produk akan tampil secara otomatis di halaman ini setelah admin menambahkannya melalui panel manajemen bahan.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "w-full py-16 md:py-20 px-6 bg-white rounded-3xl border border-dashed border-slate-300 shadow-xs flex flex-col items-center justify-center text-center gap-4",
                className,
            )}
        >
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600">
                <SearchX className="w-8 h-8 stroke-[1.75]" />
            </div>
            <div className="space-y-1.5 max-w-md">
                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 uppercase tracking-tight">
                    Bahan Tidak Ditemukan
                </h3>
                <p className="text-xs md:text-sm font-medium text-slate-600 leading-relaxed">
                    {searchQuery ? (
                        <>
                            Tidak ada produk bahan yang cocok dengan kata kunci{" "}
                            <span className="font-bold text-slate-900">
                                &ldquo;{searchQuery}&rdquo;
                            </span>
                            .
                        </>
                    ) : (
                        "Tidak ada produk bahan yang sesuai dengan kriteria kategori yang dipilih."
                    )}
                </p>
            </div>
            {onReset && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onReset}
                    className="mt-2 min-h-[44px] px-6 rounded-xl text-xs font-extrabold uppercase tracking-wider border-slate-300 text-slate-800 hover:bg-slate-100 flex items-center gap-2 cursor-pointer transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Pencarian</span>
                </Button>
            )}
        </div>
    );
}
