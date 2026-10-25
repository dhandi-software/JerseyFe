# Dokumentasi Refaktor Sentralisasi Arsitektur: Hooks & Types

Dokumen ini mencatat detail pemisahan arsitektur dan refaktorisasi menyeluruh (*codebase refactoring*) pada aplikasi frontend **FCSV Apparel (Jersey Baju)**.

---

## 1. Latar Belakang & Tujuan Refaktor

Sebelum refaktor dilakukan, banyak file presentasi (terutama pasangan `*Desktop.tsx` dan `*Mobile.tsx`) memiliki:
- Deklarasi state (`useState`, `useEffect`, `useRef`) yang terduplikasi secara identik di kedua varian perangkat.
- Interface TypeScript lokal dan *inline types* yang tersebar di dalam file komponen rute/halaman.
- Logika bisnis yang bercampur langsung dengan elemen tampilan JSX (*tight coupling*).

**Tujuan Refaktorisasi:**
1. **Separation of Concerns (SoC):** Memisahkan 100% logika bisnis, panggilan API, parsing dokumen, kalkulasi harga/ukuran ke dalam *custom hooks* tersentralisasi di `app/hooks/`.
2. **Single Source of Truth Types:** Memusatkan seluruh interface, contracts data, dan type enums ke dalam `app/types/` dengan re-export terpadu via barrel file `app/types/index.ts`.
3. **Pure Presentation Components:** Menjadikan komponen Desktop dan Mobile murni sebagai *dumb / presentation layer* yang hanya mengonsumsi state dan handlers dari shared hook.
4. **Maintenance & Scalability:** Mengurangi lebih dari 1.500 baris kode duplikat dan menghilangkan risiko *logic drift* antara versi Desktop dan Mobile saat ada perubahan fitur atau validasi.

---

## 2. Struktur Modul Domain

### A. Sentralisasi Types (`app/types/`)
Semua interface diekspor melalui `app/types/index.ts`:

| File Type Domain | Cakupan Tipe & Kontrak |
| :--- | :--- |
| `customJersey.ts` | `CustomJerseyDetailItem`, `CustomJerseyCheckoutStep`, `UseCustomJerseyCheckoutReturn`, `CustomJerseyDetailState` |
| `tracking.ts` | `TrackingOrder`, `ProgressTimelineItem`, `UseTrackingPesananReturn`, `UseProgressPesananReturn` |
| `gudang.ts` | `GudangStockItem`, `GudangMutation`, `UseDashboardGudangReturn` |
| `packing.ts` | `PackingOrderItem`, `PackingFilterTab`, `UsePackingReturn` |
| `desain.ts` | `DesainOrderItem`, `DesainFilterTab`, `UseDashboardDesainReturn` |
| `listCategory.ts` | `CategoryItem`, `CategoryFilterState`, `UseListCategoryReturn` |
| `productDetail.ts` | `ProductDetailItem`, `ProductVariant`, `UseProductDetailReturn` |
| `landing.ts` | `HomeBanner`, `ArticleNewsItem`, `ArticleDetail`, `UseHomeReturn`, `UseArticleReturn` |
| `bahanBaju.ts` | `BahanBajuItem`, `BahanBajuInput`, `UseBahanBajuReturn`, `UseBahanBajuCreateReturn`, `UseBahanBajuDetailReturn`, `UseBahanBajuEditReturn` |
| `buatPesanan.ts` | `BuatPesananForm`, `PlayerDetailItem`, `UseBuatPesananReturn` |
| `returBarang.ts` | `ReturBarangItem`, `ReturBarangFilter`, `UseReturBarangReturn` |
| `popupAdvertisement.ts` | `PopupAdItem`, `PopupAdForm`, `UsePopupAdvertisementReturn` |
| `media.ts` | `MediaItem`, `MediaUploadState`, `UseMediaReturn` |
| `logActivity.ts` | `LogActivityItem`, `LogActivityFilter`, `UseLogActivityReturn` |
| `draft.ts` | `DraftItem`, `DraftActionState`, `UseDraftReturn` |
| `monitoringPesanan.ts`| `MonitoringOrder`, `MonitoringFilterTab`, `OrderDetailMember`, `UseMonitoringPesananReturn` |
| `omset.ts` | `OmsetSummary`, `OmsetChartData`, `UseOmsetReturn` |
| `dashboard.ts` | `DashboardStats`, `DashboardActivity`, `UseDashboardReturn` |
| `account.ts` | `UserAccount`, `AccountForm`, `UseManageAccountReturn`, `UseCreateAccountReturn` |

---

### B. Sentralisasi Custom Hooks (`app/hooks/`)
Semua custom hook diekspor melalui `app/hooks/index.ts`:

