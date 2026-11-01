# GEMINI.md — FCSV Apparel Indonesia (Frontend / `FCSV_FE`)

Dokumen ini menjadi referensi konteks permanen (project memory) untuk **Gemini CLI** saat bekerja di dalam repositori `FCSV_FE`.

---

## 1. Gambaran Proyek
**FCSV_FE** adalah aplikasi web frontend untuk **FCSV Apparel Indonesia** — platform pemesanan jersey custom, manajemen stok bahan baku, simulasi kebutuhan kain (kg), pemantauan progres produksi, laporan omset, retur barang, dan live chat antara pelanggan serta tim internal.

Sistem memiliki **5 Role Pengguna**:
1. **Customer (`customer`)**: Katalog produk, simulasi kebutuhan kain & harga jersey custom, checkout pesanan (DP/Lunas), pelacakan progres pesanan, dan live chat.
2. **Admin (`admin`)**: Dashboard ringkasan, buat pesanan manual (`/admin/buat-pesanan`), monitoring pesanan & verifikasi pembayaran, manajemen stok bahan baju, manajemen akun, omset transaksi, retur barang, dan live chat pelanggan.
3. **Tim Desain (`desain`)**: Dashboard antrean desain pesanan dan live chat koordinasi desain.
4. **Gudang (`gudang`)**: Dashboard stok bahan baku, tambah bahan baju, packing pesanan, dan retur barang.
5. **Manager (`manager`)**: Dashboard eksekutif, manajemen akun staff/user, dan laporan omset transaksi (termasuk ekspor PDF/Excel).

---

## 2. Tech Stack Utama
- **Framework**: React 19 (`^19.1.0`) + **React Router v7** (`^7.7.1`, SSR & Framework Mode)
- **Bundler & Build Tool**: Vite 6 (`^6.3.3`) + `vite-tsconfig-paths`
- **Bahasa**: TypeScript 5.8 (`strict: true`, path alias `~/*` -> `./app/*`)
- **Styling & UI**:
  - Tailwind CSS v4 (`@tailwindcss/vite`) + `tw-animate-css`
  - Radix UI Primitives (`@radix-ui/react-*`) & Shadcn-style komponen di `app/components/ui/`
  - Lucide React (`lucide-react`) untuk ikon
  - Motion (`motion`) untuk animasi
  - Vaul (`vaul`) untuk drawer mobile
- **HTTP & Real-time**:
  - `axios` (`app/api/client.ts`) dengan interceptor JWT otomatis dan dukungan runtime `window.__API_BASE_URL__`
  - `socket.io-client` untuk fitur live chat
- **Dokumen & Visualisasi**:
  - `recharts` untuk grafik omset dan analitik dashboard
  - `jspdf`, `jspdf-autotable`, dan `xlsx` untuk cetak/ekspor laporan
  - `html2canvas` & konversi gambar ke WebP (`convertImageToWebP`) sebelum upload
- **Internasionalisasi & Device Detection**:
  - `i18next`, `react-i18next`, `remix-i18next`
  - `ua-parser-js` di root loader (`app/root.tsx`) untuk mendeteksi `isMobile` secara SSR dan meneruskannya melalui `<Outlet context={{ isMobile }} />`

---

## 3. Struktur Direktori (`FCSV_FE/app`)
```text
FCSV_FE/
├── app/
│   ├── api/                # Konfigurasi Axios client (client.ts) & endpoint wrapper (admin.ts, dll.)
│   ├── components/         # Komponen UI reusable (components/ui/* seperti button, dialog, sidebar, toast)
│   ├── constants/          # Konstanta aplikasi statis
│   ├── context/            # React Context global (AuthContext, CartContext, WishlistContext, PasswordContext)
│   ├── features/           # Modul fitur terpisah berdasarkan role & halaman (Desktop & Mobile view)
│   │   ├── admin/          # Fitur Admin (buat-pesanan, monitoring, bahan-baju, omset, users, dll.)
│   │   ├── customer/       # Fitur Customer (custom-jersey, checkout, tracking, chat)
│   │   ├── desain/         # Fitur Tim Desain
│   │   ├── gudang/         # Fitur Tim Gudang
│   │   ├── landing/        # Fitur halaman publik / Landing Page
│   │   ├── login/          # Komponen LoginDesktop & LoginMobile
│   │   ├── manager/        # Fitur Manager
│   │   └── register/       # Komponen RegisterDesktop & RegisterMobile
│   ├── hooks/              # Custom React Hooks (logika bisnis & state per fitur, mis. useBuatPesanan, useCustomJerseyCheckout)
│   ├── lib/                # Utilitas umum (cn, formatRupiah, convertImageToWebP)
│   ├── locales/            # File translasi bahasa (id / en)
│   ├── middleware/         # Middleware React Router (i18next)
│   ├── routes/             # Definisi route React Router v7 & Layout per role (ProtectedRoute, RoleGuard)
│   ├── services/           # Layer pemanggilan API domain (orderService, chatService, authService)
│   ├── types/              # Definisi tipe & interface TypeScript terpusat
│   ├── root.tsx            # Root layout, SSR loader (locale, isMobile, apiBaseUrl), dan ErrorBoundary
│   └── routes.ts           # Konfigurasi routing utama (@react-router/dev/routes)
├── public/                 # Aset statis (gambar, logo FCSV, font)
├── Dockerfile              # Konfigurasi container production (Port 8080)
├── package.json
├── tsconfig.json
└── vite.config.ts          # Proxy dev (/api & /uploads -> http://localhost:5002)
```

