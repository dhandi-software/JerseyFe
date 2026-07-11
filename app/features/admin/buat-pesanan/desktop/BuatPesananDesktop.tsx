import { useState, useEffect, useRef } from "react";
import { 
    ChevronLeft, 
    User, 
    Hash, 
    Ruler, 
    Upload, 
    FileText, 
    CheckCircle2, 
    ArrowRight, 
    CreditCard, 
    ShoppingCart,
    Info,
    FileUp,
    AlertCircle,
    Loader2,
    Plus,
    Minus,
    Trash2,
    ClipboardPaste,
    X,
    Mail,
    ShieldCheck
} from "lucide-react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter,
    DialogDescription
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { useCart } from "~/context/CartContext";
import { Card, CardHeader, CardContent, CardFooter } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { orderService } from "~/services/orderService";
import { chatService } from "~/services/chatService";
import { useAuth } from "~/context/AuthContext";
import { cn } from "~/lib/utils";
import { useNavigate, useSearchParams } from "react-router";
import { Toast } from "~/components/ui/toast";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";
import { CustomSelect } from "~/components/ui/custom-select";

const formatRupiah = (number: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

const getSizeSurcharge = (size: string): number => {
    const s = size.toUpperCase().trim();
    // Sizes S through 2XL have no surcharge
    if (["XXS", "XS", "S", "M", "L", "XL", "2XL", "XXL"].includes(s)) {
        return 0;
    }
    // 3XL = +Rp10.000, 4XL = +Rp20.000, 5XL = +Rp30.000, etc.
    const numXlMatch = s.match(/^(\d+)XL$/);
    if (numXlMatch) {
        const xCount = parseInt(numXlMatch[1], 10);
        if (xCount >= 3) {
            return (xCount - 2) * 10000;
        }
    }
    // Handle XXXL, XXXXL formats
    const xMatches = s.match(/^(X+)L$/);
    if (xMatches) {
        const xCount = xMatches[1].length;
        if (xCount >= 3) {
            return (xCount - 2) * 10000;
        }
    }
    return 0;
};

const getJerseyKgRequirement = (size: string, sleeve: string, rasioKonversi: number): number => {
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

const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve) => {
        if (!file.type.startsWith('image/')) {
            resolve(file);
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement("canvas");
                const MAX_WIDTH = 1200;
                const MAX_HEIGHT = 1200;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");
                ctx?.drawImage(img, 0, 0, width, height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: "image/jpeg" }));
                    } else {
                        resolve(file);
                    }
                }, "image/jpeg", 0.7);
            };
        };
    });
};

