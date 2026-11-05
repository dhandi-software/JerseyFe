import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { useCart } from "~/context/CartContext";
import { orderService } from "~/services/orderService";
import { uploadService } from "~/services/uploadService";
import { compressImage, getSizeSurcharge } from "~/features/admin/buat-pesanan/utils";
import type { 
    PaymentType, 
    OrderToast, 
    CreateOrderPayload, 
    UseOrderSubmissionOptions, 
    UseOrderSubmissionReturn 
} from "~/types/order";

export function useOrderSubmission({
    editOrderId = null,
    existingOrder = null,
    materialPricing,
    playerManager,
    onSuccess
}: UseOrderSubmissionOptions): UseOrderSubmissionReturn {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { clearCart } = useCart();

    const [step, setStep] = useState(1);
    const [customerName, setCustomerName] = useState("");
    const [customerPhoneState, setCustomerPhoneState] = useState("");
    const setCustomerPhone = (val: string) => {
        setCustomerPhoneState(val.replace(/\D/g, ""));
    };

    const [designNote, setDesignNote] = useState("");
    const [designReferenceFile, setDesignReferenceFile] = useState<File | null>(null);
    const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
    const [paymentType, setPaymentType] = useState<PaymentType>("DP");
    const [dpAmountInput, setDpAmountInput] = useState<number>(0);

    const [shippingMethod, setShippingMethod] = useState("PICKUP");
    const [shippingAddress, setShippingAddress] = useState("");

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showValidation, setShowValidation] = useState(false);

    const [toast, setToast] = useState<OrderToast>({
        show: false,
        message: "",
        variant: "success"
    });

    const isEditing = Boolean(editOrderId);

    const effectivePaidAmount = paymentType === "DP"
        ? Math.min(Math.max(0, dpAmountInput), materialPricing.totalCalculated)
        : materialPricing.totalCalculated;

    const effectiveRemainingAmount = Math.max(0, materialPricing.totalCalculated - effectivePaidAmount);

    const scrollToElementAndFocus = (
        elementId: string,
        options?: { focusSelector?: string; clickTrigger?: boolean }
    ) => {
        if (typeof document === "undefined") return;
        setTimeout(() => {
            const el = document.getElementById(elementId);
            if (!el) return;

            el.scrollIntoView({ behavior: "smooth", block: "center" });

            setTimeout(() => {
                if (options?.focusSelector) {
                    const target = el.querySelector<HTMLElement>(options.focusSelector);
                    if (target) {
                        target.focus();
                        if (options.clickTrigger) target.click();
                        return;
                    }
                }
                if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLButtonElement) {
                    el.focus();
                    if (options?.clickTrigger) el.click();
                } else {
                    const focusable = el.querySelector<HTMLElement>("input, textarea, button, [role='combobox']");
                    if (focusable) {
                        focusable.focus();
                        if (options?.clickTrigger) focusable.click();
                    }
                }
            }, 350);
        }, 50);
    };

    const isStepValid = () => {
        if (step === 1) {
            if (!customerName.trim() || !customerPhoneState.trim()) return false;
            if (!materialPricing.activeProduct) return false;
            if (playerManager.pdfFile) return true;
            if (playerManager.customDetails.length === 0) return false;
            if (materialPricing.isOverLimit) return false;
            return playerManager.customDetails.every(d => d.name.trim() !== "" && d.number.trim() !== "" && d.size !== "");
        }
        if (step === 2) {
            const hasDesign = !!designReferenceFile || !!existingOrder?.designUrl;
            const hasAddressIfCod = shippingMethod !== "COD" || shippingAddress.trim() !== "";
            return hasDesign && hasAddressIfCod;
        }
        return true;
    };

    const validateAndFocusCurrentStep = (): boolean => {
        if (step === 1) {
            if (!materialPricing.isCustomMaterial && !materialPricing.activeProduct) {
                setShowValidation(true);
                setToast({ show: true, message: "Mohon pilih Bahan Baku terlebih dahulu", variant: "destructive" });
                scrollToElementAndFocus("field-bahan-baku", { focusSelector: "button[role='combobox']", clickTrigger: true });
                return false;
            }
            if (materialPricing.isCustomMaterial && !materialPricing.customMaterialName.trim()) {
                setShowValidation(true);
                setToast({ show: true, message: "Mohon isi Nama Bahan Kustom Baru terlebih dahulu", variant: "destructive" });
                scrollToElementAndFocus("field-custom-material-name");
                return false;
            }
            if (!customerName.trim()) {
                setShowValidation(true);
                setToast({ show: true, message: "Mohon isi Nama Pelanggan terlebih dahulu", variant: "destructive" });
                scrollToElementAndFocus("field-customer-name");
                return false;
            }
            if (!customerPhoneState.trim()) {
                setShowValidation(true);
                setToast({ show: true, message: "Mohon isi Nomor Telepon Pelanggan terlebih dahulu", variant: "destructive" });
                scrollToElementAndFocus("field-customer-phone");
                return false;
            }
            if (materialPricing.isOverLimit) {
                const supported = Math.floor(materialPricing.availableKg / (materialPricing.totalRequiredKg / playerManager.customDetails.length));
                const reduce = Math.max(1, playerManager.customDetails.length - supported);
                setToast({
                    show: true,
                    message: `Stok bahan tidak cukup! Silakan kurangi pesanan Anda sebanyak ${reduce} pcs atau ubah ukuran/lengan agar sesuai ketersediaan.`,
                    variant: "destructive"
                });
                scrollToElementAndFocus("field-stock-alert");
                return false;
            }
            if (!playerManager.pdfFile && playerManager.customDetails.length === 0) {
                setShowValidation(true);
                setToast({ show: true, message: "Mohon tambahkan daftar pemain terlebih dahulu", variant: "destructive" });
                scrollToElementAndFocus("field-player-table");
                return false;
            }
            if (!playerManager.pdfFile) {
                const { isValid, invalidIndex } = playerManager.validatePlayerRows();
                if (!isValid) {
                    const invalidItem = playerManager.customDetails[invalidIndex];
                    setShowValidation(true);
                    setToast({
                        show: true,
                        message: `Mohon lengkapi detail pemain baris ke-${invalidIndex + 1} (Nama, Nomor, Size)`,
                        variant: "destructive"
                    });
                    const targetInputId = !invalidItem.name.trim()
                        ? `field-player-name-${invalidItem.id}`
                        : `field-player-number-${invalidItem.id}`;
                    scrollToElementAndFocus(targetInputId);
                    return false;
                }
            }
            return true;
        }

        if (step === 2) {
            const hasDesign = !!designReferenceFile || !!existingOrder?.designUrl;
            if (!hasDesign) {
                setShowValidation(true);
                setToast({ show: true, message: "Mohon unggah referensi desain jersey Anda", variant: "destructive" });
                scrollToElementAndFocus("field-design-reference");
                return false;
            }
            if (shippingMethod === "COD" && !shippingAddress.trim()) {
                setShowValidation(true);
                setToast({ show: true, message: "Mohon isi alamat pengiriman untuk metode COD", variant: "destructive" });
                scrollToElementAndFocus("field-shipping-address");
                return false;
            }
            return true;
        }

        return true;
    };

    const handleNextStep = () => {
        if (!validateAndFocusCurrentStep()) return;
        setShowValidation(false);
        setStep(prev => prev + 1);
    };

    const handleSubmit = async () => {
        if (!validateAndFocusCurrentStep()) return;

        setIsUploading(true);
        setUploadProgress(10);
        try {
            let designUrl = existingOrder?.designUrl || "";
            const paymentUrl = paymentType === "FULL"
                ? "LUNAS_ADMIN"
                : (effectivePaidAmount > 0 ? "DP_TERKONFIRMASI_ADMIN" : "MENUNGGU_PEMBAYARAN_ADMIN");

            if (designReferenceFile) {
                setUploadProgress(20);
                const compressed = await compressImage(designReferenceFile);
                setUploadProgress(40);
                const res = await uploadService.uploadFile(compressed);
                designUrl = res.url;
            }

            setUploadProgress(90);

            try {
                const payload: CreateOrderPayload = {
                    customerId: user?.id || 0,
                    materialId: materialPricing.isCustomMaterial ? null : (materialPricing.activeProduct?.id || null),
                    materialName: materialPricing.isCustomMaterial
                        ? (materialPricing.customMaterialName.trim() || "Bahan Kustom Baru")
                        : (materialPricing.activeProduct?.title || null),
                    materialPrice: materialPricing.effectiveBasePrice,
                    subtotalAmount: materialPricing.subtotalCalculated,
                    discount: materialPricing.discountAmount,
                    totalAmount: materialPricing.totalCalculated,
                    paymentType,
                    paidAmount: effectivePaidAmount,
                    remainingAmount: effectiveRemainingAmount,
                    designNote,
                    designUrl,
                    paymentUrl,
                    shippingMethod,
                    shippingAddress: shippingMethod === "COD" ? shippingAddress : "",
                    customerName,
                    customerPhone: customerPhoneState,
                    details: playerManager.customDetails.map(d => ({
                        productId: materialPricing.isCustomMaterial ? null : (materialPricing.activeProduct?.id || d.productId || null),
                        productTitle: materialPricing.isCustomMaterial
                            ? (materialPricing.customMaterialName.trim() || "Bahan Kustom Baru")
                            : (materialPricing.activeProduct?.title || d.productTitle),
                        playerName: d.name,
                        playerNumber: d.number,
                        playerSize: `${d.size} (${d.sleeve || "Lengan Pendek"})`,
                        unitPrice: materialPricing.effectiveBasePrice + getSizeSurcharge(d.size)
                    }))
                };

                if (isEditing && editOrderId) {
                    await orderService.updateOrder(Number(editOrderId), payload);
                    setUploadProgress(100);
                    setToast({ show: true, message: "Pesanan berhasil diperbarui!", variant: "success" });
                } else {
                    await orderService.createOrder(payload);
                    setUploadProgress(100);
                    setToast({ show: true, message: "Pesanan berhasil dibuat!", variant: "success" });
                }

                setTimeout(() => {
                    clearCart();
                    if (onSuccess) {
                        onSuccess();
                    } else {
                        navigate("/admin/monitoring-pesanan");
                    }
                }, 1500);
            } catch (apiErr) {
                console.error("API Order failed", apiErr);
                setToast({ show: true, message: "Gagal membuat pesanan. Silakan coba lagi.", variant: "destructive" });
            }
        } catch (error) {
            console.error("Upload failed:", error);
            setToast({ show: true, message: "Gagal mengunggah gambar. Silakan coba lagi.", variant: "destructive" });
        } finally {
            setIsUploading(false);
        }
    };

    return {
        step,
        setStep,
        handleNextStep,
        customerName,
        setCustomerName,
        customerPhone: customerPhoneState,
        setCustomerPhone,
        designNote,
        setDesignNote,
        designReferenceFile,
        setDesignReferenceFile,
        paymentProofFile,
        setPaymentProofFile,
        paymentType,
        setPaymentType,
        dpAmountInput,
        setDpAmountInput,
        effectivePaidAmount,
        effectiveRemainingAmount,
        shippingMethod,
        setShippingMethod,
        shippingAddress,
        setShippingAddress,
        isUploading,
        uploadProgress,
        toast,
        setToast,
        showValidation,
        setShowValidation,
        isStepValid,
        validateAndFocusCurrentStep,
        scrollToElementAndFocus,
        handleSubmit,
        isEditing,
        editOrderId,
        existingOrder
    };
}
