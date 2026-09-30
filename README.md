# Practical Trainee Allowance System (PTAS)
### Sistem Pengurusan & Pembayaran Elaun Pelatih Praktikal — Media Prima Berhad

[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)

---

## 1. Pengenalan & Gambaran Keseluruhan (Product Overview)

**Practical Trainee Allowance System (PTAS)** adalah aplikasi web korporat khusus untuk bahagian **Group People & Culture, Media Prima Berhad** bagi mengurus rekod pelatih praktikal (*interns*), mengautomasikan pengiraan elaun prorata berasaskan peraturan pembundaran integer yang ketat (*Strict Integer Rounding Rule*), menjejak penyerahan dokumen statutori tamat latihan (*offboarding*), menghantar peringatan emel, serta menyediakan analitik eksekutif merangkumi kesemua 11 entiti Media Prima.

### Objektif Utama (Core Objectives)
- **Ketepatan Pengiraan 100%**: Menghapuskan kesilapan pengiraan manual dalam pemberian elaun pelatih mengikut **Dasar Kumpulan HR-TR-04**.
- **Integriti Data Ketat**: Menguatkuasakan pengesahan 100% bagi Nombor Kad Pengenalan (12 digit angka tanpa sengkang) dan format perbankan sebelum rekod disimpan.
- **Kecekapan Masa**: Mengurangkan masa pemprosesan bulanan sekurang-kurangnya 80% dengan eksport fail penggajian siap guna (*payroll batch exports*).
- **Penyimpanan Cloud Berpusat (Firebase Firestore)**: Menyimpan semua data pelatih, konfigurasi jabatan/bank, serta pautan dokumen/Google Drive secara *real-time*.

---

## 2. Liputan 11 Entiti Media Prima (Scope & Entities)

Aplikasi ini menyokong penapisan dan pemantauan merentasi seluruh anak syarikat Media Prima Berhad:

1. **TV3** — Sistem Televisyen Malaysia Berhad (Broadcast Hub)
2. **REV** — REV Media Group (Digital Media, Vocket, SAYS)
3. **NSTP** — The New Straits Times Press (Malaysia) Berhad (Publishing & News)
4. **OMNIA** — Media Prima Omnia Sdn Bhd (Commercial Solutions & Marketing)
5. **BTO** — Big Tree Outdoor Sdn Bhd (Out-Of-Home Advertising)
6. **HQ** — Media Prima Berhad (Corporate HQ - Legal, Finance, Group People & Culture)
7. **SYNCHRO** — Synchrosound Studio Sdn Bhd (Radio & Audio - Fly FM, Hot FM, Kool 101, Molek FM)
8. **WOW** — Sistem Televisyen Malaysia Berhad (Wowshop / Home Shopping)
9. **NTV7** — Natseven Sdn Bhd (Educational Content Division)
10. **8TV** — Metropolitan TV Sdn Bhd (Chinese Language Content Hub)
11. **CH9** — Ch-9 Media Sdn Bhd (TV9 - Family Entertainment)

---

## 3. Ciri-Ciri Utama & Logik Bisnes (Key Features & Business Rules)

### F01: Pendaftaran Masterlist & Pengesahan Data Ketat (*Strict Validation*)
- Borang pendaftaran lengkap merangkumi: *Full Name, IC Number, Address, Company Entity, Department, Phone Number, Email, Duration From, Duration To, Bank Name, Bank Account Number,* dan *Document URL*.
- **Peraturan Pengesahan IC (NRIC)**: Wajib tepat **12 digit nombor tanpa sengkang** (cth: `020415105824`). Jika format salah (seperti 10 digit atau mengandungi sengkang), mesej ralat merah dipaparkan dan penghantaran borang disekat serta-merta.
- **Format Tarikh Statutori**: Dipaparkan secara seragam dalam format `DD/MM/YYYY`.

### F02: Pengurusan Dinamik Jabatan & Bank
- Pegawai HR boleh menambah atau mengedit nama Jabatan (*Departments*) dan Institusi Perbankan (*Banks*) secara dinamik.
- Pilihan baharu dikemas kini secara global merentasi semua menu pilihan (*dropdown*) dan disimpan terus ke Firebase.

### F03 & F04: Penjejak Dokumen Tamat Latihan (*Offboarding Tracker*) & Modal Peringatan
- Menapis secara automatik pelatih yang tamat tempoh latihan pada bulan dan tahun yang dipilih.
- Menjejak 3 dokumen fizikal statutori wajib:
  1. **ID Tag / Pas Keselamatan** (*Access Card*)
  2. **Borang Kehadiran Bulanan** (*Signed Attendance Form*)
  3. **Laporan Kemajuan & Penilaian Penyelia** (*Progress Report*)
