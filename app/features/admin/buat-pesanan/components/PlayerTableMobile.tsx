import React from "react";
import { FileText, X, Trash2, Plus, ShoppingCart } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import type { CustomDetailItem, BuatPesananProduct } from "~/types/buatPesanan";
import { PasteListDialog } from "./PasteListDialog";
import { ResetTableDialog } from "./ResetTableDialog";

interface PlayerTableMobileProps {
    customDetails: CustomDetailItem[];
    onDetailChange: (id: string, field: keyof CustomDetailItem, value: string) => void;
    onRemoveMember: (id: string) => void;
    onAddMember: () => void;
    showValidation: boolean;
    activeProduct: BuatPesananProduct | null;
    playerCountInput: string;
    onPlayerCountChange: (val: string) => void;
    onGenerateTable: () => void;
    isResetDialogOpen: boolean;
    onResetDialogOpenChange: (open: boolean) => void;
    onResetConfirm: () => void;
    isPasteDialogOpen: boolean;
    onPasteDialogOpenChange: (open: boolean) => void;
    pasteText: string;
    onPasteTextChange: (text: string) => void;
    onPasteKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
    onPasteRaw: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
    onPasteSubmit: () => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    pdfFile: File | null;
    onPdfFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemovePdf: () => void;
}

export function PlayerTableMobile({
    customDetails,
    onDetailChange,
    onRemoveMember,
    onAddMember,
    showValidation,
    activeProduct,
    playerCountInput,
    onPlayerCountChange,
    onGenerateTable,
    isResetDialogOpen,
    onResetDialogOpenChange,
    onResetConfirm,
    isPasteDialogOpen,
    onPasteDialogOpenChange,
    pasteText,
    onPasteTextChange,
    onPasteKeyDown,
    onPasteRaw,
    onPasteSubmit,
    textareaRef,
    pdfFile,
    onPdfFileChange,
    onRemovePdf
}: PlayerTableMobileProps) {
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                    <h3 className="text-xs font-black uppercase italic tracking-tighter text-neutral-900">
                        Order Detail
                    </h3>
                    {activeProduct && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-[#FFF0EB] text-[#D25026] border border-[#FFD9CD] rounded-full text-[9px] font-black uppercase tracking-wider italic">
                            Bahan: {activeProduct.title}
                        </span>
                    )}
                </div>

                <div className="flex gap-1.5 flex-wrap items-center">
                    <div className="flex items-center gap-1 bg-white rounded-xl border border-neutral-200 p-1">
                        <Input 
                            type="number" 
                            placeholder="Jml" 
                            value={playerCountInput} 
                            onChange={(e) => onPlayerCountChange(e.target.value)}
                            className="w-14 rounded-lg h-7 border-none focus-visible:ring-0 text-[10px] font-bold bg-transparent px-1 text-center"
                        />
                        <Button 
                            onClick={onGenerateTable} 
                            variant="default" 
                            className="rounded-lg h-7 px-2.5 bg-black text-white hover:bg-neutral-800 text-[9px] font-black uppercase tracking-widest italic cursor-pointer"
                        >
                            Buat
                        </Button>
                    </div>

                    <ResetTableDialog 
                        isOpen={isResetDialogOpen}
                        onOpenChange={onResetDialogOpenChange}
                        onConfirm={onResetConfirm}
                        variant="mobile"
                    />

                    <PasteListDialog 
                        isOpen={isPasteDialogOpen}
                        onOpenChange={onPasteDialogOpenChange}
                        pasteText={pasteText}
                        onTextChange={onPasteTextChange}
                        onKeyDown={onPasteKeyDown}
                        onPaste={onPasteRaw}
                        onSubmit={onPasteSubmit}
                        textareaRef={textareaRef}
                        variant="mobile"
                    />

                    <div className="relative">
                        <input 
                            type="file" 
                            accept=".pdf" 
                            onChange={onPdfFileChange} 
                            className="absolute inset-0 opacity-0 z-10 cursor-pointer" 
                        />
                        <Button variant="outline" size="sm" className="rounded-xl h-9 border-neutral-200 text-[9px] font-black uppercase italic flex gap-1 cursor-pointer">
                            <FileText className="w-3 h-3" />
                            PDF
                        </Button>
                    </div>
                </div>
            </div>

            {pdfFile && (
                <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-3 border border-emerald-100">
                    <FileText className="text-emerald-500 w-5 h-5" />
                    <span className="text-[11px] font-bold text-emerald-900 truncate flex-1">{pdfFile.name}</span>
                    <button type="button" onClick={onRemovePdf} className="p-1 cursor-pointer">
                        <X className="w-4 h-4 text-emerald-400 hover:text-emerald-600" />
                    </button>
                </div>
            )}

            {!pdfFile && (
                <div className="bg-white rounded-[2rem] border border-neutral-100 shadow-xl overflow-hidden relative ring-1 ring-black/5">
                    <div className="overflow-x-auto relative z-10 custom-scrollbar pb-2">
                        <table className="w-full text-left border-collapse min-w-[48rem]">
                            <thead>
                                <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                    <th className="p-4 pl-5 text-[9px] font-black uppercase tracking-widest text-neutral-700 italic w-12 text-center">No</th>
                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-neutral-700 italic w-full">Nama</th>
                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-neutral-700 italic text-center w-16 whitespace-nowrap">No. Punggung</th>
                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-neutral-700 italic text-center w-[150px] whitespace-nowrap">Ukuran Baju</th>
                                    <th className="p-4 text-[9px] font-black uppercase tracking-widest text-neutral-700 italic text-center w-[110px] whitespace-nowrap">Lengan</th>
                                    <th className="p-4 pr-5 text-[9px] font-black uppercase tracking-widest text-neutral-700 italic text-right w-14"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {customDetails.map((detail, index) => (
                                    <tr key={detail.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                                        <td className="p-3 pl-5 text-center">
                                            <span className="text-[11px] font-black text-neutral-400">{index + 1}</span>
                                        </td>
                                        <td className="p-3">
                                            <Input 
                                                value={detail.name}
                                                onChange={(e) => onDetailChange(detail.id, "name", e.target.value)}
                                                placeholder="NAMA" 
                                                className={cn(
                                                    "h-9 rounded-xl border-neutral-200 focus:ring-[#D25026]/10 focus:border-[#D25026]/30 bg-white text-xs font-black uppercase text-black placeholder:text-neutral-800 px-3 transition-all",
                                                    showValidation && !detail.name.trim() && "border-red-500 bg-red-50/30"
                                                )}
                                            />
                                        </td>
                                        <td className="p-3">
                                            <Input 
                                                value={detail.number}
                                                onChange={(e) => onDetailChange(detail.id, "number", e.target.value)}
                                                placeholder="00" 
                                                className={cn(
                                                    "h-9 rounded-xl border-neutral-200 focus:ring-[#D25026]/10 focus:border-[#D25026]/30 bg-white text-sm font-black text-center text-black placeholder:text-neutral-800 px-2 transition-all",
                                                    showValidation && !detail.number.trim() && "border-red-500 bg-red-50/30"
                                                )}
                                            />
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl h-9 w-max mx-auto border border-neutral-200">
                                                {["S", "M", "L", "XL", "2XL", "3XL", "4XL"].map(size => (
                                                    <button
                                                        key={size}
                                                        type="button"
                                                        onClick={() => onDetailChange(detail.id, "size", size)}
                                                        className={cn(
                                                            "w-7 rounded-lg text-[10px] font-black transition-all cursor-pointer",
                                                            detail.size === size 
                                                                ? "bg-black text-white shadow-md shadow-black/10" 
                                                                : "text-neutral-600 hover:text-black hover:bg-neutral-200"
                                                        )}
                                                    >
                                                        {size}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl h-9 w-max mx-auto border border-neutral-200">
                                                {[
                                                    { value: "Lengan Pendek", label: "Pendek" },
                                                    { value: "Lengan Panjang", label: "Panjang" }
                                                ].map(sleeve => (
                                                    <button
                                                        key={sleeve.value}
                                                        type="button"
                                                        onClick={() => onDetailChange(detail.id, "sleeve", sleeve.value)}
                                                        className={cn(
                                                            "px-2 rounded-lg text-[10px] font-black transition-all cursor-pointer",
                                                            (detail.sleeve || "Lengan Pendek") === sleeve.value 
                                                                ? "bg-[#D25026] text-white shadow-md shadow-[#D25026]/10" 
                                                                : "text-neutral-600 hover:text-black hover:bg-neutral-200"
                                                        )}
                                                    >
                                                        {sleeve.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-3 pr-5 text-right">
                                            <button 
                                                type="button"
                                                onClick={() => onRemoveMember(detail.id)}
                                                className="w-8 h-8 bg-red-50 text-red-500 rounded-xl inline-flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all ml-auto cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {customDetails.length === 0 && !pdfFile && (
                <div className="bg-white border-2 border-dashed border-neutral-100 rounded-2xl p-8 flex flex-col items-center justify-center gap-3">
                    <ShoppingCart className="w-8 h-8 text-neutral-200" />
                    <p className="text-xs font-black uppercase italic text-neutral-900">List masih kosong</p>
                    <Button 
                        onClick={onAddMember}
                        className="h-9 px-4 rounded-xl bg-black text-white text-[10px] font-black uppercase italic flex items-center gap-1.5 cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah Pemain
                    </Button>
                </div>
            )}

            {!pdfFile && customDetails.length > 0 && (
                <div className="flex justify-end pt-1">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onAddMember}
                        className="h-9 px-3 rounded-xl border-neutral-200 text-[10px] font-black uppercase italic flex items-center gap-1.5 hover:bg-black hover:text-white transition-all cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        Tambah Baris
                    </Button>
                </div>
            )}
        </div>
    );
}
