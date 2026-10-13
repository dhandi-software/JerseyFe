import React from "react";
import { Link } from "react-router";
import { ArrowRight, PackageSearch, Sparkles, RefreshCw } from "lucide-react";
import { cn } from "~/lib/utils";

interface HomeProductEmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  actionHref?: string;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  icon?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

export function HomeProductEmptyState({
  title = "Katalog Produk Sedang Disiapkan",
  description = "Admin FCSV sedang memperbarui daftar koleksi baju dan bahan jersey terbaru. Anda tetap dapat melakukan konsultasi atau pemesanan kustom langsung bersama kami.",
  actionText = "Pesan Custom Jersey",
  actionHref = "/customer/custom-jersey",
  secondaryActionText,
  onSecondaryAction,
  icon,
  compact = false,
  className,
}: HomeProductEmptyStateProps) {
  return (
    <div
      role="region"
      aria-label={title}
      className={cn(
        "w-full bg-white/90 backdrop-blur-xs border border-zinc-200/90 rounded-2xl text-center shadow-xs",
        compact ? "p-6 sm:p-8" : "p-8 sm:p-12",
        className
      )}
    >
      <div className="w-full mx-auto flex flex-col items-center justify-center text-center px-4">
        <div
          className={cn(
            "rounded-2xl bg-amber-50/90 border border-amber-100 flex items-center justify-center text-[#FA8232] shadow-2xs shrink-0",
            compact ? "w-12 h-12 mb-3" : "w-14 h-14 mb-4"
          )}
          aria-hidden="true"
        >
          {icon || <PackageSearch className={compact ? "w-6 h-6" : "w-7 h-7"} />}
        </div>

        <h3
          className={cn(
            "font-extrabold text-zinc-900 tracking-tight w-full",
            compact ? "text-base" : "text-lg sm:text-xl"
          )}
        >
          {title}
        </h3>

        <p
          className={cn(
            "text-zinc-600 leading-relaxed mt-2 w-full",
            compact ? "text-xs" : "text-xs sm:text-sm"
          )}
        >
          {description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          {actionHref ? (
            <Link
              to={actionHref}
              className="bg-[#FA8232] hover:bg-[#e06d20] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#FA8232] text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm inline-flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : null}

          {secondaryActionText && onSecondaryAction ? (
            <button
              type="button"
              onClick={onSecondaryAction}
              className="bg-zinc-100 hover:bg-zinc-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-zinc-400 text-zinc-800 font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{secondaryActionText}</span>
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
