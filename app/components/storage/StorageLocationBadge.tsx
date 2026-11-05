import { Store, AlertTriangle } from "lucide-react";
import { cn } from "~/lib/utils";
import type { StorageLocation } from "~/types/storageLocation";

interface StorageLocationBadgeProps {
  location?: StorageLocation | null;
  size?: "xs" | "sm" | "md";
  interactive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function StorageLocationBadge({
  location,
  size = "sm",
  interactive = false,
  onClick,
  className,
}: StorageLocationBadgeProps) {
  if (!location) {
    return (
      <span
        onClick={interactive ? onClick : undefined}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg border font-black uppercase tracking-widest italic transition-colors",
          size === "xs" && "px-2 py-0.5 text-[8px]",
          size === "sm" && "px-2.5 py-1 text-[10px]",
          size === "md" && "px-3 py-1.5 text-xs",
          "bg-amber-50 text-amber-800 border-amber-200",
          interactive && "cursor-pointer hover:bg-amber-100",
          className
        )}
        title="Belum ditempatkan di lokasi toko"
      >
        <AlertTriangle className={cn(size === "xs" ? "w-2.5 h-2.5" : "w-3 h-3", "text-amber-600 shrink-0")} />
        <span>Belum Ada Lokasi</span>
      </span>
    );
  }

  return (
    <span
      onClick={interactive ? onClick : undefined}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-lg border font-black uppercase tracking-widest italic transition-colors",
        size === "xs" && "px-2 py-0.5 text-[8px]",
        size === "sm" && "px-2.5 py-1 text-[10px]",
        size === "md" && "px-3 py-1.5 text-xs",
        "bg-indigo-50 text-indigo-800 border-indigo-200",
        interactive && "cursor-pointer hover:bg-indigo-100",
        className
      )}
      title={`${location.name} (${location.code})${location.address ? ` - ${location.address}` : ""}`}
    >
      <Store className={cn(size === "xs" ? "w-2.5 h-2.5" : "w-3 h-3", "text-indigo-600 shrink-0")} />
      <span className="font-mono text-[9px] bg-indigo-200/60 text-indigo-950 px-1 rounded">{location.code}</span>
      <span className="truncate max-w-[120px]">{location.name}</span>
    </span>
  );
}
