/**
 * useCheckoutPricing Hook
 * Handles material inventory, limits, size surcharges, and down payment calculations.
 * FCSV Apparel — Batch 2 Milestone M3 (R1 Hooks Decomposition)
 */

import { useState, useEffect } from "react";
import { adminApi } from "~/api/admin";
import { formatRupiah } from "~/lib/utils";
import { getSizeSurcharge, getJerseyKgRequirement } from "~/features/admin/buat-pesanan/utils";
import type { CustomJerseyDetailItem } from "~/types";

export interface UseCheckoutPricingOptions {
  customDetails: CustomJerseyDetailItem[];
  activeProduct: any | null;
}

export function useCheckoutPricing({
  customDetails,
  activeProduct,
}: UseCheckoutPricingOptions) {
  const [allBahan, setAllBahan] = useState<any[]>([]);
  const [paymentType, setPaymentType] = useState<"FULL" | "DP">("FULL");
  const [dpAmountInput, setDpAmountInput] = useState<number>(0);

  useEffect(() => {
    adminApi.getBahanBaju().then((res) => {
      if (res.status === "success" && Array.isArray(res.data)) {
        setAllBahan(res.data);
      }
    });
  }, []);

  const activeBahan = allBahan.find((b) => b.id === activeProduct?.id);
  const availableKg = activeBahan ? activeBahan.kuantitasKg || 0 : 0;

  const totalRequiredKg = customDetails.reduce(
    (sum, item) =>
      sum +
      getJerseyKgRequirement(
        item.size,
        item.sleeve,
        activeProduct?.rasioKonversi || 2.5,
      ),
    0,
  );

  const isOverLimit =
    activeProduct &&
    activeProduct.status !== "Habis" &&
    totalRequiredKg > availableKg;

  const totalCalculated = customDetails.reduce((acc, d) => {
    const basePrice = activeProduct?.price || d.price || 150000;
    return acc + basePrice + getSizeSurcharge(d.size);
  }, 0);

  const effectivePaidAmount =
    paymentType === "DP"
      ? dpAmountInput > 0
        ? Math.min(dpAmountInput, totalCalculated)
        : Math.round(totalCalculated * 0.5)
      : totalCalculated;

  const effectiveRemainingAmount = Math.max(
    0,
    totalCalculated - effectivePaidAmount,
  );

  return {
    allBahan,
    setAllBahan,
    activeBahan,
    availableKg,
    totalRequiredKg,
    isOverLimit,
    paymentType,
    setPaymentType,
    dpAmountInput,
    setDpAmountInput,
    totalCalculated,
    effectivePaidAmount,
    effectiveRemainingAmount,
    formatRupiah,
    getSizeSurcharge,
  };
}
