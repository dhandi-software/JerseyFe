import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { CustomSelect } from "~/components/ui/custom-select";
import type { BahanOption } from "~/types/buatPesanan";

interface CustomerDataSectionProps {
    customerName: string;
    onCustomerNameChange: (val: string) => void;
    customerPhone: string;
    onCustomerPhoneChange: (val: string) => void;
    allBahan: BahanOption[];
    selectedBahanId: string;
    onSelectBahan: (bahanId: string) => void;
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
    variant = "desktop"
}: CustomerDataSectionProps) {
    if (variant === "mobile") {
        return (
            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase italic tracking-tighter text-neutral-900">
                    Data Pelanggan
                </h3>
                <div className="space-y-4">
                    <div>
                        <Label className="text-[10px] font-bold mb-1.5 block">Nama Pelanggan</Label>
                        <Input 
                            value={customerName}
                            onChange={e => onCustomerNameChange(e.target.value)}
                            placeholder="Contoh: Budi"
                            className="w-full bg-neutral-50 h-11 rounded-xl px-4 text-xs font-medium"
                            required
                        />
                    </div>
                    <div>
                        <Label className="text-[10px] font-bold mb-1.5 block">Nomor Telepon</Label>
                        <Input 
                            value={customerPhone}
                            onChange={e => onCustomerPhoneChange(e.target.value)}
                            placeholder="Contoh: 08123456789"
                            className="w-full bg-neutral-50 h-11 rounded-xl px-4 text-xs font-medium"
                            required
                        />
                    </div>
                    <div>
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
                            className="w-full h-11 bg-neutral-50 border-none text-xs"
                        />
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
                <div>
                    <Label className="text-xs font-bold mb-2 block">Nama Pelanggan</Label>
                    <Input 
                        value={customerName}
                        onChange={e => onCustomerNameChange(e.target.value)}
                        placeholder="Contoh: Budi Santoso"
                        className="w-full bg-neutral-50 h-[3.25rem] rounded-xl px-5 text-sm font-medium"
                        required
                    />
                </div>
                <div>
                    <Label className="text-xs font-bold mb-2 block">Nomor Telepon</Label>
                    <Input 
                        value={customerPhone}
                        onChange={e => onCustomerPhoneChange(e.target.value)}
                        placeholder="Contoh: 08123456789"
                        className="w-full bg-neutral-50 h-[3.25rem] rounded-xl px-5 text-sm font-medium"
                        required
                    />
                </div>
                <div>
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
                        className="w-full h-[3.25rem] bg-neutral-50 border-none"
                    />
                </div>
            </div>
        </div>
    );
}
