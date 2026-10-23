# Jersey Baju - Frontend (FCSV_FE)

Frontend aplikasi web modern untuk platform e-commerce dan tracking produksi jersey kustom **FCSV Apparel**. Dibangun menggunakan **React 19**, **React Router v7**, **TypeScript**, dan **Tailwind CSS 4**.

---

## 📋 Daftar Isi
1. [Tech Stack](#-tech-stack)
2. [Prinsip Rendering & Isolasi Halaman (Anti-Lag Guarantee)](#-prinsip-rendering--isolasi-halaman-anti-lag-guarantee)
3. [Arsitektur Sentralisasi (Clean Code Architecture)](#-arsitektur-sentralisasi-clean-code-architecture)
4. [Fitur Unggulan Sistem](#-fitur-unggulan-sistem)
5. [Struktur Role & Hak Akses Layout](#-struktur-role--hak-akses-layout)
6. [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
7. [Environment Variables](#-environment-variables)
8. [Struktur Folder Proyek](#-struktur-folder-proyek)

---

## 🛠️ Tech Stack
- ⚛️ **Core Framework:** React 19.x & React Router v7.x
- ⚡ **Build Tool:** Vite 6.x
- 🎨 **Styling Engine:** Tailwind CSS 4.x & Lucide React Icons
- 🧠 **Language:** TypeScript 5.8 (Strict Type-Safety)
- 📊 **Visualisasi Data:** Recharts (Interactive Line & Bar Charts)
- 📄 **Dokumen & Cetak:** jsPDF & jsPDF-AutoTable (Invoice PDF Otomatis)
- 🌐 **HTTP Client:** Axios dengan zero-trust request/response interceptors
- 🔌 **Real-Time Client:** Socket.io Client
- 🖼️ **Media Assets:** WebP High-Efficiency Compressed Images

---

## ⚡ Prinsip Rendering & Isolasi Halaman (Anti-Lag Guarantee)

Aplikasi FCSV dirancang dengan arsitektur rendering terisolasi untuk menjamin performa maksimal tanpa lag:

### 1. Isolasi Penuh Active Route (`<Outlet />` Mounting)
- Setiap modul halaman (Dashboard, Monitoring Pesanan, Omset, Buat Pesanan, Chat, dll.) dirender via React Router `<Outlet />`.
- **Hanya Halaman Aktif yang Berada di DOM:** Ketika pengguna berada di Halaman A (misal: `/admin/omset`), **HANYA** komponen `AdminOmsetRoute` yang dimount dan dieksekusi.
- Halaman lainnya (seperti `MonitoringPesanan`, `Users`, `BuatPesanan`) **SAMA SEKALI TIDAK DIRENDER** ke dalam Virtual DOM maupun DOM browser asli.

### 2. Siklus Hidup Unmounting Otomatis (Garbage Collection & Cleanup)
- Saat pengguna berpindah dari Halaman A ke Halaman B (misal: dari Monitoring Pesanan ke Omset):
  - Seluruh sub-tree Halaman A langsung di-unmount secara tuntas.
  - Seluruh `useEffect` cleanup handler berjalan (menghapus interval polling `clearInterval`, listener event window, listener WebSocket, dan instance chart).
  - State lokal Halaman A dibebaskan dari memori browser, mencegah penumpukan konsumsi RAM (*memory leaks*).

### 3. Zero Duplicate DOM via JavaScript Conditional Rendering
- Pada aplikasi konvensional, rendering responsif sering kali merender versi Desktop DAN versi Mobile sekaligus ke DOM lalu menyembunyikan salah satunya dengan CSS (`hidden md:block` / `display: none`). Cara ini menggandakan beban rendering dan konsumsi memori.
- Di FCSV, setiap route menggunakan **JavaScript conditional rendering murni**:
  ```tsx
  export default function AdminOmsetRoute() {
    const { isMobile } = useOutletContext<{ isMobile: boolean }>();
    return isMobile ? <OmsetMobile /> : <OmsetDesktop />;
  }
  ```
  Hanya ada **SATU** varian UI (Desktop ATAU Mobile) yang diinstansiasi ke dalam memori pada saat bersamaan sesuai viewport pengguna.

### 4. Debounced Input & Server/Client Pagination
- Pada tabel data padat (seperti daftar pesanan dan rincian pemain hingga ratusan anggota), pencarian nama atau nomor menggunakan **debounce delay** (300-400ms).
- Data dibatasi dengan paginasi (10 baris per halaman) dan scroll container terkontrol (`max-h-[360px]`), mencegah lonjakan rendering ribuan elemen DOM sekaligus.

---

## 🏛️ Arsitektur Sentralisasi (Clean Code Architecture)

Untuk menjaga konsistensi kode dan kemudahan *maintenance*, seluruh hooks dan types telah disentralisasi:

### 1. Sentralisasi Types (`app/types/`)
Seluruh interface TypeScript, contract data, dan enum diekspor melalui satu pintu masuk:
```text
app/types/
├── index.ts               # Barrel re-export untuk seluruh types
├── monitoringPesanan.ts   # Contract data pesanan, status, filter tab, modal
├── omset.ts               # Contract data laporan omset, card stats, chart
├── dashboard.ts           # Type ringkasan dashboard & log aktivitas
├── user.ts                # Contract pengguna, role, dan profil
├── bahanBaju.ts           # Type inventaris kain & mutasi stok
└── order.ts               # Type pesanan jersey & detail anggota
```
*Penggunaan dalam komponen:*
```tsx
import type { MonitoringOrder, MonitoringFilterTab, OmsetStats } from "~/types";
```

### 2. Sentralisasi Custom Hooks (`app/hooks/`)
Seluruh logika bisnis, pemanggilan API, perhitungan state, dan handler event dipisahkan dari tampilan UI:
```text
app/hooks/
├── index.ts               # Barrel re-export untuk seluruh hooks
├── useMonitoringPesanan.ts# State manajemen alur produksi, modal, filter, PDF
├── useOmset.ts            # State manajemen chart, filter tahun/bulan, laporan
├── useDashboard.ts        # State metrik dashboard dan statistik
├── useAuth.ts             # Auth session, login, logout, user profile state
└── useSidebar.ts          # State navigasi sidebar desktop & mobile
```
*Penggunaan dalam komponen:*
```tsx
import { useMonitoringPesanan, useOmset, useDashboard } from "~/hooks";
```

### 3. Pemisahan Strict UI vs Logic
- File komponen Desktop (`*Desktop.tsx`) dan Mobile (`*Mobile.tsx`) bertindak murni sebagai **Presentation Layer**.
- Tidak ada duplikasi logika `useState`/`useEffect` antar platform; kedua varian mengonsumsi custom hook yang sama secara konsisten.

---

## 👕 Fitur Unggulan Sistem

### 1. Smart Paste List Anggota Jersey
- Mendukung *copy-paste* langsung daftar pemain dari WhatsApp atau Microsoft Word.
- Regex otomatis mengekstrak: **Nomor Punggung**, **Nama Pemain**, **Ukuran Baju (XXS s/d 5XL)**, dan **Tipe Lengan (Pendek / Panjang)**.
- Membersihkan karakter residu seperti tanda pagar (`#`) atau komentar format (`//M`, `//L`).

### 2. Monitoring Pesanan Terintegrasi (Alur Produksi)
- Pelacakan 7 tahapan produksi: `MENUNGGU` ➔ `DESAIN` ➔ `MOCKUP` ➔ `LAYOUT` ➔ `PRINTING` ➔ `FINISHING` ➔ `SELESAI`.
- **Daftar Anggota Expandable:** Dropdown accordion dalam tabel yang menampilkan rincian nama anggota, nomor, dan ukuran, lengkap dengan input pencarian instan (debounced).
- **Penugasan Desainer:** Modal assign staf desainer internal.
- **Ekspor Invoice PDF:** Generate invoice resmi format cetak beresolusi tinggi langsung di browser.

### 3. Laporan Omset & Transaksi Interaktif
- Visualisasi multi-periode: **Harian**, **Bulanan**, dan **Tahunan** dengan chart interaktif.
- Auto-switching breakdown metrik keuangan (Gross Revenue, Total Order, Rata-rata Nilai Pesanan).
- Ekspor laporan keuangan ke format PDF siap cetak.

### 4. Pelacakan Pesanan Publik (`/tracking`)
- Customer dapat melacak status pesanan secara live menggunakan nomor resi / Order ID tanpa perlu melakukan registrasi atau login.

### 5. Konsultasi Desain & Chat Real-Time
- Percakapan multi-channel antara Customer, Desainer, dan Admin via WebSocket Socket.io dengan dukungan pengiriman gambar WebP.

---

## 👥 Struktur Role & Hak Akses Layout

| Role | Prefix Route | Deskripsi Layout & Akses Menu |
| :--- | :--- | :--- |
| **Admin** | `/admin/*` | Dashboard, Buat Pesanan, User Management, Monitoring Pesanan, Omset, Bahan Baju, Retur Barang, Chat, Profil |
| **Manager** | `/manager/*` | Dashboard Manager, User Management, Laporan Omset Transaksi, Buat Akun Staf, Profil |
| **Desain** | `/desain/*` | Management Pesanan Desain, Upload Mockup & Layout, Chat Konsultasi Customer, Profil |
| **Gudang** | `/gudang/*` | Stok Bahan Baju, Packing, Retur Barang Rusak, Pencatatan Kerusakan Potong/Jahit, Profil |
| **Customer**| `/customer/*`| Dashboard Customer, Custom Jersey Checkout, Progress Pesanan, Konsultasi Desain, Profil |
| **Publik** | `/*` | Landing Home, Katalog Produk, FAQ, Visi Misi, Lacak Pesanan Publik (`/tracking`) |

---

## 🚀 Panduan Instalasi & Menjalankan

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Konfigurasi Environment
Salin template konfigurasi:
```bash
cp .env.example .env
```
Isi konfigurasi `VITE_API_BASE_URL` jika backend berada di host berbeda (kosongkan jika berjalan di balik reverse proxy Nginx).

### 3. Menjalankan Server Development
```bash
npm run dev
```
Aplikasi frontend akan aktif di `http://localhost:5173` (atau port yang dialokasikan Vite).

### 4. Type Checking & Code Validation
```bash
npm run typecheck
```

### 5. Production Build
```bash
npm run build
npm run start
```

---

## ⚙️ Environment Variables

| Variable | Deskripsi | Default / Contoh |
| :--- | :--- | :--- |
| `VITE_API_BASE_URL` | URL basis endpoint API backend | `http://localhost:5002` *(atau kosong jika reverse proxy)* |

---

## 📁 Struktur Folder Proyek

```text
FCSV_FE/
├── app/
│   ├── api/                 # Axios instance & zero-trust API clients
│   ├── components/          # Reusable UI primitives (Button, Modal, Sidebar, Toast)
│   ├── context/             # AuthContext, CartContext, PasswordContext
│   ├── features/            # Fitur modular (admin, customer, manager, shared)
│   │   ├── admin/           # monitoring-pesanan, omset, dashboard, users, dll.
│   │   ├── customer/        # custom-jersey, dashboard, dll.
│   │   └── shared/          # profile, chat, dll.
│   ├── hooks/               # Custom hooks sentral (useMonitoringPesanan, useOmset, dll.)
│   ├── lib/                 # Utility functions (cn, formatters, pdfHelper)
│   ├── routes/              # Route entry components & layout wrappers
│   ├── types/               # TypeScript interfaces & contracts sentral
│   ├── root.tsx             # Root document & context provider wrapper
│   ├── routes.ts            # Definisi rute React Router v7
│   └── app.css              # Styling Tailwind CSS
├── public/                  # Aset statis WebP, favicon, logo
├── Dockerfile               # Konfigurasi container Docker production
├── package.json             # Dependensi & NPM scripts
└── README.md                # Dokumentasi frontend
```
