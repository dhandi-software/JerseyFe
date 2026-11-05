/**
 * useCustomJerseyCheckout Coordinator Facade
 * 100% backward-compatible coordinator orchestrating:
 * - useJerseyRoster: Roster table, generation, and list parsing
 * - useCheckoutPricing: Dynamic pricing, sizes, inventory limits, and DP logic
 * - useCheckoutSubmission: Steps wizard, uploads, and order dispatch
 * FCSV Apparel — Batch 2 Milestone M3 (R1 Hooks Decomposition)
 */

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useCart } from "~/context/CartContext";
import { useAuth } from "~/context/AuthContext";
import { orderService } from "~/services/orderService";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";
import {
  getSizeSurcharge,
  getJerseyKgRequirement,
  compressImage,
  parseSizeAndSleeve,
} from "~/features/admin/buat-pesanan/utils";
import type { UseCustomJerseyCheckoutReturn } from "~/types";

import { useJerseyRoster } from "./useJerseyRoster";
import { useCheckoutPricing } from "./useCheckoutPricing";
import { useCheckoutSubmission } from "./useCheckoutSubmission";

export { getJerseyKgRequirement, compressImage };

export function useCustomJerseyCheckout(): UseCustomJerseyCheckoutReturn {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearCart } = useCart();
  const [searchParams] = useSearchParams();
  const productIdParam = searchParams.get("productId");
  const editOrderId = searchParams.get("editOrderId");

  const [directProduct, setDirectProduct] = useState<any>(null);
  const [existingOrder, setExistingOrder] = useState<any | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    variant: "success" | "destructive" | "default";
  }>({
    show: false,
    message: "",
    variant: "success",
  });

  const sizeParam = searchParams.get("size") || "L";
  const sleeveParam = searchParams.get("sleeve") || "Lengan Pendek";
  const nameParam = searchParams.get("name") || "";
  const numberParam = searchParams.get("number") || "";

  // Direct product resolution
  useEffect(() => {
    if (productIdParam) {
      adminApi.getBahanBaju().then((res) => {
        if (res.status === "success" && Array.isArray(res.data)) {
          const product = res.data.find(
            (b: any) =>
              String(b.id) === String(productIdParam) ||
              String(b.uuid) === String(productIdParam),
          );
          if (product) {
            setDirectProduct({
              id: product.id,
              title: product.nama,
              price: product.harga || 150000,
              status: product.status,
              kuantitasKg: product.kuantitasKg || 0,
              rasioKonversi: product.rasioKonversi || 2.5,
              image: product.imageUrl ? `${UPLOADS_URL}${product.imageUrl}` : "",
            });
          }
        }
      });
    }
  }, [productIdParam]);

  const cartActiveProduct =
    cart.length > 0
      ? {
          id: cart[0].product.id,
          title: cart[0].product.title,
          price: cart[0].product.price,
          status: cart[0].product.status,
          image: cart[0].product.image,
          rasioKonversi: 2.5,
        }
      : null;

  const activeProduct = productIdParam
    ? directProduct || cartActiveProduct
    : cartActiveProduct || directProduct;

  // 1. Jersey Roster sub-hook
  const roster = useJerseyRoster({
    activeProduct,
    directProduct,
    cart,
    productIdParam,
    nameParam,
    numberParam,
    sizeParam,
    sleeveParam,
    isEditing,
    editOrderId,
    setToast,
  });

  // 2. Checkout Pricing sub-hook
  const pricing = useCheckoutPricing({
    customDetails: roster.customDetails,
    activeProduct,
  });

  // 3. Checkout Submission sub-hook
  const submission = useCheckoutSubmission({
    user,
    clearCart,
    navigate,
    activeProduct,
    customDetails: roster.customDetails,
    isOverLimit: pricing.isOverLimit,
    availableKg: pricing.availableKg,
    totalRequiredKg: pricing.totalRequiredKg,
    totalCalculated: pricing.totalCalculated,
    paymentType: pricing.paymentType,
    effectivePaidAmount: pricing.effectivePaidAmount,
    effectiveRemainingAmount: pricing.effectiveRemainingAmount,
    existingOrder,
    isEditing,
    sizeParam,
    sleeveParam,
    setShowValidation: roster.setShowValidation,
    setToast,
  });

  // Handle edit order loading
  useEffect(() => {
    if (editOrderId) {
      setIsEditing(true);
      const loadOrderToEdit = async () => {
        try {
          const order = await orderService.trackOrder(editOrderId);
          if (order && order.status === "MENUNGGU") {
            setExistingOrder(order);
            submission.setDesignNote(order.designNote || "");
            submission.setShippingMethod(order.shippingMethod || "PICKUP");
            submission.setShippingAddress(order.shippingAddress || "");

            adminApi.getBahanBaju().then((res) => {
              if (res.status === "success") {
                const products = res.data;
                const firstDetail = order.details?.[0];
                if (firstDetail) {
                  const product = products.find(
                    (b: any) => b.id === Number(firstDetail.productId),
                  );
                  if (product) {
                    setDirectProduct({
                      id: product.id,
                      title: product.nama,
                      price: product.harga || 150000,
                      status: product.status,
                      kuantitasKg: product.kuantitasKg || 0,
                      rasioKonversi: product.rasioKonversi || 2.5,
                      image: product.imageUrl
                        ? `${UPLOADS_URL}${product.imageUrl}`
                        : "",
                    });
                  }
                }

                if (order.details && order.details.length > 0) {
                  const detailsMapped = order.details.map(
                    (detail: any, idx: number) => {
                      const { size, sleeve } = parseSizeAndSleeve(
                        detail.playerSize,
                      );
                      const matchingBahan = products.find(
                        (b: any) => b.id === Number(detail.productId),
                      );
                      return {
                        id: `edit-${detail.id}-${idx}`,
                        productId: detail.productId,
                        productTitle: detail.productTitle,
                        price: matchingBahan?.harga || 150000,
                        image: matchingBahan?.imageUrl
                          ? `${UPLOADS_URL}${matchingBahan.imageUrl}`
                          : "",
                        name: detail.playerName || "",
                        number: detail.playerNumber || "",
                        size: size,
                        sleeve: sleeve,
                      };
                    },
                  );
                  roster.setCustomDetails(detailsMapped);
                }
              }
            });
          } else {
            setToast({
              show: true,
              message: "Pesanan ini tidak dapat diedit atau tidak ditemukan.",
              variant: "destructive",
            });
            navigate("/customer");
          }
        } catch (err) {
          console.error("Failed to load order for edit:", err);
          setToast({
            show: true,
            message: "Gagal memuat detail pesanan.",
            variant: "destructive",
          });
        }
      };
      loadOrderToEdit();
    }
  }, [editOrderId]);

  return {
    step: submission.step,
    setStep: submission.setStep,
    activeProduct,
    activeBahan: pricing.activeBahan,
    allBahan: pricing.allBahan,
    availableKg: pricing.availableKg,
    customDetails: roster.customDetails,
    setCustomDetails: roster.setCustomDetails,
    designNote: submission.designNote,
    setDesignNote: submission.setDesignNote,
    designReferenceFile: submission.designReferenceFile,
    setDesignReferenceFile: submission.setDesignReferenceFile,
    paymentProofFile: submission.paymentProofFile,
    setPaymentProofFile: submission.setPaymentProofFile,
    paymentType: pricing.paymentType,
    setPaymentType: pricing.setPaymentType,
    dpAmountInput: pricing.dpAmountInput,
    setDpAmountInput: pricing.setDpAmountInput,
    pdfFile: submission.pdfFile,
    setPdfFile: submission.setPdfFile,
    isUploading: submission.isUploading,
    uploadProgress: submission.uploadProgress,
    shippingMethod: submission.shippingMethod,
    setShippingMethod: submission.setShippingMethod,
    shippingAddress: submission.shippingAddress,
    setShippingAddress: submission.setShippingAddress,
    pasteText: roster.pasteText,
    setPasteText: roster.setPasteText,
    isPasteDialogOpen: roster.isPasteDialogOpen,
    setIsPasteDialogOpen: roster.setIsPasteDialogOpen,
    textareaRef: roster.textareaRef,
    isResetDialogOpen: roster.isResetDialogOpen,
    setIsResetDialogOpen: roster.setIsResetDialogOpen,
    playerCountInput: roster.playerCountInput,
    setPlayerCountInput: roster.setPlayerCountInput,
    showValidation: roster.showValidation,
    setShowValidation: roster.setShowValidation,
    totalRequiredKg: pricing.totalRequiredKg,
    isOverLimit: pricing.isOverLimit,
    toast,
    setToast,
    user,
    existingOrder,
    setExistingOrder,
    isEditing,
    steps: submission.steps,
    formatRupiah: pricing.formatRupiah,
    getSizeSurcharge: pricing.getSizeSurcharge,
    generateTable: roster.generateTable,
    resetTable: roster.resetTable,
    parsePasteData: roster.parsePasteData,
    handleTextareaKeyDown: roster.handleTextareaKeyDown,
    handleTextareaPaste: roster.handleTextareaPaste,
    removeUnit: roster.removeUnit,
    updateUnitQuantity: roster.updateUnitQuantity,
    handleDetailChange: roster.handleDetailChange,
    handlePdfImport: (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        submission.setPdfFile(file);
        setToast({
          show: true,
          message: "File PDF berhasil diunggah. Admin akan memproses data pemain dari PDF ini.",
          variant: "success",
        });
      }
    },
    isStepValid: submission.isStepValid,
    handleNextStep: submission.handleNextStep,
    handleSubmit: submission.handleSubmit,
    totalCalculated: pricing.totalCalculated,
    effectivePaidAmount: pricing.effectivePaidAmount,
    effectiveRemainingAmount: pricing.effectiveRemainingAmount,
  };
}
