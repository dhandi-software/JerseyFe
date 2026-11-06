import { useState } from "react";
import { adminApi } from "~/api/admin";
import { useAuth } from "~/hooks/useAuth";
import type { BahanBajuItem } from "~/types/material";

interface UseCustomMaterialModalOptions {
    onSuccess: (createdBahan: BahanBajuItem) => void;
    onClose: () => void;
    onToast?: (message: string, variant: "success" | "destructive" | "default") => void;
}

export function useCustomMaterialModal({
    onSuccess,
    onClose,
    onToast
}: UseCustomMaterialModalOptions) {
    const { user } = useAuth();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [nama, setNama] = useState("");
    const [harga, setHarga] = useState<number | "">("");
    const [kuantitasKg, setKuantitasKg] = useState<string>("");
    const [rasioKonversi, setRasioKonversi] = useState<string>("2,5");
    const [status, setStatus] = useState<string>("Tersedia");
    const [hargaBeli, setHargaBeli] = useState<number | "">("");
    const [deskripsi, setDeskripsi] = useState("");

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [buktiNota, setBuktiNota] = useState<File | null>(null);
    const [buktiNotaPreview, setBuktiNotaPreview] = useState<string | null>(null);
    const [buktiNotaType, setBuktiNotaType] = useState<string | null>(null);

    const parsedKuantitas = parseFloat(String(kuantitasKg).replace(",", ".")) || 0;
    const parsedRasio = parseFloat(String(rasioKonversi).replace(",", ".")) || 2.5;

    const formatThousands = (value: number | string) => {
        if (value === "" || value === null || value === undefined) return "";
        const numStr = typeof value === "string" ? value.replace(/[^0-9]/g, "") : value.toString();
        if (!numStr) return "";
        return Number(numStr).toLocaleString("id-ID");
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleBuktiNotaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setBuktiNota(file);
        setBuktiNotaType(file.type);
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setBuktiNotaPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setBuktiNotaPreview(null);
        }
    };

    const handleRemoveBuktiNota = () => {
        setBuktiNota(null);
        setBuktiNotaPreview(null);
        setBuktiNotaType(null);
    };

    const resetForm = () => {
        setNama("");
        setHarga("");
        setKuantitasKg("");
        setRasioKonversi("2,5");
        setStatus("Tersedia");
        setHargaBeli("");
        setDeskripsi("");
        setImage(null);
        setImagePreview(null);
        setBuktiNota(null);
        setBuktiNotaPreview(null);
        setBuktiNotaType(null);
        setErrorMsg(null);
    };

    const handleClose = () => {
        if (isSubmitting) return;
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!nama.trim()) {
            setErrorMsg("Nama bahan wajib diisi.");
            return;
        }
        if (!harga || Number(harga) <= 0) {
            setErrorMsg("Harga satuan bahan wajib diisi dan lebih dari Rp 0.");
            return;
        }
        if (kuantitasKg.trim() === "" || parsedKuantitas < 0) {
            setErrorMsg("Ketersediaan stok awal (kg) wajib diisi.");
            return;
        }
        if (!buktiNota) {
            setErrorMsg("Mohon unggah bukti nota pembelian bahan (JPG, PNG, atau PDF).");
            return;
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("nama", nama.trim());
            formData.append("deskripsi", deskripsi.trim());
            formData.append("kuantitasKg", String(parsedKuantitas));
            formData.append("rasioKonversi", String(parsedRasio));
            formData.append("status", status);
            formData.append("harga", String(Number(harga)));
            formData.append("hargaBeli", String(Number(hargaBeli) || 0));
            formData.append(
                "actor",
                (user as any)?.staff?.nama || (user as any)?.username || "Admin"
            );

            if (image) {
                formData.append("image", image);
            }
            if (buktiNota) {
                formData.append("buktiNota", buktiNota);
            }

            const res = await adminApi.createBahanBaju(formData);
            if (res.status === "success" && res.data) {
                const createdBahan: BahanBajuItem = res.data;
                resetForm();
                onSuccess(createdBahan);
                onClose();
                onToast?.(
                    `Bahan "${createdBahan.nama}" berhasil disimpan & dipilih!`,
                    "success"
                );
            } else {
                setErrorMsg("Gagal menyimpan bahan baru. Silakan coba lagi.");
            }
        } catch (err: any) {
            console.error("Failed to create custom material:", err);
            const message =
                err?.response?.data?.message ||
                "Gagal menyimpan bahan baru. Periksa koneksi atau ukuran file.";
            setErrorMsg(message);
            onToast?.(message, "destructive");
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isSubmitting,
        errorMsg,
        setErrorMsg,
        nama,
        setNama,
        harga,
        setHarga,
        kuantitasKg,
        setKuantitasKg,
        rasioKonversi,
        setRasioKonversi,
        status,
        setStatus,
        hargaBeli,
        setHargaBeli,
        deskripsi,
        setDeskripsi,
        image,
        imagePreview,
        handleImageChange,
        handleRemoveImage,
        buktiNota,
        buktiNotaPreview,
        buktiNotaType,
        handleBuktiNotaChange,
        handleRemoveBuktiNota,
        parsedKuantitas,
        parsedRasio,
        formatThousands,
        resetForm,
        handleClose,
        handleSubmit
    };
}

export type UseCustomMaterialModalReturn = ReturnType<typeof useCustomMaterialModal>;

