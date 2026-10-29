import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { User, FileUp, CreditCard } from "lucide-react";
import { useCart } from "~/context/CartContext";
import { useAuth } from "~/context/AuthContext";
import { orderService } from "~/services/orderService";
import { chatService } from "~/services/chatService";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";
import { formatRupiah, convertImageToWebP } from "~/lib/utils";
import type {
    CustomJerseyDetailItem,
    CustomJerseyCheckoutStep,
    UseCustomJerseyCheckoutReturn,
} from "~/types";

const getSizeSurcharge = (size: string): number => {
    const s = size.toUpperCase().trim();
    if (["XXS", "XS", "S", "M", "L", "XL", "2XL", "XXL"].includes(s)) {
        return 0;
    }
    const numXlMatch = s.match(/^(\d+)XL$/);
    if (numXlMatch) {
        const xCount = parseInt(numXlMatch[1], 10);
        if (xCount >= 3) {
            return (xCount - 2) * 10000;
        }
    }
    const xMatches = s.match(/^(X+)L$/);
    if (xMatches) {
        const xCount = xMatches[1].length;
        if (xCount >= 3) {
            return (xCount - 2) * 10000;
        }
    }
    return 0;
};

export const getJerseyKgRequirement = (
    size: string,
    sleeve: string,
    rasioKonversi: number,
): number => {
    const s = size.toUpperCase().trim();
    const isLongSleeve = sleeve === "Lengan Panjang";
    const isBigSize = ["3XL", "4XL", "5XL", "6XL", "XXXL", "XXXXL"].includes(s);
    const rasio = rasioKonversi || 2.5;

    if (isLongSleeve) {
        return (isBigSize ? 2.5 : 1.25) / rasio;
    } else {
        return (isBigSize ? 1.25 : 0.8333) / rasio;
    }
};

export const compressImage = (file: File): Promise<File> => {
    return convertImageToWebP(file, 0.8, 1200);
};

