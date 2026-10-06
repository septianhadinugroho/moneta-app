# 💸 Moneta — Smart Personal Finance & Expense Tracker

Moneta adalah aplikasi web pencatatan keuangan pribadi berbasis **Next.js (App Router)** dengan tampilan **mobile-first** dan dukungan **PWA** (bisa di-install ke layar utama). Pantau banyak dompet, catat pemasukan & pengeluaran, atur anggaran bulanan, kejar target impian, lihat analitik, hingga ekspor laporan ke **PDF / Excel / Email**.

🌐 **Live Demo:** [https://moneta.my.id](https://moneta.my.id/)

> Repositori ini adalah **frontend client**. Aplikasi ini membutuhkan **REST API backend** terpisah (lihat bagian [Integrasi Backend](#-integrasi-backend)).

---

## ✨ Fitur Utama

### 🔐 Autentikasi
- Login & registrasi dengan email dan password.
- **Verifikasi email via OTP 6 digit** saat registrasi.
- **Google Sign-In** menggunakan `@react-oauth/google`.
- **Lupa password** multi-langkah: kirim OTP → verifikasi kode → atur password baru.
- Sesi berbasis **JWT** (disimpan di `localStorage`), otomatis dikirim lewat Axios interceptor. Jika token kedaluwarsa (401), sesi dibersihkan dan pengguna diarahkan ke `/auth?session=expired`.
- Pengguna yang sudah login otomatis diarahkan dari landing page ke `/dashboard`.

### 🏠 Dashboard
- Ringkasan **saldo bersih**, pemasukan, dan pengeluaran bulan berjalan.
- Grafik pengeluaran per kategori dan daftar transaksi terbaru.
- **Banner peringatan anggaran**: muncul saat pemakaian anggaran mencapai ≥ 80% dari limit (peringatan) atau ≥ 100% (melebihi limit).
- Akses cepat ke Analitik, Impian, Anggaran, Kategori, dan Ekspor.

### 💳 Multi Dompet & Transfer
- Kelola banyak dompet dengan tipe: **Bank**, **E-Wallet**, **E-Money**, dan **Tunai**.
- Tampilan **kartu virtual** untuk setiap dompet.
- **Transfer antar dompet** dengan nominal, tanggal, dan catatan, tanpa memengaruhi statistik pengeluaran riil.
- Tambah, ubah, dan hapus dompet.

### 🧾 Transaksi
- Catat **pemasukan** dan **pengeluaran** dengan form cepat: *quick amount chips*, *quick date picker*, grid pemilihan kategori (dengan pencarian), dompet, dan catatan.
- Daftar transaksi **dikelompokkan per tanggal** dan dapat difilter per bulan/tahun.
- **Filter lanjutan** (drawer): pencarian teks, tipe transaksi, dompet, dan rentang tanggal.
- Lihat detail, ubah, dan hapus transaksi.

### 🏷️ Kategori Kustom
- Buat kategori pemasukan/pengeluaran sendiri dengan **ikon** (dengan pencarian ikon) dan **warna** pilihan.

### 🎯 Anggaran Bulanan
- Tetapkan batas pengeluaran per kategori dan pantau progresnya.
- Peringatan otomatis saat mendekati atau melampaui limit.

### 🌟 Target Impian & Tabungan
- Buat target finansial (liburan, gadget, dana darurat, dll.) dengan nominal target, **tenggat waktu opsional**, dan **sumber dompet alokasi opsional**.
- Pantau progres tabungan setiap target.

### 📊 Analitik
- **Pie chart** distribusi pengeluaran per kategori.
- **Bar chart** arus kas (pemasukan vs pengeluaran) per periode.
- Pemilihan bulan dan tahun analisis. Grafik dibuat dengan **Recharts**.

### 📄 Ekspor & Laporan
- Filter laporan berdasarkan **bulan, tahun, dompet, dan tipe transaksi**.
- **Pratinjau PDF** laporan resmi berlogo Moneta (dibuat di sisi klien dengan `jsPDF` + `jspdf-autotable`), lalu unduh.
- **Ekspor Excel (.xlsx)** menggunakan `SheetJS (xlsx)`.
- **Kirim laporan ke email** langsung dari aplikasi.

### 👤 Profil & Keamanan
- Ubah nama dan email. Perubahan email diverifikasi lewat **OTP**.
- Ubah password.
- **Proteksi akun Google**: email dikunci dan menu ganti password disembunyikan untuk pengguna Google Sign-In.
- **Hapus akun** permanen dengan modal konfirmasi kustom (tanpa `confirm()` bawaan browser).

### 🎨 UI/UX
- **Dark mode / Light mode** (mengikuti sistem, bisa diganti manual) dengan `next-themes`.
- Layout dibingkai ala aplikasi mobile (`max-w-md`) dengan **bottom navigation**.
- **PWA**: manifest, ikon, dan modal ajakan install aplikasi.
- Landing page dengan preview fitur, bahasa antarmuka **Bahasa Indonesia**, dan format mata uang **Rupiah (IDR)**.

---

## 🛠️ Tech Stack

| Kategori        | Teknologi                                  |
|-----------------|--------------------------------------------|
| Framework       | Next.js 16 (App Router)                    |
| UI Library      | React 19                                   |
| Bahasa          | TypeScript                                 |
| Styling         | Tailwind CSS v4                            |
| Ikon            | lucide-react                               |
| Grafik          | Recharts                                   |
| HTTP Client     | Axios (JWT interceptor)                    |
| OAuth           | `@react-oauth/google`                      |
| Tema            | next-themes                                |
| Ekspor PDF      | jsPDF + jspdf-autotable                    |
| Ekspor Excel    | SheetJS (`xlsx`)                           |
| Linting         | ESLint 9 + `eslint-config-next`           |
| Deployment      | Docker (standalone output) di VPS          |

---

## 📁 Struktur Proyek

```
moneta-app/
├── public/                          # Ikon PWA (192x192 & 512x512)
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Landing page
│   │   ├── layout.tsx               # Root layout (font, metadata, PWA modal, mobile frame)
│   │   ├── providers.tsx            # ThemeProvider + GoogleOAuthProvider
│   │   ├── globals.css              # Global styles
│   │   ├── manifest.json            # PWA manifest
│   │   ├── auth/page.tsx            # Halaman login/register/OTP/lupa password
│   │   └── dashboard/
│   │       ├── layout.tsx           # Layout terproteksi + bottom nav
│   │       ├── page.tsx             # Beranda dashboard
│   │       ├── transactions/        # Daftar & filter transaksi
│   │       ├── wallets/             # Dompet, transfer, kartu virtual
│   │       ├── categories/          # Kelola kategori
│   │       ├── budgets/             # Anggaran bulanan
│   │       ├── goals/               # Target impian
│   │       ├── stats/               # Analitik (pie & bar chart)
│   │       ├── export/              # Ekspor PDF / Excel / Email
│   │       ├── profile/             # Pengaturan profil & akun
│   │       └── menu/                # Menu lainnya & logout
│   ├── components/
│   │   ├── auth/                    # Login, Register, OTP, ForgotPassword forms
│   │   ├── cards/                   # SummaryCards, ExpenseChart, RecentTx, VirtualWalletCard
│   │   ├── modals/                  # Transaction, Transfer, Wallet, Budget, Goal, Category,
│   │   │   │                        # Confirm, PdfPreview, TransactionDetail, dll.
│   │   │   └── transaction-fields/  # CategoryGridSelector, QuickAmountChips, QuickDatePicker
│   │   ├── profile/                 # ProfileForm, PasswordForm, UserCard, DangerZone, EmailOtpModal
│   │   ├── transactions/            # TransactionFilterDrawer
│   │   ├── providers/               # ThemeProvider
│   │   └── ui/                      # BottomNav, Header, QuickAccess, CustomDropdown,
│   │                                # CustomDatePicker, ColorPicker, CategoryIcon,
│   │                                # BudgetWarningBanner, PwaInstallModal, ThemeToggle
│   └── lib/
│       ├── api.ts                   # Axios instance + request/response interceptor
│       ├── exportPdf.ts             # Generator laporan PDF
│       └── utils.ts                 # Helper (formatRupiah, dll.)
├── .env.example                     # Contoh environment variable
├── Dockerfile                       # Multi-stage build (standalone)
├── next.config.ts                   # output: 'standalone'
├── tailwind.config.ts               # Tema warna Moneta & dark mode class
├── eslint.config.mjs
├── postcss.config.mjs
├── tsconfig.json                    # Alias @/* → ./src/*
└── package.json
```

---

## 🔌 Integrasi Backend

Frontend ini berkomunikasi dengan REST API melalui `NEXT_PUBLIC_API_BASE_URL`. Endpoint yang digunakan:

| Modul        | Endpoint                                                                                                  |
|--------------|-----------------------------------------------------------------------------------------------------------|
| Auth         | `POST /auth/register`, `/auth/login`, `/auth/google`, `/auth/verify-otp`, `/auth/forgot-password`, `/auth/reset-password` |
| Profil       | `GET /users/me`, `PUT /auth/profile`, `PUT /auth/verify-new-email`, `PUT /auth/change-password`, `DELETE /auth/account` |
| Dashboard    | `GET /dashboard/summary`                                                                                  |
| Transaksi    | `GET/POST /transactions`, `PUT/DELETE /transactions/:id`                                                  |
| Dompet       | `GET/POST /wallets`, `PUT/DELETE /wallets/:id`                                                            |
| Kategori     | `GET/POST /categories`, `PUT/DELETE /categories/:id`                                                      |
| Anggaran     | `GET/POST /budgets`, `PUT/DELETE /budgets/:id`                                                            |
| Impian       | `GET/POST /goals`, `PUT/DELETE /goals/:id`                                                                |
| Laporan      | `POST /reports/send-email`                                                                                |

Semua request (kecuali auth) menyertakan header `Authorization: Bearer <token>`.

---

## 🔑 Environment Variables

Salin `.env.example` menjadi `.env.local` (development) atau `.env` (build produksi):

```env
# Base URL backend API
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api

# Google OAuth Client ID (harus sama dengan Client ID di backend)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

> ⚠️ Variabel berawalan `NEXT_PUBLIC_` ditanam saat **build time**. Jika nilainya berubah, aplikasi harus di-build ulang.

---

## 🚦 Menjalankan Secara Lokal

**Prasyarat:** Node.js 20+ dan backend API yang sudah berjalan.

```bash
# 1. Clone repositori
git clone https://github.com/septianhadinugroho/moneta-app.git
cd moneta-app

# 2. Install dependensi
npm install

# 3. Siapkan environment
cp .env.example .env.local
# lalu isi nilai NEXT_PUBLIC_API_BASE_URL dan NEXT_PUBLIC_GOOGLE_CLIENT_ID

# 4. Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Jika backend juga berjalan di port 3000, jalankan frontend di port lain, misalnya `npm run dev -- -p 3001`.

### Script yang Tersedia

| Perintah         | Fungsi                                |
|------------------|---------------------------------------|
| `npm run dev`    | Menjalankan development server        |
| `npm run build`  | Build produksi (output `standalone`)  |
| `npm start`      | Menjalankan hasil build               |
| `npm run lint`   | Menjalankan ESLint                    |

---

## 🐳 Deployment dengan Docker (VPS)

Aplikasi ini sudah dideploy di VPS pada **[https://moneta.my.id](https://moneta.my.id/)**. `Dockerfile` memakai multi-stage build dengan `node:20-alpine` dan output Next.js `standalone` agar image ringan.

```bash
# 1. Pastikan file .env (berisi NEXT_PUBLIC_*) ada di root proyek sebelum build
# 2. Build image
docker build -t moneta-app .

# 3. Jalankan container (port 3001)
docker run -d \
  --name moneta-app \
  --restart unless-stopped \
  -e PORT=3001 \
  -p 3001:3001 \
  moneta-app
```

Container mengekspos port **3001**. Untuk produksi di VPS, arahkan domain `moneta.my.id` ke container tersebut menggunakan **reverse proxy** (misalnya Nginx atau Caddy) dan aktifkan **HTTPS** (misalnya dengan Let's Encrypt). HTTPS juga dibutuhkan agar fitur PWA dan Google Sign-In berfungsi dengan baik.

Contoh konfigurasi Nginx:

```nginx
server {
    server_name moneta.my.id;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

> Pastikan domain `https://moneta.my.id` sudah didaftarkan di **Authorized JavaScript origins** pada Google Cloud Console agar Google Sign-In bisa digunakan di produksi, dan sesuaikan konfigurasi CORS di backend.

---

## 📱 Install sebagai Aplikasi (PWA)

1. Buka [https://moneta.my.id](https://moneta.my.id/) di browser ponsel.
2. **Android (Chrome):** ikuti prompt *Install* dari Moneta, atau menu ⋮ → *Install app / Add to Home screen*.
3. **iOS (Safari):** tombol *Share* → *Add to Home Screen*.

---

## 🎨 Tema Warna

| Token              | Warna     | Kegunaan                     |
|--------------------|-----------|------------------------------|
| `moneta-primary`   | `#064E3B` | Emerald gelap (brand utama)  |
| `moneta-secondary` | `#059669` | Emerald sedang               |
| `moneta-surface`   | `#F8FAFC` | Latar terang                 |
| `moneta-rose`      | `#E11D48` | Indikator pengeluaran        |

---

## 👨‍💻 Pengembang

**Septian Hadi Nugroho**

- LinkedIn: [septian-hadi-nugroho](https://www.linkedin.com/in/septian-hadi-nugroho)
- Instagram: [@septianhnr](https://instagram.com/septianhnr)

---

© Moneta — Kelola Keuangan Pribadi Lebih Mudah.