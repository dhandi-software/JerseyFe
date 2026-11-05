import { Store } from "lucide-react";
import { cn } from "~/lib/utils";
import type { StorageLocation } from "~/types/storageLocation";

interface StorageLocationFilterBarProps {
  locations: StorageLocation[];
  selectedLocationId: number | "all" | "unassigned";
  onSelectLocation: (id: number | "all" | "unassigned") => void;
  onOpenManager: () => void;
  totalOrdersInTab: number;
  unassignedCount: number;
  variant?: "desktop" | "mobile";
  className?: string;
}

export function StorageLocationFilterBar({
  locations,
  selectedLocationId,
  onSelectLocation,
  onOpenManager,
  totalOrdersInTab,
  unassignedCount,
  variant = "desktop",
  className,
}: StorageLocationFilterBarProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs mb-4",
        variant === "mobile" && "flex-col items-stretch p-3",
        className
      )}
    >
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scrollbar flex-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 italic whitespace-nowrap px-1">
          Filter Toko:
        </span>

        {/* All stores button */}
        <button
          type="button"
          onClick={() => onSelectLocation("all")}
          className={cn(
            "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic whitespace-nowrap transition-all cursor-pointer border",
            selectedLocationId === "all"
              ? "bg-[#D25026] text-white border-[#D25026] shadow-2xs"
              : "bg-slate-50 text-slate-600 hover:bg-slate-100 border-slate-200"
          )}
        >
          Semua ({totalOrdersInTab})
        </button>

        {/* Unassigned orders button */}
        <button
          type="button"
          onClick={() => onSelectLocation("unassigned")}
          className={cn(
            "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic whitespace-nowrap transition-all cursor-pointer border",
            selectedLocationId === "unassigned"
              ? "bg-amber-500 text-white border-amber-500 shadow-2xs"
              : "bg-amber-50 text-amber-800 hover:bg-amber-100 border-amber-200"
          )}
        >
          Belum Ada Toko ({unassignedCount})
        </button>

        {/* Individual location buttons */}
        {locations.map((loc) => (
          <button
            key={loc.id}
            type="button"
            onClick={() => onSelectLocation(loc.id)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest italic whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1.5",
              selectedLocationId === loc.id
                ? "bg-indigo-600 text-white border-indigo-600 shadow-2xs"
                : "bg-indigo-50/50 text-indigo-900 hover:bg-indigo-100 border-indigo-200"
            )}
          >
            <span className="font-mono text-[9px] bg-black/10 px-1 rounded">{loc.code}</span>
            <span>{loc.name}</span>
            <span className="opacity-80">({loc.orderCount || 0})</span>
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onOpenManager}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider italic transition-all shadow-xs shrink-0 cursor-pointer"
      >
        <Store size={13} className="text-[#D25026]" />
        <span>Kelola Lokasi Toko</span>
      </button>
    </div>
  );
}
