import React from "react";
import { ClipboardPaste, Info } from "lucide-react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger, 
    DialogDescription 
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

interface PasteListDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    pasteText: string;
    onTextChange: (text: string) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
    onSubmit: () => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    variant?: "desktop" | "mobile";
}

export function PasteListDialog({
    isOpen,
    onOpenChange,
    pasteText,
    onTextChange,
    onKeyDown,
    onPaste,
    onSubmit,
    textareaRef,
    variant = "desktop"
}: PasteListDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className={
                        variant === "desktop"
                            ? "rounded-xl h-10 px-4 border-neutral-200 text-[10px] font-black uppercase tracking-widest italic flex gap-2 hover:bg-black hover:text-white transition-all cursor-pointer"
                            : "rounded-xl h-9 px-3 border-neutral-200 text-[9px] font-black uppercase tracking-widest italic flex gap-1.5 hover:bg-black hover:text-white transition-all cursor-pointer"
                    }
                >
                    <ClipboardPaste className="w-3.5 h-3.5" />
                    Paste List
                </Button>
            </DialogTrigger>
            <DialogContent className="!w-[600px] !max-w-[95vw] rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden bg-white flex flex-col max-h-[90vh]">
                <div className="relative h-32 w-full bg-black flex flex-col justify-center px-10 shrink-0">
                    <div 
                        className="absolute inset-0 opacity-20 pointer-events-none" 
                        style={{ 
                            backgroundImage: "radial-gradient(circle at 0.0625rem 0.0625rem, white 0.0625rem, transparent 0)", 
                            backgroundSize: "1.5rem 1.5rem" 
                        }} 
                    />
                    <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-white relative z-10">
                        Paste Player List
                    </DialogTitle>
                    <DialogDescription className="text-neutral-400 font-medium text-xs mt-1 relative z-10 italic">
                        Format: No. Nama Nomor_Punggung Ukuran Lengan (opsional)
                    </DialogDescription>
                </div>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <div className="bg-orange-50/50 border border-orange-100/50 rounded-2xl p-4 mb-6 flex items-start gap-3">
                        <Info className="w-4 h-4 text-[#D25026] mt-0.5 shrink-0" />
                        <div className="text-[11px] leading-relaxed text-neutral-600 font-medium">
                            <p className="font-bold text-slate-800 mb-1">Panduan Penginputan Otomatis:</p>
                            <p>• Masukkan list berisi <span className="font-bold">No, Nama, No Punggung, Ukuran Baju</span>, dan <span className="font-bold">Lengan</span>.</p>
                            <p>• Jika kolom lengan dikosongkan, sistem akan otomatis memilih <span className="font-bold">Lengan Pendek</span>.</p>
                            <p>• Contoh: <span className="italic">1. BAYU 10 L Pendek</span> atau <span className="italic">2. YUSUF 23 XL Panjang</span></p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">
                            Paste Your List Here
                        </Label>
                        <Textarea 
                            ref={textareaRef}
                            value={pasteText}
                            onChange={(e) => onTextChange(e.target.value)}
                            onKeyDown={onKeyDown}
                            onPaste={onPaste}
                            placeholder={"1. BAYU, 10, L, Pendek\n2. YUSUF, 23, XL, Lengan Panjang"}
                            className="min-h-[18rem] rounded-[1.5rem] border-neutral-100 text-sm p-6 focus:ring-[#D25026]/10 focus:border-[#D25026]/20 bg-neutral-50/50 resize-none transition-all"
                        />
                    </div>
                </div>

                <div className="p-8 pt-4 border-t border-neutral-50 bg-white shrink-0">
                    <div className="flex gap-4">
                        <Button 
                            onClick={() => onOpenChange(false)} 
                            variant="ghost" 
                            className="flex-1 rounded-2xl h-14 text-xs font-black uppercase tracking-widest italic hover:bg-neutral-50 cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={onSubmit} 
                            className="flex-[2] rounded-2xl h-14 bg-[#D25026] text-white text-xs font-black uppercase tracking-widest italic shadow-xl shadow-[#D25026]/20 hover:bg-[#B34320] transition-all cursor-pointer"
                        >
                            Process List
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
