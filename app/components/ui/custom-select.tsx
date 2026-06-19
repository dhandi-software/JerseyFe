import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface Option {
  label: string;
  value: string;
  disabled?: boolean;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
}

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No option found.",
  className,
  disabled = false,
}: CustomSelectProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel = options.find((opt) => opt.value === value)?.label;
  const hasSub = selectedLabel ? (selectedLabel.includes("(") && selectedLabel.endsWith(")")) : false;
  const mainLabel = selectedLabel && hasSub ? selectedLabel.split("(")[0].trim() : (selectedLabel || "");
  const subLabel = selectedLabel && hasSub ? selectedLabel.split("(")[1].replace(")", "").trim() : "";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "w-full justify-between rounded-xl border-gray-300 font-normal hover:bg-gray-50 bg-white cursor-pointer px-5 py-3 h-auto items-center flex",
            !value && "text-muted-foreground",
            className
          )}
        >
          <div className="flex flex-col text-left py-0.5">
            {selectedLabel ? (
              <>
                <span className="font-semibold text-slate-800 text-sm leading-tight">{mainLabel}</span>
                {subLabel && <span className="text-slate-400 text-[11px] font-medium mt-0.5 leading-none">{subLabel}</span>}
              </>
            ) : (
              <span className="text-slate-400 font-medium text-sm">{placeholder}</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] min-w-[var(--radix-popover-trigger-width)] p-1 rounded-xl border-gray-200 shadow-lg bg-white" 
        align="start"
      >
        <Command className="w-full">
          <CommandList className="w-full max-h-[300px] overflow-auto p-1">
            <CommandEmpty className="py-3 text-center text-sm text-gray-500">{emptyMessage}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const hasSubLabel = option.label.includes("(") && option.label.endsWith(")");
                const mainLabel = hasSubLabel ? option.label.split("(")[0].trim() : option.label;
                const subLabel = hasSubLabel ? option.label.split("(")[1].replace(")", "").trim() : "";

                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    disabled={option.disabled}
                    onSelect={() => {
                      if (option.disabled) return;
                      onChange(option.value === value ? "" : option.value);
                      setOpen(false);
                    }}
                    className={cn(
                      "cursor-pointer rounded-lg py-2.5 px-3 aria-selected:bg-gray-150 aria-selected:text-gray-900 transition-colors w-full flex items-center justify-between",
                      option.disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50 data-[selected=true]:bg-gray-100 data-[selected=true]:text-gray-900"
                    )}
                  >
                    <div className="flex items-center">
                      <Check
                        className={cn(
                          "mr-3 h-4 w-4 shrink-0 text-[#D25026]",
                          value === option.value ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <div className="flex flex-col text-left">
                        <span className="font-semibold text-slate-800 text-sm leading-tight">{mainLabel}</span>
                        {subLabel && <span className="text-slate-400 text-[11px] font-medium mt-0.5 leading-none">{subLabel}</span>}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
