/**
 * useCheckoutSubmission Hook
 * Handles multi-step navigation, form validation, file uploads, and order creation/update.
 * FCSV Apparel — Batch 2 Milestone M3 (R1 Hooks Decomposition)
 */

import { useState } from "react";
import { User, FileUp, CreditCard } from "lucide-react";
import { orderService } from "~/services/orderService";
import { uploadService } from "~/services/uploadService";
import { getSizeSurcharge, compressImage, parseSizeAndSleeve } from "~/features/admin/buat-pesanan/utils";
import type {
  CustomJerseyDetailItem,
  CustomJerseyCheckoutStep,
} from "~/types";

export interface UseCheckoutSubmissionOptions {
  user: any | null;
  clearCart: () => void;
  navigate: (to: string) => void;
  activeProduct: any | null;
  customDetails: CustomJerseyDetailItem[];
  isOverLimit: boolean;
  availableKg: number;
  totalRequiredKg: number;
  totalCalculated: number;
  paymentType: "FULL" | "DP";
  effectivePaidAmount: number;
  effectiveRemainingAmount: number;
  existingOrder: any | null;
  isEditing: boolean;
  sizeParam?: string;
  sleeveParam?: string;
  setShowValidation: (val: boolean) => void;
  setToast: (toast: { show: boolean; message: string; variant: "success" | "destructive" | "default" }) => void;
}

