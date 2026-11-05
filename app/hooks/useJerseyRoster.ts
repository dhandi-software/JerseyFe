/**
 * useJerseyRoster Hook
 * Manages player roster details, batch generation, paste parser, and table interactions.
 * FCSV Apparel — Batch 2 Milestone M3 (R1 Hooks Decomposition)
 */

import { useState, useEffect, useRef } from "react";
import { parsePasteData as parsePastePlayerList } from "~/features/admin/buat-pesanan/utils";
import type { CustomJerseyDetailItem } from "~/types";

export interface UseJerseyRosterOptions {
  activeProduct: any | null;
  directProduct?: any | null;
  cart?: any[];
  productIdParam?: string | null;
  nameParam?: string;
  numberParam?: string;
  sizeParam?: string;
  sleeveParam?: string;
  isEditing?: boolean;
  editOrderId?: string | null;
  setToast: (toast: { show: boolean; message: string; variant: "success" | "destructive" | "default" }) => void;
  setPdfFile?: (file: File | null) => void;
}

export function useJerseyRoster({
  activeProduct,
  directProduct,
  cart = [],
  productIdParam,
  nameParam = "",
  numberParam = "",
  sizeParam = "L",
  sleeveParam = "Lengan Pendek",
  isEditing = false,
  editOrderId = null,
  setToast,
  setPdfFile,
}: UseJerseyRosterOptions) {
  const [customDetails, setCustomDetails] = useState<CustomJerseyDetailItem[]>([]);
  const [pasteText, setPasteText] = useState("");
  const [isPasteDialogOpen, setIsPasteDialogOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [playerCountInput, setPlayerCountInput] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  // Sync paste dialog text with existing customDetails when opening
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

  // Initial populate from URL params or Cart
  useEffect(() => {
    if (isEditing || editOrderId) return;
    if (customDetails.length === 0) {
      if (productIdParam && directProduct) {
        const initialDetails = Array.from({ length: 1 }).map(() => ({
          id: `${directProduct.id}-${Math.random().toString(36).substr(2, 9)}`,
          productId: directProduct.id,
          productTitle: directProduct.title,
          price: directProduct.price,
          image: directProduct.image,
          name: nameParam,
          number: numberParam,
          size: sizeParam,
          sleeve: sleeveParam,
        }));
        setCustomDetails(initialDetails);
      } else if (!productIdParam && cart.length > 0) {
        const initialDetails = cart.flatMap((item) =>
          Array.from({ length: item.quantity }).map(() => ({
            id: `${item.product.id}-${Math.random().toString(36).substr(2, 9)}`,
            productId: item.product.id,
            productTitle: item.product.title,
            price: item.product.price,
            image: item.product.image,
            name: nameParam,
            number: numberParam,
            size: sizeParam,
            sleeve: sleeveParam,
          })),
        );
        setCustomDetails(initialDetails);
      } else if (!productIdParam && activeProduct) {
        const initialDetails = Array.from({ length: 1 }).map(() => ({
          id: `${activeProduct.id}-${Math.random().toString(36).substr(2, 9)}`,
          productId: activeProduct.id,
          productTitle: activeProduct.title,
          price: activeProduct.price,
          image: activeProduct.image,
          name: nameParam,
          number: numberParam,
          size: sizeParam,
          sleeve: sleeveParam,
        }));
        setCustomDetails(initialDetails);
      }
    }
  }, [
    cart,
    activeProduct,
    directProduct,
    productIdParam,
    customDetails.length,
    nameParam,
    numberParam,
    sizeParam,
    sleeveParam,
  ]);

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
    const parsed = parsePastePlayerList(pasteText, activeProduct);
    if (parsed.length > 0) {
      setCustomDetails(parsed);
      setIsPasteDialogOpen(false);
      setPasteText("");
      setToast({
        show: true,
        message: `Successfully parsed ${parsed.length} players!`,
        variant: "success",
      });
    } else {
      setToast({
        show: true,
        message: "Tidak ada data pemain yang valid terdeteksi",
        variant: "destructive",
      });
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
          const newBefore = linesBefore.slice(0, -1).join("\n");
          const finalVal =
            (newBefore ? newBefore + "\n" : "") + afterCursor.replace(/^\n/, "");
          setPasteText(finalVal);
          setTimeout(() => {
            if (textareaRef.current) {
              const pos = newBefore ? newBefore.length + 1 : 0;
              textareaRef.current.selectionStart = pos;
              textareaRef.current.selectionEnd = pos;
            }
          }, 0);
          return;
        }

        const nextPrefix = `${currentNum + 1}${delimiter.includes(".") ? ". " : delimiter.includes(")") ? ") " : " "}`;
        const updatedVal = beforeCursor + "\n" + nextPrefix + afterCursor;
        setPasteText(updatedVal);
        setTimeout(() => {
          if (textareaRef.current) {
            const nextCursorPos = selStart + 1 + nextPrefix.length;
            textareaRef.current.selectionStart = nextCursorPos;
            textareaRef.current.selectionEnd = nextCursorPos;
          }
        }, 0);
      }
    }
  };

  const handleTextareaPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pasted = e.clipboardData.getData("text");
    if (!pasted) return;

    const rawLines = pasted
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const hasNumberedList = rawLines.some((l) => /^\d+[\.\)\-\s]/.test(l));
    if (!hasNumberedList && rawLines.length > 1) {
      e.preventDefault();
      const textarea = e.currentTarget;
      const val = textarea.value;
      const selStart = textarea.selectionStart;
      const selEnd = textarea.selectionEnd;

      const before = val.substring(0, selStart);
      const after = val.substring(selEnd);
      const linesBefore = before.split("\n");
      const currentLine = linesBefore[linesBefore.length - 1];
      const match = currentLine.match(/^(\d+)/);
      let startIdx = match ? parseInt(match[1], 10) : 1;

      const numbered = rawLines
        .map((line, idx) => {
          const num = startIdx + idx;
          return `${num}. ${line}`;
        })
        .join("\n");

      const insertText = (currentLine.match(/^\d+[\.\)]\s*$/) ? "" : "\n") + numbered + "\n";
      const nextVal = before + insertText + after;
      setPasteText(nextVal);
      setTimeout(() => {
        if (textareaRef.current) {
          const pos = (before + insertText).length;
          textareaRef.current.selectionStart = pos;
          textareaRef.current.selectionEnd = pos;
        }
      }, 0);
    }
  };

  const removeUnit = (id: string) => {
    setCustomDetails((prev) => prev.filter((d) => d.id !== id));
  };

  const updateUnitQuantity = (productId: number, delta: number) => {
    if (delta > 0) {
      const product = cart.find((item) => item.product.id === productId)?.product || {
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
      if (setPdfFile) setPdfFile(file);
      setToast({
        show: true,
        message: "File PDF berhasil diunggah. Admin akan memproses data pemain dari PDF ini.",
        variant: "success",
      });
    }
  };

  return {
    customDetails,
    setCustomDetails,
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
    generateTable,
    resetTable,
    parsePasteData,
    handleTextareaKeyDown,
    handleTextareaPaste,
    removeUnit,
    updateUnitQuantity,
    handleDetailChange,
    handlePdfImport,
  };
}