- Status automatik: Memaparkan **Complete** apabila ketiga-tiga dokumen ditanda; jika tidak, status kekal **Pending**.
- **Modal Peringatan Emel**: Membuka templat emel rasmi lengkap dengan butiran dokumen yang belum dihantar untuk dihantar kepada pelatih.

### F05: Formula Pengiraan Elaun Automatik & Pembundaran Integer (Dasar HR-TR-04)
- **Elaun Asas Bulanan**: **RM 500.00 / bulan** bagi kehadiran penuh.
- **Formula Prorata**:
  $$\text{Elaun} = \left[ \left(\frac{\text{RM 500}}{\text{Jumlah Hari dalam Bulan}}\right) \times \text{Hari Bekerja Aktif} \right] - \text{Potongan Cuti}$$
- **Potongan Cuti (Leave/MC)**: HR boleh memasukkan bilangan hari cuti yang ditolak mengikut kadar harian.
- **Peraturan Pembundaran Integer (*Strict Integer Rounding*)**:
  - Nilai perpuluhan $\ge 0.50$ dibundarkan ke **ATAS** kepada Ringgit terdekat.
  - Nilai perpuluhan $< 0.50$ dibundarkan ke **BAWAH** kepada Ringgit terdekat.
  - Tiada nilai sen dipaparkan (cth: 13 hari aktif / 31 hari = $\text{RM209.67} \rightarrow \mathbf{RM 210}$).

### F06: Status Pembayaran Batch & Catatan Kewangan
- HR boleh menukar status batch sama ada **Release Batch** (Diluluskan) atau **On Hold** (Disekat untuk semakan).
- Menyimpan catatan audit khas (*remarks*) untuk rujukan Jabatan Kewangan Kumpulan.

### F07: Suite Eksport Penggajian (Payroll Batch Export Suite)
- **Eksport CSV**: Fail CSV mengikut spesifikasi fail penggajian Media Prima.
- **Eksport Excel (.xlsx)**: Hamparan elektronik berformat perakaunan.
- **Format Google Sheets**: Salin nilai TSV ke papan keratan (*clipboard*) dengan satu klik.
- **Cetak / Eksport PDF**: Susun atur cetakan dokumen rasmi Media Prima.

### F08: Papan Pemuka Analitik Eksekutif (*Executive Analytics Dashboard*)
- **Kad KPI Eksekutif**:
  - Jumlah Pelatih Aktif (*Total Active Interns*).
  - Jumlah Elaun Dibayar (*Allowance Disbursed in MYR*).
  - Kadar Pelepasan Tamat Latihan (*Offboarding Clearance Rate*).
  - Penyerap Bakat Tertinggi (*Top Talent Absorber* — TV3 34%).
- **Carta Trend Pembayaran Bulanan 2026**: Perbandingan perbelanjaan sebenar (Jan–Ogos) dan unjuran bajet Q4 (Sep–Dis).
- **Carta Donut Pengagihan Bahagian**: Agihan mengikut 6 bahagian operasi.
- **Carta Bar Agihan 11 Entiti**: Penarafan pelatih dan perbelanjaan merentas semua anak syarikat dengan fungsi susunan (*sort by headcount / spend*).
- **Roster Pematuhan & Audit Kewangan**: Jadual semakan audit setiap anak syarikat bersama butang *drill-down* **View Sheet $\rightarrow$** ke Penyata Elaun.

### F09: Cloud Links & Documents Repository (Firebase Firestore)
- Dedicated **"Links & Documents"** button on the primary navigation bar.
- Stores Google Drive folders, payroll reports, Maybank Corporate Autopay portals, and statutory guidelines directly in Cloud Firestore.
- Supports individual trainee document links for quick access to resumes, offer letters, or Google Drive evaluation folders.

### F10: Single-User Authentication (HR Internship) & Password Management
- **Single Authorized User**: The system strictly restricts access to **HR Internship** (`Internship@mediaprima.com.my`). Any unauthorized email attempts are rejected.
- **Default Official Credentials**:
  - **Email**: `Internship@mediaprima.com.my`
  - **Initial Password**: `Internship123`
