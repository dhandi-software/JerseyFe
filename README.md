# Jersey Baju - Frontend

Frontend application for the Jersey Baju platform. Built with React and React Router v7.

## 🚀 Getting Started

### 📦 Installation
```bash
npm install
```

### ⚡ Development
```bash
npm run dev
```

### 🔨 Build
```bash
npm run build
```

## 🌐 Tech Stack
- ⚛️ **React**
- 🔀 **React Router v7**
- 🧠 **TypeScript**
- 🎨 **Tailwind CSS**
- 🧩 **Modular Architecture**

---

## 👕 Jersey Customization Checkout Feature

Sistem pemesanan Jersey Customizer premium yang mendukung konfigurasi detail pemain (nama, nomor punggung, ukuran, tipe lengan) secara massal (*bulk*) dengan visual interaktif dan penginputan otomatis yang cerdas.

### ✨ Fitur Utama

#### 1. Pilihan Lengan Baju (Sleeve Selection)
* Mendukung pilihan **Lengan Pendek** dan **Lengan Panjang** untuk setiap pemain.
* Dilengkapi dengan kontrol selector pill-button premium bertema HSL Orange di tabel pembuat order baik untuk tampilan **Desktop** maupun **Mobile**.
* **Integrasi Database Tanpa Migrasi:** Pilihan ukuran dan tipe lengan dikombinasikan secara otomatis menjadi format `${Size} (${Sleeve})` (contoh: `XL (Lengan Panjang)`) sebelum dikirim ke database. Ini memastikan visualisasi laporan pesanan, tracking admin, cetak PDF, dan desainer langsung mendukung data lengan secara native.

#### 2. Smart Paste Player List (Input Massal Otomatis)
Sistem input otomatis yang sangat cerdas untuk mempermudah pemesan memasukkan list pemain dari teks biasa (seperti chat WhatsApp) langsung ke dalam tabel:

* 🔄 **Pelanjutan List & Sinkronisasi (Continuation & Auto-Prefill):**
  * Ketika dialog *Paste List* dibuka, sistem akan otomatis membaca seluruh isi tabel pemain yang ada, menyusunnya kembali menjadi format teks rapi (contoh: `1. NAMA, NOMOR, UKURAN, LENGAN`), lalu menaruhnya ke dalam textarea.
  * Baris baru dengan nomor urut berikutnya akan dibuat secara otomatis di bagian paling bawah dengan kursor langsung terfokus di sana.
  * Memungkinkan pengguna untuk mereview, mengedit, menghapus, atau melanjutkan pengisian list pemain lama tanpa khawatir duplikasi atau kehilangan data sebelumnya.
* 🧠 **Smart Parser (Regex Terintegrasi):**
  * Mengenali tipe lengan secara cerdas dan case-insensitive (contoh: `panjang`, `pjg`, `long` $\rightarrow$ `Lengan Panjang` | `pendek`, `pdk`, `short` $\rightarrow$ `Lengan Pendek`).
  * Mengekstrak ukuran baju secara cerdas (`XXS` hingga `5XL`).
  * Membedakan nomor punggung dari nomor baris list secara akurat.
  * Membersihkan spasi berlebih dan karakter simbol untuk menghasilkan nama kapital yang bersih.
* ✍️ **MS Word-Style Auto-Numbering:**
  * Menekan tombol `Enter` saat mengetik list secara manual di text area akan langsung membuat baris baru dengan format nomor urut berikutnya secara otomatis (seperti Microsoft Word atau Google Docs).
  * Menekan enter di baris berangka kosong akan menghapus nomor tersebut dan kembali ke baris normal.
* ⏱️ **Real-Time Auto-Comma Injection:**
  * Secara otomatis menyisipkan koma pemisah saat pengguna mengetik data secara berurutan (Nama $\rightarrow$ No Punggung $\rightarrow$ Ukuran $\rightarrow$ Lengan) untuk mempermudah generate data yang rapi.
* 📦 **Perbaikan Pengecekan Stok (Stock Bug Fix):**
  * Memperbaiki bug pengecekan stok dengan memvalidasi kuantitas total terhadap `activeProduct?.stock` secara langsung, sehingga checkout langsung lewat link produk maupun via keranjang belanja berjalan 100% lancar tanpa error `0 pcs`.

### 📂 File Terkait
* Desktop Checkout: `app/features/customer/custom-jersey/CustomJerseyCheckoutDesktop.tsx`
* Mobile Checkout: `app/features/customer/custom-jersey/CustomJerseyCheckoutMobile.tsx`

---

## 📊 Admin Turnover (Omset) Transaction Filtering

Sistem pelaporan keuangan dan omset transaksi premium pada panel Admin yang mendukung pemfilteran data secara dinamis berdasarkan bulan dan tahun.

### ✨ Fitur Utama
* 🗓️ **Dropdown Tahun & Bulan Dinamis:** Admin dapat memilih tahun (mulai dari 2022 hingga tahun berjalan) dan bulan (Januari hingga Desember) untuk mempersempit visualisasi pendapatan.
* 📈 **Auto-Switching Chart View:**
  * Jika hanya memilih **Tahun**, grafik omset otomatis beralih ke tampilan **Bulanan** (*Monthly*) untuk menampilkan tren penjualan per bulan pada tahun tersebut.
  * Jika memilih **Tahun** dan **Bulan**, grafik omset otomatis beralih ke tampilan **Harian** (*Daily*) untuk menampilkan tren penjualan per hari pada bulan tersebut.
* 💰 **Summary Pendapatan Akumulatif:** Secara dinamis menghitung dan menampilkan total pendapatan kotor (*Gross Revenue*) berdasarkan filter waktu yang dipilih secara real-time.
* 📱 **Desain Responsif:** Dropdown filter dirancang khusus dengan gaya minimalis, dropdown menu yang rapi, dan sepenuhnya responsif pada tata letak desktop (`OmsetDesktop.tsx`) maupun mobile (`OmsetMobile.tsx`).

---

## 🚚 Shipping Options (Opsi Pengiriman)

Proses pemesanan kini mendukung pemilihan metode pengiriman terintegrasi langsung pada checkout Step 2 (Design & Shipping) untuk memfasilitasi kebutuhan logistik pelanggan.

### ✨ Fitur Utama
* 🏪 **Ambil di Tempat (Self-Pickup):**
  * Ditujukan untuk pelanggan yang ingin mengambil langsung jersey ke toko fisik.
  * Menampilkan informasi alamat lengkap toko secara jelas: `Jalan raya cikande kopo. Kp padaharan, Ds Rancasumur rt 001 rw 001 kecamatan kopo. Kabupaten Serang. Provinsi Banten 42178`.
* 💵 **COD (Penerima Yang Bayar):**
  * Ditujukan untuk pengiriman kurir dengan sistem bayar di tempat.
  * Mewajibkan pengguna menginput alamat tujuan pengiriman secara mendetail sebelum bisa melanjutkan ke tahap pembayaran (Step 3).
* 👁️ **Visibilitas Pelacakan & Admin:**
  * **Admin Panel:** Informasi metode dan alamat pengiriman disimpan ke database dan ditampilkan di halaman *Monitoring Pesanan* saat admin melihat detail order.
  * **Customer Panel:** Informasi metode dan alamat pengiriman ditampilkan di halaman *Progress Pesanan* milik customer, serta pada halaman *Public Tracking* (lacak pesanan via ID).
