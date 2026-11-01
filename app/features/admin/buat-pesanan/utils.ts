import { convertImageToWebP } from "~/lib/utils";
import type { BuatPesananProduct, CustomDetailItem } from "~/types/buatPesanan";

export const AVAILABLE_SIZES = ["XXS", "XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL", "6XL"] as const;
export const AVAILABLE_SLEEVES = ["Lengan Pendek", "Lengan Panjang"] as const;

export const formatRupiah = (number: number): string => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(number);
};

export const getSizeSurcharge = (size: string): number => {
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

export const getJerseyKgRequirement = (size: string, sleeve: string, rasioKonversi: number): number => {
    const s = size.toUpperCase().trim();
    const isLongSleeve = sleeve === "Lengan Panjang";
    const isBigSize = ["3XL", "4XL", "5XL", "6XL", "XXXL", "XXXXL"].includes(s);
    const rasio = rasioKonversi || 2.5;

    if (isLongSleeve) {
        return (isBigSize ? 2.5 : 1.25) / rasio;
    }
    return (isBigSize ? 1.25 : 0.8333) / rasio;
};

export const compressImage = (file: File): Promise<File> => {
    return convertImageToWebP(file, 0.8, 1200);
};

export const parseSizeAndSleeve = (playerSize: string): { size: string; sleeve: string } => {
    const match = playerSize.match(/^([^(]+)(?:\(([^)]+)\))?$/);
    if (match) {
        const size = match[1].trim();
        const sleeve = match[2] ? match[2].trim() : "Lengan Pendek";
        return { size, sleeve };
    }
    return { size: playerSize || "L", sleeve: "Lengan Pendek" };
};

export const parsePasteData = (
    text: string,
    activeProduct: BuatPesananProduct | null
): CustomDetailItem[] => {
    const rawLines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (rawLines.length === 0) return [];

    const fallbackProduct: BuatPesananProduct = activeProduct || {
        id: 0,
        title: "Custom Jersey",
        price: 150000,
        image: ""
    };

    const validSizes = [
        "6XL", "5XL", "4XL", "3XL", "2XL",
        "XXXXXXL", "XXXXXL", "XXXXL", "XXXL", "XXL",
        "XL", "XS", "XXS", "S", "M", "L", "ALLSIZE", "ALL SIZE"
    ];
    const isSize = (val: string) => validSizes.includes(val.toUpperCase().trim());
    const normalizeSize = (rawSize: string) => {
        const s = rawSize.toUpperCase().trim();
        if (s === "XXL") return "2XL";
        if (s === "XXXL") return "3XL";
        if (s === "XXXXL") return "4XL";
        if (s === "XXXXXL") return "5XL";
        if (s === "XXXXXXL") return "6XL";
        if (s === "ALLSIZE" || s === "ALL SIZE") return "L";
        return s;
    };
    const isNumeric = (val: string) => /^#?\d+$/.test(val.trim());
    const cleanNumeric = (val: string) => val.trim().replace(/^#/, "");

    const results: CustomDetailItem[] = [];

    rawLines.forEach((line, idx) => {
        let tempLine = line.trim();

        // Strip leading list numbering like "1.", "1)", "1 -", "No. 1."
        tempLine = tempLine.replace(/^\s*(?:no\.?|nomor)?\s*\d+\s*[\.\)\:\-]\s*/i, "").trim();
        if (!tempLine) return;

        let sleeve = "Lengan Pendek";
        const panjangRegex = /\b(lengan\s*panjang|panjang|pjg|long\s*sleeve|long|ls)\b/i;
        const pendekRegex = /\b(lengan\s*pendek|pendek|pdk|short\s*sleeve|short|ss)\b/i;

        if (panjangRegex.test(tempLine)) {
            sleeve = "Lengan Panjang";
            tempLine = tempLine.replace(panjangRegex, " ");
        } else if (pendekRegex.test(tempLine)) {
            sleeve = "Lengan Pendek";
            tempLine = tempLine.replace(pendekRegex, " ");
        }

        let name = "";
        let number = "";
        let size = "L";

        const hasDelimiter = /[\/\t\|;,]|\s+-\s+/.test(tempLine);

        if (hasDelimiter) {
            const parts = tempLine
                .split(/(?:[\/\t\|;,]+|\s+-\s+)/)
                .map(p => p.trim())
                .filter(Boolean);

            const nameParts: string[] = [];
            let sizeFound = false;

            for (const part of parts) {
                if (!sizeFound && isSize(part)) {
                    size = normalizeSize(part);
                    sizeFound = true;
                } else if (!number && isNumeric(part)) {
                    number = cleanNumeric(part);
                } else {
                    // Check if a slash-separated part still contains multiple tokens (e.g. "ROPAI 10")
                    nameParts.push(part);
                }
            }

            // If number or size wasn't separated by delimiter, check tokens in nameParts
            if (!number || !sizeFound) {
                const combinedTokens = nameParts.join(" ").split(/\s+/).filter(Boolean);
                for (let i = combinedTokens.length - 1; i >= 0; i--) {
                    const token = combinedTokens[i];
                    if (!sizeFound && isSize(token)) {
                        size = normalizeSize(token);
                        sizeFound = true;
                        combinedTokens.splice(i, 1);
                    } else if (!number && isNumeric(token)) {
                        number = cleanNumeric(token);
                        combinedTokens.splice(i, 1);
                    }
                }
                name = combinedTokens.join(" ");
            } else {
                name = nameParts.join(" ");
            }
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
                    number = cleanNumeric(token);
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

        if (!name && !number) return;

        results.push({
            id: `pasted-${idx}-${Date.now()}`,
            productId: fallbackProduct.id,
            productTitle: fallbackProduct.title,
            price: fallbackProduct.price,
            image: fallbackProduct.image || "",
            name: name.toUpperCase(),
            number: number,
            size: size,
            sleeve: sleeve
        });
    });

    return results;
};
