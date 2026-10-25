import { User, Trash2, Plus, ShoppingCart } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { CustomDetailItem } from "~/types/buatPesanan";

interface PlayerTableDesktopProps {
    customDetails: CustomDetailItem[];
    onDetailChange: (id: string, field: keyof CustomDetailItem, value: string) => void;
    onRemoveMember: (id: string) => void;
    onAddMember: () => void;
    showValidation: boolean;
    hasPdfFile: boolean;
}

export function PlayerTableDesktop({
    customDetails,
    onDetailChange,
    onRemoveMember,
    onAddMember,
    showValidation,
    hasPdfFile
}: PlayerTableDesktopProps) {
    if (customDetails.length === 0 && !hasPdfFile) {
        return (
            <div className="bg-white border-2 border-dashed border-neutral-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4">
                <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center">
                    <ShoppingCart className="w-8 h-8 text-neutral-200" />
                </div>
                <div className="text-center">
                    <p className="text-sm font-black italic uppercase text-neutral-900 tracking-tighter">Your list is empty</p>
                    <p className="text-[10px] font-medium text-neutral-400 mt-1 max-w-[200px]">
                        Add items from the shop or paste your player list to get started.
                    </p>
                </div>
                <Button 
                    onClick={onAddMember}
                    className="mt-2 h-11 px-6 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-black uppercase tracking-wider italic flex items-center gap-2 cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Pemain Pertama
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-2xl overflow-hidden relative ring-1 ring-black/5">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[6.25rem] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D25026]/5 blur-[6.25rem] pointer-events-none" />
                
                <div className="overflow-x-auto relative z-10 custom-scrollbar pb-4">
                    <table className="w-full text-left border-collapse min-w-[62.5rem]">
                        <thead>
                            <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                <th className="p-6 pl-10 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic w-20 text-center">No</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic w-full">Nama</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-center w-24 whitespace-nowrap">Nomor Punggung</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-center w-[230px] whitespace-nowrap">Ukuran Baju</th>
                                <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-center w-[150px] whitespace-nowrap">Lengan</th>
                                <th className="p-6 pr-10 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-right w-28">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100">
                            {customDetails.map((detail, index) => (
                                <tr key={detail.id} className="hover:bg-neutral-50/50 transition-all duration-300 group">
                                    <td className="p-5 pl-10 text-center">
                                        <span className="text-sm font-black text-neutral-400">{index + 1}</span>
                                    </td>
                                    <td className="p-5">
                                        <div className="relative group/input">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-800 group-focus-within/input:text-[#D25026] transition-colors" />
                                            <Input 
                                                value={detail.name}
                                                onChange={(e) => onDetailChange(detail.id, "name", e.target.value)}
                                                placeholder="NAMA" 
                                                className={cn(
                                                    "h-12 rounded-2xl border-neutral-200 focus:border-[#D25026]/50 focus:ring-[#D25026]/20 bg-white text-sm font-black uppercase tracking-wider text-black placeholder:text-neutral-800 pl-11 transition-all duration-300",
                                                    showValidation && !detail.name.trim() && "border-red-500 bg-red-50/30"
                                                )}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <Input 
                                            value={detail.number}
                                            onChange={(e) => onDetailChange(detail.id, "number", e.target.value)}
                                            placeholder="00" 
                                            maxLength={3}
                                            className={cn(
                                                "w-20 mx-auto h-12 rounded-2xl border-neutral-200 focus:border-[#D25026]/50 focus:ring-[#D25026]/20 bg-white text-base font-black text-center text-black placeholder:text-neutral-800 transition-all duration-300",
                                                showValidation && !detail.number.trim() && "border-red-500 bg-red-50/30"
                                            )}
                                        />
                                    </td>
                                    <td className="p-5">
                                        <div className="flex gap-1 bg-neutral-50 p-1 rounded-xl border border-neutral-100 w-max mx-auto">
                                            {["S", "M", "L", "XL", "2XL", "3XL", "4XL"].map(size => (
                                                <button
                                                    key={size}
                                                    type="button"
                                                    onClick={() => onDetailChange(detail.id, "size", size)}
                                                    className={cn(
                                                        "w-7 h-7 rounded-lg text-[10px] font-black transition-all duration-300 cursor-pointer",
                                                        detail.size === size 
                                                            ? "bg-black text-white shadow-md" 
                                                            : "text-neutral-600 hover:text-black hover:bg-neutral-200"
                                                    )}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-5">
                                        <div className="flex gap-1 bg-neutral-50 p-1 rounded-xl border border-neutral-100 w-max mx-auto">
                                            {[
                                                { value: "Lengan Pendek", label: "Pendek" },
                                                { value: "Lengan Panjang", label: "Panjang" }
                                            ].map(sleeve => (
                                                <button
                                                    key={sleeve.value}
                                                    type="button"
                                                    onClick={() => onDetailChange(detail.id, "sleeve", sleeve.value)}
                                                    className={cn(
                                                        "px-3 h-7 rounded-lg text-[10px] font-black transition-all duration-300 cursor-pointer",
                                                        (detail.sleeve || "Lengan Pendek") === sleeve.value 
                                                            ? "bg-[#D25026] text-white shadow-md shadow-[#D25026]/20" 
                                                            : "text-neutral-600 hover:text-[#D25026] hover:bg-neutral-200"
                                                    )}
                                                >
                                                    {sleeve.label}
                                                </button>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-5 pr-10 text-right">
                                        <button 
                                            type="button"
                                            onClick={() => onRemoveMember(detail.id)}
                                            className="w-11 h-11 bg-red-50 text-red-500 rounded-2xl inline-flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
                                            title="Hapus Pemain"
                                        >
                                            <Trash2 className="w-4.5 h-4.5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onAddMember}
                    className="h-11 px-5 rounded-xl border-neutral-200 text-xs font-black uppercase tracking-wider italic flex items-center gap-2 hover:bg-black hover:text-white transition-all cursor-pointer"
                >
                    <Plus className="w-4 h-4" />
                    Tambah Baris Pemain
                </Button>
            </div>
        </div>
    );
}
