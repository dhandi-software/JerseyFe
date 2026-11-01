import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { CustomSelect } from "~/components/ui/custom-select";
import { cn } from "~/lib/utils";
import type { BahanOption } from "~/types/buatPesanan";

interface CustomerDataSectionProps {
    customerName: string;
    onCustomerNameChange: (val: string) => void;
    customerPhone: string;
    onCustomerPhoneChange: (val: string) => void;
    allBahan: BahanOption[];
    selectedBahanId: string;
    onSelectBahan: (bahanId: string) => void;
    showValidation?: boolean;
    variant?: "desktop" | "mobile";
}

export function CustomerDataSection({
    customerName,
    onCustomerNameChange,
    customerPhone,
    onCustomerPhoneChange,
    allBahan,
    selectedBahanId,
    onSelectBahan,
    showValidation = false,
    variant = "desktop"
}: CustomerDataSectionProps) {
    if (variant === "mobile") {
        return (
            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase italic tracking-tighter text-neutral-900">
                    Data Pelanggan
                </h3>
                <div className="space-y-4">
                    <div id="field-customer-name-container">
                        <Label className="text-[10px] font-bold mb-1.5 block">Nama Pelanggan</Label>
                        <Input 
                            id="field-customer-name"
                            value={customerName}
                            onChange={e => onCustomerNameChange(e.target.value)}
                            placeholder="Contoh: Budi"
                            className={cn(
                                "w-full bg-neutral-50 h-11 rounded-xl px-4 text-xs font-medium transition-all",
                                showValidation && !customerName.trim() && "border-red-500 bg-red-50/30 ring-2 ring-red-500/20"
                            )}
                            required
                        />
                        {showValidation && !customerName.trim() && (
                            <p className="text-[10px] font-bold text-red-500 mt-1">* Mohon isi nama pelanggan</p>
                        )}
                    </div>
                    <div id="field-customer-phone-container">
                        <Label className="text-[10px] font-bold mb-1.5 block">Nomor Telepon</Label>
                        <Input 
                            id="field-customer-phone"
                            value={customerPhone}
                            onChange={e => onCustomerPhoneChange(e.target.value)}
                            placeholder="Contoh: 08123456789"
                            className={cn(
                                "w-full bg-neutral-50 h-11 rounded-xl px-4 text-xs font-medium transition-all",
                                showValidation && !customerPhone.trim() && "border-red-500 bg-red-50/30 ring-2 ring-red-500/20"
                            )}
                            required
                        />
                        {showValidation && !customerPhone.trim() && (
                            <p className="text-[10px] font-bold text-red-500 mt-1">* Mohon isi nomor telepon</p>
                        )}
                    </div>
                    <div id="field-bahan-baku">
                        <Label className="text-[10px] font-bold mb-1.5 block">Pilih Bahan Baku</Label>
                        <CustomSelect 
                            options={allBahan.map(b => ({
                                label: `${b.nama} (${b.status || "Tersedia"})`,
                                value: b.id.toString(),
                                disabled: b.status === "Habis"
                            }))}
                            value={selectedBahanId}
                            onChange={onSelectBahan}
                            placeholder="Pilih Bahan"
                            className={cn(
                                "w-full h-11 bg-neutral-50 border-none text-xs transition-all",
                                showValidation && !selectedBahanId && "!border !border-red-500 !bg-red-50/40 ring-2 ring-red-500/20"
                            )}
                        />
                        {showValidation && !selectedBahanId && (
                            <p className="text-[10px] font-bold text-red-500 mt-1">* Mohon pilih bahan baku terlebih dahulu</p>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-neutral-900 italic uppercase tracking-tighter">
                Data Pelanggan & Bahan
            </h2>
            <div className="grid grid-cols-3 gap-6">
                <div id="field-customer-name-container">
                    <Label className="text-xs font-bold mb-2 block">Nama Pelanggan</Label>
                    <Input 
                        id="field-customer-name"
                        value={customerName}
                        onChange={e => onCustomerNameChange(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className={cn(
                            "w-full bg-neutral-50 h-[3.25rem] rounded-xl px-5 text-sm font-medium transition-all",
                            showValidation && !customerName.trim() && "border-red-500 bg-red-50/30 ring-2 ring-red-500/20"
                        )}
                        required
                    />
                    {showValidation && !customerName.trim() && (
                        <p className="text-[11px] font-bold text-red-500 mt-1.5">* Mohon isi nama pelanggan</p>
                    )}
                </div>
                <div id="field-customer-phone-container">
                    <Label className="text-xs font-bold mb-2 block">Nomor Telepon</Label>
                    <Input 
                        id="field-customer-phone"
                        value={customerPhone}
                        onChange={e => onCustomerPhoneChange(e.target.value)}
                        placeholder="Contoh: 08123456789"
                        className={cn(
                            "w-full bg-neutral-50 h-[3.25rem] rounded-xl px-5 text-sm font-medium transition-all",
                            showValidation && !customerPhone.trim() && "border-red-500 bg-red-50/30 ring-2 ring-red-500/20"
                        )}
                        required
                    />
                    {showValidation && !customerPhone.trim() && (
                        <p className="text-[11px] font-bold text-red-500 mt-1.5">* Mohon isi nomor telepon</p>
                    )}
                </div>
                <div id="field-bahan-baku">
                    <Label className="text-xs font-bold mb-2 block">Pilih Bahan Baku</Label>
                    <CustomSelect 
                        options={allBahan.map(b => ({
                            label: `${b.nama} (${b.status || "Tersedia"})`,
                            value: b.id.toString(),
                            disabled: b.status === "Habis"
                        }))}
                        value={selectedBahanId}
                        onChange={onSelectBahan}
                        placeholder="Pilih Bahan"
                        className={cn(
                            "w-full h-[3.25rem] bg-neutral-50 border-none transition-all",
                            showValidation && !selectedBahanId && "!border !border-red-500 !bg-red-50/40 ring-2 ring-red-500/20"
                        )}
                    />
                    {showValidation && !selectedBahanId && (
                        <p className="text-[11px] font-bold text-red-500 mt-1.5">* Mohon pilih bahan baku terlebih dahulu</p>
                    )}
                </div>
            </div>
        </div>
    );
}
