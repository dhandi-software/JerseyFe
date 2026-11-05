import { useState, useEffect, useRef } from "react";
import type { 
    PlayerRow, 
    UsePlayerTableManagerOptions, 
    UsePlayerTableManagerReturn 
} from "~/types/player";
import { parsePasteData } from "~/features/admin/buat-pesanan/utils";

export function usePlayerTableManager({
    activeProduct,
    effectiveBasePrice,
    isCustomMaterial,
    customMaterialName,
    sizeParam = "L",
    sleeveParam = "Lengan Pendek",
    cartLength = 0,
    cartItems = [],
    isEditing = false,
    editOrderId = null,
    onToast
}: UsePlayerTableManagerOptions): UsePlayerTableManagerReturn {
    const [customDetails, setCustomDetails] = useState<PlayerRow[]>([]);
    const [pasteText, setPasteText] = useState("");
    const [isPasteDialogOpen, setIsPasteDialogOpen] = useState(false);
    const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
    const [playerCountInput, setPlayerCountInput] = useState("");
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Initial population from Cart or Default Product
    useEffect(() => {
        if (isEditing || editOrderId) return;
        if (customDetails.length === 0) {
            if (cartLength > 0 && cartItems.length > 0) {
                const initial = cartItems.flatMap(item =>
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
                setCustomDetails(initial);
            } else if (activeProduct) {
                const initial = Array.from({ length: 1 }).map(() => ({
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
                setCustomDetails(initial);
            }
        }
    }, [cartLength, cartItems, activeProduct, customDetails.length, isEditing, editOrderId, sizeParam, sleeveParam]);

    // Paste dialog prep
    useEffect(() => {
        if (isPasteDialogOpen) {
            const isEmptyDefaultList = customDetails.length === 1 && !customDetails[0].name && !customDetails[0].number;
            if (!isEmptyDefaultList && customDetails.length > 0) {
                const serializedLines = customDetails.map((detail, idx) => {
                    const parts: string[] = [];
                    if (detail.name) parts.push(detail.name);
                    if (detail.number) parts.push(detail.number);
                    if (detail.size) parts.push(detail.size);
                    if (detail.sleeve) parts.push(detail.sleeve.replace("Lengan ", ""));
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

    const handleDetailChange = (id: string, field: keyof PlayerRow, value: string) => {
        setCustomDetails(prev => prev.map(detail =>
            detail.id === id ? { ...detail, [field]: value } : detail
        ));
    };

    const handleAddMember = (productId: number) => {
        const prod = activeProduct || { id: productId, title: "Custom Jersey", price: effectiveBasePrice, image: "" };
        setCustomDetails(prev => [...prev, {
            id: `${productId}-${Math.random().toString(36).substring(2, 9)}`,
            productId: isCustomMaterial ? 0 : prod.id,
            productTitle: isCustomMaterial ? (customMaterialName || "Bahan Kustom Baru") : prod.title,
            price: effectiveBasePrice,
            image: prod.image,
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
            onToast?.({ show: true, message: "Masukkan jumlah pemain yang valid", variant: "destructive" });
            return;
        }

        const prod = activeProduct || { id: 0, title: "Custom Jersey", price: 150000, image: "" };
        const newDetails: PlayerRow[] = Array.from({ length: count }).map((_, idx) => ({
            id: `gen-${idx}-${Date.now()}`,
            productId: prod.id,
            productTitle: prod.title,
            price: prod.price,
            image: prod.image || "",
            name: "",
            number: "",
            size: "L",
            sleeve: "Lengan Pendek"
        }));

        setCustomDetails(newDetails);
        setPlayerCountInput("");
        onToast?.({ show: true, message: `Berhasil membuat tabel untuk ${count} pemain`, variant: "success" });
    };

    const resetTable = () => {
        setCustomDetails([]);
        setIsResetDialogOpen(false);
        onToast?.({ show: true, message: "Tabel berhasil direset", variant: "success" });
    };

    const handlePasteSubmit = () => {
        const parsed = parsePasteData(pasteText, activeProduct as any);
        if (parsed.length > 0) {
            setCustomDetails(parsed);
            setIsPasteDialogOpen(false);
            setPasteText("");
            onToast?.({ show: true, message: `Berhasil mengimpor ${parsed.length} pemain!`, variant: "success" });
        } else {
            onToast?.({ show: true, message: "Tidak ada data pemain yang valid terdeteksi", variant: "destructive" });
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
            onToast?.({ show: true, message: "File PDF berhasil diunggah. Data pemain siap diproses dari dokumen ini.", variant: "success" });
        }
    };

    const validatePlayerRows = () => {
        const invalidIndex = customDetails.findIndex(
            d => !d.name.trim() || !d.number.trim() || !d.size
        );
        return {
            isValid: invalidIndex === -1,
            invalidIndex
        };
    };

    return {
        customDetails,
        setCustomDetails,
        handleDetailChange,
        handleAddMember,
        handleRemoveMember,
        generateTable,
        resetTable,
        handlePasteSubmit,
        handleTextareaKeyDown,
        handleTextareaPaste,
        handlePdfImport,
        isPasteDialogOpen,
        setIsPasteDialogOpen,
        pasteText,
        setPasteText,
        textareaRef,
        isResetDialogOpen,
        setIsResetDialogOpen,
        playerCountInput,
        setPlayerCountInput,
        pdfFile,
        setPdfFile,
        validatePlayerRows
    };
}
