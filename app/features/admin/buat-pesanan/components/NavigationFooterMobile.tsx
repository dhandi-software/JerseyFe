import { Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { formatRupiah } from "../utils";

interface NavigationFooterMobileProps {
    step: number;
    paymentType: "FULL" | "DP";
    effectiveRemainingAmount: number;
    effectivePaidAmount: number;
    totalCalculated: number;
    isUploading: boolean;
    uploadProgress: number;
    onBack: () => void;
    onNext: () => void;
}

export function NavigationFooterMobile({
    step,
    paymentType,
    effectiveRemainingAmount,
    effectivePaidAmount,
    totalCalculated,
    isUploading,
    uploadProgress,
    onBack,
    onNext
}: NavigationFooterMobileProps) {
    return (
        <div className="bg-white border-t border-neutral-100 p-4 sticky bottom-0 z-50">
            <div className="flex justify-between items-center mb-3">
                <div>
                    <span className="text-[10px] font-black uppercase italic text-neutral-400 block">
                        {paymentType === "DP" ? "Total Tagihan (DP Terpilih)" : "Total Tagihan"}
                    </span>
                    {paymentType === "DP" && (
                        <span className="text-[10px] font-bold text-rose-600 block">
                            Sisa: {formatRupiah(effectiveRemainingAmount)}
                        </span>
                    )}
                </div>
                <div className="text-right">
                    <span className="text-lg font-black italic tracking-tighter text-[#D25026]">
                        {formatRupiah(totalCalculated)}
                    </span>
                    {paymentType === "DP" && (
                        <span className="text-[10px] text-neutral-500 font-semibold block">
                            DP: {formatRupiah(effectivePaidAmount)}
                        </span>
                    )}
                </div>
            </div>
            
            <div className="flex gap-3">
                <Button 
                    variant="outline" 
                    type="button"
                    onClick={onBack}
                    className="flex-1 h-12 rounded-xl border-neutral-100 text-xs font-black uppercase italic cursor-pointer"
                >
                    {step === 1 ? "Exit" : "Back"}
                </Button>
                <Button 
                    type="button"
                    onClick={onNext}
                    disabled={isUploading}
                    className="flex-[2] h-12 rounded-xl bg-[#D25026] text-white text-xs font-black uppercase italic shadow-lg shadow-[#D25026]/20 cursor-pointer"
                >
                    {isUploading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        step === 2 ? "Complete Order" : "Next Step"
                    )}
                </Button>
            </div>

            {isUploading && (
                <div className="mt-4 h-1 w-full bg-neutral-100 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-[#D25026] transition-all duration-300" 
                        style={{ width: `${uploadProgress}%` }} 
                    />
                </div>
            )}
        </div>
    );
}
