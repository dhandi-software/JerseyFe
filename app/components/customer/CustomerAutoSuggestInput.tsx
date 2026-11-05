import { useState, useRef, useEffect } from "react";
import { User, Phone, Search, Loader2, Award, Clock } from "lucide-react";
import { cn, formatRupiah } from "~/lib/utils";
import type { CustomerSuggestion } from "~/types/customerTracking";

interface CustomerAutoSuggestInputProps {
  value: string;
  onChange: (val: string) => void;
  onSelectCustomer: (customer: CustomerSuggestion) => void;
  suggestions: CustomerSuggestion[];
  isLoading?: boolean;
  onSearch: (q: string) => void;
  label?: string;
  placeholder?: string;
  showValidation?: boolean;
  errorMessage?: string;
  variant?: "desktop" | "mobile";
  id?: string;
  className?: string;
}

export function CustomerAutoSuggestInput({
  value,
  onChange,
  onSelectCustomer,
  suggestions,
  isLoading = false,
  onSearch,
  label = "Nama Pelanggan",
  placeholder = "Ketik nama pelanggan untuk mencari...",
  showValidation = false,
  errorMessage = "* Mohon isi nama pelanggan",
  variant = "desktop",
  id = "field-customer-name",
  className,
}: CustomerAutoSuggestInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    onChange(newVal);
    onSearch(newVal);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleSelect = (customer: CustomerSuggestion) => {
    onSelectCustomer(customer);
    setIsOpen(false);
    setHighlightedIndex(-1);
  };

  const isInvalid = showValidation && !value.trim();

  return (
    <div ref={containerRef} className={cn("relative font-geist", className)}>
      {label && (
        <label
          htmlFor={id}
          className={cn(
            "font-bold block",
            variant === "mobile" ? "text-[10px] mb-1.5" : "text-xs mb-2"
          )}
        >
          {label}
        </label>
      )}

      <div className="relative">
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={isOpen && suggestions.length > 0}
          aria-autocomplete="list"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            if (value.trim().length >= 2 && suggestions.length > 0) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            "w-full bg-neutral-50 rounded-xl font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#D25026]/20 focus:border-[#D25026] border border-neutral-200",
            variant === "mobile" ? "h-11 px-4 text-xs" : "h-[3.25rem] px-5 text-sm",
            isInvalid && "border-red-500 bg-red-50/30 ring-2 ring-red-500/20"
          )}
          required
        />

        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-neutral-400 pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#D25026]" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </div>
      </div>

      {isInvalid && (
        <p className={cn("font-bold text-red-500", variant === "mobile" ? "text-[10px] mt-1" : "text-[11px] mt-1.5")}>
          {errorMessage}
        </p>
      )}

      {/* Auto-suggest dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3.5 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 italic">
            Pelanggan Ditemukan ({suggestions.length})
          </div>

          {suggestions.map((customer, idx) => {
            const isHighlighted = idx === highlightedIndex;
            return (
              <button
                key={`${customer.customerName}-${customer.customerPhone}-${idx}`}
                type="button"
                onClick={() => handleSelect(customer)}
                className={cn(
                  "w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 transition-colors cursor-pointer",
                  isHighlighted ? "bg-[#FFF0EB]/80 text-[#D25026]" : "hover:bg-slate-50 text-slate-700"
                )}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs uppercase italic text-slate-900 truncate">
                      {customer.customerName}
                    </span>
                    {customer.totalOrders > 1 ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
                        <Award size={10} className="text-amber-500" />
                        {customer.totalOrders} Pesanan
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold text-slate-500 bg-slate-100 border border-slate-200">
                        1 Pesanan
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <Phone size={10} className="text-slate-400" />
                      {customer.customerPhone || "Tanpa no. telepon"}
                    </span>
                    <span className="font-semibold text-emerald-700">
                      Total: {formatRupiah(customer.totalSpent)}
                    </span>
                  </div>
                </div>

                {customer.lastOrderDate && (
                  <div className="text-right shrink-0">
                    <span className="text-[9px] font-medium text-slate-400 flex items-center gap-1">
                      <Clock size={9} />
                      {new Date(customer.lastOrderDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
