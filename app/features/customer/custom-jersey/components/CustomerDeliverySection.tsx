/**
 * CustomerDeliverySection Component
 * Step 2: Custom design instructions and shipping delivery selection (Pickup vs COD).
 * FCSV Apparel — Batch 2 Milestone M3 (R1 UI Decomposition)
 */

import { Info } from "lucide-react";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";

export interface CustomerDeliverySectionProps {
  designNote: string;
  setDesignNote: (val: string) => void;
  shippingMethod: string;
  setShippingMethod: (method: string) => void;
  shippingAddress: string;
  setShippingAddress: (addr: string) => void;
  showValidation: boolean;
  [key: string]: any;
}

export function CustomerDeliverySection({
  designNote,
  setDesignNote,
  shippingMethod,
  setShippingMethod,
  shippingAddress,
  setShippingAddress,
  showValidation,
}: CustomerDeliverySectionProps) {
  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-2xl md:text-3xl font-black text-neutral-900 italic uppercase tracking-tighter">
          Catatan & Pengiriman
        </h2>
        <p className="text-neutral-400 font-medium text-xs md:text-sm mt-1">
          Tambahkan instruksi catatan khusus dan tentukan opsi pengiriman pesanan Anda.
        </p>
      </div>

      {/* Catatan Tambahan Desain */}
      <div className="space-y-2.5">
        <Label className="text-[11px] font-black uppercase tracking-widest italic text-neutral-900">
          Catatan Tambahan Desain & Pesanan
        </Label>
        <Textarea
          value={designNote}
          onChange={(e) => setDesignNote(e.target.value)}
          placeholder="Jelaskan detail desain tambahan (warna logo, sponsor, posisi nomor, dll)..."
          className="min-h-[10rem] md:min-h-[14rem] rounded-[2rem] md:rounded-[2.5rem] border-neutral-100 p-6 md:p-8 focus:ring-[#D25026]/10 focus:border-[#D25026] bg-white shadow-sm ring-1 ring-black/5 text-sm font-medium leading-relaxed w-full resize-none"
        />
      </div>

      {/* Opsi Pengiriman */}
      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-neutral-100 p-6 md:p-8 shadow-sm ring-1 ring-black/5 space-y-6">
        <div>
          <h3 className="text-base md:text-lg font-black italic uppercase tracking-tighter text-neutral-900">
            Opsi Pengiriman
          </h3>
          <p className="text-neutral-400 text-xs font-medium mt-1">
            Pilih metode penyerahan pesanan jersey Anda.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          {[
            { value: "PICKUP", label: "Ambil di Tempat (Self-Pickup)" },
            { value: "COD", label: "COD (Penerima Yang Bayar)" },
          ].map((method) => (
            <button
              key={method.value}
              type="button"
              onClick={() => setShippingMethod(method.value)}
              className={cn(
                "flex-1 py-3.5 md:py-4 px-5 md:px-6 rounded-2xl text-xs font-black uppercase tracking-widest italic border transition-all duration-300 cursor-pointer",
                shippingMethod === method.value
                  ? "bg-black text-white border-black shadow-lg"
                  : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-400 hover:text-black",
              )}
            >
              {method.label}
            </button>
          ))}
        </div>

        {shippingMethod === "PICKUP" ? (
          <div className="bg-orange-50/50 border border-orange-100/50 rounded-2xl p-5 md:p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-10 h-10 bg-[#D25026]/10 rounded-xl flex items-center justify-center shrink-0">
              <Info className="text-[#D25026] w-5 h-5" />
            </div>
            <div className="text-xs leading-relaxed text-neutral-700">
              <p className="font-black uppercase tracking-wider text-[#D25026] mb-1">
                Catatan Pengambilan:
              </p>
              <p className="font-medium">
                Anda dapat mengunjungi toko kami secara langsung untuk mengambil pesanan jersey Anda setelah selesai diproduksi.
              </p>
              <p className="font-black uppercase tracking-wider text-neutral-900 mt-2 mb-0.5">
                Alamat Toko:
              </p>
              <p className="font-bold font-mono text-neutral-900 bg-white/60 p-3 rounded-lg border border-orange-200/50">
                Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label className="text-[11px] font-black uppercase tracking-widest italic text-neutral-900">
              Alamat yang Dituju (Penerima)
            </Label>
            <Textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              placeholder="Tulis alamat pengiriman secara detail (Nama penerima, No HP, Nama Jalan, RT/RW, Kecamatan, Kabupaten, Kode Pos)..."
              className={cn(
                "min-h-[8rem] rounded-2xl border-neutral-100 p-5 md:p-6 focus:ring-[#D25026]/10 focus:border-[#D25026] bg-neutral-50/50 text-sm font-medium leading-relaxed resize-none",
                showValidation &&
                  shippingAddress.trim() === "" &&
                  "border-red-500 bg-red-50/20",
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}
