import { useEffect } from "react";
import { useCustomMaterialModal } from "~/hooks/useCustomMaterialModal";
import { CustomMaterialModalDesktop } from "./CustomMaterialModalDesktop";
import { CustomMaterialModalMobile } from "./CustomMaterialModalMobile";
import type { BahanBajuItem } from "~/types/material";

interface CustomMaterialModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (createdBahan: BahanBajuItem) => void;
    onToast?: (message: string, variant: "success" | "destructive" | "default") => void;
    variant?: "desktop" | "mobile";
}

export function CustomMaterialModal({
    isOpen,
    onClose,
    onSuccess,
    onToast,
    variant = "desktop"
}: CustomMaterialModalProps) {
    const form = useCustomMaterialModal({
        onSuccess,
        onClose,
        onToast
    });

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                form.handleClose();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, form.handleClose]);

    if (!isOpen) return null;

    if (variant === "mobile") {
        return <CustomMaterialModalMobile form={form} />;
    }

    return <CustomMaterialModalDesktop form={form} />;
}