---

## 4. Aturan & Konvensi Koding (Coding Guidelines)

1. **Pemisahan Desktop & Mobile View (`isMobile`)**:
   - Route komponen di `app/routes/**` mengambil `{ isMobile }` dari `useOutletContext<{ isMobile: boolean }>()` atau `useRouteLoaderData("root")`.
   - Pisahkan tampilan kompleks ke dalam `Desktop` dan `Mobile` di dalam `app/features/<role>/<fitur>/` (contoh: `BuatPesananDesktop.tsx` dan `BuatPesananMobile.tsx`).
2. **Pemisahan Logika Bisnis ke Custom Hooks (`app/hooks/`)**:
   - Jangan menumpuk state dan pemanggilan API langsung di komponen presentasi.
   - Gunakan atau buat custom hook di `app/hooks/` (seperti `useBuatPesanan.ts`, `useCustomJerseyCheckout.ts`, `useLogin.ts`, `useRegister.ts`) sehingga komponen `Desktop` dan `Mobile` berbagi satu sumber logika yang sama.
3. **Konvensi Import & Path Alias**:
   - Selalu gunakan alias `~/` untuk mengimpor dari dalam `app/` (contoh: `import { client } from "~/api/client"`).
   - Gunakan `import type { ... }` untuk mengimpor tipe TypeScript karena `verbatimModuleSyntax: true` aktif di `tsconfig.json`.
4. **Pemanggilan API & Variabel Environment**:
   - Gunakan instance `client` dari `~/api/client` atau service di `~/services/*` — **jangan** melakukan hardcode URL `http://localhost:5002` di komponen.
   - Untuk URL gambar dari backend, gunakan `UPLOADS_URL` atau `getUploadsUrl()` dari `~/api/client`.
5. **Kalkulasi Harga & Kebutuhan Kain (Domain Rules)**:
   - Tambahan harga ukuran besar (`getSizeSurcharge`): ukuran `XXS` s/d `2XL` (`XXL`) tidak dikenakan biaya tambahan (`Rp 0`). Ukuran `3XL` ke atas dikenakan tambahan `Rp 10.000` per tingkat (`(N - 2) * 10000`).
   - Format penyimpanan ukuran pemain di detail pesanan adalah `"${size} (${sleeve})"`, contoh: `"L (Lengan Pendek)"` atau `"XL (Lengan Panjang)"`.
6. **Autentikasi & Proteksi Route**:
   - Semua route internal wajib dibungkus `<ProtectedRoute>` dan `<RoleGuard allowedRoles={[...]}>` pada masing-masing `layout.tsx`.
   - Saat mengarahkan pengguna yang belum login ke `/login` atau `/register`, pertahankan `location.state.from` (`pathname + search`) agar setelah autentikasi pengguna kembali ke halaman tujuan semula.
7. **Gaya Desain & UI**:
   - Warna aksen utama brand: Oranye FCSV (`#D25026`), dikombinasikan dengan tema gelap (`slate-950` / `black`) pada sidebar/header dan latar bersih (`#FAFAFA` / `white`) pada area kerja.
   - Gunakan Bahasa Indonesia yang jelas dan konsisten untuk pesan Toast, validasi form, serta label antarmuka pengguna.

---

## 5. Perintah Penting (Scripts)
- **Menjalankan mode development**: `npm run dev` (berjalan di `http://localhost:5173`, proxy `/api` & `/uploads` ke `http://localhost:5002`)
- **Mengecek tipe TypeScript**: `npm run typecheck` (`react-router typegen && tsc`)
- **Build production**: `npm run build`
- **Menjalankan server production**: `npm run start` (`react-router-serve ./build/server/index.js`, di Railway berjalan pada `PORT=8080`)

