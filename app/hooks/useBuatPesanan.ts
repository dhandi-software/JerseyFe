import { useEffect, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useCart } from "~/context/CartContext";
import { orderService } from "~/services/orderService";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";
import { parseSizeAndSleeve } from "~/features/admin/buat-pesanan/utils";
import type { MaterialProduct } from "~/types/material";

import { useMaterialPricing } from "./useMaterialPricing";
import { usePlayerTableManager } from "./usePlayerTableManager";
import { useOrderSubmission } from "./useOrderSubmission";

export function useBuatPesanan() {
    const navigate = useNavigate();
    const { cart } = useCart();
    const [searchParams] = useSearchParams();

    const productIdParam = searchParams.get("productId");
    const editOrderId = searchParams.get("editOrderId");
    const sizeParam = searchParams.get("size") || "L";
    const sleeveParam = searchParams.get("sleeve") || "Lengan Pendek";

    const [existingOrder, setExistingOrder] = useState<any | null>(null);
    const activeProductRef = useRef<MaterialProduct | null>(null);

    // 1. Initialize Player Table Manager
    const playerManager = usePlayerTableManager({
        activeProduct: activeProductRef.current,
        effectiveBasePrice: 150000,
        isCustomMaterial: false,
        customMaterialName: "",
        sizeParam,
        sleeveParam,
        cartLength: cart.length,
        cartItems: cart,
        isEditing: Boolean(editOrderId),
        editOrderId
    });

    // 2. Initialize Material Pricing
    const materialPricing = useMaterialPricing({
        productIdParam,
        cartProduct: cart.length > 0 ? {
            id: cart[0].product.id,
            title: cart[0].product.title,
            price: cart[0].product.price,
            status: cart[0].product.status,
            image: cart[0].product.image
        } : null,
        playerRows: playerManager.customDetails
    });

    // Keep activeProductRef current
    activeProductRef.current = materialPricing.activeProduct;

    // 3. Initialize Order Submission
    const orderSubmission = useOrderSubmission({
        editOrderId,
        existingOrder,
        materialPricing,
        playerManager
    });

    // Initial default row if activeProduct arrives and table is empty
    useEffect(() => {
        if (!playerManager.customDetails.length && materialPricing.activeProduct && !cart.length && !editOrderId) {
            playerManager.setCustomDetails([{
                id: `${materialPricing.activeProduct.id}-${Math.random().toString(36).substring(2, 9)}`,
                productId: materialPricing.activeProduct.id,
                productTitle: materialPricing.activeProduct.title,
                price: materialPricing.activeProduct.price,
                image: materialPricing.activeProduct.image,
                name: "",
                number: "",
                size: sizeParam,
                sleeve: sleeveParam
            }]);
        }
    }, [materialPricing.activeProduct, cart.length, editOrderId, sizeParam, sleeveParam]);

    // 4. Handle Edit Order Loading
    useEffect(() => {
        if (editOrderId) {
            const loadOrderToEdit = async () => {
                try {
                    const order = await orderService.trackOrder(editOrderId);
                    if (order && order.status === "MENUNGGU") {
                        setExistingOrder(order);
                        orderSubmission.setCustomerName(order.customerName || "");
                        orderSubmission.setCustomerPhone(order.customerPhone || "");
                        orderSubmission.setDesignNote(order.designNote || "");
                        orderSubmission.setShippingMethod(order.shippingMethod || "PICKUP");
                        orderSubmission.setShippingAddress(order.shippingAddress || "");

                        if (order.materialPrice) {
                            materialPricing.setMaterialPriceInputState(order.materialPrice);
                        }
                        if (order.discount) {
                            materialPricing.setDiscountInput(order.discount);
                        }
                        if (order.materialId === null && order.materialName) {
                            materialPricing.setIsCustomMaterial(true);
                            materialPricing.setCustomMaterialNameState(order.materialName);
                        }

                        adminApi.getBahanBaju().then((res) => {
                            if (res.status === "success") {
                                const products = res.data;
                                const firstDetail = order.details?.[0];
                                if (firstDetail) {
                                    const product = products.find((b: any) => b.id === Number(firstDetail.productId));
                                    if (product) {
                                        materialPricing.setDirectProduct({
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

                                if (order.details && order.details.length > 0) {
                                    const detailsMapped = order.details.map((detail: any, idx: number) => {
                                        const { size, sleeve } = parseSizeAndSleeve(detail.playerSize);
                                        const matchingBahan = products.find((b: any) => b.id === Number(detail.productId));
                                        return {
                                            id: `edit-${detail.id}-${idx}`,
                                            productId: detail.productId,
                                            productTitle: detail.productTitle,
                                            price: matchingBahan?.harga || 150000,
                                            image: matchingBahan?.imageUrl ? `${UPLOADS_URL}${matchingBahan.imageUrl}` : "",
                                            name: detail.playerName || "",
                                            number: detail.playerNumber || "",
                                            size: size,
                                            sleeve: sleeve
                                        };
                                    });
                                    playerManager.setCustomDetails(detailsMapped);
                                }
                            }
                        });
                    } else {
                        orderSubmission.setToast({
                            show: true,
                            message: "Pesanan ini tidak dapat diedit atau tidak ditemukan.",
                            variant: "destructive"
                        });
                        navigate("/admin/monitoring-pesanan");
                    }
                } catch (error) {
                    console.error("Failed to load order for edit:", error);
                    orderSubmission.setToast({
                        show: true,
                        message: "Gagal memuat detail pesanan.",
                        variant: "destructive"
                    });
                }
            };
            loadOrderToEdit();
        }
    }, [editOrderId, navigate]);

    const handleAddMember = (productId?: number) => {
        const prod = materialPricing.activeProduct || {
            id: productId || 0,
            title: "Custom Jersey",
            price: materialPricing.effectiveBasePrice,
            image: ""
        };
        playerManager.setCustomDetails(prev => [...prev, {
            id: `${prod.id}-${Math.random().toString(36).substring(2, 9)}`,
            productId: materialPricing.isCustomMaterial ? 0 : prod.id,
            productTitle: materialPricing.isCustomMaterial
                ? (materialPricing.customMaterialName || "Bahan Kustom Baru")
                : prod.title,
            price: materialPricing.effectiveBasePrice,
            image: prod.image,
            name: "",
            number: "",
            size: "L",
            sleeve: "Lengan Pendek"
        }]);
    };

    // 5. Merge and return backward-compatible surface
    return {
        // Step & Nav
        step: orderSubmission.step,
        setStep: orderSubmission.setStep,
        handleNextStep: orderSubmission.handleNextStep,

        // Customer
        customerName: orderSubmission.customerName,
        setCustomerName: orderSubmission.setCustomerName,
        customerPhone: orderSubmission.customerPhone,
        setCustomerPhone: orderSubmission.setCustomerPhone,

        // Player Details
        customDetails: playerManager.customDetails,
        setCustomDetails: playerManager.setCustomDetails,
        handleDetailChange: playerManager.handleDetailChange,
        handleAddMember,
        handleRemoveMember: playerManager.handleRemoveMember,

        // Material & Pricing
        activeProduct: materialPricing.activeProduct,
        isLoadingProduct: materialPricing.isLoadingProduct,
        availableKg: materialPricing.availableKg,
        allBahan: materialPricing.allBahan,
        totalRequiredKg: materialPricing.totalRequiredKg,
        isOverLimit: materialPricing.isOverLimit,
        isCustomMaterial: materialPricing.isCustomMaterial,
        setIsCustomMaterial: materialPricing.setIsCustomMaterial,
        customMaterialName: materialPricing.customMaterialName,
        setCustomMaterialName: materialPricing.setCustomMaterialName,
        materialPriceInput: materialPricing.materialPriceInput,
        setMaterialPriceInput: materialPricing.setMaterialPriceInput,
        discountInput: materialPricing.discountInput,
        setDiscountInput: materialPricing.setDiscountInput,
        selectedBahanId: materialPricing.selectedBahanId,
        subtotalCalculated: materialPricing.subtotalCalculated,
        discountAmount: materialPricing.discountAmount,
        totalCalculated: materialPricing.totalCalculated,
        handleSelectBahan: materialPricing.handleSelectBahan,

        // Payment & Shipping
        paymentType: orderSubmission.paymentType,
        setPaymentType: orderSubmission.setPaymentType,
        dpAmountInput: orderSubmission.dpAmountInput,
        setDpAmountInput: orderSubmission.setDpAmountInput,
        effectivePaidAmount: orderSubmission.effectivePaidAmount,
        effectiveRemainingAmount: orderSubmission.effectiveRemainingAmount,
        designNote: orderSubmission.designNote,
        setDesignNote: orderSubmission.setDesignNote,
        designReferenceFile: orderSubmission.designReferenceFile,
        setDesignReferenceFile: orderSubmission.setDesignReferenceFile,
        paymentProofFile: orderSubmission.paymentProofFile,
        setPaymentProofFile: orderSubmission.setPaymentProofFile,
        shippingMethod: orderSubmission.shippingMethod,
        setShippingMethod: orderSubmission.setShippingMethod,
        shippingAddress: orderSubmission.shippingAddress,
        setShippingAddress: orderSubmission.setShippingAddress,

        // PDF Import
        pdfFile: playerManager.pdfFile,
        setPdfFile: playerManager.setPdfFile,
        handlePdfImport: playerManager.handlePdfImport,

        // Dialogs & Textarea
        isPasteDialogOpen: playerManager.isPasteDialogOpen,
        setIsPasteDialogOpen: playerManager.setIsPasteDialogOpen,
        pasteText: playerManager.pasteText,
        setPasteText: playerManager.setPasteText,
        handlePasteSubmit: playerManager.handlePasteSubmit,
        handleTextareaKeyDown: playerManager.handleTextareaKeyDown,
        handleTextareaPaste: playerManager.handleTextareaPaste,
        textareaRef: playerManager.textareaRef,

        isResetDialogOpen: playerManager.isResetDialogOpen,
        setIsResetDialogOpen: playerManager.setIsResetDialogOpen,
        playerCountInput: playerManager.playerCountInput,
        setPlayerCountInput: playerManager.setPlayerCountInput,
        generateTable: playerManager.generateTable,
        resetTable: playerManager.resetTable,

        // Status & Submissions
        isUploading: orderSubmission.isUploading,
        uploadProgress: orderSubmission.uploadProgress,
        toast: orderSubmission.toast,
        setToast: orderSubmission.setToast,
        showValidation: orderSubmission.showValidation,
        setShowValidation: orderSubmission.setShowValidation,
        handleSubmit: orderSubmission.handleSubmit,
        isEditing: orderSubmission.isEditing,
        editOrderId: orderSubmission.editOrderId
    };
}