export function useCustomJerseyCheckout(): UseCustomJerseyCheckoutReturn {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [searchParams] = useSearchParams();
    const productIdParam = searchParams.get("productId");
    const [directProduct, setDirectProduct] = useState<any>(null);

    const [customDetails, setCustomDetails] = useState<CustomJerseyDetailItem[]>([]);
    const [designNote, setDesignNote] = useState("");
    const [designReferenceFile, setDesignReferenceFile] = useState<File | null>(null);
    const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
    const [paymentType, setPaymentType] = useState<"FULL" | "DP">("FULL");
    const [dpAmountInput, setDpAmountInput] = useState<number>(0);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [shippingMethod, setShippingMethod] = useState("PICKUP");
    const [shippingAddress, setShippingAddress] = useState("");

    const [pasteText, setPasteText] = useState("");
    const [isPasteDialogOpen, setIsPasteDialogOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [playerCountInput, setPlayerCountInput] = useState("");
    const [showValidation, setShowValidation] = useState(false);
    const [allBahan, setAllBahan] = useState<any[]>([]);

    const [toast, setToast] = useState<{
        show: boolean;
        message: string;
        variant: "success" | "destructive" | "default";
    }>({
        show: false,
        message: "",
        variant: "success",
    });

    const editOrderId = searchParams.get("editOrderId");
    const [existingOrder, setExistingOrder] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const sizeParam = searchParams.get("size") || "L";
    const sleeveParam = searchParams.get("sleeve") || "Lengan Pendek";

    useEffect(() => {
        adminApi.getBahanBaju().then((res) => {
            if (res.status === "success") {
                setAllBahan(res.data);
            }
        });
    }, []);

    const parseSizeAndSleeve = (playerSize: string) => {
        const match = playerSize.match(/^([^(]+)(?:\(([^)]+)\))?$/);
        if (match) {
            const size = match[1].trim();
            const sleeve = match[2] ? match[2].trim() : "Lengan Pendek";
            return { size, sleeve };
        }
        return { size: playerSize || "L", sleeve: "Lengan Pendek" };
    };

    useEffect(() => {
        if (productIdParam && cart.length === 0) {
            adminApi.getBahanBaju().then((res) => {
                if (res.status === "success") {
                    const product = res.data.find(
                        (b: any) => b.id === Number(productIdParam),
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
            });
        }
    }, [productIdParam, cart.length]);

    const activeProduct =
        cart.length > 0
            ? {
                  id: cart[0].product.id,
                  title: cart[0].product.title,
                  price: cart[0].product.price,
                  status: cart[0].product.status,
                  image: cart[0].product.image,
                  rasioKonversi: 2.5,
              }
            : directProduct;

    const activeBahan = allBahan.find((b) => b.id === activeProduct?.id);
    const availableKg = activeBahan ? activeBahan.kuantitasKg || 0 : 0;

    useEffect(() => {
        if (isPasteDialogOpen) {
            const isEmptyDefaultList =
                customDetails.length === 1 &&
                !customDetails[0].name &&
                !customDetails[0].number;
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
    }, [isPasteDialogOpen]);

    useEffect(() => {
        if (editOrderId) {
            setIsEditing(true);
            const loadOrderToEdit = async () => {
                try {
                    const order = await orderService.trackOrder(editOrderId);
                    if (order && order.status === "MENUNGGU") {
                        setExistingOrder(order);
                        setDesignNote(order.designNote || "");
                        setShippingMethod(order.shippingMethod || "PICKUP");
                        setShippingAddress(order.shippingAddress || "");

                        adminApi.getBahanBaju().then((res) => {
                            if (res.status === "success") {
                                const products = res.data;
                                const firstDetail = order.details?.[0];
                                if (firstDetail) {
                                    const product = products.find(
                                        (b: any) =>
                                            b.id === Number(firstDetail.productId),
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
                                                (b: any) =>
                                                    b.id === Number(detail.productId),
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
                                    setCustomDetails(detailsMapped);
                                }
                            }
                        });
                    } else {
                        setToast({
                            show: true,
                            message:
                                "Pesanan ini tidak dapat diedit atau tidak ditemukan.",
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

    useEffect(() => {
        if (isEditing || editOrderId) return;
        if (customDetails.length === 0) {
            if (cart.length > 0) {
                const initialDetails = cart.flatMap((item) =>
                    Array.from({ length: item.quantity }).map(() => ({
                        id: `${item.product.id}-${Math.random().toString(36).substr(2, 9)}`,
                        productId: item.product.id,
                        productTitle: item.product.title,
                        price: item.product.price,
                        image: item.product.image,
                        name: "",
                        number: "",
                        size: sizeParam,
                        sleeve: sleeveParam,
                    })),
                );
                setCustomDetails(initialDetails);
            } else if (activeProduct) {
                const initialDetails = Array.from({ length: 1 }).map(() => ({
                    id: `${activeProduct.id}-${Math.random().toString(36).substr(2, 9)}`,
                    productId: activeProduct.id,
                    productTitle: activeProduct.title,
                    price: activeProduct.price,
                    image: activeProduct.image,
                    name: "",
                    number: "",
                    size: sizeParam,
                    sleeve: sleeveParam,
                }));
                setCustomDetails(initialDetails);
            }
        }
    }, [cart, activeProduct, customDetails.length]);

    const generateTable = () => {
        const count = parseInt(playerCountInput);
        if (isNaN(count) || count <= 0) {
            setToast({
                show: true,
                message: "Masukkan jumlah pemain yang valid",
                variant: "destructive",
            });
            return;
        }

        if (!activeProduct) {
            setToast({
                show: true,
                message: "Pilih produk terlebih dahulu",
                variant: "destructive",
            });
            return;
        }

        const productId = activeProduct.id;
        const productTitle = activeProduct.title;
        const price = activeProduct.price;
        const image = activeProduct.image;

        const newDetails: CustomJerseyDetailItem[] = Array.from({ length: count }).map(
            (_, idx) => ({
                id: `gen-${idx}-${Date.now()}`,
                productId,
                productTitle,
                price,
                image,
                name: "",
                number: "",
                size: "L",
                sleeve: "Lengan Pendek",
            }),
        );
        setCustomDetails(newDetails);
        setPlayerCountInput("");
        setToast({
            show: true,
            message: `Berhasil membuat tabel untuk ${count} pemain`,
            variant: "success",
        });
    };

    const resetTable = () => {
        setCustomDetails([]);
        setIsResetDialogOpen(false);
        setToast({ show: true, message: "Tabel berhasil direset", variant: "success" });
    };

    const parsePasteData = () => {
        const lines = pasteText.split("\n").filter((l) => l.trim());
        if (!activeProduct) return;

        const validSizes = [
            "5XL",
            "4XL",
            "3XL",
            "2XL",
            "XXXL",
            "XXL",
            "XL",
            "XS",
            "XXS",
            "S",
            "M",
            "L",
        ];
        const isSize = (val: string) =>
            validSizes.includes(val.toUpperCase().trim());
        const normalizeSize = (rawSize: string) => {
            const s = rawSize.toUpperCase().trim();
            if (s === "XXL") return "2XL";
            if (s === "XXXL") return "3XL";
            if (s === "XXXXL") return "4XL";
            return s;
        };
        const isNumeric = (val: string) => /^\d+$/.test(val.trim());

        const newDetails: CustomJerseyDetailItem[] = lines.map((line, idx) => {
            let tempLine = line.trim();

            let sleeve = "Lengan Pendek";
            const panjangRegex = /\b(panjang|pjg|long|lengan\s*panjang)\b/i;
            const pendekRegex = /\b(pendek|pdk|short|lengan\s*pendek)\b/i;

            if (panjangRegex.test(tempLine)) {
                sleeve = "Lengan Panjang";
                tempLine = tempLine.replace(panjangRegex, " ");
            } else if (pendekRegex.test(tempLine)) {
                sleeve = "Lengan Pendek";
                tempLine = tempLine.replace(pendekRegex, " ");
            }

            tempLine = tempLine.replace(
                /^\s*(?:no\.?|nomor)?\s*\d+\s*[\.\)\:\-]\s*/i,
                "",
            );

            let name = "";
            let number = "";
            let size = "L";

            const hasDelimiter = /[\/\t\|;,]|\s+-\s+/.test(tempLine);

            if (hasDelimiter) {
                const parts = tempLine
                    .split(/(?:[\/\t\|;,]+|\s+-\s+)/)
                    .map((p) => p.trim())
                    .filter(Boolean);

                const nameParts: string[] = [];
                let sizeFound = false;

                for (const part of parts) {
                    if (!sizeFound && isSize(part)) {
                        size = normalizeSize(part);
                        sizeFound = true;
                    } else if (!number && isNumeric(part)) {
                        number = part;
                    } else {
                        nameParts.push(part);
                    }
                }

                name = nameParts.join(" ");
            } else {
                const tokens = tempLine.split(/\s+/).filter(Boolean);
                let sizeFound = false;

                for (let i = tokens.length - 1; i >= 0; i--) {
                    const token = tokens[i];
                    if (!sizeFound && isSize(token)) {
                        size = normalizeSize(token);
                        sizeFound = true;
                        tokens.splice(i, 1);
                    } else if (!number && isNumeric(token)) {
                        number = token;
                        tokens.splice(i, 1);
                    }
                }

                name = tokens.join(" ");
            }

            name = name
                .replace(/["'\(\)\[\]\{\}]/g, "")
                .replace(/[\/\\|;,]/g, " ")
                .replace(/\s+/g, " ")
                .trim();

            return {
                id: `pasted-${idx}-${Date.now()}`,
                productId: activeProduct?.id || 101,
                productTitle: activeProduct?.title || "Custom Jersey",
                price: activeProduct?.price || 150000,
                image: activeProduct?.image || "",
                name: name.toUpperCase(),
                number: number,
                size: size,
                sleeve: sleeve,
            };
        });

        setCustomDetails(newDetails);
        setIsPasteDialogOpen(false);
        setPasteText("");
        setToast({
            show: true,
            message: `Successfully parsed ${newDetails.length} players!`,
            variant: "success",
        });
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
                const remainingContent = currentLine
                    .substring(leadingNumberMatch[0].length)
                    .trim();

                if (remainingContent === "") {
                    const newBefore =
                        linesBefore.slice(0, -1).join("\n") +
                        (linesBefore.length > 1 ? "\n" : "");
                    textarea.value = newBefore + afterCursor;
                    textarea.selectionStart = textarea.selectionEnd =
                        newBefore.length;
                    setPasteText(textarea.value);
                } else {
                    const nextNum = currentNum + 1;
                    const nextLineText = `\n${nextNum}${delimiter}`;
                    textarea.value = beforeCursor + nextLineText + afterCursor;
                    textarea.selectionStart = textarea.selectionEnd =
                        selStart + nextLineText.length;
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
                    textarea.selectionStart = textarea.selectionEnd =
                        selStart + insertText.length;
                    setPasteText(textarea.value);
                    return;
                }
            }

            if (/^\d+[\.\)\-\s]+.*,\s*\d+$/i.test(trimmedLine)) {
                if (/^[a-zA-Z]$/.test(e.key)) {
                    e.preventDefault();
                    const insertText = `, ${e.key.toUpperCase()}`;
                    textarea.value = beforeCursor + insertText + afterCursor;
                    textarea.selectionStart = textarea.selectionEnd =
                        selStart + insertText.length;
                    setPasteText(textarea.value);
                    return;
                }
            }

            if (
                /^\d+[\.\)\-\s]+.*,\s*\d+\s*,\s*(XXS|XS|S|M|L|XL|XXL|2XL|3XL|4XL|5XL)$/i.test(
                    trimmedLine,
                )
            ) {
                if (/^[a-zA-Z]$/.test(e.key)) {
                    e.preventDefault();
                    const insertText = `, ${e.key.toUpperCase()}`;
                    textarea.value = beforeCursor + insertText + afterCursor;
                    textarea.selectionStart = textarea.selectionEnd =
                        selStart + insertText.length;
                    setPasteText(textarea.value);
                    return;
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
                const hasPrefixAlready =
                    isFirstLine &&
                    numMatch &&
                    lastLineBefore.trim() === numMatch[0].trim();
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

    const removeUnit = (id: string) => {
        setCustomDetails((prev) => prev.filter((d) => d.id !== id));
    };

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
            const hasDesign = !!designReferenceFile || !!existingOrder?.designUrl;
            const hasAddressIfCod =
                shippingMethod !== "COD" || shippingAddress.trim() !== "";
            return hasDesign && hasAddressIfCod;
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
                const hasDesign =
                    !!designReferenceFile || !!existingOrder?.designUrl;
                if (!hasDesign) {
                    msg = "Mohon unggah referensi desain jersey Anda";
                } else {
                    msg = "Mohon isi alamat pengiriman untuk metode COD";
                }
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

    const updateUnitQuantity = (productId: number, delta: number) => {
        if (delta > 0) {
            const product = cart.find((item) => item.product.id === productId)
                ?.product || {
                id: productId,
                title: "Custom Jersey",
                price: 150000,
                image: "",
            };

            setCustomDetails((prev) => [
                ...prev,
                {
                    id: `${productId}-${Math.random().toString(36).substr(2, 9)}`,
                    productId: productId,
                    productTitle: product.title,
                    price: product.price,
                    image: product.image,
                    name: "",
                    number: "",
                    size: "L",
                    sleeve: "Lengan Pendek",
                },
            ]);
        } else {
            const lastIdx = [...customDetails]
                .reverse()
                .findIndex((d) => d.productId === productId);
            if (lastIdx !== -1) {
                const actualIdx = customDetails.length - 1 - lastIdx;
                setCustomDetails((prev) => prev.filter((_, i) => i !== actualIdx));
            }
        }
    };

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

    const handleDetailChange = (id: string, field: string, value: string) => {
        setCustomDetails((prev) =>
            prev.map((detail) =>
                detail.id === id ? { ...detail, [field]: value } : detail,
            ),
        );
    };

    const handlePdfImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPdfFile(file);
            setToast({
                show: true,
                message:
                    "File PDF berhasil diunggah. Admin akan memproses data pemain dari PDF ini.",
                variant: "success",
            });
        }
    };

    const handleSubmit = async () => {
        if (!isStepValid()) {
            setShowValidation(true);
            setToast({
                show: true,
                message:
                    "Mohon lengkapi seluruh data pemain dan bukti transfer.",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);
        setUploadProgress(10);
        try {
            let designUrl = existingOrder?.designUrl || "";
            let paymentUrl = existingOrder?.paymentUrl || "";

            if (designReferenceFile) {
                setUploadProgress(20);
                const compressed = await compressImage(designReferenceFile);
                setUploadProgress(40);
                const res = await chatService.uploadFile(compressed);
                designUrl = res.url;
            }

            if (paymentProofFile) {
                setUploadProgress(60);
                const compressed = await compressImage(paymentProofFile);
                setUploadProgress(80);
                const res = await chatService.uploadFile(compressed);
                paymentUrl = res.url;
            }

            setUploadProgress(90);

            try {
                const payload = {
                    customerId: user?.id || 0,
                    bahanBajuId: activeProduct?.id,
                    totalAmount: totalCalculated,
                    paymentType: paymentType,
                    paidAmount: effectivePaidAmount,
                    remainingAmount: effectiveRemainingAmount,
                    designNote: designNote,
                    designUrl: designUrl,
                    paymentUrl: paymentUrl,
                    shippingMethod: shippingMethod,
                    shippingAddress:
                        shippingMethod === "COD" ? shippingAddress : "",
                    details: customDetails.map((d) => ({
                        productId: d.productId,
                        productTitle: d.productTitle,
                        playerName: d.name,
                        playerNumber: d.number,
                        playerSize: `${d.size} (${d.sleeve || "Lengan Pendek"})`,
                    })),
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

    const steps: CustomJerseyCheckoutStep[] = [
        { id: 1, name: "Player Info", icon: User },
        { id: 2, name: "Design Reference", icon: FileUp },
        { id: 3, name: "Payment Proof", icon: CreditCard },
    ];

    return {
        step,
        setStep,
        activeProduct,
        activeBahan,
        allBahan,
        availableKg,
        customDetails,
        setCustomDetails,
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
        pdfFile,
        setPdfFile,
        isUploading,
        uploadProgress,
        shippingMethod,
        setShippingMethod,
        shippingAddress,
        setShippingAddress,
        pasteText,
        setPasteText,
        isPasteDialogOpen,
        setIsPasteDialogOpen,
        textareaRef,
        isResetDialogOpen,
        setIsResetDialogOpen,
        playerCountInput,
        setPlayerCountInput,
        showValidation,
        setShowValidation,
        totalRequiredKg,
        isOverLimit,
        toast,
        setToast,
        user,
        existingOrder,
        setExistingOrder,
        isEditing,
        steps,
        formatRupiah,
        getSizeSurcharge,
        generateTable,
        resetTable,
        parsePasteData,
        handleTextareaKeyDown,
        handleTextareaPaste,
        removeUnit,
        updateUnitQuantity,
        handleDetailChange,
        handlePdfImport,
        isStepValid,
        handleNextStep,
        handleSubmit,
        totalCalculated,
        effectivePaidAmount,
        effectiveRemainingAmount,
    };
}