| Custom Hook | Tanggung Jawab & Logika Bisnis |
| :--- | :--- |
| `useCustomJerseyCheckout` | Multi-step checkout, state keranjang, PDF player parser, kalkulasi harga/DP/surcharge, kompresi gambar, integrasi upload API pesanan |
| `useCustomJerseyDetail` | Fetch detail bahan baju, seleksi ukuran/lengan, kalkulasi batasan kuantitas kg ke pcs, navigasi direct order & cart |
| `useCustomJersey` | Listing katalog jersey, filter kategori, navigasi pemilihan bahan |
| `useTrackingPesanan` | Pencarian pesanan publik dengan Order ID / Resi, validasi input, status order timeline |
| `useProgressPesanan` | Tracking progres pesanan customer terautentikasi, download invoice PDF, status pelunasan |
| `useProfileLogic` | Profil pengguna, update data pribadi, ubah password, integrasi logout |
| `useDashboardDesain` | Antrean pesanan tim desain, filter status desain/mockup/layout, input catatan desainer |
| `useDashboardGudang` | Metrik stok kain, alert batas minimum stok, mutasi inventaris |
| `usePacking` | Antrean pesanan siap kirim, packing checklist, konfirmasi pengiriman |
| `useListCategory` | Navigasi kategori produk, sorting, infinite scroll / pagination |
| `useProductDetail` | Detail produk pakaian, pemilihan varian, interaksi wishlist & cart |
| `useHome` & `useArticle` | Konten beranda, hero banner, artikel berita, kategori pilihan |
| `useBahanBaju*` | CRUD lengkap bahan baku: listing, penambahan, pengubahan, dan detail stok kain |
| `useBuatPesanan` | Formulir pembuatan pesanan manual admin, kalkulasi DP, parsing daftar nama anggota |
| `useReturBarang` | Pencatatan & monitoring barang retur dari pelanggan atau kesalahan produksi |
| `useMonitoringPesanan` | Alur produksi 7 tahap, penugasan desainer, expandable member accordion, invoice PDF otomatis |
| `usePopupAdvertisement` | Manajemen iklan popup beranda, status aktif/nonaktif, upload banner iklan |

---

## 3. Matriks Pemisahan Komponen UI Desktop & Mobile

Setiap halaman sekarang hanya bertugas menyusun layout visual dan meneruskan props/handler yang disediakan oleh hook terkait:

```
[ Route Component ]
         |
         +--> use<Domain>Hook() (State, API, Handlers)
         |
         +--> isMobile ? <DomainMobile {...hookReturn} /> : <DomainDesktop {...hookReturn} />
```

| Domain / Fitur | Desktop View | Mobile View | Shared Hook |
| :--- | :--- | :--- | :--- |
| **Custom Jersey Checkout** | `CustomJerseyCheckoutDesktop.tsx` | `CustomJerseyCheckoutMobile.tsx` | `useCustomJerseyCheckout()` |
| **Custom Jersey Detail** | `CustomJerseyDetailDesktop.tsx` | `CustomJerseyDetailMobile.tsx` | `useCustomJerseyDetail()` |
| **Custom Jersey Listing** | `CustomJerseyDesktop.tsx` | `CustomJerseyMobile.tsx` | `useCustomJersey()` |
| **Tracking Pesanan** | `TrackingPesananDesktop.tsx` | `TrackingPesananMobile.tsx` | `useTrackingPesanan()` |
| **Progress Pesanan** | `ProgressPesananDesktop.tsx` | `ProgressPesananMobile.tsx` | `useProgressPesanan()` |
| **Customer Profile** | `ProfileDesktop.tsx` | `ProfileMobile.tsx` | `useProfileLogic()` |
| **Desain Dashboard** | `DashboardDesainDesktop.tsx` | `DashboardDesainMobile.tsx` | `useDashboardDesain()` |
| **Gudang Dashboard** | `DashboardGudangDesktop.tsx` | `DashboardGudangMobile.tsx` | `useDashboardGudang()` |
| **Gudang Packing** | `PackingDesktop.tsx` | `PackingMobile.tsx` | `usePacking()` |
| **Katalog Kategori** | `ListCategoryDesktop.tsx` | `ListCategoryMobile.tsx` | `useListCategory()` |
| **Bahan Baju (Admin)** | `BahanBajuDesktop.tsx`, Create, Edit, Detail | `BahanBajuMobile.tsx`, Create, Edit, Detail | `useBahanBaju*()` |
| **Buat Pesanan (Admin)** | `BuatPesananDesktop.tsx` | `BuatPesananMobile.tsx` | `useBuatPesanan()` |
| **Retur Barang (Admin)** | `ReturBarangDesktop.tsx` | `ReturBarangMobile.tsx` | `useReturBarang()` |
| **Monitoring Pesanan** | `MonitoringPesananDesktop.tsx` | `MonitoringPesananMobile.tsx` | `useMonitoringPesanan()` |
| **Popup Ads (Admin)** | `PopupAdvertisementDesktop.tsx` | `PopupAdvertisementMobile.tsx` | `usePopupAdvertisement()` |

---

## 4. Keuntungan & Hasil Pengujian

1. **Eliminasi Kode Redundan:** Menghemat lebih dari 1.500 baris duplikasi kode antarmuka.
2. **Kerapian Kode (Anti-Slop):** Tidak ada komentar boilerplate generic AI; kode bersih, deskriptif, dan modular.
3. **Type-Safety Penuh:** Seluruh return type hooks didefinisikan secara eksplisit, menghilangkan implicit `any` pada data formulir, kalkulasi pesanan, dan upload file.
4. **Performa Rendering:** Tetap mempertahankan prinsip *Zero Duplicate DOM*, hanya varian perangkat aktif yang dirender dan dikonsumsi ke dalam memori.
