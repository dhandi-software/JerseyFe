# Jersey Baju - Frontend (FCSV_FE)

Modern web application for the FCSV Jersey Baju e-commerce and custom production tracking platform. Built with React and React Router v7.

---

## 🚀 Getting Started

### 📦 Installation
```bash
npm install
```

### ⚡ Development Server
```bash
npm run dev
```

### 🔨 Production Build
```bash
npm run build
```

---

## 🌐 Tech Stack & Architecture
- ⚛️ **React 19 & React Router v7**
- 🧠 **TypeScript**
- 🎨 **Tailwind CSS & Lucide Icons**
- ⚡ **Axios HTTP Client** with centralized zero-trust interceptors
- 🖼️ **Modern WebP Image Architecture**
- 📱 **Fully Responsive Layouts** (Mobile-first & Desktop-optimized)

---

## 🔒 Security & Client Integrity

1. **Zero Secret Leakage**
   - Tidak ada private key, Gemini API key, credential database, maupun JWT secret yang tertanam di client bundle frontend.
   - Variabel lingkungan hanya mengekspos konfigurasi publik yang aman via `import.meta.env` (`VITE_API_BASE_URL`).

2. **Centralized Authentication Interceptor (`app/api/client.ts`)**
   - Otomatis menyisipkan token Bearer JWT ke header `Authorization` untuk setiap request API.
   - Menangani invalidasi sesi otomatis (401 response handling).

3. **Type-Safe API Contracts**
   - Kontrak API tersinkronisasi 100% dengan backend (`adminApi`, `productApi`, `orderService`, `chatService`, `userApi`, `profileApi`).

---

## 👕 Key Features & Capabilities

### 1. Jersey Customization Checkout & Smart Paste
- **Pilihan Tipe Lengan:** Mendukung konfigurasi lengan pendek & lengan panjang per pemain tanpa mengubah skema tabel database lama.
- **Smart Paste Player List:** Membaca teks mentah pemain (format WA/Word) dan secara otomatis mengekstrak nomor punggung, nama, ukuran baju (XXS-5XL), serta tipe lengan dengan regex cerdas.
- **Auto-Comma Injection & MS Word Style Numbering:** Kemudahan pengisian list pemain dengan penomoran urut otomatis saat menekan enter.

### 2. Live Tracking Pesanan (Lacak Pesanan)
- **Tampilan Responsif Desktop & Mobile:** Penyesuaian layout container dan fleksibilitas teks agar seluruh informasi status pesanan, timeline produksi, nama tim, dan nomor resi terbaca jelas tanpa terpotong (*no clipping*).
- **Public Tracking:** Pelacakan pesanan instan tanpa perlu login menggunakan Order ID (`/tracking-pesanan`).

### 3. Asset & Gambar Berperforma Tinggi (WebP First)
- Seluruh aset visual banner, hero section, produk jersey, dan logo telah dikonversi ke format **WebP** terkompresi untuk mempercepat First Contentful Paint (FCP) dan menghemat bandwidth pengguna.

### 4. Admin & Manager Management Suite
- **Manajemen Pengguna Lengkap:** Dukungan penuh untuk filter per role, detail akun, pengeditan profil, hingga penghapusan massal (*batch delete*).
- **Laporan Omset & Keuangan:** Visualisasi grafik omset dinamis dengan auto-switching chart (tahunan, bulanan, harian) dan ringkasan pendapatan kotor real-time.
- **Monitoring Pesanan Real-Time:** Pelacakan tahapan produksi mulai dari antrean desain, mockup, layout, cetak, hingga finishing dan log kendala jahitan.
- **Inventaris Bahan Baku:** Integrasi langsung dengan stok kain jersey dan katalog produk backend.

### 5. Real-Time Chat & Collaboration
- Fitur chat interaktif antara Customer, Desainer, dan Admin menggunakan Socket.io untuk konsultasi desain dan konfirmasi cepat.
