import { Trash2 } from "lucide-react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger, 
    DialogDescription 
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

interface ResetTableDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    variant?: "desktop" | "mobile";
}

export function ResetTableDialog({
    isOpen,
    onOpenChange,
    onConfirm,
    variant = "desktop"
}: ResetTableDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button 
                    variant="outline" 
                    className={
                        variant === "desktop"
                            ? "rounded-xl h-10 px-4 border-neutral-200 text-[10px] font-black uppercase tracking-widest italic flex gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer"
                            : "rounded-xl h-9 px-3 border-neutral-200 text-[9px] font-black uppercase tracking-widest italic flex gap-1.5 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer"
                    }
                >
                    <Trash2 className="w-3.5 h-3.5" />
                    Reset
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2rem] p-10 w-full max-w-[25rem] border-none shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-neutral-900">
                        Reset Tabel?
                    </DialogTitle>
                    <DialogDescription className="text-sm font-medium text-neutral-500 italic mt-3 leading-relaxed">
                        Seluruh data pemain yang sudah Anda masukkan akan dihapus secara permanen dari daftar ini.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex gap-4 mt-8">
                    <Button 
                        onClick={() => onOpenChange(false)} 
                        variant="ghost" 
                        className="flex-1 rounded-2xl h-14 text-xs font-black uppercase tracking-widest italic hover:bg-neutral-50 cursor-pointer"
                    >
                        Batal
                    </Button>
                    <Button 
                        onClick={onConfirm} 
                        variant="destructive" 
                        className="flex-[1.5] rounded-2xl h-14 bg-red-600 text-white text-xs font-black uppercase tracking-widest italic shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all cursor-pointer"
                    >
                        Ya, Reset
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