- **Change Password**: Accessible directly from the top header profile dropdown, allowing HR to update their password (minimum 6 characters).
- **Forgot / Reset Password**: Linked exclusively to the official email `Internship@mediaprima.com.my`, supporting Firebase password reset email delivery, instant password updates, or restoring the official default password.

---

## 4. Senibina & Integrasi Firebase (Firebase Cloud Architecture)

Sistem menggunakan **Google Cloud Firestore** dan **Firebase Authentication** untuk penyimpanan kekal:

- **Firebase Project ID**: `gen-lang-client-0743475428`
- **Firestore Database ID**: `ai-studio-practicaltrainee-24c69876-c911-4f00-8ca4-fb6fad8ca809`
- **Region**: `asia-southeast1`

### Struktur Koleksi Firestore:
| Koleksi / Dokumen | Skema | Penerangan |
|---|---|---|
| `/interns/{internId}` | `Intern` | Rekod peribadi, perbankan, penempatan, dan status pelepasan pelatih. |
| `/config/departments` | `Config` | Senarai nama jabatan dinamik yang dikemas kini secara global. |
| `/config/banks` | `Config` | Senarai institusi perbankan yang disokong. |
| `/links/{linkId}` | `CloudLink` | Pautan Google Drive, portal bank, dokumen dasar, dan fail penggajian. |

### Peraturan Keselamatan (`firestore.rules`):
- Memerlukan pengesahan pengguna (*authenticated users*).
- Mengesahkan skema dokumen dengan had panjang teks, regex 12 digit NRIC (`^[0-9]{12}$`), julat cuti (0–31), dan status pembayaran yang sah.
- Melindungi data daripada pengubahsuaian tanpa kebenaran.

---

## 5. Timbunan Teknologi (Tech Stack)

| Komponen | Teknologi |
|---|---|
| **Frontend Framework** | React 19 (Hooks, Functional Components) |
| **Bahasa Pengaturcaraan** | TypeScript (Strict Typing) |
| **Gaya & Reka Bentuk** | Tailwind CSS v4, Plus Jakarta Sans, Inter, JetBrains Mono |
| **Ikonografi** | Google Material Symbols Outlined & Lucide React |
| **Pangkalan Data Cloud** | Firebase Cloud Firestore (v11 SDK) & Anonymous Auth |
| **Alat Binaan (Build Tool)** | Vite 8.3 & TSX |

---

## 6. Panduan Pemasangan & Pembangunan (Getting Started)

### Prasyarat
- Node.js (v20 atau terkini)
- npm atau bun

### Langkah Pemasangan:
```bash
# 1. Klon repositori ini
git clone https://github.com/username/practical-trainee-allowance-system.git
cd practical-trainee-allowance-system

# 2. Pasang kebergantungan (dependencies)
npm install

# 3. Jalankan pelayan pembangunan (development server)
npm run dev
```

Aplikasi akan berjalan pada port `http://localhost:3000`.

### Perintah Binaan & Semakan Kod:
```bash
# Semak ralat taip TypeScript (Linting)
npm run lint

# Bina aplikasi untuk pengeluaran (Production Build)
npm run build

# Pratonton aplikasi binaan pengeluaran
npm run preview
```

---

## 7. Senarai Semak Ujian QA (QA Verification Checklist)

Berdasarkan dokumen PRD Seksyen 8:

| ID Ujian | Penerangan Kes Ujian | Tingkah Laku Dihasratkan | Status |
|---|---|---|---|
| **TC-01** | *Normal Intern Entry* | Rekod berjaya disimpan dan dipaparkan dalam jadual Masterlist. | **LULUS (Passed)** |
| **TC-02** | *Invalid 10-Digit IC Entry* | Menyekat penghantaran borang; memaparkan ralat teks merah. | **LULUS (Passed)** |
| **TC-03** | *Offboarding Filter (Aug 2026)* | Hanya memaparkan pelatih yang tamat latihan pada bulan Ogos 2026. | **LULUS (Passed)** |
| **TC-04** | *Checklist Completion* | Menandakan 3 kotak dokumen menukar status kepada "Complete". | **LULUS (Passed)** |
| **TC-06** | *Rounding Up (RM434.56)* | Sistem membundarkan nilai secara automatik kepada **RM 435**. | **LULUS (Passed)** |

---

## 8. Hak Cipta & Kerahsiaan (Confidentiality)

© 2026 **Media Prima Berhad** (Company No. 200001024235 [530182-V]).  
*Trainee Allowance Disbursement System (PTAS) • Group People & Culture • Sulit & Hak Cipta Terpelihara.*
