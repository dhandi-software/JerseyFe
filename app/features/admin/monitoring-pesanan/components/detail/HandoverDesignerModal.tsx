import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "~/components/ui/dialog";
import { CustomSelect } from "~/components/ui/custom-select";
import type { DesignerItem } from "~/types";

interface HandoverDesignerModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    designers: DesignerItem[];
    selectedDesignerId: number | "";
    setSelectedDesignerId: (id: number | "") => void;
    orderToAssign: number | null;
    handleUpdateStatus: (id: number, newStatus: string, designerId?: number) => Promise<void>;
}

export function HandoverDesignerModal({
    isOpen,
    onOpenChange,
    designers,
    selectedDesignerId,
    setSelectedDesignerId,
    orderToAssign,
    handleUpdateStatus
}: HandoverDesignerModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[540px] font-geist border-slate-100 shadow-xl rounded-3xl p-8 bg-white">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 pr-12">
                        Serahkan ke Tim Desain
                    </DialogTitle>
                </DialogHeader>
                <div className="py-6 space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 italic">Pilih Desainer</label>
                        <CustomSelect
                            options={designers.map(d => ({
                                value: String(d.id),
                                label: `${d.nama} (${d.email})`
                            }))}
                            value={selectedDesignerId ? String(selectedDesignerId) : ""}
                            onChange={(val) => setSelectedDesignerId(val ? Number(val) : "")}
                            placeholder="-- Pilih Desainer --"
                            searchPlaceholder="Cari desainer..."
                            emptyMessage="Desainer tidak ditemukan."
                        />
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-2">
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        className="px-6 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={async () => {
                            if (!selectedDesignerId || !orderToAssign) {
                                alert("Pilih desainer terlebih dahulu");
                                return;
                            }
                            await handleUpdateStatus(orderToAssign, "DESAIN", selectedDesignerId as number);
                            onOpenChange(false);
                            setSelectedDesignerId("");
                        }}
                        disabled={!selectedDesignerId}
                        className="px-6 py-2.5 bg-[#D25026] text-white font-bold rounded-xl hover:bg-[#B34320] transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        Konfirmasi & Serahkan
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
