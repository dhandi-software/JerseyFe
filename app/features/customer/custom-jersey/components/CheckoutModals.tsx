/**
 * CheckoutModals Component
 * Roster Reset confirmation dialog and Paste Player List parsing dialog.
 * FCSV Apparel — Batch 2 Milestone M3 (R1 UI Decomposition)
 */

import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "~/components/ui/dialog";
import { Info } from "lucide-react";

export interface CheckoutModalsProps {
  isResetDialogOpen: boolean;
  setIsResetDialogOpen: (open: boolean) => void;
  resetTable: () => void;
  isPasteDialogOpen: boolean;
  setIsPasteDialogOpen: (open: boolean) => void;
  pasteText: string;
  setPasteText: (text: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  handleTextareaKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  handleTextareaPaste: (e: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  parsePasteData: () => void;
  [key: string]: any;
}

export function CheckoutModals({
  isResetDialogOpen,
  setIsResetDialogOpen,
  resetTable,
  isPasteDialogOpen,
  setIsPasteDialogOpen,
  pasteText,
  setPasteText,
  textareaRef,
  handleTextareaKeyDown,
  handleTextareaPaste,
  parsePasteData,
}: CheckoutModalsProps) {
  return (
    <>
      {/* Reset Confirmation Dialog */}
      <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <DialogContent className="rounded-[2rem] p-8 md:p-10 w-full max-w-[25rem] border-none shadow-2xl bg-white">
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
              onClick={() => setIsResetDialogOpen(false)}
              variant="ghost"
              className="flex-1 rounded-2xl h-12 md:h-14 text-xs font-black uppercase tracking-widest italic hover:bg-neutral-50"
            >
              Batal
            </Button>
            <Button
              onClick={resetTable}
              variant="destructive"
              className="flex-[1.5] rounded-2xl h-12 md:h-14 bg-red-600 text-white text-xs font-black uppercase tracking-widest italic shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all"
            >
              Ya, Reset
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Paste Player List Dialog */}
      <Dialog open={isPasteDialogOpen} onOpenChange={setIsPasteDialogOpen}>
        <DialogContent className="!w-[600px] !max-w-[95vw] rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden bg-white flex flex-col max-h-[90vh]">
          <div className="relative h-28 md:h-32 w-full bg-black flex flex-col justify-center px-6 md:px-10 shrink-0">
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 0.0625rem 0.0625rem, white 0.0625rem, transparent 0)",
                backgroundSize: "1.5rem 1.5rem",
              }}
            />
            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-white relative z-10">
              Paste Player List
            </DialogTitle>
            <DialogDescription className="text-neutral-400 font-medium text-xs mt-1 relative z-10 italic">
              Format: No. Nama Nomor_Punggung Ukuran Lengan (opsional)
            </DialogDescription>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
            <div className="bg-orange-50/50 border border-orange-100/50 rounded-2xl p-4 mb-6 flex items-start gap-3">
              <Info className="w-4 h-4 text-[#D25026] mt-0.5 shrink-0" />
              <div className="text-[11px] leading-relaxed text-neutral-600 font-medium">
                <p className="font-bold text-slate-800 mb-1">
                  Panduan Penginputan Otomatis:
                </p>
                <p>
                  • Masukkan list berisi{" "}
                  <span className="font-bold">
                    No, Nama, No Punggung, Ukuran Baju
                  </span>
                  , dan <span className="font-bold">Lengan</span>.
                </p>
                <p>
                  • Jika kolom lengan dikosongkan, sistem akan otomatis memilih{" "}
                  <span className="font-bold">Lengan Pendek</span>.
                </p>
                <p>
                  • Contoh:{" "}
                  <span className="italic">1. BAYU 10 L Pendek</span> atau{" "}
                  <span className="italic">2. YUSUF 23 XL Panjang</span>
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">
                Paste Your List Here
              </Label>
              <Textarea
                ref={textareaRef as any}
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                onPaste={handleTextareaPaste}
                placeholder={
                  "1. BAYU, 10, L, Pendek\n2. YUSUF, 23, XL, Lengan Panjang"
                }
                className="min-h-[16rem] md:min-h-[18rem] rounded-[1.5rem] border-neutral-100 text-sm p-4 md:p-6 focus:ring-[#D25026]/10 focus:border-[#D25026]/20 bg-neutral-50/50 resize-none transition-all"
              />
            </div>
          </div>

          <div className="p-6 md:p-8 pt-4 border-t border-neutral-50 bg-white shrink-0">
            <div className="flex gap-4">
              <Button
                onClick={() => setIsPasteDialogOpen(false)}
                variant="ghost"
                className="flex-1 rounded-2xl h-12 md:h-14 text-xs font-black uppercase tracking-widest italic hover:bg-neutral-50"
              >
                Cancel
              </Button>
              <Button
                onClick={parsePasteData}
                className="flex-[2] rounded-2xl h-12 md:h-14 bg-[#D25026] text-white text-xs font-black uppercase tracking-widest italic shadow-xl shadow-[#D25026]/20 hover:bg-[#B34320] transition-all"
              >
                Process List
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
