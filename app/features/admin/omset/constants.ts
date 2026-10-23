import type { MonthOption, TimeView } from "~/types";

export const MONTHS: MonthOption[] = [
    { value: 1, label: "Januari" },
    { value: 2, label: "Februari" },
    { value: 3, label: "Maret" },
    { value: 4, label: "April" },
    { value: 5, label: "Mei" },
    { value: 6, label: "Juni" },
    { value: 7, label: "Juli" },
    { value: 8, label: "Agustus" },
    { value: 9, label: "September" },
    { value: 10, label: "Oktober" },
    { value: 11, label: "November" },
    { value: 12, label: "Desember" }
];

export const TIME_VIEW_TABS: { id: TimeView; label: string }[] = [
    { id: 'daily', label: 'Harian' },
    { id: 'monthly', label: 'Bulanan' },
    { id: 'yearly', label: 'Tahunan' },
    { id: 'lifetime', label: 'Lifetime' }
];

export const START_YEAR = 2022;
