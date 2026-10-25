export interface CustomDetailItem {
    id: string;
    productId: number;
    productTitle: string;
    price: number;
    image?: string;
    name: string;
    number: string;
    size: string;
    sleeve: string;
}

export interface BuatPesananProduct {
    id: number;
    title: string;
    price: number;
    status?: string;
    kuantitasKg?: number;
    rasioKonversi?: number;
    image?: string;
}

export interface BuatPesananToast {
    show: boolean;
    message: string;
    variant: "success" | "destructive" | "default";
}

export interface BahanOption {
    id: number;
    nama: string;
    harga?: number;
    kuantitasKg?: number;
    rasioKonversi?: number;
    status?: string;
    imageUrl?: string;
    deskripsi?: string;
}
