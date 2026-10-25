export interface BahanBajuItem {
    id: number;
    nama: string;
    deskripsi?: string;
    kuantitasKg: number;
    rasioKonversi: number;
    status: "Tersedia" | "Habis" | string;
    harga: number;
    hargaBeli: number;
    imageUrl?: string;
    buktiNotaUrl?: string;
    createdAt: string;
    updatedAt: string;
}

export interface BahanBajuHistoryItem {
    id: number;
    bahanBajuId?: number;
    bahanId?: number | string;
    namaBahan?: string;
    bahan?: { nama?: string; [key: string]: any };
    actor?: string;
    customerName?: string;
    aksi: string;
    perubahan?: string;
    deskripsi?: string;
    jumlah?: number | string;
    stokAkhir?: number | string;
    keterangan?: string;
    tanggal?: string;
    createdAt: string;
    buktiNotaUrl?: string;
}

export interface BahanBajuToast {
    title: string;
    variant: "success" | "destructive";
}

export interface BahanBajuCreateFormState {
    nama: string;
    deskripsi: string;
    kuantitasKg: string;
    rasioKonversi: string;
    status: string;
    harga: number | "";
    hargaBeli: number | "";
    image: File | null;
    imagePreview: string | null;
    buktiNota: File | null;
    buktiNotaPreview: string | null;
    buktiNotaType: string | null;
}

export interface BahanBajuEditFormState extends BahanBajuCreateFormState {
    keteranganUbah: string;
    rusakPcs: string;
    keteranganRusak: string;
    deleteImage: boolean;
    deleteBuktiNota: boolean;
}

export type BahanBajuTab = "penyubliman" | "katalog" | "riwayat";
export type BahanBajuSortColumn = "nama" | "stok" | "harga" | "tanggal" | null;
export type BahanBajuSortDirection = "asc" | "desc";