export function BuatPesananDesktop({ title }: { title: string }) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { cart, clearCart } = useCart();
    const [step, setStep] = useState(1);
    const [searchParams] = useSearchParams();
    const productIdParam = searchParams.get("productId");
    const [directProduct, setDirectProduct] = useState<any>(null);
    const [isLoadingProduct, setIsLoadingProduct] = useState(false);
    
    // Admin fields
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    
    const [customDetails, setCustomDetails] = useState<any[]>([]);
    const [designNote, setDesignNote] = useState("");
    const [designReferenceFile, setDesignReferenceFile] = useState<File | null>(null);
    const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [shippingMethod, setShippingMethod] = useState("PICKUP");
    const [shippingAddress, setShippingAddress] = useState("");

    const [pasteText, setPasteText] = useState("");
    const [isPasteDialogOpen, setIsPasteDialogOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    }, [isPasteDialogOpen]);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [playerCountInput, setPlayerCountInput] = useState("");
    const [showValidation, setShowValidation] = useState(false);
    const [allBahan, setAllBahan] = useState<any[]>([]);

    useEffect(() => {
        adminApi.getBahanBaju().then(res => {
            if (res.status === "success") {
                setAllBahan(res.data);
            }
        });
    }, []);

    const sizeParam = searchParams.get("size") || "L";
    const sleeveParam = searchParams.get("sleeve") || "Lengan Pendek";

    useEffect(() => {
        if (productIdParam && cart.length === 0) {
            setIsLoadingProduct(true);
            adminApi.getBahanBaju().then(res => {
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

    const activeProduct = cart.length > 0 ? {
        id: cart[0].product.id,
        title: cart[0].product.title,
        price: cart[0].product.price,
        status: cart[0].product.status,
        image: cart[0].product.image
    } : directProduct;

    const activeBahan = allBahan.find(b => b.id === activeProduct?.id);
    const availableKg = activeBahan ? (activeBahan.kuantitasKg || 0) : 0;

    const [toast, setToast] = useState<{ show: boolean, message: string, variant: "success" | "destructive" | "default" }>({ 
        show: false, 
        message: "", 
        variant: "success" 
    });

    const parseSizeAndSleeve = (playerSize: string) => {
        const match = playerSize.match(/^([^(]+)(?:\(([^)]+)\))?$/);
        if (match) {
            const size = match[1].trim();
            const sleeve = match[2] ? match[2].trim() : "Lengan Pendek";
            return { size, sleeve };
        }
        return { size: playerSize || "L", sleeve: "Lengan Pendek" };
    };

    const editOrderId = searchParams.get("editOrderId");
    const [existingOrder, setExistingOrder] = useState<any | null>(null);
    const [isEditing, setIsEditing] = useState(false);

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
                        
                        // Load details & product details
                        adminApi.getBahanBaju().then(res => {
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
                        navigate("/customer");
                    }
                } catch (error) {
                    console.error("Failed to load order for edit:", error);
                    setToast({ show: true, message: "Gagal memuat detail pesanan.", variant: "destructive" });
                }
            };
            loadOrderToEdit();
        }
    }, [editOrderId]);

    const generateTable = () => {
        const count = parseInt(playerCountInput);
        if (isNaN(count) || count <= 0) {
            setToast({ show: true, message: "Masukkan jumlah pemain yang valid", variant: "destructive" });
            return;
        }

        if (!activeProduct) {
            setToast({ show: true, message: "Pilih produk terlebih dahulu", variant: "destructive" });
            return;
        }

        const productId = activeProduct.id;
        const productTitle = activeProduct.title;
        const price = activeProduct.price;
        const image = activeProduct.image;
        
        const newDetails = Array.from({ length: count }).map((_, idx) => ({
            id: `gen-${idx}-${Date.now()}`,
            productId,
            productTitle,
            price,
            image,
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

    useEffect(() => {
        if (isEditing || editOrderId) return;
        if (customDetails.length === 0) {
            if (cart.length > 0) {
                const initialDetails = cart.flatMap(item => 
                    Array.from({ length: item.quantity }).map((_, idx) => ({
                        id: `${item.product.id}-${Math.random().toString(36).substr(2, 9)}`,
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
                const initialDetails = Array.from({ length: 1 }).map((_, idx) => ({
                    id: `${activeProduct.id}-${Math.random().toString(36).substr(2, 9)}`,
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
    }, [cart, activeProduct, customDetails.length]);

    const parsePasteData = () => {
        const lines = pasteText.split('\n').filter(l => l.trim());
        if (!activeProduct) return;

        const newDetails = lines.map((line, idx) => {
            let tempLine = line.trim();
            
            // 1. Detect Sleeve Length (Lengan)
            let sleeve = "Lengan Pendek";
            const panjangRegex = /\b(panjang|pjg|long)\b/i;
            const pendekRegex = /\b(pendek|pdk|short)\b/i;
            
            if (panjangRegex.test(tempLine)) {
                sleeve = "Lengan Panjang";
                tempLine = tempLine.replace(panjangRegex, '');
            } else if (pendekRegex.test(tempLine)) {
                sleeve = "Lengan Pendek";
                tempLine = tempLine.replace(pendekRegex, '');
            }

            // 2. Detect Size (Ukuran)
            const sizeRegex = /\b(XXS|XS|S|M|L|XL|XXL|2XL|XXXL|4XL|5XL)\b/i;
            const sizeMatch = tempLine.match(sizeRegex);
            const size = sizeMatch ? sizeMatch[0].toUpperCase() : "L";
            if (sizeMatch) {
                tempLine = tempLine.replace(sizeMatch[0], "");
            }

            // 3. Detect Numbers (Line Number vs Back Number)
            const allNumbers = [...tempLine.matchAll(/\b\d+\b/g)].map(m => m[0]);
            let number = "";
            
            if (allNumbers.length >= 2) {
                const firstNumber = allNumbers[0];
                const leadingNumberRegex = new RegExp(`^${firstNumber}\\s*[\\.\\)\\-\\,]*\\s*`);
                if (leadingNumberRegex.test(tempLine)) {
                    tempLine = tempLine.replace(leadingNumberRegex, '');
                    number = allNumbers[1];
                    tempLine = tempLine.replace(new RegExp(`\\b${number}\\b`), '');
                } else {
                    number = firstNumber;
                    tempLine = tempLine.replace(new RegExp(`\\b${number}\\b`), '');
                }
            } else if (allNumbers.length === 1) {
                number = allNumbers[0];
                tempLine = tempLine.replace(new RegExp(`\\b${number}\\b`), '');
            }

            // 4. Clean up Name (Nama)
            let name = tempLine
                .replace(/["'\(\)\[\]\{\}]/g, '')
                .replace(/[-–—,;|]/g, ' ')
                .replace(/\s+/g, ' ')
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
                sleeve: sleeve
            };
        });

        setCustomDetails(newDetails);
        setIsPasteDialogOpen(false);
        setPasteText("");
        setToast({ show: true, message: `Successfully parsed ${newDetails.length} players!`, variant: "success" });
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

        // 1. MS Word style auto-numbering when pressing Enter
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

        // Auto-comma triggers ONLY when the character before cursor is a space
        if (beforeCursor.endsWith(" ")) {
            // 2. Smart auto-inserting comma after Name when typing the back number
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

            // 3. Smart auto-inserting comma after Back Number when typing size
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

            // 4. Smart auto-inserting comma after Size when typing sleeve length
            if (/^\d+[\.\)\-\s]+.*,\s*\d+\s*,\s*(XXS|XS|S|M|L|XL|XXL|2XL|3XL|4XL|5XL)$/i.test(trimmedLine)) {
                if (/^[a-zA-Z]$/.test(e.key)) {
                    e.preventDefault();
                    const insertText = `, ${e.key.toUpperCase()}`;
                    textarea.value = beforeCursor + insertText + afterCursor;
                    textarea.selectionStart = textarea.selectionEnd = selStart + insertText.length;
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

        // Get the text before and after the selection
        const before = val.substring(0, selStart);
        const after = val.substring(selEnd);

        // Let's split the pasted text into lines
        const lines = pastedText.split(/\r?\n/);
        
        // We need to determine the starting number.
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

    const removeUnit = (id: string) => {
        setCustomDetails(prev => prev.filter(d => d.id !== id));
    };

    const totalRequiredKg = customDetails.reduce((sum, item) => sum + getJerseyKgRequirement(item.size, item.sleeve, activeProduct?.rasioKonversi || 2.5), 0);
    const isOverLimit = activeProduct && activeProduct.status !== "Habis" && totalRequiredKg > availableKg;

    const isStepValid = () => {
        if (step === 1) {
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
        if (step === 3) {
            return !!paymentProofFile || !!existingOrder?.paymentUrl;
        }
        return true;
    };

    const handleNextStep = () => {
        if (step === 1 && isOverLimit) {
            const supported = Math.floor(availableKg / (totalRequiredKg / customDetails.length));
            const reduce = Math.max(1, customDetails.length - supported);
            setToast({ 
                show: true, 
                message: `Stok bahan tidak cukup! Silakan kurangi pesanan Anda sebanyak ${reduce} pcs atau ubah ukuran/lengan agar sesuai dengan ketersediaan.`, 
                variant: "destructive" 
            });
            return;
        }
        if (!isStepValid()) {
            setShowValidation(true);
            let msg = "Lengkapi langkah ini terlebih dahulu";
            if (step === 1) {
                msg = "Mohon lengkapi detail pemain (Nama, Nomor, Size)";
            } else if (step === 2) {
                const hasDesign = !!designReferenceFile || !!existingOrder?.designUrl;
                if (!hasDesign) {
                    msg = "Mohon unggah referensi desain jersey Anda";
                } else {
                    msg = "Mohon isi alamat pengiriman untuk metode COD";
                }
            }
            setToast({ 
                show: true, 
                message: msg, 
                variant: "destructive" 
            });
            return;
        }
        setShowValidation(false);
        setStep(prev => prev + 1);
    };

    const updateUnitQuantity = (productId: number, delta: number) => {
        if (delta > 0) {
            const product = cart.find(item => item.product.id === productId)?.product || 
                          { id: productId, title: "Custom Jersey", price: 150000, image: "" };
            
            setCustomDetails(prev => [...prev, {
                id: `${productId}-${Math.random().toString(36).substr(2, 9)}`,
                productId: productId,
                productTitle: product.title,
                price: product.price,
                image: product.image,
                name: "",
                number: "",
                size: "L",
                sleeve: "Lengan Pendek"
            }]);
        } else {
            const lastIdx = [...customDetails].reverse().findIndex(d => d.productId === productId);
            if (lastIdx !== -1) {
                const actualIdx = customDetails.length - 1 - lastIdx;
                setCustomDetails(prev => prev.filter((_, i) => i !== actualIdx));
            }
        }
    };

    const totalCalculated = customDetails.reduce((acc, d) => {
        const basePrice = activeProduct?.price || d.price || 150000;
        return acc + basePrice + getSizeSurcharge(d.size);
    }, 0);

    const handleDetailChange = (id: string, field: string, value: string) => {
        setCustomDetails(prev => prev.map(detail => 
            detail.id === id ? { ...detail, [field]: value } : detail
        ));
    };

    const handlePdfImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPdfFile(file);
            setToast({ show: true, message: "File PDF berhasil diunggah. Admin akan memproses data pemain dari PDF ini.", variant: "success" });
        }
    };

    const handleSubmit = async () => {
        if (!isStepValid()) {
            setShowValidation(true);
            setToast({ show: true, message: "Mohon lengkapi seluruh data pemain.", variant: "destructive" });
            return;
        }

        setIsUploading(true);
        setUploadProgress(10);
        try {
            let designUrl = existingOrder?.designUrl || "";
            let paymentUrl = "MENUNGGU_PEMBAYARAN_ADMIN";

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
                    totalAmount: totalCalculated + 20000,
                    designNote: designNote,
                    designUrl: designUrl,
                    paymentUrl: paymentUrl,
                    shippingMethod: shippingMethod,
                    shippingAddress: shippingMethod === "COD" ? shippingAddress : "",
                    customerName: customerName,
                    customerPhone: customerPhone,
                    details: customDetails.map(d => ({
                        productId: d.productId,
                        productTitle: d.productTitle,
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

    const steps = [
        { id: 1, name: "Data Pemain & Pelanggan", icon: User },
        { id: 2, name: "Design & Pengiriman", icon: FileUp },
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-['Inter']">
            {/* Top Navigation */}
            <div className="bg-white border-b border-neutral-100 sticky top-0 z-50">
                <div className="max-w-[87.5rem] mx-auto px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <button 
                            onClick={() => navigate("/customer/custom-jersey")}
                            className="flex items-center gap-2 text-neutral-400 hover:text-black transition-colors font-bold text-sm group"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            BACK TO SHOP
                        </button>
                        {step > 1 && (
                            <button 
                                onClick={() => setStep(prev => prev - 1)}
                                className="flex items-center gap-2 text-neutral-400 hover:text-[#D25026] transition-colors font-bold text-sm group border-l border-neutral-200 pl-6"
                            >
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                PREVIOUS STEP
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#D25026] rounded-xl flex items-center justify-center shadow-lg shadow-[#D25026]/20">
                            <ShoppingCart className="text-white w-5 h-5" />
                        </div>
                        <h1 className="text-xl font-black italic uppercase tracking-tighter text-neutral-900">Checkout Process</h1>
                    </div>
                    <div className="flex items-center gap-8">
                        {activeProduct && (
                            <div className="hidden lg:flex items-center gap-3 pr-8 border-r border-neutral-100">
                                 {activeProduct.image && (
                                     <img 
                                         src={activeProduct.image} 
                                         alt={activeProduct.title} 
                                         className="w-10 h-10 rounded-xl object-cover border border-neutral-200 shadow-sm" 
                                     />
                                 )}
                                 <div className="text-right">
                                     <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic leading-none mb-1">Bahan Baku</p>
                                     <p className="text-xs font-black italic uppercase tracking-tight text-[#D25026]">{activeProduct.title}</p>
                                 </div>
                            </div>
                        )}
                        <div className="hidden xl:flex items-center gap-3 pr-8 border-r border-neutral-100">
                             <div className="w-10 h-10 bg-neutral-50 rounded-full flex items-center justify-center border border-neutral-100">
                                 <User className="w-5 h-5 text-neutral-400" />
                             </div>
                             <div>
                                 <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest italic leading-none mb-1">Ordering as</p>
                                 <p className="text-xs font-black italic uppercase tracking-tight text-neutral-900">{user?.username || "Guest User"}</p>
                             </div>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest italic">Est. Total</p>
                            <p className="text-lg font-black text-[#D25026] tracking-tighter">{formatRupiah(totalCalculated)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Horizontal Progress Bar */}
            <div className="bg-white border-b border-neutral-100">
                <div className="max-w-[87.5rem] mx-auto px-8 py-6">
                    <div className="flex items-center justify-center gap-12">
                        {steps.map((s, idx) => {
                            const isActive = step === s.id;
                            const isCompleted = step > s.id;
                            const Icon = s.icon;

                            return (
                                <div key={s.id} className="flex items-center gap-4">
                                    <div className={cn(
                                        "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500",
                                        isActive ? "bg-black text-white" : 
                                        isCompleted ? "bg-[#D25026] text-white" : "bg-neutral-50 text-neutral-300"
                                    )}>
                                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className={cn("text-xs font-black uppercase tracking-tighter italic", isActive ? "text-neutral-900" : "text-neutral-400")}>{s.name}</p>
                                        <p className="text-[10px] font-bold text-neutral-300">Step 0{s.id}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <main className="max-w-[87.5rem] mx-auto px-8 py-12">
                <div className="space-y-12">
                    {/* Main Content Area */}
                    <div className="w-full">
                        {step === 1 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div className="grid grid-cols-1 gap-8">
                                    {/* Data Pelanggan */}
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-xl font-black text-neutral-900 italic uppercase tracking-tighter">Data Pelanggan</h2>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-6 bg-white p-6 rounded-2xl border border-neutral-200">
                                            <div>
                                                <Label className="text-xs font-bold mb-2 block">Nama Pelanggan</Label>
                                                <Input 
                                                    value={customerName}
                                                    onChange={e => setCustomerName(e.target.value)}
                                                    placeholder="Contoh: Budi"
                                                    className="w-full bg-neutral-50 h-[3.25rem] rounded-xl px-5 text-sm font-medium"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs font-bold mb-2 block">Nomor Telepon</Label>
                                                <Input 
                                                    value={customerPhone}
                                                    onChange={e => setCustomerPhone(e.target.value)}
                                                    placeholder="Contoh: 08123456789"
                                                    className="w-full bg-neutral-50 h-[3.25rem] rounded-xl px-5 text-sm font-medium"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label className="text-xs font-bold mb-2 block">Pilih Bahan Baku</Label>
                                                <CustomSelect 
                                                    options={allBahan.map(b => ({ label: `${b.nama} (${b.status})`, value: b.id.toString(), disabled: b.status === "Habis" }))}
                                                    value={directProduct?.id?.toString() || ""}
                                                    onChange={(val: string) => {
                                                        const product = allBahan.find(b => b.id.toString() === val);
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
                                                    }}
                                                    placeholder="Pilih Bahan"
                                                    className="w-full h-[3.25rem] bg-neutral-50 border-none"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Detail */}
                                    <div className="space-y-6 mt-8">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <h2 className="text-xl font-black text-neutral-900 italic uppercase tracking-tighter">Order Detail</h2>
                                                {activeProduct && (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF0EB] text-[#D25026] border border-[#FFD9CD] rounded-full text-[10px] font-black uppercase tracking-wider italic">
                                                        {activeProduct.image && (
                                                            <img 
                                                                src={activeProduct.image} 
                                                                alt={activeProduct.title} 
                                                                className="w-4 h-4 rounded-full object-cover border border-[#FFD9CD]" 
                                                            />
                                                        )}
                                                        Bahan: {activeProduct.title}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex gap-3 items-center flex-wrap">
                                                <div className="flex items-center gap-2 bg-white rounded-xl border border-neutral-200 p-1">
                                                    <Input 
                                                        type="number" 
                                                        placeholder="Jml Pemain" 
                                                        value={playerCountInput} 
                                                        onChange={(e) => setPlayerCountInput(e.target.value)}
                                                        className="w-32 rounded-lg h-8 border-none focus-visible:ring-0 text-xs font-bold bg-transparent"
                                                    />
                                                    <Button onClick={generateTable} variant="default" className="rounded-lg h-8 px-4 bg-black text-white hover:bg-neutral-800 text-[10px] font-black uppercase tracking-widest italic transition-all shadow-sm">
                                                        Buat Tabel
                                                    </Button>
                                                </div>

                                                <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" className="rounded-xl h-10 px-4 border-neutral-200 text-[10px] font-black uppercase tracking-widest italic flex gap-2 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all">
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                            Reset
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="rounded-[2rem] p-10 w-full max-w-[25rem] border-none shadow-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-neutral-900">Reset Tabel?</DialogTitle>
                                                            <DialogDescription className="text-sm font-medium text-neutral-500 italic mt-3 leading-relaxed">
                                                                Seluruh data pemain yang sudah Anda masukkan akan dihapus secara permanen dari daftar ini.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="flex gap-4 mt-8">
                                                            <Button onClick={() => setIsResetDialogOpen(false)} variant="ghost" className="flex-1 rounded-2xl h-14 text-xs font-black uppercase tracking-widest italic hover:bg-neutral-50">Batal</Button>
                                                            <Button onClick={resetTable} variant="destructive" className="flex-[1.5] rounded-2xl h-14 bg-red-600 text-white text-xs font-black uppercase tracking-widest italic shadow-xl shadow-red-600/20 hover:bg-red-700 transition-all">Ya, Reset</Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                <Dialog open={isPasteDialogOpen} onOpenChange={setIsPasteDialogOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" className="rounded-xl h-10 px-4 border-neutral-200 text-[10px] font-black uppercase tracking-widest italic flex gap-2 hover:bg-black hover:text-white transition-all">
                                                            <ClipboardPaste className="w-3.5 h-3.5" />
                                                            Paste List
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="!w-[600px] !max-w-[95vw] rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden bg-white flex flex-col max-h-[90vh]">
                                                        <div className="relative h-32 w-full bg-black flex flex-col justify-center px-10 shrink-0">
                                                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 0.0625rem 0.0625rem, white 0.0625rem, transparent 0)', backgroundSize: '1.5rem 1.5rem' }}></div>
                                                            <DialogTitle className="text-2xl font-black italic uppercase tracking-tighter text-white relative z-10">Paste Player List</DialogTitle>
                                                            <DialogDescription className="text-neutral-400 font-medium text-xs mt-1 relative z-10 italic">Format: No. Nama Nomor_Punggung Ukuran Lengan (opsional)</DialogDescription>
                                                        </div>
                                                        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                                            <div className="bg-orange-50/50 border border-orange-100/50 rounded-2xl p-4 mb-6 flex items-start gap-3">
                                                                <Info className="w-4 h-4 text-[#D25026] mt-0.5 shrink-0" />
                                                                <div className="text-[11px] leading-relaxed text-neutral-600 font-medium">
                                                                    <p className="font-bold text-slate-800 mb-1">Panduan Penginputan Otomatis:</p>
                                                                    <p>• Masukkan list berisi <span className="font-bold">No, Nama, No Punggung, Ukuran Baju</span>, dan <span className="font-bold">Lengan</span>.</p>
                                                                    <p>• Jika kolom lengan dikosongkan, sistem akan otomatis memilih <span className="font-bold">Lengan Pendek</span>.</p>
                                                                    <p>• Contoh: <span className="italic">1. BAYU 10 L Pendek</span> atau <span className="italic">2. YUSUF 23 XL Panjang</span></p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Paste Your List Here</Label>
                                                                <Textarea 
                                                                    ref={textareaRef}
                                                                    value={pasteText}
                                                                    onChange={(e) => setPasteText(e.target.value)}
                                                                    onKeyDown={handleTextareaKeyDown}
                                                                    onPaste={handleTextareaPaste}
                                                                    placeholder={"1. BAYU, 10, L, Pendek\n2. YUSUF, 23, XL, Lengan Panjang"}
                                                                    className="min-h-[18rem] rounded-[1.5rem] border-neutral-100 text-sm p-6 focus:ring-[#D25026]/10 focus:border-[#D25026]/20 bg-neutral-50/50 resize-none transition-all"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="p-8 pt-4 border-t border-neutral-50 bg-white shrink-0">
                                                            <div className="flex gap-4">
                                                                <Button onClick={() => setIsPasteDialogOpen(false)} variant="ghost" className="flex-1 rounded-2xl h-14 text-xs font-black uppercase tracking-widest italic hover:bg-neutral-50">Cancel</Button>
                                                                <Button onClick={parsePasteData} className="flex-[2] rounded-2xl h-14 bg-[#D25026] text-white text-xs font-black uppercase tracking-widest italic shadow-xl shadow-[#D25026]/20 hover:bg-[#B34320] transition-all">Process List</Button>
                                                            </div>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>

                                                <div className="relative group">
                                                    <input 
                                                        type="file" 
                                                        accept=".pdf"
                                                        onChange={handlePdfImport}
                                                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    />
                                                    <Button variant="outline" className="rounded-xl h-10 px-4 border-neutral-200 text-[10px] font-black uppercase tracking-widest italic flex gap-2 hover:bg-[#D25026] hover:text-white transition-all">
                                                        <FileText className="w-3.5 h-3.5" />
                                                        PDF
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {activeProduct?.status === "Habis" && (
                                            <div className="bg-orange-50 border border-orange-200 p-5 rounded-2xl flex items-start gap-3 mb-6">
                                                <Info className="w-5 h-5 text-[#D25026] shrink-0 mt-0.5" />
                                                <div className="text-xs font-bold uppercase tracking-tight text-[#B34320]">
                                                    Pemberitahuan: Bahan jersey "{activeProduct.title}" sedang tidak tersedia / habis. Anda tetap dapat melanjutkan pemesanan. Admin akan menghubungi Anda setelah checkout untuk merekomendasikan bahan alternatif yang tersedia.
                                                </div>
                                            </div>
                                        )}

                                        {isOverLimit && (
                                            <div className="bg-red-50 border border-red-200 p-5 rounded-2xl flex items-start gap-3 mb-6">
                                                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                                <div className="text-xs font-bold uppercase tracking-tight text-red-800">
                                                    Kebutuhan bahan baku melebihi ketersediaan di gudang! (Dibutuhkan: {totalRequiredKg.toFixed(2)} kg, Tersedia: {availableKg.toFixed(2)} kg).
                                                    <span className="block mt-1 text-[#B34320] font-extrabold normal-case">
                                                        Stok bahan "{activeProduct?.title}" saat ini hanya cukup untuk {Math.floor(availableKg / (totalRequiredKg / customDetails.length))} pcs jersey dengan kombinasi lengan & ukuran Anda saat ini.
                                                        Silakan kurangi pesanan Anda sebanyak {Math.max(1, customDetails.length - Math.floor(availableKg / (totalRequiredKg / customDetails.length)))} pcs atau ubah ukuran/tipe lengan ke yang lebih kecil/pendek.
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {pdfFile && (
                                            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                                                <CheckCircle2 className="text-emerald-500 w-5 h-5" />
                                                <div>
                                                    <p className="text-sm font-black text-emerald-900 italic tracking-tighter">PDF IMPORTED: {pdfFile.name}</p>
                                                    <p className="text-[11px] text-emerald-600 font-medium">Data pemain akan diproses manual oleh admin.</p>
                                                </div>
                                                <button onClick={() => setPdfFile(null)} className="ml-auto text-emerald-400 hover:text-emerald-600 font-bold text-[10px] uppercase">REMOVE</button>
                                            </div>
                                        )}

                                        <div className="bg-white rounded-[2.5rem] border border-neutral-100 shadow-2xl overflow-hidden relative ring-1 ring-black/5">
                                            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 blur-[6.25rem] pointer-events-none"></div>
                                            <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D25026]/5 blur-[6.25rem] pointer-events-none"></div>
                                            
                                            <div className="overflow-x-auto relative z-10 custom-scrollbar pb-4">
                                                <table className="w-full text-left border-collapse min-w-[62.5rem]">
                                                    <thead>
                                                        <tr className="border-b border-neutral-100 bg-neutral-50/50">
                                                            <th className="p-6 pl-10 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic w-20 text-center">No</th>
                                                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic w-full">Nama</th>
                                                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-center w-24 whitespace-nowrap">Nomor Punggung</th>
                                                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-center w-[230px] whitespace-nowrap">Ukuran Baju</th>
                                                            <th className="p-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-center w-[150px] whitespace-nowrap">Lengan</th>
                                                            <th className="p-6 pr-10 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-700 italic text-right w-28">Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-neutral-100">
                                                        {customDetails.map((detail, index) => (
                                                            <tr key={detail.id} className="hover:bg-neutral-50/50 transition-all duration-300 group">
                                                                <td className="p-5 pl-10 text-center">
                                                                    <span className="text-sm font-black text-neutral-400">{index + 1}</span>
                                                                </td>
                                                                <td className="p-5">
                                                                    <div className="relative group/input">
                                                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-800 group-focus-within/input:text-[#D25026] transition-colors" />
                                                                        <Input 
                                                                            value={detail.name}
                                                                            onChange={(e) => handleDetailChange(detail.id, "name", e.target.value)}
                                                                            placeholder="NAMA" 
                                                                            className={cn(
                                                                                "h-12 rounded-2xl border-neutral-200 focus:border-[#D25026]/50 focus:ring-[#D25026]/20 bg-white text-sm font-black uppercase tracking-wider text-black placeholder:text-neutral-800 pl-11 transition-all duration-300",
                                                                                showValidation && !detail.name.trim() && "border-red-500 bg-red-50/30"
                                                                            )}
                                                                        />
                                                                    </div>
                                                                </td>
                                                                <td className="p-5">
                                                                    <Input 
                                                                        value={detail.number}
                                                                        onChange={(e) => handleDetailChange(detail.id, "number", e.target.value)}
                                                                        placeholder="00" 
                                                                        maxLength={3}
                                                                        className={cn(
                                                                            "w-20 mx-auto h-12 rounded-2xl border-neutral-200 focus:border-[#D25026]/50 focus:ring-[#D25026]/20 bg-white text-base font-black text-center text-black placeholder:text-neutral-800 transition-all duration-300",
                                                                            showValidation && !detail.number.trim() && "border-red-500 bg-red-50/30"
                                                                        )}
                                                                    />
                                                                </td>
                                                                <td className="p-5">
                                                                    <div className="flex gap-1 bg-neutral-50 p-1 rounded-xl border border-neutral-100 w-max mx-auto">
                                                                        {["S", "M", "L", "XL", "2XL", "3XL", "4XL"].map(size => (
                                                                            <button
                                                                                key={size}
                                                                                onClick={() => handleDetailChange(detail.id, "size", size)}
                                                                                className={cn(
                                                                                    "w-7 h-7 rounded-lg text-[10px] font-black transition-all duration-300",
                                                                                    detail.size === size 
                                                                                        ? "bg-black text-white shadow-md" 
                                                                                        : "text-neutral-600 hover:text-black hover:bg-neutral-200"
                                                                                )}
                                                                            >
                                                                                {size}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                                <td className="p-5">
                                                                    <div className="flex gap-1 bg-neutral-50 p-1 rounded-xl border border-neutral-100 w-max mx-auto">
                                                                        {[
                                                                            { value: "Lengan Pendek", label: "Pendek" },
                                                                            { value: "Lengan Panjang", label: "Panjang" }
                                                                        ].map(sleeve => (
                                                                            <button
                                                                                key={sleeve.value}
                                                                                onClick={() => handleDetailChange(detail.id, "sleeve", sleeve.value)}
                                                                                className={cn(
                                                                                    "px-3 h-7 rounded-lg text-[10px] font-black transition-all duration-300",
                                                                                    (detail.sleeve || "Lengan Pendek") === sleeve.value 
                                                                                        ? "bg-[#D25026] text-white shadow-md shadow-[#D25026]/20" 
                                                                                        : "text-neutral-600 hover:text-[#D25026] hover:bg-neutral-200"
                                                                                )}
                                                                            >
                                                                                {sleeve.label}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                                <td className="p-5 pr-10 text-right">
                                                                    <button 
                                                                        onClick={() => removeUnit(detail.id)}
                                                                        className="w-11 h-11 bg-red-50 text-red-500 rounded-2xl inline-flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all duration-300"
                                                                    >
                                                                        <Trash2 className="w-4.5 h-4.5" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>

                                        {customDetails.length === 0 && !pdfFile && (
                                            <div className="bg-white border-2 border-dashed border-neutral-100 rounded-[2.5rem] p-12 flex flex-col items-center justify-center gap-4">
                                                <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center">
                                                    <ShoppingCart className="w-8 h-8 text-neutral-200" />
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-sm font-black italic uppercase text-neutral-900 tracking-tighter">Your list is empty</p>
                                                    <p className="text-[10px] font-medium text-neutral-400 mt-1 max-w-[200px]">Add items from the shop or paste your player list to get started.</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div>
                                    <h2 className="text-3xl font-black text-neutral-900 italic uppercase tracking-tighter">Design Reference</h2>
                                    <p className="text-neutral-400 font-medium mt-1">Unggah referensi desain dan tambahkan catatan tambahan.</p>
                                </div>

                                <div className="grid grid-cols-3 gap-8">
                                    <div className="col-span-2 space-y-3">
                                        <Label className="text-[11px] font-black uppercase tracking-widest italic text-neutral-900">Catatan Tambahan Desain</Label>
                                        <Textarea 
                                            value={designNote}
                                            onChange={(e) => setDesignNote(e.target.value)}
                                            placeholder="Jelaskan detail desain tambahan (warna logo, sponsor, posisi nomor, dll)..." 
                                            className="min-h-[22rem] rounded-[2.5rem] border-neutral-100 p-8 focus:ring-[#D25026]/10 focus:border-[#D25026] bg-white shadow-sm ring-1 ring-black/5 text-sm font-medium leading-relaxed"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[11px] font-black uppercase tracking-widest italic text-neutral-900">Upload Referensi</Label>
                                        <div className="h-[15.625rem] border-2 border-dashed border-neutral-200 rounded-[2.5rem] p-8 flex flex-col items-center justify-center gap-4 bg-white hover:bg-neutral-50 hover:border-[#D25026]/30 transition-all cursor-pointer group relative overflow-hidden shadow-sm ring-1 ring-black/5">
                                            {designReferenceFile || existingOrder?.designUrl ? (
                                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-white p-4">
                                                    {designReferenceFile ? (
                                                        (designReferenceFile.type.includes("pdf") || designReferenceFile.name.toLowerCase().endsWith(".pdf")) ? (
                                                            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-3 border border-red-100">
                                                                <FileText className="w-10 h-10 text-red-500" />
                                                            </div>
                                                        ) : (
                                                            <img src={URL.createObjectURL(designReferenceFile)} className="w-full h-full object-contain mb-2 rounded-xl" />
                                                        )
                                                    ) : (
                                                        existingOrder.designUrl.toLowerCase().endsWith(".pdf") ? (
                                                            <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mb-3 border border-red-100">
                                                                <FileText className="w-10 h-10 text-red-500" />
                                                            </div>
                                                        ) : (
                                                            <img src={existingOrder.designUrl.startsWith('http') ? existingOrder.designUrl : `${UPLOADS_URL}${existingOrder.designUrl.startsWith('/') ? '' : '/'}${existingOrder.designUrl}`} className="w-full h-full object-contain mb-2 rounded-xl" />
                                                        )
                                                    )}
                                                    <p className="text-[10px] font-black uppercase text-neutral-400 truncate w-full text-center px-4 italic">
                                                        {designReferenceFile ? designReferenceFile.name : "Existing Design Reference"}
                                                    </p>
                                                    
                                                    <button 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setDesignReferenceFile(null);
                                                            if (existingOrder) {
                                                                setExistingOrder((prev: any) => ({ ...prev, designUrl: "" }));
                                                            }
                                                        }}
                                                        className="absolute top-4 right-4 z-20 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                                        title="Remove File"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="w-16 h-16 bg-neutral-50 rounded-2xl flex items-center justify-center group-hover:bg-[#FFF0EB] transition-colors">
                                                        <Upload className="w-8 h-8 text-neutral-300 group-hover:text-[#D25026]" />
                                                    </div>
                                                    <div className="text-center">
                                                        <p className="text-sm font-black italic uppercase text-neutral-900 tracking-tighter">Drop file here</p>
                                                        <p className="text-[10px] font-bold text-neutral-400 mt-1 uppercase tracking-widest">Image or PDF allowed</p>
                                                    </div>
                                                </>
                                            )}
                                            <input 
                                                type="file" 
                                                accept="image/*,.pdf"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        setDesignReferenceFile(file);
                                                        setToast({ show: true, message: "Design reference uploaded!", variant: "success" });
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Opsi Pengiriman */}
                                <div className="bg-white rounded-[2.5rem] border border-neutral-100 p-8 shadow-sm ring-1 ring-black/5 space-y-6">
                                    <div>
                                        <h3 className="text-lg font-black italic uppercase tracking-tighter text-neutral-900">Opsi Pengiriman</h3>
                                        <p className="text-neutral-400 text-xs font-medium mt-1">Pilih metode pengiriman pesanan jersey Anda.</p>
                                    </div>

                                    <div className="flex gap-4">
                                        {[
                                            { value: "PICKUP", label: "Ambil di Tempat (Self-Pickup)" },
                                            { value: "COD", label: "COD (Penerima Yang Bayar)" }
                                        ].map((method) => (
                                            <button
                                                key={method.value}
                                                type="button"
                                                onClick={() => setShippingMethod(method.value)}
                                                className={cn(
                                                    "flex-1 py-4 px-6 rounded-2xl text-xs font-black uppercase tracking-widest italic border transition-all duration-300",
                                                    shippingMethod === method.value
                                                        ? "bg-black text-white border-black shadow-lg"
                                                        : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-450 hover:text-black"
                                                )}
                                            >
                                                {method.label}
                                            </button>
                                        ))}
                                    </div>

                                    {shippingMethod === "PICKUP" ? (
                                        <div className="bg-orange-50/50 border border-orange-100/50 rounded-2xl p-6 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <div className="w-10 h-10 bg-[#D25026]/10 rounded-xl flex items-center justify-center shrink-0">
                                                <Info className="text-[#D25026] w-5 h-5" />
                                            </div>
                                            <div className="text-xs leading-relaxed text-neutral-700">
                                                <p className="font-black uppercase tracking-wider text-[#D25026] mb-1">Catatan Pengambilan:</p>
                                                <p className="font-medium">Anda harus mengunjungi toko kami secara langsung untuk mengambil pesanan jersey Anda setelah selesai diproduksi.</p>
                                                <p className="font-black uppercase tracking-wider text-neutral-900 mt-2 mb-0.5">Alamat Toko:</p>
                                                <p className="font-bold font-mono text-neutral-900 bg-white/60 p-3 rounded-lg border border-orange-200/50">
                                                    Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                            <Label className="text-[11px] font-black uppercase tracking-widest italic text-neutral-900">Alamat yang Dituju (Penerima)</Label>
                                            <Textarea
                                                value={shippingAddress}
                                                onChange={(e) => setShippingAddress(e.target.value)}
                                                placeholder="Tulis alamat pengiriman secara detail (Nama penerima, No HP, Nama Jalan, RT/RW, Kecamatan, Kabupaten, Kode Pos)..."
                                                className={cn(
                                                    "min-h-[8rem] rounded-2xl border-neutral-100 p-6 focus:ring-[#D25026]/10 focus:border-[#D25026] bg-neutral-50/50 text-sm font-medium leading-relaxed",
                                                    showValidation && shippingAddress.trim() === "" && "border-red-500 bg-red-50/20"
                                                )}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Removed step 3 */}

                        {/* Navigation Buttons */}
                        <div className="mt-12 flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-neutral-100 shadow-sm ring-1 ring-black/5">
                            <Button 
                                variant="outline"
                                onClick={() => step === 1 ? navigate(-1) : setStep(prev => prev - 1)}
                                className="h-14 px-10 rounded-2xl border-neutral-200 text-[13px] font-black uppercase tracking-widest italic hover:bg-neutral-50 transition-all flex gap-3"
                                disabled={isUploading}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                {step === 1 ? "Exit Checkout" : "Previous Step"}
                            </Button>

                            <div className="flex items-center gap-4">
                                {isUploading && (
                                    <div className="flex flex-col justify-center px-4 w-48">
                                        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest italic text-neutral-400 mb-1.5">
                                            <span>Syncing...</span>
                                            <span>{uploadProgress}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#D25026] transition-all duration-500" style={{ width: `${uploadProgress}%` }}></div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className={cn("flex items-center p-2 rounded-[1.5rem] shadow-2xl ring-1 ring-black/5 gap-2", step === 1 && customDetails.length > 0 ? "bg-black" : "bg-transparent")}>
                                    {step === 1 && customDetails.length > 0 && !isUploading && (
                                        <div className="flex items-center gap-4 pl-4 pr-2">
                                            <div className="w-10 h-10 bg-[#D25026]/20 rounded-xl flex items-center justify-center">
                                                <ShoppingCart className="w-4 h-4 text-[#D25026]" />
                                            </div>
                                            <div className="min-w-[120px]">
                                                <span className="text-[9px] font-black uppercase tracking-widest italic text-neutral-400 block leading-none mb-1">Total Payment</span>
                                                <p className="text-lg font-black tracking-tighter text-white">{formatRupiah(totalCalculated)}</p>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <Button 
                                        onClick={() => step === 2 ? handleSubmit() : setStep(prev => prev + 1)}
                                        className="h-[52px] px-8 rounded-xl bg-[#D25026] hover:bg-[#B34320] text-white text-[12px] font-black uppercase tracking-widest italic shadow-lg active:scale-95 transition-all flex gap-3 shrink-0"
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                {step === 2 ? "Complete & Create Order" : "Continue to Next Step"}
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="mt-8 flex justify-center">
                        <div className="bg-[#FFF0EB] rounded-2xl px-6 py-3 border border-[#FFE0D5] flex items-center gap-3">
                            <div className="w-6 h-6 bg-[#D25026] rounded-lg flex items-center justify-center shrink-0">
                                <Info className="text-white w-3 h-3" />
                            </div>
                            <p className="text-[10px] text-[#B34320] font-bold italic uppercase tracking-tight">
                                Butuh bantuan? Hubungi admin jika Anda kesulitan dalam mengisi detail pesanan.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {toast.show && (
                <Toast 
                    title={toast.message} 
                    variant={toast.variant} 
                    onClose={() => setToast(prev => ({ ...prev, show: false }))} 
                />
            )}
        </div>
    );
}