export function useCheckoutSubmission({
  user,
  clearCart,
  navigate,
  activeProduct,
  customDetails,
  isOverLimit,
  availableKg,
  totalRequiredKg,
  totalCalculated,
  paymentType,
  effectivePaidAmount,
  effectiveRemainingAmount,
  existingOrder,
  isEditing,
  sizeParam = "L",
  sleeveParam = "Lengan Pendek",
  setShowValidation,
  setToast,
}: UseCheckoutSubmissionOptions) {
  const [step, setStep] = useState(1);
  const [designNote, setDesignNote] = useState("");
  const [designReferenceFile, setDesignReferenceFile] = useState<File | null>(null);
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [shippingMethod, setShippingMethod] = useState("PICKUP");
  const [shippingAddress, setShippingAddress] = useState("");

  const steps: CustomJerseyCheckoutStep[] = [
    { id: 1, name: "Player Info", icon: User },
    { id: 2, name: "Design Reference", icon: FileUp },
    { id: 3, name: "Payment Proof", icon: CreditCard },
  ];

  const isStepValid = () => {
    if (step === 1) {
      if (pdfFile) return true;
      if (customDetails.length === 0) return false;
      if (isOverLimit) return false;
      return customDetails.every(
        (d) =>
          d.name.trim() !== "" &&
          d.number.trim() !== "" &&
          d.size !== "",
      );
    }
    if (step === 2) {
      const hasAddressIfCod =
        shippingMethod !== "COD" || shippingAddress.trim() !== "";
      return hasAddressIfCod;
    }
    if (step === 3) {
      return !!paymentProofFile || !!existingOrder?.paymentUrl;
    }
    return true;
  };

  const handleNextStep = () => {
    if (step === 1 && isOverLimit) {
      const supported = Math.floor(
        availableKg / (totalRequiredKg / customDetails.length),
      );
      const reduce = Math.max(1, customDetails.length - supported);
      setToast({
        show: true,
        message: `Stok bahan tidak cukup! Silakan kurangi pesanan Anda sebanyak ${reduce} pcs atau ubah ukuran/lengan agar sesuai dengan ketersediaan.`,
        variant: "destructive",
      });
      return;
    }
    if (!isStepValid()) {
      setShowValidation(true);
      let msg = "Lengkapi langkah ini terlebih dahulu";
      if (step === 1) {
        msg = "Mohon lengkapi detail pemain (Nama, Nomor, Size)";
      } else if (step === 2) {
        msg = "Mohon isi alamat pengiriman untuk metode COD";
      }
      setToast({
        show: true,
        message: msg,
        variant: "destructive",
      });
      return;
    }
    setShowValidation(false);
    setStep((prev) => prev + 1);
  };

  const handleSubmit = async () => {
    if (!isStepValid()) {
      setShowValidation(true);
      setToast({
        show: true,
        message: "Mohon lengkapi seluruh data pemain dan bukti transfer.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    try {
      let designUrl = existingOrder?.designUrl || "";
      let paymentUrl = existingOrder?.paymentUrl || "";
      let finalDesignNote = designNote;

      if (pdfFile) {
        const pdfRes = await uploadService.uploadFile(pdfFile);
        if (pdfRes?.url) {
          finalDesignNote = `${designNote ? `${designNote}\n` : ""}[Data Pemain PDF: ${pdfRes.url}]`;
        }
      }

      if (paymentProofFile) {
        setUploadProgress(60);
        const compressed = await compressImage(paymentProofFile);
        setUploadProgress(80);
        const res = await uploadService.uploadFile(compressed);
        paymentUrl = res.url;
      }

      setUploadProgress(90);

      try {
        const effectiveDetails =
          customDetails.length > 0
            ? customDetails.map((d) => ({
                productId: d.productId || activeProduct?.id || 1,
                productTitle:
                  d.productTitle ||
                  activeProduct?.title ||
                  "Custom Jersey",
                playerName:
                  d.name.trim() ||
                  (pdfFile ? "DATA PEMAIN PDF" : "PEMAIN"),
                playerNumber:
                  d.number.trim() || (pdfFile ? "PDF" : "00"),
                playerSize: `${d.size || "L"} (${d.sleeve || "Lengan Pendek"})`,
              }))
            : activeProduct
              ? [
                  {
                    productId: activeProduct.id,
                    productTitle: activeProduct.title,
                    playerName: pdfFile
                      ? "DATA PEMAIN PDF"
                      : "PEMAIN",
                    playerNumber: pdfFile ? "PDF" : "00",
                    playerSize: `${sizeParam || "L"} (${sleeveParam || "Lengan Pendek"})`,
                  },
                ]
              : [];

        const basePrice = activeProduct?.price || 150000;
        const subtotalAmount = effectiveDetails.reduce((sum, d) => {
          const { size: pureSize } = parseSizeAndSleeve(d.playerSize);
          const surcharge = getSizeSurcharge(pureSize);
          return sum + basePrice + surcharge;
        }, 0);

        const payload = {
          customerId: user?.id || 0,
          customerName: user?.name || user?.username || "",
          bahanBajuId: activeProduct?.id,
          materialId: activeProduct?.id || null,
          materialName: activeProduct?.title || null,
          materialPrice: basePrice,
          subtotalAmount: subtotalAmount || totalCalculated,
          discount: 0,
          totalAmount: totalCalculated,
          paymentType: paymentType,
          paidAmount: effectivePaidAmount,
          remainingAmount: effectiveRemainingAmount,
          designNote: finalDesignNote,
          designUrl: designUrl,
          paymentUrl: paymentUrl,
          shippingMethod: shippingMethod,
          shippingAddress:
            shippingMethod === "COD" ? shippingAddress : "",
          details: effectiveDetails.map((d) => {
            const { size: pureSize } = parseSizeAndSleeve(d.playerSize);
            return {
              ...d,
              unitPrice: basePrice + getSizeSurcharge(pureSize),
            };
          }),
        };

        if (isEditing && existingOrder) {
          await orderService.updateOrder(existingOrder.id, payload);
          setUploadProgress(100);
          setToast({
            show: true,
            message: "Pesanan berhasil diperbarui!",
            variant: "success",
          });
        } else {
          await orderService.createOrder(payload);
          setUploadProgress(100);
          setToast({
            show: true,
            message:
              "Pesanan berhasil dibuat dan telah terkirim ke sistem admin!",
            variant: "success",
          });
        }

        setTimeout(() => {
          clearCart();
          navigate("/customer");
        }, 1500);
      } catch (apiErr) {
        console.error("API Order failed", apiErr);
        setToast({
          show: true,
          message: isEditing
            ? "Gagal memperbarui pesanan. Silakan coba lagi."
            : "Gagal membuat pesanan. Silakan coba lagi.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setToast({
        show: true,
        message: "Gagal mengunggah gambar. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return {
    step,
    setStep,
    designNote,
    setDesignNote,
    designReferenceFile,
    setDesignReferenceFile,
    paymentProofFile,
    setPaymentProofFile,
    pdfFile,
    setPdfFile,
    shippingMethod,
    setShippingMethod,
    shippingAddress,
    setShippingAddress,
    isUploading,
    uploadProgress,
    steps,
    isStepValid,
    handleNextStep,
    handleSubmit,
  };
}
