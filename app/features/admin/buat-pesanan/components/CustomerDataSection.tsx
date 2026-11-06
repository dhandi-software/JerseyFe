import { useState } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { CustomSelect } from "~/components/ui/custom-select";
import { cn } from "~/lib/utils";
import type { BahanOption } from "~/types/buatPesanan";
import type { BahanBajuItem } from "~/types/material";
import { useCustomerTracking } from "~/hooks/useCustomerTracking";
import {
    CustomerAutoSuggestInput,
    CustomerRepeatBadge,
    CustomerHistoryModal
} from "~/components/customer";
import { CustomMaterialModal } from "./CustomMaterialModal";
import type { CustomerSuggestion } from "~/types/customerTracking";

interface CustomerDataSectionProps {
    customerName: string;
    onCustomerNameChange: (val: string) => void;
    customerPhone: string;
    onCustomerPhoneChange: (val: string) => void;
    allBahan: BahanOption[];
    selectedBahanId: string;
    onSelectBahan: (bahanId: string) => void;
    onMaterialCreated?: (createdBahan: BahanBajuItem) => void;
    onToast?: (msg: string, variant: "success" | "destructive" | "default") => void;
    isCustomMaterial?: boolean;
    customMaterialName?: string;
    onCustomMaterialNameChange?: (val: string) => void;
    materialPrice?: number;
    onMaterialPriceChange?: (val: number) => void;
    discount?: number;
    onDiscountChange?: (val: number) => void;
    subtotal?: number;
    total?: number;
    showValidation?: boolean;
    variant?: "desktop" | "mobile";
}

