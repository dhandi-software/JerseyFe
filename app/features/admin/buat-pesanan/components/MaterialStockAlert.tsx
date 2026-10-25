import { Info, AlertCircle } from "lucide-react";
import type { BuatPesananProduct } from "~/types/buatPesanan";

interface MaterialStockAlertProps {
    activeProduct: BuatPesananProduct | null;
    isOverLimit: boolean;
    totalRequiredKg: number;
    availableKg: number;
    playerCount: number;
    variant?: "desktop" | "mobile";
}

export function MaterialStockAlert({
    activeProduct,
    isOverLimit,
    totalRequiredKg,
    availableKg,
    playerCount,
    variant = "desktop"
}: MaterialStockAlertProps) {
    if (!activeProduct) return null;

    if (variant === "mobile") {
        return (
            <div className="space-y-3 mb-4">
                {activeProduct.status === "Habis" && (
                    <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-[#D25026] shrink-0 mt-0.5" />
                        <div className="text-[10px] font-bold uppercase tracking-tight text-[#B34320] leading-relaxed">
                            Pemberitahuan: Bahan jersey "{activeProduct.title}" sedang tidak tersedia / habis di stok gudang. Anda tetap dapat melanjutkan pembuatan pesanan ini.
                        </div>
                    </div>
                )}

                {isOverLimit && (
                    <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        <div className="text-[10px] font-bold uppercase tracking-tight text-red-800 leading-relaxed">
                            Kebutuhan bahan baku melebihi ketersediaan di gudang! (Dibutuhkan: {totalRequiredKg.toFixed(2)} kg, Tersedia: {availableKg.toFixed(2)} kg).
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-4 mb-6">
            {activeProduct.status === "Habis" && (
                <div className="bg-orange-50 border border-orange-200 p-5 rounded-2xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-[#D25026] shrink-0 mt-0.5" />
                    <div className="text-xs font-bold uppercase tracking-tight text-[#B34320]">
                        Pemberitahuan: Bahan jersey "{activeProduct.title}" sedang tidak tersedia / habis di stok gudang. Anda tetap dapat melanjutkan pembuatan pesanan ini.
                    </div>
                </div>
            )}

            {isOverLimit && (
                <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div className="text-xs font-bold uppercase tracking-tight text-red-800">
                        Kebutuhan bahan baku melebihi ketersediaan di gudang! (Dibutuhkan: {totalRequiredKg.toFixed(2)} kg, Tersedia: {availableKg.toFixed(2)} kg).
                        <span className="block mt-1 text-[#B34320] font-extrabold normal-case">
                            Stok bahan "{activeProduct.title}" saat ini hanya cukup untuk {playerCount > 0 ? Math.floor(availableKg / (totalRequiredKg / playerCount)) : 0} pcs jersey dengan kombinasi lengan & ukuran saat ini.
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
}
