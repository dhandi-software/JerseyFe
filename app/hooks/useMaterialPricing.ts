import { useState, useEffect } from "react";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";
import { getSizeSurcharge, getJerseyKgRequirement } from "~/features/admin/buat-pesanan/utils";
import type { 
    MaterialOption, 
    MaterialProduct, 
    UseMaterialPricingOptions, 
    MaterialPricingState 
} from "~/types/material";

export function useMaterialPricing({
    productIdParam,
    cartProduct,
    playerRows,
    initialMaterialState
}: UseMaterialPricingOptions): MaterialPricingState {
    const [allBahan, setAllBahan] = useState<MaterialOption[]>([]);
    const [directProduct, setDirectProduct] = useState<MaterialProduct | null>(null);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);

    const [isCustomMaterial, setIsCustomMaterial] = useState(false);
    const [customMaterialName, setCustomMaterialNameState] = useState("");
    const [materialPriceInput, setMaterialPriceInputState] = useState<number>(150000);
    const [discountInput, setDiscountInput] = useState<number>(0);

    // Fetch material catalog on mount
    useEffect(() => {
        adminApi.getBahanBaju().then((res) => {
            if (res.status === "success") {
                setAllBahan(res.data);
            }
        });
    }, []);

    // Handle direct product from query param if not in cart
    useEffect(() => {
        if (productIdParam && !cartProduct) {
            setIsLoadingProduct(true);
            adminApi.getBahanBaju().then((res) => {
                if (res.status === "success") {
                    const product = res.data.find((b: any) => 
                        String(b.id) === String(productIdParam) || (b.uuid && String(b.uuid) === String(productIdParam))
                    );
                    if (product) {
                        setDirectProduct({
                            id: product.id,
                            title: product.nama,
                            price: product.harga || 150000,
                            status: product.status,
                            kuantitasKg: product.kuantitasKg || 0,
                            rasioKonversi: product.rasioKonversi || 2.5,
                            image: product.imageUrl ? `${UPLOADS_URL}${product.imageUrl}` : ""
                        });
                    }
                }
            }).finally(() => setIsLoadingProduct(false));
        }
    }, [productIdParam, cartProduct]);

    // Active product selection (cart takes precedence)
    const activeProduct: MaterialProduct | null = cartProduct || directProduct;
    const activeBahan = allBahan.find(b => 
        String(b.id) === String(activeProduct?.id) || ((b as any).uuid && String((b as any).uuid) === String(activeProduct?.id))
    );
    const availableKg = activeBahan ? (activeBahan.kuantitasKg || 0) : 0;

    const selectedBahanId = isCustomMaterial ? "CUSTOM" : (activeProduct?.id?.toString() || "");

    const effectiveBasePrice = materialPriceInput > 0
        ? materialPriceInput
        : (activeProduct?.price || 150000);

    const totalRequiredKg = (playerRows || []).reduce((sum, item) => {
        return sum + getJerseyKgRequirement(item.size, item.sleeve, activeProduct?.rasioKonversi || 2.5);
    }, 0);

    const isOverLimit = isCustomMaterial
        ? false
        : !!(activeProduct && activeProduct.status !== "Habis" && totalRequiredKg > availableKg);

    const subtotalCalculated = (playerRows || []).reduce((acc, d) => {
        return acc + effectiveBasePrice + getSizeSurcharge(d.size);
    }, 0);

    const discountAmount = Math.max(0, Number(discountInput) || 0);
    const totalCalculated = Math.max(0, subtotalCalculated - discountAmount);

    const handleSelectBahan = (val: string) => {
        if (val === "CUSTOM") {
            setIsCustomMaterial(true);
            const customTitle = customMaterialName.trim() || "Bahan Kustom Baru";
            const price = materialPriceInput || 150000;
            const newProduct: MaterialProduct = {
                id: 0,
                title: customTitle,
                price: price,
                status: "Tersedia",
                kuantitasKg: 9999,
                rasioKonversi: 2.5,
                image: ""
            };
            setDirectProduct(newProduct);
            return;
        }

        setIsCustomMaterial(false);
        const found = allBahan.find(b => 
            String(b.id) === String(val) || ((b as any).uuid && String((b as any).uuid) === String(val))
        );
        if (found) {
            const price = found.harga || 150000;
            setMaterialPriceInputState(price);
            const newProduct: MaterialProduct = {
                id: found.id,
                title: found.nama,
                price,
                status: found.status,
                kuantitasKg: found.kuantitasKg || 0,
                rasioKonversi: found.rasioKonversi || 2.5,
                image: found.imageUrl ? `${UPLOADS_URL}${found.imageUrl}` : ""
            };
            setDirectProduct(newProduct);
        }
    };

    const setCustomMaterialName = (val: string) => {
        setCustomMaterialNameState(val);
        if (isCustomMaterial) {
            setDirectProduct(prev => prev ? { ...prev, title: val || "Bahan Kustom Baru" } : null);
        }
    };

    const setMaterialPriceInput = (val: number) => {
        setMaterialPriceInputState(val);
    };

    return {
        allBahan,
        activeProduct,
        activeBahan,
        isLoadingProduct,
        availableKg,
        selectedBahanId,
        isCustomMaterial,
        setIsCustomMaterial,
        customMaterialName,
        setCustomMaterialName,
        materialPriceInput,
        setMaterialPriceInput,
        discountInput,
        setDiscountInput,
        effectiveBasePrice,
        subtotalCalculated,
        discountAmount,
        totalCalculated,
        totalRequiredKg,
        isOverLimit,
        handleSelectBahan,
        setDirectProduct,
        setMaterialPriceInputState,
        setCustomMaterialNameState
    };
}