export function CustomerDataSection({
    customerName, onCustomerNameChange,
    customerPhone, onCustomerPhoneChange,
    allBahan, selectedBahanId, onSelectBahan,
    onMaterialCreated, onToast,
    isCustomMaterial = false, customMaterialName = "", onCustomMaterialNameChange,
    materialPrice = 150000, onMaterialPriceChange,
    discount = 0, onDiscountChange,
    subtotal = 0, total = 0,
    showValidation = false, variant = "desktop"
}: CustomerDataSectionProps) {
    const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);

    const {
        suggestions, isLoadingSuggestions, selectedCustomer, selectCustomer,
        clearSelectedCustomer, searchCustomers, historyData, isLoadingHistory,
        historyError, isHistoryModalOpen, openHistoryModal, closeHistoryModal
    } = useCustomerTracking();

    const handleSelectCustomer = (cust: CustomerSuggestion) => {
        selectCustomer(cust);
        onCustomerNameChange(cust.customerName);
        if (cust.customerPhone) {
            onCustomerPhoneChange(cust.customerPhone);
        }
    };

    const handleSelectBahanChange = (val: string) => {
        if (val === "CUSTOM") {
            setIsCustomModalOpen(true);
            return;
        }
        onSelectBahan(val);
    };

    const handleMaterialCreatedSuccess = (createdBahan: BahanBajuItem) => {
        if (onMaterialCreated) {
            onMaterialCreated(createdBahan);
        } else {
            onSelectBahan(String(createdBahan.id));
        }
    };

    const materialOptions = [
        ...allBahan.map(b => ({
            label: `${b.nama} (${b.status || "Tersedia"}) - Rp ${(b.harga || 150000).toLocaleString("id-ID")}`,
            value: b.id.toString(),
            disabled: b.status === "Habis"
        })),
        { label: "+ Tambah Bahan Kustom...", value: "CUSTOM" }
    ];

    if (variant === "mobile") {
        return (
            <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm space-y-4">
                <h3 className="text-xs font-black uppercase italic tracking-tighter text-neutral-900">
                    Data Pelanggan & Bahan
                </h3>
                <div className="space-y-4">
                    <div id="field-customer-name-container">
                        <CustomerAutoSuggestInput
                            id="field-customer-name" value={customerName} onChange={onCustomerNameChange}
                            onSearch={searchCustomers} suggestions={suggestions} isLoading={isLoadingSuggestions}
                            onSelectCustomer={handleSelectCustomer} placeholder="Contoh: Budi"
                            showValidation={showValidation} variant="mobile"
                        />
                    </div>

                    <div id="field-customer-phone-container">
                        <Label className="text-[10px] font-bold mb-1.5 block">Nomor Telepon</Label>
                        <Input 
                            id="field-customer-phone" type="tel" inputMode="numeric" pattern="[0-9]*"
                            value={customerPhone} onChange={e => onCustomerPhoneChange(e.target.value.replace(/\D/g, ""))}
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

                    {selectedCustomer && (
                        <CustomerRepeatBadge
                            customer={selectedCustomer} onOpenHistory={openHistoryModal}
                            onClear={clearSelectedCustomer} variant="mobile"
                        />
                    )}

                    <div id="field-bahan-baku">
                        <div className="flex items-center justify-between mb-1.5">
                            <Label className="text-[10px] font-bold block">Pilih Bahan Baku</Label>
                            {isCustomMaterial && (
                                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                    Bahan Kustom
                                </span>
                            )}
                        </div>
                        <CustomSelect 
                            options={materialOptions} value={selectedBahanId} onChange={handleSelectBahanChange}
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

                    {isCustomMaterial && (
                        <div id="field-custom-material-name-container" className="animate-in fade-in duration-200">
                            <Label className="text-[10px] font-bold mb-1.5 block text-[#D25026]">Nama Bahan Kustom Baru</Label>
                            <Input 
                                id="field-custom-material-name" value={customMaterialName}
                                onChange={e => onCustomMaterialNameChange?.(e.target.value)}
                                placeholder="Contoh: Dryfit Brazil Super Light"
                                className={cn(
                                    "w-full bg-orange-50/40 border border-orange-200 h-11 rounded-xl px-4 text-xs font-medium transition-all",
                                    showValidation && !customMaterialName.trim() && "border-red-500 bg-red-50/30 ring-2 ring-red-500/20"
                                )}
                            />
                            {showValidation && !customMaterialName.trim() && (
                                <p className="text-[10px] font-bold text-red-500 mt-1">* Mohon isi nama bahan baru</p>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
                        <div id="field-material-price-container">
                            <Label className="text-[10px] font-bold mb-1.5 block">Harga Satuan Bahan (Rp)</Label>
                            <Input 
                                id="field-material-price" type="text" inputMode="numeric"
                                value={materialPrice ? materialPrice.toLocaleString("id-ID") : ""}
                                onChange={e => {
                                    const rawDigits = e.target.value.replace(/\D/g, "");
                                    onMaterialPriceChange?.(rawDigits ? parseInt(rawDigits, 10) : 0);
                                }}
                                placeholder="150.000" className="w-full bg-neutral-50 h-11 rounded-xl px-3 text-xs font-semibold"
                            />
                            <p className="text-[9px] text-neutral-400 mt-1">Harga per pcs (editable)</p>
                        </div>

                        <div id="field-discount-container">
                            <Label className="text-[10px] font-bold mb-1.5 block">Diskon Nota (Rp)</Label>
                            <Input 
                                id="field-discount" type="text" inputMode="numeric"
                                value={discount ? discount.toLocaleString("id-ID") : ""}
                                onChange={e => {
                                    const rawDigits = e.target.value.replace(/\D/g, "");
                                    onDiscountChange?.(rawDigits ? parseInt(rawDigits, 10) : 0);
                                }}
                                placeholder="0" className="w-full bg-neutral-50 h-11 rounded-xl px-3 text-xs font-semibold"
                            />
                            <p className="text-[9px] text-neutral-400 mt-1">Opsional (potongan nota)</p>
                        </div>
                    </div>

                    {/* Live Calculation Summary Mobile */}
                    <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100 space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-neutral-500 font-medium text-[11px]">Subtotal Kotor:</span>
                            <span className="font-bold text-neutral-800">Rp {(subtotal || 0).toLocaleString("id-ID")}</span>
                        </div>
                        {(discount || 0) > 0 && (
                            <div className="flex justify-between items-center text-xs text-emerald-600">
                                <span className="font-medium text-[11px]">Diskon Nota:</span>
                                <span className="font-bold">- Rp {(discount || 0).toLocaleString("id-ID")}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center pt-1.5 border-t border-neutral-200">
                            <span className="text-xs font-black uppercase italic tracking-wider text-neutral-900">Total Akhir:</span>
                            <span className="text-sm font-black text-[#D25026]">Rp {(total || 0).toLocaleString("id-ID")}</span>
                        </div>
                    </div>
                </div>

                <CustomerHistoryModal
                    isOpen={isHistoryModalOpen} onClose={closeHistoryModal}
                    data={historyData} loading={isLoadingHistory} error={historyError}
                />

                <CustomMaterialModal
                    isOpen={isCustomModalOpen}
                    onClose={() => setIsCustomModalOpen(false)}
                    onSuccess={handleMaterialCreatedSuccess}
                    onToast={onToast}
                    variant="mobile"
                />
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-black text-neutral-900 italic uppercase tracking-tighter">
                    Data Pelanggan & Bahan
                </h2>
                {isCustomMaterial && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-xs font-black uppercase tracking-wider italic">
                        Mode Bahan Kustom Aktif
                    </span>
                )}
            </div>

            <div className="grid grid-cols-3 gap-6">
                <div id="field-customer-name-container">
                    <CustomerAutoSuggestInput
                        id="field-customer-name" value={customerName} onChange={onCustomerNameChange}
                        onSearch={searchCustomers} suggestions={suggestions} isLoading={isLoadingSuggestions}
                        onSelectCustomer={handleSelectCustomer} placeholder="Contoh: Budi Santoso"
                        showValidation={showValidation} variant="desktop"
                    />
                </div>

                <div id="field-customer-phone-container">
                    <Label className="text-xs font-bold mb-2 block">Nomor Telepon</Label>
                    <Input 
                        id="field-customer-phone" type="tel" inputMode="numeric" pattern="[0-9]*"
                        value={customerPhone} onChange={e => onCustomerPhoneChange(e.target.value.replace(/\D/g, ""))}
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
                        options={materialOptions} value={selectedBahanId} onChange={handleSelectBahanChange}
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

            {selectedCustomer && (
                <CustomerRepeatBadge
                    customer={selectedCustomer} onOpenHistory={openHistoryModal}
                    onClear={clearSelectedCustomer} variant="desktop"
                />
            )}

            {isCustomMaterial && (
                <div id="field-custom-material-name-container" className="animate-in fade-in duration-200">
                    <Label className="text-xs font-bold mb-2 block text-[#D25026]">
                        Nama Bahan Kustom Baru
                    </Label>
                    <Input 
                        id="field-custom-material-name" value={customMaterialName}
                        onChange={e => onCustomMaterialNameChange?.(e.target.value)}
                        placeholder="Masukkan nama bahan kustom baru (Contoh: Dryfit Milano Emboss Premium)"
                        className={cn(
                            "w-full bg-orange-50/40 border border-orange-200 h-[3.25rem] rounded-xl px-5 text-sm font-medium transition-all",
                            showValidation && !customMaterialName.trim() && "border-red-500 bg-red-50/30 ring-2 ring-red-500/20"
                        )}
                    />
                    {showValidation && !customMaterialName.trim() && (
                        <p className="text-[11px] font-bold text-red-500 mt-1.5">* Mohon isi nama bahan baru</p>
                    )}
                </div>
            )}

            {/* Dynamic Price & Discount Inputs */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                <div id="field-material-price-container">
                    <Label className="text-xs font-bold mb-2 block">
                        Harga Satuan Bahan (Rp)
                    </Label>
                    <Input 
                        id="field-material-price" type="text" inputMode="numeric"
                        value={materialPrice ? materialPrice.toLocaleString("id-ID") : ""}
                        onChange={e => {
                            const rawDigits = e.target.value.replace(/\D/g, "");
                            onMaterialPriceChange?.(rawDigits ? parseInt(rawDigits, 10) : 0);
                        }}
                        placeholder="150.000" className="w-full bg-neutral-50 h-[3.25rem] rounded-xl px-5 text-sm font-semibold"
                    />
                    <p className="text-[11px] text-neutral-400 mt-1.5">
                        Harga dasar satuan jersey per pesanan (dapat disesuaikan manual)
                    </p>
                </div>

                <div id="field-discount-container">
                    <Label className="text-xs font-bold mb-2 block">
                        Diskon Nota (Rp) [Opsional]
                    </Label>
                    <Input 
                        id="field-discount" type="text" inputMode="numeric"
                        value={discount ? discount.toLocaleString("id-ID") : ""}
                        onChange={e => {
                            const rawDigits = e.target.value.replace(/\D/g, "");
                            onDiscountChange?.(rawDigits ? parseInt(rawDigits, 10) : 0);
                        }}
                        placeholder="0" className="w-full bg-neutral-50 h-[3.25rem] rounded-xl px-5 text-sm font-semibold"
                    />
                    <p className="text-[11px] text-neutral-400 mt-1.5">
                        Potongan harga nota total (kosongkan atau isi 0 jika tanpa diskon)
                    </p>
                </div>
            </div>

            {/* Real-time Calculation Summary Desktop */}
            <div className="bg-neutral-50 rounded-2xl p-5 border border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-8">
                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 block mb-1">
                            Subtotal Kotor
                        </span>
                        <span className="text-base font-black text-neutral-800">
                            Rp {(subtotal || 0).toLocaleString("id-ID")}
                        </span>
                    </div>
                    {(discount || 0) > 0 && (
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 block mb-1">
                                Potongan Diskon
                            </span>
                            <span className="text-base font-black text-emerald-600">
                                - Rp {(discount || 0).toLocaleString("id-ID")}
                            </span>
                        </div>
                    )}
                </div>

                <div className="text-right">
                    <span className="text-[10px] font-black uppercase tracking-widest italic text-neutral-400 block mb-1">
                        Total Akhir Nota
                    </span>
                    <span className="text-2xl font-black text-[#D25026]">
                        Rp {(total || 0).toLocaleString("id-ID")}
                    </span>
                </div>
            </div>

            <CustomerHistoryModal
                isOpen={isHistoryModalOpen} onClose={closeHistoryModal}
                data={historyData} loading={isLoadingHistory} error={historyError}
            />

            <CustomMaterialModal
                isOpen={isCustomModalOpen}
                onClose={() => setIsCustomModalOpen(false)}
                onSuccess={handleMaterialCreatedSuccess}
                onToast={onToast}
                variant="desktop"
            />
        </div>
    );
}
