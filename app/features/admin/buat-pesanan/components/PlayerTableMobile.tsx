import React from "react";
import { FileText, X, Trash2, Plus, ShoppingCart, ChevronDown } from "lucide-react";
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
    const totalCount = customDetails.length;

    return (
        <div className="space-y-4">
            {/* Header: Section Title & Material Badge */}
            <div className="flex justify-between items-center flex-wrap gap-2">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-xs font-black uppercase italic tracking-tighter text-neutral-900">
                            Daftar Pemain
                        </h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700">
                            {totalCount} Pemain
                        </span>
                    </div>
                    {activeProduct && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 bg-[#FFF0EB] text-[#B34320] border border-[#FFD9CD] rounded-full text-[9px] font-bold uppercase tracking-wider">
                            Bahan: {activeProduct.title}
                        </span>
                    )}
                </div>

                {/* Quick Generator & Dialog Actions (All >= 44px height) */}
                <div className="flex gap-1.5 flex-wrap items-center">
                    {/* Number generator with >= 44px container hit area */}
                    <div className="flex items-center bg-white rounded-xl border border-neutral-200 h-11 px-1.5 gap-1 shadow-xs">
                        <Input 
                            type="number" 
                            placeholder="Jml" 
                            value={playerCountInput} 
                            onChange={(e) => onPlayerCountChange(e.target.value)}
                            className="w-12 h-9 border-none focus-visible:ring-0 text-xs font-bold bg-transparent px-1 text-center"
                            aria-label="Jumlah pemain otomatis"
                        />
                        <Button 
                            type="button"
                            onClick={onGenerateTable} 
                            variant="default" 
                            className="rounded-lg h-9 px-3 bg-neutral-900 text-white hover:bg-black text-xs font-bold cursor-pointer"
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
                            aria-label="Upload file PDF daftar pemain"
                        />
                        <Button 
                            type="button"
                            variant="outline" 
                            className="rounded-xl h-11 px-3.5 border-neutral-200 text-xs font-bold flex gap-1.5 cursor-pointer hover:bg-neutral-50"
                        >
                            <FileText className="w-3.5 h-3.5 text-neutral-600" />
                            PDF
                        </Button>
                    </div>
                </div>
            </div>

            {/* Attached PDF Notice */}
            {pdfFile && (
                <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-3 border border-emerald-200">
                    <FileText className="text-emerald-600 w-5 h-5 shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-emerald-950 truncate">{pdfFile.name}</p>
                        <p className="text-[10px] text-emerald-700">Daftar pemain akan diproses dari lampiran PDF</p>
                    </div>
                    <button 
                        type="button" 
                        onClick={onRemovePdf} 
                        className="w-11 h-11 -mr-2 rounded-xl flex items-center justify-center text-emerald-600 hover:text-emerald-800 hover:bg-emerald-100/60 transition-colors cursor-pointer"
                        aria-label="Hapus lampiran PDF"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Empty State */}
            {customDetails.length === 0 && !pdfFile && (
                <div 
                    id="field-player-table" 
                    className="bg-white border-2 border-dashed border-neutral-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 text-center"
                >
                    <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-neutral-900">Daftar Pemain Kosong</p>
                        <p className="text-xs text-neutral-500 mt-0.5">Mulai dengan menambahkan pemain atau gunakan fitur Paste List</p>
                    </div>
                    <Button 
                        type="button"
                        onClick={onAddMember}
                        className="h-11 px-5 rounded-xl bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer hover:bg-black shadow-xs"
                    >
                        <Plus className="w-4 h-4" />
                        Tambah Pemain
                    </Button>
                </div>
            )}

            {/* Vertical Card Stacking: Each player is an independent card (Zero horizontal overflow) */}
            {!pdfFile && customDetails.length > 0 && (
                <div className="space-y-3" role="list" aria-label="Daftar Baris Pemain">
                    {customDetails.map((detail, index) => (
                        <div 
                            key={detail.id}
                            id={`field-player-row-${detail.id}`}
                            className="bg-white rounded-2xl border border-neutral-200/90 shadow-xs p-4 space-y-3.5 transition-all"
                            role="listitem"
                        >
                            {/* Card Header: Player Badge & Delete Action */}
                            <div className="flex items-center justify-between pb-2 border-b border-neutral-100">
                                <div className="flex items-center gap-2">
                                    <span className="w-7 h-7 rounded-lg bg-neutral-900 text-white text-xs font-black flex items-center justify-center">
                                        {index + 1}
                                    </span>
                                    <span className="text-xs font-bold text-neutral-800">
                                        Pemain #{index + 1}
                                    </span>
                                </div>
                                <button 
                                    type="button"
                                    onClick={() => onRemoveMember(detail.id)}
                                    className="w-11 h-11 -mr-2 -my-2 rounded-xl bg-red-50 hover:bg-red-500 text-red-500 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                                    aria-label={`Hapus pemain ${index + 1} (${detail.name || 'tanpa nama'})`}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Row 1: Name and Back Number Inputs */}
                            <div className="grid grid-cols-12 gap-2.5">
                                <div className="col-span-8 space-y-1">
                                    <label 
                                        htmlFor={`field-player-name-${detail.id}`}
                                        className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block"
                                    >
                                        Nama Jersey
                                    </label>
                                    <Input 
                                        id={`field-player-name-${detail.id}`}
                                        value={detail.name}
                                        onChange={(e) => onDetailChange(detail.id, "name", e.target.value)}
                                        placeholder="Contoh: BAYU" 
                                        className={cn(
                                            "h-11 rounded-xl border-neutral-200 focus:ring-[#D25026]/20 focus:border-[#D25026] bg-white text-xs font-bold uppercase text-neutral-900 placeholder:text-neutral-400 px-3 transition-all",
                                            showValidation && !detail.name.trim() && "border-red-500 bg-red-50/40 ring-2 ring-red-500/20"
                                        )}
                                    />
                                </div>
                                <div className="col-span-4 space-y-1">
                                    <label 
                                        htmlFor={`field-player-number-${detail.id}`}
                                        className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block text-center"
                                    >
                                        No. Punggung
                                    </label>
                                    <Input 
                                        id={`field-player-number-${detail.id}`}
                                        value={detail.number}
                                        onChange={(e) => onDetailChange(detail.id, "number", e.target.value)}
                                        placeholder="00" 
                                        maxLength={3}
                                        inputMode="numeric"
                                        className={cn(
                                            "h-11 rounded-xl border-neutral-200 focus:ring-[#D25026]/20 focus:border-[#D25026] bg-white text-xs font-bold text-center text-neutral-900 placeholder:text-neutral-400 px-2 transition-all",
                                            showValidation && !detail.number.trim() && "border-red-500 bg-red-50/40 ring-2 ring-red-500/20"
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Row 2: Size Select & Sleeve Toggles */}
                            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
                                {/* Size Select Dropdown */}
                                <div className="space-y-1">
                                    <label 
                                        htmlFor={`field-player-size-${detail.id}`}
                                        className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block"
                                    >
                                        Ukuran Baju
                                    </label>
                                    <div className="relative">
                                        <select
                                            id={`field-player-size-${detail.id}`}
                                            value={detail.size || "L"}
                                            onChange={(e) => onDetailChange(detail.id, "size", e.target.value)}
                                            className="w-full h-11 px-3 pr-8 rounded-xl border border-neutral-200 bg-white text-xs font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] appearance-none cursor-pointer"
                                        >
                                            {["S", "M", "L", "XL", "2XL", "3XL", "4XL"].map((sz) => (
                                                 <option key={sz} value={sz}>
                                                    {sz} {sz === "3XL" || sz === "4XL" ? "(Jumbo)" : ""}
                                                </option>
                                            ))}
                                        </select>
                                        <ChevronDown className="w-4 h-4 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Sleeve Toggle Buttons */}
                                <div className="space-y-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-600 block">
                                        Panjang Lengan
                                    </span>
                                    <div className="grid grid-cols-2 gap-1.5">
                                        {[
                                            { value: "Lengan Pendek", label: "Pendek" },
                                            { value: "Lengan Panjang", label: "Panjang" }
                                        ].map((sleeve) => {
                                            const isSelected = (detail.sleeve || "Lengan Pendek") === sleeve.value;
                                            return (
                                                <button
                                                    key={sleeve.value}
                                                    type="button"
                                                    onClick={() => onDetailChange(detail.id, "sleeve", sleeve.value)}
                                                    className={cn(
                                                        "h-11 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center border",
                                                        isSelected
                                                            ? "bg-[#B34320] text-white border-[#B34320] shadow-xs"
                                                            : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100"
                                                    )}
                                                >
                                                    {sleeve.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Bottom Add Player Button (Full-width, h-12 thumb target) */}
            {!pdfFile && customDetails.length > 0 && (
                <div className="pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onAddMember}
                        className="w-full h-12 rounded-xl border-2 border-dashed border-neutral-300 hover:border-neutral-900 bg-white hover:bg-neutral-50 text-xs font-bold uppercase tracking-wider text-neutral-800 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
                    >
                        <Plus className="w-4 h-4 text-[#D25026]" />
                        Tambah Baris Pemain
                    </Button>
                </div>
            )}
        </div>
    );
}
