import { ChevronLeft, ArrowRight, ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { formatRupiah } from "../utils";

interface NavigationFooterDesktopProps {
    step: number;
    onBack: () => void;
    onNext: () => void;
    isUploading: boolean;
    uploadProgress: number;
    totalCalculated: number;
    hasPlayers: boolean;
}

export function NavigationFooterDesktop({
    step,
    onBack,
    onNext,
    isUploading,
    uploadProgress,
    totalCalculated,
    hasPlayers
}: NavigationFooterDesktopProps) {
    return (
        <div className="mt-12 flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm ring-1 ring-black/5">
            <Button 
                variant="outline"
                type="button"
                onClick={onBack}
                className="h-14 px-10 rounded-2xl border-neutral-200 text-[13px] font-black uppercase tracking-widest italic hover:bg-neutral-50 transition-all flex gap-3 cursor-pointer"
                disabled={isUploading}
            >
                <ChevronLeft className="w-4 h-4" />
                {step === 1 ? "Exit Checkout" : "Previous Step"}
            </Button>

            <div className="flex items-center gap-4">
                {isUploading && (
                    <div className="flex flex-col justify-center px-4 w-48">
                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest italic text-neutral-400 mb-1.5">
                            <span>Syncing...</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-[#D25026] transition-all duration-500" 
                                style={{ width: `${uploadProgress}%` }} 
                            />
                        </div>
                    </div>
                )}
                
                <div className={cn(
                    "flex items-center p-2 rounded-[1.5rem] shadow-2xl ring-1 ring-black/5 gap-2", 
                    step === 1 && hasPlayers ? "bg-black" : "bg-transparent"
                )}>
                    {step === 1 && hasPlayers && !isUploading && (
                        <div className="flex items-center gap-4 pl-4 pr-2">
                            <div className="w-10 h-10 bg-[#D25026]/20 rounded-xl flex items-center justify-center">
                                <ShoppingCart className="w-4 h-4 text-[#D25026]" />
                            </div>
                            <div className="min-w-[120px]">
                                <span className="text-[9px] font-black uppercase tracking-widest italic text-neutral-400 block leading-none mb-1">
                                    Total Payment
                                </span>
                                <p className="text-lg font-black tracking-tighter text-white">
                                    {formatRupiah(totalCalculated)}
                                </p>
                            </div>
                        </div>
                    )}
                    
                    <Button 
                        type="button"
                        onClick={onNext}
                        className="h-[52px] px-8 rounded-xl bg-[#D25026] hover:bg-[#B34320] text-white text-[12px] font-black uppercase tracking-widest italic shadow-lg active:scale-95 transition-all flex gap-3 shrink-0 cursor-pointer"
                        disabled={isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                {step === 2 ? "Complete & Create Order" : "Continue to Next Step"}
                                <ArrowRight className="w-4 h-4" />
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}
