import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router";
import { adminApi } from "~/api/admin";
import { UPLOADS_URL } from "~/api/client";
import type { BahanBajuToast } from "~/types/bahanBaju";

export function useBahanBajuEdit() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams<{ id: string }>();
    
    const isGudang = location.pathname.startsWith("/gudang");
    const backPath = isGudang ? "/gudang" : "/admin/bahan-baju";

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [toast, setToast] = useState<BahanBajuToast | null>(null);

    const [nama, setNama] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [kuantitasKg, setKuantitasKg] = useState<string>("");
    const [rasioKonversi, setRasioKonversi] = useState<string>("");
    const [status, setStatus] = useState("Tersedia");
    const [harga, setHarga] = useState<number | "">("");
    const [hargaBeli, setHargaBeli] = useState<number | "">("");
    const [keteranganUbah, setKeteranganUbah] = useState("");

    const [rusakPcs, setRusakPcs] = useState("");
    const [keteranganRusak, setKeteranganRusak] = useState("");

    const parsedKuantitas = parseFloat(String(kuantitasKg).replace(",", ".")) || 0;
    const parsedRasio = parseFloat(String(rasioKonversi).replace(",", ".")) || 2.5;

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [deleteImage, setDeleteImage] = useState(false);

    const [buktiNotaFile, setBuktiNotaFile] = useState<File | null>(null);
    const [buktiNotaPreview, setBuktiNotaPreview] = useState<string | null>(null);
    const [deleteBuktiNota, setDeleteBuktiNota] = useState(false);

    useEffect(() => {
        const fetchBahan = async () => {
            try {
                const res = await adminApi.getBahanBaju();
                if (res.status === "success") {
                    const bahan = res.data.find((b: any) => b.id === Number(id));
                    if (bahan) {
                        setNama(bahan.nama);
                        setDeskripsi(bahan.deskripsi || "");
                        setKuantitasKg(bahan.kuantitasKg ? String(bahan.kuantitasKg).replace(".", ",") : "");
                        setRasioKonversi(bahan.rasioKonversi ? String(bahan.rasioKonversi).replace(".", ",") : "");
                        setStatus(bahan.status || "Tersedia");
                        setHarga(bahan.harga || 0);
                        setHargaBeli(bahan.hargaBeli || 0);
                        if (bahan.imageUrl) {
                            setImagePreview(UPLOADS_URL + bahan.imageUrl);
                        }
                        if (bahan.buktiNotaUrl) {
                            setBuktiNotaPreview(UPLOADS_URL + bahan.buktiNotaUrl);
                        }
                    } else {
                        setToast({ title: "Bahan tidak ditemukan", variant: "destructive" });
                        navigate(backPath);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBahan();
    }, [id, navigate, backPath]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setDeleteImage(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImageFile(null);
        setImagePreview(null);
        setDeleteImage(true);
    };

    const handleBuktiNotaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setBuktiNotaFile(file);
            setDeleteBuktiNota(false);
            const reader = new FileReader();
            reader.onloadend = () => {
                setBuktiNotaPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveBuktiNota = () => {
        setBuktiNotaFile(null);
        setBuktiNotaPreview(null);
        setDeleteBuktiNota(true);
    };

    const formatThousands = (value: number | string) => {
        if (!value) return "";
        const num = typeof value === "string" ? value.replace(/[^0-9]/g, "") : value.toString();
        return new Intl.NumberFormat("id-ID").format(Number(num));
    };

    const handleKurangiRusak = () => {
        let pcs = parseInt(rusakPcs);
        if (isNaN(pcs)) return;
        pcs = Math.abs(pcs);
        if (pcs === 0) return;

        const pengali = 0.8333;
        const kgDikurangi = pcs * (pengali / parsedRasio);

        const newKuantitas = Math.max(0, parsedKuantitas - kgDikurangi);
        const roundedKuantitas = Math.round(newKuantitas * 10000) / 10000;
        setKuantitasKg(roundedKuantitas.toString().replace(".", ","));
        setKeteranganRusak(`Dikurangi ${kgDikurangi.toFixed(2)} kg (Konversi dari ${pcs} pcs).`);
        setKeteranganUbah(`Pengurangan barang rusak: ${pcs} pcs (${kgDikurangi.toFixed(2)} kg)`);
        setRusakPcs("");
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
            formData.append("keterangan_ubah", keteranganUbah);
            if (deleteImage) {
                formData.append("deleteImage", "true");
            }
            if (imageFile) {
                formData.append("image", imageFile);
            }
            if (deleteBuktiNota) {
                formData.append("deleteBuktiNota", "true");
            }
            if (buktiNotaFile) {
                formData.append("buktiNota", buktiNotaFile);
            }

            await adminApi.updateBahanBaju(Number(id), formData);
            setToast({ title: "Bahan baju berhasil diperbarui!", variant: "success" });
            setTimeout(() => navigate(backPath), 1500);
        } catch (error) {
            console.error(error);
            setToast({ title: "Gagal menyimpan data", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        id,
        isGudang,
        backPath,
        loading,
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
        keteranganUbah,
        setKeteranganUbah,
        rusakPcs,
        setRusakPcs,
        keteranganRusak,
        handleKurangiRusak,
        imagePreview,
        handleImageChange,
        handleRemoveImage,
        buktiNotaFile,
        buktiNotaPreview,
        deleteBuktiNota,
        handleBuktiNotaChange,
        handleRemoveBuktiNota,
        parsedKuantitas,
        parsedRasio,
        formatThousands,
        handleSubmit,
        navigate,
    };
}
