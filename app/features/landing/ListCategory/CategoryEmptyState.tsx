import { PackageOpen, SearchX, RotateCcw } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

interface CategoryEmptyStateProps {
    type: "no-data" | "not-found";
    searchQuery?: string;
    onReset?: () => void;
    className?: string;
}

export function CategoryEmptyState({
    type,
    searchQuery,
    onReset,
    className
}: CategoryEmptyStateProps) {
    if (type === "no-data") {
        return (
            <div
                className={cn(
                    "w-full py-20 md:py-24 px-6 bg-white rounded-[2.5rem] border border-dashed border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center gap-5",
                    className
                )}
            >
                <div className="w-20 h-20 rounded-3xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 shadow-inner">
                    <PackageOpen className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div className="space-y-2 max-w-md">
                    <h3 className="text-xl md:text-2xl font-black text-neutral-900 uppercase italic tracking-tighter">
                        Belum Ada Bahan Baju
                    </h3>
                    <p className="text-sm font-medium text-neutral-500 leading-relaxed">
                        Data bahan jersey belum ditambahkan oleh administrator. Data produk akan tampil secara otomatis setelah diinput melalui panel admin.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "w-full py-16 md:py-20 px-6 bg-white rounded-[2.5rem] border border-dashed border-neutral-200/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center gap-4",
                className
            )}
        >
            <div className="w-16 h-16 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-400 shadow-inner">
                <SearchX className="w-8 h-8 stroke-[1.75]" />
            </div>
            <div className="space-y-1.5 max-w-md">
                <h3 className="text-lg md:text-xl font-black text-neutral-900 uppercase italic tracking-tighter">
                    Bahan Tidak Ditemukan
                </h3>
                <p className="text-xs md:text-sm font-medium text-neutral-500 leading-relaxed">
                    {searchQuery ? (
                        <>Tidak ada bahan yang cocok dengan kata kunci <span className="font-bold text-neutral-800">"{searchQuery}"</span>.</>
                    ) : (
                        "Tidak ada bahan yang sesuai dengan kriteria filter yang dipilih."
                    )}
                </p>
            </div>
            {onReset && (
                <Button
                    type="button"
                    variant="outline"
                    onClick={onReset}
                    className="mt-2 h-11 px-6 rounded-xl text-xs font-black uppercase italic tracking-wider border-neutral-200 text-neutral-800 hover:bg-neutral-50 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset Pencarian
                </Button>
            )}
        </div>
    );
}
