import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { adminApi } from "~/api/admin";
import { useAuth } from "~/hooks/useAuth";
import type { BahanBajuToast } from "~/types/bahanBaju";

export function useBahanBajuCreate() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    
    const isGudang = location.pathname.startsWith("/gudang");
    const backPath = isGudang ? "/gudang" : "/admin/bahan-baju";
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<BahanBajuToast | null>(null);

    const [nama, setNama] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [kuantitasKg, setKuantitasKg] = useState<string>("");
    const [rasioKonversi, setRasioKonversi] = useState<string>("2,5");
    const [status, setStatus] = useState("Tersedia");
    const [harga, setHarga] = useState<number | "">("");
    const [hargaBeli, setHargaBeli] = useState<number | "">("");
    const [buktiNota, setBuktiNota] = useState<File | null>(null);
    const [buktiNotaPreview, setBuktiNotaPreview] = useState<string | null>(null);
    const [buktiNotaType, setBuktiNotaType] = useState<string | null>(null);

    const parsedKuantitas = parseFloat(String(kuantitasKg).replace(",", ".")) || 0;
    const parsedRasio = parseFloat(String(rasioKonversi).replace(",", ".")) || 2.5;
    
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleBuktiNotaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
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
        }
    };

    const handleRemoveBuktiNota = () => {
        setBuktiNota(null);
        setBuktiNotaPreview(null);
        setBuktiNotaType(null);
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const formatThousands = (value: number | string) => {
        if (!value) return "";
        const num = typeof value === "string" ? value.replace(/[^0-9]/g, "") : value.toString();
        return new Intl.NumberFormat("id-ID").format(Number(num));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append("nama", nama);
            formData.append("deskripsi", deskripsi);
            formData.append("kuantitasKg", String(parsedKuantitas));
            formData.append("rasioKonversi", String(parsedRasio));
            formData.append("status", status);
            formData.append("harga", String(harga));
            formData.append("hargaBeli", String(hargaBeli));
            formData.append("actor", (user as any)?.staff?.nama || (user as any)?.username || (isGudang ? "Staf Gudang" : "Admin"));
            if (image) {
                formData.append("image", image);
            }
            if (buktiNota) {
                formData.append("buktiNota", buktiNota);
            }

            await adminApi.createBahanBaju(formData);
            setToast({ title: "Bahan baju berhasil ditambahkan!", variant: "success" });
            setTimeout(() => navigate(backPath), 1500);
        } catch (error) {
            console.error(error);
            setToast({ title: "Gagal menyimpan data", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        isGudang,
        backPath,
        isSubmitting,
        toast,
        setToast,
        nama,
        setNama,
        deskripsi,
        setDeskripsi,
        kuantitasKg,
        setKuantitasKg,
        rasioKonversi,
        setRasioKonversi,
        status,
        setStatus,
        harga,
        setHarga,
        hargaBeli,
        setHargaBeli,
        buktiNota,
        buktiNotaPreview,
        buktiNotaType,
        handleBuktiNotaChange,
        handleRemoveBuktiNota,
        image,
        imagePreview,
        handleImageChange,
        handleRemoveImage,
        parsedKuantitas,
        parsedRasio,
        formatThousands,
        handleSubmit,
        navigate
    };
}
