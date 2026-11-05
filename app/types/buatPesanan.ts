import type { PlayerRow } from "./player";
import type { MaterialOption, MaterialProduct } from "./material";

export type CustomDetailItem = PlayerRow;
export type BuatPesananProduct = MaterialProduct;
export type BahanOption = MaterialOption;

export interface BuatPesananToast {
    show: boolean;
    message: string;
    variant: "success" | "destructive" | "default";
}
