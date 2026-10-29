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
    const lines = text.split("\n").filter(l => l.trim());
    if (!activeProduct || lines.length === 0) return [];

    const validSizes = ["5XL", "4XL", "3XL", "2XL", "XXXL", "XXL", "XL", "XS", "XXS", "S", "M", "L"];
    const isSize = (val: string) => validSizes.includes(val.toUpperCase().trim());
    const normalizeSize = (rawSize: string) => {
        const s = rawSize.toUpperCase().trim();
        if (s === "XXL") return "2XL";
        if (s === "XXXL") return "3XL";
        if (s === "XXXXL") return "4XL";
        return s;
    };
    const isNumeric = (val: string) => /^\d+$/.test(val.trim());

    return lines.map((line, idx) => {
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

        tempLine = tempLine.replace(/^\s*(?:no\.?|nomor)?\s*\d+\s*[\.\)\:\-]\s*/i, "");

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
            productId: activeProduct.id,
            productTitle: activeProduct.title,
            price: activeProduct.price,
            image: activeProduct.image || "",
            name: name.toUpperCase(),
            number: number,
            size: size,
            sleeve: sleeve
        };
    });
};
