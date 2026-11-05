import { useState } from "react";
import { Store, Loader2, ChevronDown, Check } from "lucide-react";
import { cn } from "~/lib/utils";
import type { StorageLocation } from "~/types/storageLocation";

interface StorageLocationSelectProps {
  currentLocationId?: number | null;
  currentLocation?: StorageLocation | null;
  locations: StorageLocation[];
  onAssign: (locationId: number | null) => Promise<void> | void;
  disabled?: boolean;
  size?: "sm" | "md";
  showLabel?: boolean;
  allowClear?: boolean;
  className?: string;
}

export function StorageLocationSelect({
  currentLocationId,
  currentLocation,
  locations,
  onAssign,
  disabled = false,
  size = "sm",
  showLabel = false,
  allowClear = true,
  className,
}: StorageLocationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeId = currentLocationId ?? currentLocation?.id ?? null;
  const activeLocation = currentLocation || locations.find((l) => l.id === activeId);

  const handleSelect = async (locId: number | null) => {
    if (locId === activeId) {
      setIsOpen(false);
      return;
    }
    setIsSubmitting(true);
    try {
      await onAssign(locId);
    } finally {
      setIsSubmitting(false);
      setIsOpen(false);
    }
  };

  return (
    <div className={cn("relative inline-block text-left font-geist", className)}>
      {showLabel && (
        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 italic mb-1">
          Lokasi Toko:
        </label>
      )}

      <button
        type="button"
        disabled={disabled || isSubmitting}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "inline-flex items-center justify-between gap-2 rounded-xl border font-black uppercase tracking-widest italic transition-all cursor-pointer shadow-2xs",
          size === "sm" ? "px-3 py-1.5 text-[11px]" : "px-4 py-2.5 text-xs",
          activeLocation
            ? "bg-indigo-50/70 border-indigo-200 text-indigo-900 hover:bg-indigo-100/70"
            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50",
          (disabled || isSubmitting) && "opacity-50 cursor-not-allowed"
        )}
      >
        <div className="flex items-center gap-1.5 min-w-0">
          {isSubmitting ? (
            <Loader2 className="w-3 h-3 animate-spin text-[#D25026]" />
          ) : (
            <Store className={cn("w-3.5 h-3.5 shrink-0", activeLocation ? "text-indigo-600" : "text-slate-400")} />
          )}
          <span className="truncate max-w-[130px]">
            {activeLocation ? `${activeLocation.name} (${activeLocation.code})` : "Pilih Lokasi Toko"}
          </span>
        </div>
        <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform", isOpen && "rotate-180")} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 mt-1.5 w-64 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            <div className="px-3 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest italic border-b border-slate-100">
              Tetapkan Lokasi Penyimpanan
            </div>

            <div className="max-h-56 overflow-y-auto divide-y divide-slate-50">
              {allowClear && (
                <button
                  type="button"
                  onClick={() => handleSelect(null)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-[10px] font-bold uppercase tracking-wider flex items-center justify-between transition-colors hover:bg-slate-50 cursor-pointer",
                    activeId === null ? "text-amber-600 bg-amber-50/40" : "text-slate-500"
                  )}
                >
                  <span>— Lepas / Belum Dialokasikan —</span>
                  {activeId === null && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              )}

              {locations.map((loc) => (
                <button
                  key={loc.id}
                  type="button"
                  onClick={() => handleSelect(loc.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs font-semibold flex items-center justify-between transition-colors hover:bg-[#FFF0EB]/40 cursor-pointer",
                    activeId === loc.id ? "bg-[#FFF0EB]/80 text-[#D25026] font-black" : "text-slate-700"
                  )}
                >
                  <div className="flex flex-col min-w-0 pr-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-[9px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded font-black">
                        {loc.code}
                      </span>
                      <span className="truncate font-bold italic">{loc.name}</span>
                    </div>
                    {loc.address && <span className="text-[10px] text-slate-400 truncate mt-0.5">{loc.address}</span>}
                  </div>
                  {activeId === loc.id && <Check className="w-3.5 h-3.5 text-[#D25026] shrink-0" />}
                </button>
              ))}

              {locations.length === 0 && (
                <div className="px-3 py-4 text-center text-[10px] font-bold text-slate-400 italic">
                  Belum ada lokasi toko dibuat
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
