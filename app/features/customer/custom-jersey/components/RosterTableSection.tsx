/**
 * RosterTableSection Component
 * Step 1: Inventory notices, quick table generation, batch action triggers, and interactive roster table.
 * FCSV Apparel — Batch 2 Milestone M3 (R1 UI Decomposition)
 */

import {
  User,
  Trash2,
  FileText,
  CheckCircle2,
  ShoppingCart,
  ClipboardPaste,
  Info,
  AlertCircle,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";
import type { CustomJerseyDetailItem } from "~/types";

export interface RosterTableSectionProps {
  activeProduct: any | null;
  isOverLimit: boolean;
  totalRequiredKg: number;
  availableKg: number;
  pdfFile: File | null;
  setPdfFile: (file: File | null) => void;
  customDetails: CustomJerseyDetailItem[];
  playerCountInput: string;
  setPlayerCountInput: (val: string) => void;
  generateTable: () => void;
  setIsResetDialogOpen: (open: boolean) => void;
  setIsPasteDialogOpen: (open: boolean) => void;
  handlePdfImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDetailChange: (id: string, field: string, value: string) => void;
  removeUnit: (id: string) => void;
  showValidation: boolean;
  variant?: "desktop" | "mobile";
  [key: string]: any;
}

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"];
const SLEEVE_OPTIONS = [
  { value: "Lengan Pendek", label: "Pendek" },
  { value: "Lengan Panjang", label: "Panjang" },
];

export function RosterTableSection({
  activeProduct,
  isOverLimit,
  totalRequiredKg,
  availableKg,
  pdfFile,
  setPdfFile,
  customDetails,
  playerCountInput,
  setPlayerCountInput,
  generateTable,
  setIsResetDialogOpen,
  setIsPasteDialogOpen,
  handlePdfImport,
  handleDetailChange,
  removeUnit,
  showValidation,
  variant = "desktop",
}: RosterTableSectionProps) {
  const isMobile = variant === "mobile";

  return (
    <div className="space-y-6">
      {/* Step 1 Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter text-neutral-900">
            Detail Pemain Jersey
          </h2>
          <p className="text-xs font-medium text-neutral-400 mt-0.5 italic">
            Masukkan daftar pemain atau unggah dokumen PDF
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {/* Quick Count Generator */}
          <div className="flex items-center gap-1.5 bg-neutral-50 p-1 rounded-2xl border border-neutral-100">
            <Input
              type="number"
              placeholder="Jumlah"
              value={playerCountInput}
              onChange={(e) => setPlayerCountInput(e.target.value)}
              className="w-16 md:w-20 h-9 md:h-10 border-none bg-transparent text-xs font-bold text-center focus-visible:ring-0"
              min="1"
            />
            <Button
              type="button"
              onClick={generateTable}
              className="h-9 md:h-10 px-3 md:px-4 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest italic hover:bg-neutral-800 transition-all cursor-pointer"
            >
              Generate
            </Button>
          </div>

          {/* Reset Dialog Trigger */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsResetDialogOpen(true)}
            className="rounded-xl h-9 md:h-10 px-3 md:px-4 border-neutral-200 text-[10px] font-black uppercase tracking-widest italic flex gap-1.5 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Reset
          </Button>

          {/* Paste List Dialog Trigger */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsPasteDialogOpen(true)}
            className="rounded-xl h-9 md:h-10 px-3 md:px-4 border-neutral-200 text-[10px] font-black uppercase tracking-widest italic flex gap-1.5 hover:bg-black hover:text-white transition-all cursor-pointer"
          >
            <ClipboardPaste className="w-3.5 h-3.5" />
            Paste List
          </Button>

          {/* PDF Import Input */}
          <div className="relative group">
            <input
              type="file"
              accept=".pdf"
              onChange={handlePdfImport}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
              aria-label="Upload PDF Data Pemain"
            />
            <Button
              type="button"
              variant="outline"
              className="rounded-xl h-9 md:h-10 px-3 md:px-4 border-neutral-200 text-[10px] font-black uppercase tracking-widest italic flex gap-1.5 hover:bg-[#D25026] hover:text-white transition-all cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Alert: Out of Stock */}
      {activeProduct?.status === "Habis" && (
        <div className="bg-orange-50 border border-orange-200 p-4 md:p-5 rounded-2xl flex items-start gap-3">
          <Info className="w-5 h-5 text-[#D25026] shrink-0 mt-0.5" />
          <div className="text-xs font-bold uppercase tracking-tight text-[#B34320]">
            Pemberitahuan: Bahan jersey &quot;{activeProduct.title}&quot; sedang tidak tersedia / habis. Anda tetap dapat melanjutkan pemesanan. Admin akan menghubungi Anda setelah checkout untuk merekomendasikan bahan alternatif yang tersedia.
          </div>
        </div>
      )}

      {/* Alert: Over Inventory Limit */}
      {isOverLimit && (
        <div className="bg-red-50 border border-red-200 p-4 md:p-5 rounded-2xl flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs font-bold uppercase tracking-tight text-red-800 leading-relaxed">
            Kebutuhan bahan baku melebihi ketersediaan di gudang! (Dibutuhkan: {totalRequiredKg.toFixed(2)} kg, Tersedia: {availableKg.toFixed(2)} kg).
            <span className="block mt-1 text-[#B34320] font-extrabold normal-case">
              Stok bahan &quot;{activeProduct?.title}&quot; saat ini hanya cukup untuk {Math.floor(availableKg / (totalRequiredKg / customDetails.length))} pcs jersey dengan kombinasi lengan & ukuran Anda saat ini.
              Silakan kurangi pesanan Anda sebanyak {Math.max(1, customDetails.length - Math.floor(availableKg / (totalRequiredKg / customDetails.length)))} pcs atau ubah ukuran/tipe lengan ke yang lebih kecil/pendek.
            </span>
          </div>
        </div>
      )}

      {/* PDF Imported Banner */}
      {pdfFile && (
        <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
          <CheckCircle2 className="text-emerald-500 w-5 h-5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-emerald-900 italic tracking-tighter truncate">
              PDF IMPORTED: {pdfFile.name}
            </p>
            <p className="text-[11px] text-emerald-600 font-medium">
              Data pemain akan diproses manual oleh admin FCSV.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setPdfFile(null)}
            className="ml-auto text-emerald-700 hover:text-emerald-900 font-bold text-[10px] uppercase cursor-pointer"
          >
            REMOVE
          </button>
        </div>
      )}

      {/* Main Roster Table */}
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-neutral-100 shadow-xl overflow-hidden relative ring-1 ring-black/5">
        <div className="overflow-x-auto relative z-10 custom-scrollbar pb-2">
          <table className="w-full text-left border-collapse min-w-[56rem] md:min-w-[62.5rem]">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="p-4 md:p-6 pl-6 md:pl-10 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic w-16 text-center">
                  No
                </th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic w-full">
                  Nama Pemain
                </th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-center w-28 whitespace-nowrap">
                  No Punggung
                </th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-center w-[230px] whitespace-nowrap">
                  Ukuran Baju
                </th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-center w-[160px] whitespace-nowrap">
                  Tipe Lengan
                </th>
                <th className="p-4 md:p-6 pr-6 md:pr-10 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-right w-24">
                  Hapus
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {customDetails.map((detail, index) => (
                <tr
                  key={detail.id}
                  className="hover:bg-neutral-50/50 transition-all duration-300 group"
                >
                  <td className="p-4 md:p-5 pl-6 md:pl-10 text-center">
                    <span className="text-sm font-black text-neutral-400">
                      {index + 1}
                    </span>
                  </td>
                  <td className="p-4 md:p-5">
                    <div className="relative group/input">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-800 group-focus-within/input:text-[#D25026] transition-colors" />
                      <Input
                        value={detail.name}
                        onChange={(e) =>
                          handleDetailChange(detail.id, "name", e.target.value)
                        }
                        placeholder="NAMA PEMAIN"
                        className={cn(
                          "h-12 rounded-2xl border-neutral-200 focus:border-[#D25026]/50 focus:ring-[#D25026]/20 bg-white text-sm font-black uppercase tracking-wider text-black placeholder:text-neutral-400 pl-11 transition-all duration-300",
                          showValidation &&
                            !detail.name.trim() &&
                            "border-red-500 bg-red-50/30",
                        )}
                      />
                    </div>
                  </td>
                  <td className="p-4 md:p-5">
                    <Input
                      value={detail.number}
                      onChange={(e) =>
                        handleDetailChange(detail.id, "number", e.target.value)
                      }
                      placeholder="00"
                      maxLength={3}
                      className={cn(
                        "w-20 mx-auto h-12 rounded-2xl border-neutral-200 focus:border-[#D25026]/50 focus:ring-[#D25026]/20 bg-white text-base font-black text-center text-black placeholder:text-neutral-400 transition-all duration-300",
                        showValidation &&
                          !detail.number.trim() &&
                          "border-red-500 bg-red-50/30",
                      )}
                    />
                  </td>
                  <td className="p-4 md:p-5">
                    <div className="flex gap-1 bg-neutral-50 p-1 rounded-xl border border-neutral-100 w-max mx-auto">
                      {AVAILABLE_SIZES.map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() =>
                            handleDetailChange(detail.id, "size", size)
                          }
                          className={cn(
                            "w-7 h-7 rounded-lg text-[10px] font-black transition-all duration-300 cursor-pointer",
                            detail.size === size
                              ? "bg-black text-white shadow-md"
                              : "text-neutral-600 hover:text-black hover:bg-neutral-200",
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 md:p-5">
                    <div className="flex gap-1 bg-neutral-50 p-1 rounded-xl border border-neutral-100 w-max mx-auto">
                      {SLEEVE_OPTIONS.map((sleeve) => (
                        <button
                          key={sleeve.value}
                          type="button"
                          onClick={() =>
                            handleDetailChange(detail.id, "sleeve", sleeve.value)
                          }
                          className={cn(
                            "px-3 h-7 rounded-lg text-[10px] font-black transition-all duration-300 cursor-pointer",
                            (detail.sleeve || "Lengan Pendek") === sleeve.value
                              ? "bg-[#D25026] text-white shadow-md shadow-[#D25026]/20"
                              : "text-neutral-600 hover:text-[#D25026] hover:bg-neutral-200",
                          )}
                        >
                          {sleeve.label}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 md:p-5 pr-6 md:pr-10 text-right">
                    <button
                      type="button"
                      onClick={() => removeUnit(detail.id)}
                      className="w-10 h-10 md:w-11 md:h-11 bg-red-50 text-red-500 rounded-2xl inline-flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
                      aria-label="Hapus Pemain"
                    >
                      <Trash2 className="w-4 h-4 md:w-4.5 md:h-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {customDetails.length === 0 && !pdfFile && (
        <div className="bg-white border-2 border-dashed border-neutral-100 rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center justify-center gap-4">
          <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center">
            <ShoppingCart className="w-8 h-8 text-neutral-300" />
          </div>
          <div className="text-center">
            <p className="text-sm font-black italic uppercase text-neutral-900 tracking-tighter">
              Daftar Pemain Kosong
            </p>
            <p className="text-xs text-neutral-400 font-medium mt-1">
              Gunakan tombol Generate di atas atau tombol Paste List untuk memasukkan daftar pemain secara instan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
