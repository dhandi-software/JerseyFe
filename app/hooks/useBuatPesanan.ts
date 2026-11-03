import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useAuth } from "~/context/AuthContext";
import { useCart } from "~/context/CartContext";
import { adminApi } from "~/api/admin";
import { orderService } from "~/services/orderService";
import { chatService } from "~/services/chatService";
import { UPLOADS_URL } from "~/api/client";
import type { 
    CustomDetailItem, 
    BuatPesananProduct, 
    BuatPesananToast, 
    BahanOption 
} from "~/types/buatPesanan";
import { 
    getSizeSurcharge, 
    getJerseyKgRequirement, 
    compressImage, 
    parseSizeAndSleeve, 
    parsePasteData 
} from "~/features/admin/buat-pesanan/utils";

export function useBuatPesanan() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, clearCart } = useCart();
    const [searchParams] = useSearchParams();

    const productIdParam = searchParams.get("productId");
    const editOrderId = searchParams.get("editOrderId");
    const sizeParam = searchParams.get("size") || "L";
    const sleeveParam = searchParams.get("sleeve") || "Lengan Pendek";

    const [step, setStep] = useState(1);
    const [directProduct, setDirectProduct] = useState<BuatPesananProduct | null>(null);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    const [allBahan, setAllBahan] = useState<BahanOption[]>([]);

    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhoneState] = useState("");
    const setCustomerPhone = (val: string) => {
        setCustomerPhoneState(val.replace(/\D/g, ""));
    };
    const [customDetails, setCustomDetails] = useState<CustomDetailItem[]>([]);

    const [designNote, setDesignNote] = useState("");
    const [designReferenceFile, setDesignReferenceFile] = useState<File | null>(null);
    const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
    const [paymentType, setPaymentType] = useState<"FULL" | "DP">("DP");
    const [dpAmountInput, setDpAmountInput] = useState<number>(0);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const [shippingMethod, setShippingMethod] = useState("PICKUP");
    const [shippingAddress, setShippingAddress] = useState("");

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [pasteText, setPasteText] = useState("");
    const [isPasteDialogOpen, setIsPasteDialogOpen] = useState(false);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [playerCountInput, setPlayerCountInput] = useState("");
    const [showValidation, setShowValidation] = useState(false);

    const [existingOrder, setExistingOrder] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [toast, setToast] = useState<BuatPesananToast>({
        show: false,
        message: "",
        variant: "success"
    });

    useEffect(() => {
        adminApi.getBahanBaju().then((res) => {
            if (res.status === "success") {
                setAllBahan(res.data);
            }
        });
    }, []);

    useEffect(() => {
        if (productIdParam && cart.length === 0) {
            setIsLoadingProduct(true);
            adminApi.getBahanBaju().then((res) => {
                if (res.status === "success") {
                    const product = res.data.find((b: any) => b.id === Number(productIdParam));
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
    }, [productIdParam, cart.length]);

    const activeProduct: BuatPesananProduct | null = cart.length > 0 ? {
        id: cart[0].product.id,
        title: cart[0].product.title,
        price: cart[0].product.price,
        status: cart[0].product.status,
        image: cart[0].product.image
    } : directProduct;

    const activeBahan = allBahan.find(b => b.id === activeProduct?.id);
    const availableKg = activeBahan ? (activeBahan.kuantitasKg || 0) : 0;

    useEffect(() => {
        if (editOrderId) {
            setIsEditing(true);
            const loadOrderToEdit = async () => {
                try {
                    const order = await orderService.trackOrder(editOrderId);
                    if (order && order.status === "MENUNGGU") {
                        setExistingOrder(order);
                        setCustomerName(order.customerName || "");
                        setCustomerPhone(order.customerPhone || "");
                        setDesignNote(order.designNote || "");
                        setShippingMethod(order.shippingMethod || "PICKUP");
                        setShippingAddress(order.shippingAddress || "");

                        adminApi.getBahanBaju().then((res) => {
                            if (res.status === "success") {
                                const products = res.data;
                                const firstDetail = order.details?.[0];
                                if (firstDetail) {
                                    const product = products.find((b: any) => b.id === Number(firstDetail.productId));
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
                                    setCustomDetails(detailsMapped);
                                }
                            }
                        });
                    } else {
                        setToast({ show: true, message: "Pesanan ini tidak dapat diedit atau tidak ditemukan.", variant: "destructive" });
                        navigate("/admin/monitoring-pesanan");
                    }
                } catch (error) {
                    console.error("Failed to load order for edit:", error);
                    setToast({ show: true, message: "Gagal memuat detail pesanan.", variant: "destructive" });
                }
            };
            loadOrderToEdit();
        }
    }, [editOrderId, navigate]);

    useEffect(() => {
        if (isEditing || editOrderId) return;
        if (customDetails.length === 0) {
            if (cart.length > 0) {
                const initialDetails = cart.flatMap(item =>
                    Array.from({ length: item.quantity }).map(() => ({
                        id: `${item.product.id}-${Math.random().toString(36).substring(2, 9)}`,
                        productId: item.product.id,
                        productTitle: item.product.title,
                        price: item.product.price,
                        image: item.product.image,
                        name: "",
                        number: "",
                        size: sizeParam,
                        sleeve: sleeveParam
                    }))
                );
                setCustomDetails(initialDetails);
            } else if (activeProduct) {
                const initialDetails = Array.from({ length: 1 }).map(() => ({
                    id: `${activeProduct.id}-${Math.random().toString(36).substring(2, 9)}`,
                    productId: activeProduct.id,
                    productTitle: activeProduct.title,
                    price: activeProduct.price,
                    image: activeProduct.image,
                    name: "",
                    number: "",
                    size: sizeParam,
                    sleeve: sleeveParam
                }));
                setCustomDetails(initialDetails);
            }
        }
    }, [cart, activeProduct, customDetails.length, isEditing, editOrderId, sizeParam, sleeveParam]);

    useEffect(() => {
        if (isPasteDialogOpen) {
            const isEmptyDefaultList = customDetails.length === 1 && !customDetails[0].name && !customDetails[0].number;
            if (!isEmptyDefaultList && customDetails.length > 0) {
                const serializedLines = customDetails.map((detail, idx) => {
                    const parts: string[] = [];
                    if (detail.name) parts.push(detail.name);
                    if (detail.number) parts.push(detail.number);
                    if (detail.size) parts.push(detail.size);
                    if (detail.sleeve) {
                        const shortSleeve = detail.sleeve.replace("Lengan ", "");
                        parts.push(shortSleeve);
                    }
                    return `${idx + 1}. ${parts.join(", ")}`;
                });
                serializedLines.push(`${customDetails.length + 1}. `);
                setPasteText(serializedLines.join("\n"));
            } else {
                setPasteText("1. ");
            }
            setTimeout(() => {
                if (textareaRef.current) {
                    textareaRef.current.focus();
                    const length = textareaRef.current.value.length;
                    textareaRef.current.setSelectionRange(length, length);
                }
            }, 50);
        }
    }, [isPasteDialogOpen, customDetails]);

    const totalRequiredKg = customDetails.reduce((sum, item) => {
        return sum + getJerseyKgRequirement(item.size, item.sleeve, activeProduct?.rasioKonversi || 2.5);
    }, 0);

    const isOverLimit = !!(activeProduct && activeProduct.status !== "Habis" && totalRequiredKg > availableKg);

    const totalCalculated = customDetails.reduce((acc, d) => {
        const basePrice = activeProduct?.price || d.price || 150000;
        return acc + basePrice + getSizeSurcharge(d.size);
    }, 0);

    const effectivePaidAmount = paymentType === "DP"
        ? Math.min(Math.max(0, dpAmountInput), totalCalculated)
        : totalCalculated;

    const effectiveRemainingAmount = Math.max(0, totalCalculated - effectivePaidAmount);

    const handleSelectBahan = (val: string) => {
        const found = allBahan.find(b => b.id.toString() === val);
        if (found) {
            const newProduct: BuatPesananProduct = {
                id: found.id,
                title: found.nama,
                price: found.harga || 150000,
                status: found.status,
                kuantitasKg: found.kuantitasKg || 0,
                rasioKonversi: found.rasioKonversi || 2.5,
                image: found.imageUrl ? `${UPLOADS_URL}${found.imageUrl}` : ""
            };
            setDirectProduct(newProduct);
            setCustomDetails(prev => prev.map(detail => ({
                ...detail,
                productId: newProduct.id,
                productTitle: newProduct.title,
                price: newProduct.price,
                image: newProduct.image || ""
            })));
            setToast({ show: true, message: `Bahan ${found.nama} dipilih`, variant: "success" });
        }
    };

    const handleDetailChange = (id: string, field: keyof CustomDetailItem, value: string) => {
        setCustomDetails(prev => prev.map(detail =>
            detail.id === id ? { ...detail, [field]: value } : detail
        ));
    };

    const handleAddMember = (productId: number) => {
        const product = activeProduct || { id: productId, title: "Custom Jersey", price: 150000, image: "" };
        setCustomDetails(prev => [...prev, {
            id: `${productId}-${Math.random().toString(36).substring(2, 9)}`,
            productId: product.id,
            productTitle: product.title,
            price: product.price,
            image: product.image,
            name: "",
            number: "",
            size: "L",
            sleeve: "Lengan Pendek"
        }]);
    };

    const handleRemoveMember = (id: string) => {
        setCustomDetails(prev => prev.filter(d => d.id !== id));
    };

    const generateTable = () => {
        const count = parseInt(playerCountInput, 10);
        if (isNaN(count) || count <= 0) {
            setToast({ show: true, message: "Masukkan jumlah pemain yang valid", variant: "destructive" });
            return;
        }

        const product = activeProduct || {
            id: 0,
            title: "Custom Jersey",
            price: 150000,
            image: ""
        };

        const newDetails: CustomDetailItem[] = Array.from({ length: count }).map((_, idx) => ({
            id: `gen-${idx}-${Date.now()}`,
            productId: product.id,
            productTitle: product.title,
            price: product.price,
            image: product.image || "",
            name: "",
            number: "",
            size: "L",
            sleeve: "Lengan Pendek"
        }));

        setCustomDetails(newDetails);
        setPlayerCountInput("");
        setToast({ show: true, message: `Berhasil membuat tabel untuk ${count} pemain`, variant: "success" });
    };

    const resetTable = () => {
        setCustomDetails([]);
        setIsResetDialogOpen(false);
        setToast({ show: true, message: "Tabel berhasil direset", variant: "success" });
    };

    const handlePasteSubmit = () => {
        const parsed = parsePasteData(pasteText, activeProduct);
        if (parsed.length > 0) {
            setCustomDetails(parsed);
            setIsPasteDialogOpen(false);
            setPasteText("");
            setToast({ show: true, message: `Berhasil mengimpor ${parsed.length} pemain!`, variant: "success" });
        } else {
            setToast({ show: true, message: "Tidak ada data pemain yang valid terdeteksi", variant: "destructive" });
        }
    };

    const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const textarea = e.currentTarget;
        const val = textarea.value;
        const selStart = textarea.selectionStart;
        const selEnd = textarea.selectionEnd;

        const beforeCursor = val.substring(0, selStart);
        const afterCursor = val.substring(selEnd);
        const linesBefore = beforeCursor.split("\n");
        const currentLine = linesBefore[linesBefore.length - 1];
        const trimmedLine = currentLine.trim();

        if (e.key === "Enter") {
            const leadingNumberMatch = currentLine.match(/^(\d+)([\.\)\-\s]+)/);
            if (leadingNumberMatch) {
                e.preventDefault();
                const currentNum = parseInt(leadingNumberMatch[1], 10);
                const delimiter = leadingNumberMatch[2];
                const remainingContent = currentLine.substring(leadingNumberMatch[0].length).trim();

                if (remainingContent === "") {
                    const newBefore = linesBefore.slice(0, -1).join("\n") + (linesBefore.length > 1 ? "\n" : "");
                    textarea.value = newBefore + afterCursor;
                    textarea.selectionStart = textarea.selectionEnd = newBefore.length;
                    setPasteText(textarea.value);
                } else {
                    const nextNum = currentNum + 1;
                    const nextLineText = `\n${nextNum}${delimiter}`;
                    textarea.value = beforeCursor + nextLineText + afterCursor;
                    textarea.selectionStart = textarea.selectionEnd = selStart + nextLineText.length;
                    setPasteText(textarea.value);
                }
                return;
            }
        }

        if (beforeCursor.endsWith(" ")) {
            if (/^\d+[\.\)\-\s]+[A-Za-z_\s]+$/i.test(trimmedLine)) {
                if (/^\d$/.test(e.key)) {
                    e.preventDefault();
                    const insertText = `, ${e.key}`;
                    textarea.value = beforeCursor + insertText + afterCursor;
                    textarea.selectionStart = textarea.selectionEnd = selStart + insertText.length;
                    setPasteText(textarea.value);
                    return;
                }
            }

            if (/^\d+[\.\)\-\s]+.*,\s*\d+$/i.test(trimmedLine)) {
                if (/^[a-zA-Z]$/.test(e.key)) {
                    e.preventDefault();
                    const insertText = `, ${e.key.toUpperCase()}`;
                    textarea.value = beforeCursor + insertText + afterCursor;
                    textarea.selectionStart = textarea.selectionEnd = selStart + insertText.length;
                    setPasteText(textarea.value);
                    return;
                }
            }

            if (/^\d+[\.\)\-\s]+.*,\s*\d+\s*,\s*(XXS|XS|S|M|L|XL|XXL|2XL|3XL|4XL|5XL)$/i.test(trimmedLine)) {
                if (/^[a-zA-Z]$/.test(e.key)) {
                    e.preventDefault();
                    const insertText = `, ${e.key.toUpperCase()}`;
                    textarea.value = beforeCursor + insertText + afterCursor;
                    textarea.selectionStart = textarea.selectionEnd = selStart + insertText.length;
                    setPasteText(textarea.value);
                }
            }
        }
    };

    const handleTextareaPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        const pastedText = e.clipboardData.getData("text");
        const textarea = e.currentTarget;
        const val = textarea.value;
        const selStart = textarea.selectionStart;
        const selEnd = textarea.selectionEnd;

        const before = val.substring(0, selStart);
        const after = val.substring(selEnd);
        const lines = pastedText.split(/\r?\n/);

        const lastLineBefore = before.split("\n").pop() || "";
        const numMatch = lastLineBefore.match(/^(\d+)([\.\)\-\s]+)/);

        let currentNum = 1;
        let delimiter = ". ";

        if (numMatch) {
            currentNum = parseInt(numMatch[1], 10);
            delimiter = numMatch[2];
        } else {
            const beforeLines = before.split("\n");
            let lastNumFound = 0;
            for (let i = beforeLines.length - 1; i >= 0; i--) {
                const m = beforeLines[i].match(/^(\d+)([\.\)\-\s]+)/);
                if (m) {
                    lastNumFound = parseInt(m[1], 10);
                    delimiter = m[2];
                    break;
                }
            }
            if (lastNumFound > 0) {
                currentNum = lastNumFound + 1;
            }
        }

        const finalPastedLines: string[] = [];
        lines.forEach((line, index) => {
            const trimmed = line.trim();
            if (!trimmed) {
                finalPastedLines.push("");
            } else {
                const lineNumMatch = trimmed.match(/^(\d+)([\.\)\-\s]+)(.*)/);
                let lineText = trimmed;
                if (lineNumMatch) {
                    lineText = lineNumMatch[3].trim();
                }
                const isFirstLine = index === 0;
                const hasPrefixAlready = isFirstLine && numMatch && (lastLineBefore.trim() === numMatch[0].trim());
                if (isFirstLine && hasPrefixAlready) {
                    finalPastedLines.push(lineText);
                    currentNum++;
                } else {
                    const numToUse = currentNum;
                    currentNum++;
                    finalPastedLines.push(`${numToUse}${delimiter}${lineText}`);
                }
            }
        });

        const insertText = finalPastedLines.join("\n");
        const newVal = before + insertText + after;
        setPasteText(newVal);

        const newCursorPos = selStart + insertText.length;
        setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = newCursorPos;
        }, 0);
    };

    const handlePdfImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPdfFile(file);
            setToast({ show: true, message: "File PDF berhasil diunggah. Data pemain siap diproses dari dokumen ini.", variant: "success" });
        }
    };

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
                        if (options.clickTrigger) {
                            target.click();
                        }
                        return;
                    }
                }
                if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLButtonElement) {
                    el.focus();
                    if (options?.clickTrigger) {
                        el.click();
                    }
                } else {
                    const focusable = el.querySelector<HTMLElement>("input, textarea, button, [role='combobox']");
                    if (focusable) {
                        focusable.focus();
                        if (options?.clickTrigger) {
                            focusable.click();
                        }
                    }
                }
            }, 350);
        }, 50);
    };

    const isStepValid = () => {
        if (step === 1) {
            if (!customerName.trim() || !customerPhone.trim()) return false;
            if (!activeProduct) return false;
            if (pdfFile) return true;
            if (customDetails.length === 0) return false;
            if (isOverLimit) return false;
            return customDetails.every(d => d.name.trim() !== "" && d.number.trim() !== "" && d.size !== "");
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
            if (!activeProduct) {
                setShowValidation(true);
                setToast({
                    show: true,
                    message: "Mohon pilih Bahan Baku terlebih dahulu",
                    variant: "destructive"
                });
                scrollToElementAndFocus("field-bahan-baku", {
                    focusSelector: "button[role='combobox']",
                    clickTrigger: true
                });
                return false;
            }
            if (!customerName.trim()) {
                setShowValidation(true);
                setToast({
                    show: true,
                    message: "Mohon isi Nama Pelanggan terlebih dahulu",
                    variant: "destructive"
                });
                scrollToElementAndFocus("field-customer-name");
                return false;
            }
            if (!customerPhone.trim()) {
                setShowValidation(true);
                setToast({
                    show: true,
                    message: "Mohon isi Nomor Telepon Pelanggan terlebih dahulu",
                    variant: "destructive"
                });
                scrollToElementAndFocus("field-customer-phone");
                return false;
            }
            if (isOverLimit) {
                const supported = Math.floor(availableKg / (totalRequiredKg / customDetails.length));
                const reduce = Math.max(1, customDetails.length - supported);
                setToast({
                    show: true,
                    message: `Stok bahan tidak cukup! Silakan kurangi pesanan Anda sebanyak ${reduce} pcs atau ubah ukuran/lengan agar sesuai ketersediaan.`,
                    variant: "destructive"
                });
                scrollToElementAndFocus("field-stock-alert");
                return false;
            }
            if (!pdfFile && customDetails.length === 0) {
                setShowValidation(true);
                setToast({
                    show: true,
                    message: "Mohon tambahkan daftar pemain terlebih dahulu",
                    variant: "destructive"
                });
                scrollToElementAndFocus("field-player-table");
                return false;
            }
            if (!pdfFile) {
                const invalidIndex = customDetails.findIndex(
                    d => !d.name.trim() || !d.number.trim() || !d.size
                );
                if (invalidIndex !== -1) {
                    const invalidItem = customDetails[invalidIndex];
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
                setToast({
                    show: true,
                    message: "Mohon unggah referensi desain jersey Anda",
                    variant: "destructive"
                });
                scrollToElementAndFocus("field-design-reference");
                return false;
            }
            if (shippingMethod === "COD" && !shippingAddress.trim()) {
                setShowValidation(true);
                setToast({
                    show: true,
                    message: "Mohon isi alamat pengiriman untuk metode COD",
                    variant: "destructive"
                });
                scrollToElementAndFocus("field-shipping-address");
                return false;
            }
            return true;
        }

        return true;
    };

    const handleNextStep = () => {
        if (!validateAndFocusCurrentStep()) {
            return;
        }
        setShowValidation(false);
        setStep(prev => prev + 1);
    };

    const handleSubmit = async () => {
        if (!validateAndFocusCurrentStep()) {
            return;
        }

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
                const res = await chatService.uploadFile(compressed);
                designUrl = res.url;
            }

            setUploadProgress(90);

            try {
                const payload = {
                    customerId: user?.id || 0,
                    bahanBajuId: activeProduct?.id,
                    totalAmount: totalCalculated,
                    paymentType,
                    paidAmount: effectivePaidAmount,
                    remainingAmount: effectiveRemainingAmount,
                    designNote,
                    designUrl,
                    paymentUrl,
                    shippingMethod,
                    shippingAddress: shippingMethod === "COD" ? shippingAddress : "",
                    customerName,
                    customerPhone,
                    details: customDetails.map(d => ({
                        productId: activeProduct?.id || d.productId,
                        productTitle: activeProduct?.title || d.productTitle,
                        playerName: d.name,
                        playerNumber: d.number,
                        playerSize: `${d.size} (${d.sleeve || "Lengan Pendek"})`
                    }))
                };

                await orderService.createOrder(payload);
                setUploadProgress(100);
                setToast({ show: true, message: "Pesanan berhasil dibuat!", variant: "success" });

                setTimeout(() => {
                    clearCart();
                    navigate("/admin/monitoring-pesanan");
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
        customerPhone,
        setCustomerPhone,
        customDetails,
        setCustomDetails,
        handleSelectBahan,
        handleDetailChange,
        handleAddMember,
        handleRemoveMember,
        activeProduct,
        isLoadingProduct,
        availableKg,
        allBahan,
        totalRequiredKg,
        isOverLimit,
        totalCalculated,
        paymentType,
        setPaymentType,
        dpAmountInput,
        setDpAmountInput,
        effectivePaidAmount,
        effectiveRemainingAmount,
        designNote,
        setDesignNote,
        designReferenceFile,
        setDesignReferenceFile,
        paymentProofFile,
        setPaymentProofFile,
        pdfFile,
        setPdfFile,
        handlePdfImport,
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
        isPasteDialogOpen,
        setIsPasteDialogOpen,
        pasteText,
        setPasteText,
        handlePasteSubmit,
        handleTextareaKeyDown,
        handleTextareaPaste,
        textareaRef,
        isResetDialogOpen,
        setIsResetDialogOpen,
        playerCountInput,
        setPlayerCountInput,
        generateTable,
        resetTable,
        handleSubmit,
        isEditing,
        editOrderId
    };
}
