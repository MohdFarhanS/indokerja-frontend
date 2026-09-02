# IndoKerja Frontend

Frontend web IndoKerja yang terhubung ke REST API
[`indokerja-backend`](https://github.com/MohdFarhanS/indokerja-backend). Aplikasi
ini melayani dua role: `JOB_SEEKER` dan `COMPANY`.

## Tentang IndoKerja

IndoKerja mempertemukan pencari kerja dengan perusahaan melalui frontend React
dan backend REST API yang terpisah. Job Seeker dapat melihat lowongan, membuka
detail, melamar, dan memantau status lamaran. Company dapat membuat serta
melihat lowongan miliknya, melihat kandidat, dan memperbarui status lamaran.

## Fitur

### Authentication

- Registrasi akun Job Seeker dan Company.
- Login, logout, persistensi access token JWT, dan pemulihan sesi melalui
  `GET /auth/me`.
- Proteksi route berdasarkan status autentikasi dan role.
- Pemulihan deep link yang aman setelah login hanya untuk namespace role yang
  sama.
- UI pemulihan sesi untuk kegagalan jaringan atau server sementara.

### Job Seeker

- Melihat daftar dan detail lowongan.
- Mengirim lamaran dengan pencegahan submit berulang di UI.
- Melihat lamaran sendiri beserta status terkininya.

### Company

- Melihat lowongan milik perusahaan dan membuat lowongan baru.
- Melihat kandidat pada lowongan miliknya.
- Memperbarui status kandidat dengan umpan balik untuk konflik perubahan data.

### UI dan UX

- Layout responsive untuk desktop dan viewport kecil.
- Loading, empty, error, dan success state sesuai kebutuhan layar.
- Form dengan label, pesan validasi, status submit, kontrol visibilitas password,
  dan checklist persyaratan password.
- Memperhatikan accessibility dasar melalui HTML semantik, label, `aria-invalid`,
  `aria-describedby`, helper text untuk screen reader, status yang diumumkan,
  semantik tombol, serta focus state yang terlihat. Proyek tidak mengklaim
  sertifikasi accessibility formal.

## Teknologi yang Digunakan

Versi berikut berasal dari metadata dependency repository saat ini.

| Teknologi | Versi | Kegunaan |
| --- | --- | --- |
| React / React DOM | `^19.2.8` | UI berbasis komponen |
| TypeScript | `~6.0.2` | Type checking dalam mode strict |
| Vite | `^8.2.2` | Development server dan production bundle |
| React Router DOM | `^7.18.3` | Routing dan proteksi route |
| Axios | `^1.20.0` | Integrasi HTTP dengan backend |
| React Hook Form | `^7.87.0` | Pengelolaan form |
| Zod | `^4.5.4` | Schema dan validasi input |
| `@hookform/resolvers` | `^5.9.1` | Integrasi Zod dengan React Hook Form |
| ESLint | `^10.9.0` | Pemeriksaan kualitas kode |

Prettier tidak dikonfigurasi sebagai dependency atau script repository ini.

## Arsitektur Frontend

```text
Browser
  ↓
React Router
  ↓
Page / Feature
  ↓
API Client
  ↓
Axios
  ↓
IndoKerja Backend REST API
```

Alur state authentication:

```text
access token di localStorage
  ↓
AuthContext
  ↓
GET /auth/me
  ↓
user dan role authoritative dari backend
```

State global authentication dikelola dengan React Context. State lain tetap
lokal pada komponen sesuai kebutuhan. Frontend route guard hanya merupakan UX
boundary; autentikasi, authorization, dan validasi ownership oleh backend tetap
menjadi security boundary.

## Struktur Folder

```text
indokerja-frontend/
├── public/
├── src/
│   ├── api/
│   ├── assets/
│   ├── components/
│   │   └── layout/
│   ├── context/
│   ├── features/
│   │   ├── auth/
│   │   ├── company/
│   │   └── job-seeker/
│   ├── hooks/
│   ├── routes/
│   ├── types/
│   ├── utils/
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
├── .env.example
├── package.json
└── README.md
```

Request API berada di `src/api/`, domain dan API types di `src/types/`, state
authentication di `src/context/`, routing di `src/routes/`, komponen reusable di
`src/components/`, dan perilaku setiap workflow di `src/features/`.

## Prasyarat

- Git.
- Node.js `>=22.12.0`, sesuai field `engines` pada `package.json`.
- npm.
- IndoKerja Backend untuk menggunakan workflow yang memerlukan API.

## Instalasi

```bash
git clone https://github.com/MohdFarhanS/indokerja-frontend.git
cd indokerja-frontend
npm ci
```

`npm ci` direkomendasikan untuk install reproducible dari lockfile. Gunakan
`npm install` hanya ketika dependency proyek memang sedang diubah.

## Konfigurasi Environment

| Variable | Wajib | Keterangan | Contoh lokal |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | Ya | Base URL REST API yang digunakan Axios | `http://localhost:4000/api` |

Buat `.env` dari contoh repository.

PowerShell:

```powershell
Copy-Item .env.example .env
```

Unix/macOS:

```bash
cp .env.example .env
```

API client memakai relative path seperti `/auth/login`, `/jobs`, dan
`/applications/me`; base URL harus mencakup prefix `/api` pada arsitektur lokal
saat ini. Restart development server setelah mengubah environment variable Vite.

File `.env` sudah diabaikan Git dan tidak boleh di-commit. Environment variable
frontend hanya boleh berisi konfigurasi yang aman diekspos ke browser. Jangan
menaruh secret backend seperti `JWT_SECRET` atau `DATABASE_URL` di dalamnya.

## Menjalankan Aplikasi

```bash
npm run dev
```

Tanpa konfigurasi port khusus, Vite biasanya menyediakan aplikasi di
`http://localhost:5173`; gunakan URL yang ditampilkan terminal sebagai acuan.
Backend harus berjalan agar fitur API dapat digunakan.

Build production menjalankan TypeScript build lalu Vite bundle:

```bash
npm run build
```

Untuk memeriksa hasil build secara lokal:

```bash
npm run preview
```

## Route Aplikasi

| Route | Akses | Keterangan |
| --- | --- | --- |
| `/login` | Publik, guest only | Login; user aktif diarahkan ke home role |
| `/register` | Publik, guest only | Registrasi Job Seeker atau Company |
| `/job-seeker` | `JOB_SEEKER` | Redirect ke `/job-seeker/jobs` |
| `/job-seeker/jobs` | `JOB_SEEKER` | Daftar lowongan |
| `/job-seeker/jobs/:jobId` | `JOB_SEEKER` | Detail lowongan dan aksi melamar |
| `/job-seeker/applications` | `JOB_SEEKER` | Lamaran milik user |
| `/company` | `COMPANY` | Redirect ke `/company/jobs` |
| `/company/jobs` | `COMPANY` | Lowongan milik perusahaan |
| `/company/jobs/new` | `COMPANY` | Form pembuatan lowongan |
| `/company/jobs/:jobId/candidates` | `COMPANY` | Kandidat lowongan milik perusahaan |

Route yang tidak dikenal diarahkan melalui `/` ke `/login` atau home role user.

## Role dan Hak Akses

| Role | Akses Utama |
| --- | --- |
| `JOB_SEEKER` | Lowongan, detail lowongan, apply, dan lamaran sendiri |
| `COMPANY` | Lowongan milik perusahaan, pembuatan lowongan, kandidat, dan update status |

Frontend mengarahkan user yang membuka namespace role lain, tetapi backend tetap
wajib memvalidasi role dan ownership pada setiap request.

## Authentication

```text
login
  ↓
backend mengembalikan accessToken + user
  ↓
accessToken disimpan di localStorage
  ↓
user disimpan dalam React Context
  ↓
browser di-refresh
  ↓
token dibaca dan GET /auth/me dipanggil
  ↓
backend mengembalikan user authoritative
```

Hanya access token yang disimpan dengan key `token`; user dan role tidak
disimpan di `localStorage`, dan JWT tidak di-decode untuk menentukan identity di
frontend. Desain assessment ini menggunakan access token di `localStorage`
sesuai arsitektur proyek, bukan sebagai klaim bahwa penyimpanan tersebut bebas
risiko.

- `/auth/me` berhasil: user dan role dipulihkan dari respons backend.
- `/auth/me` atau protected request menghasilkan `401`: token invalid dibersihkan
  dan sesi diinvalidasi.
- Gangguan jaringan atau respons `5xx` saat restore: token dipertahankan dan UI
  menawarkan retry atau masuk ulang.
- Respons `403` tidak otomatis membuat user logout karena dapat berarti akses
  resource ditolak, bukan sesi invalid.

Setelah login, protected destination dipulihkan jika berada dalam namespace role
yang sama, misalnya `/job-seeker/applications` atau `/company/jobs/new`.
Destination lintas role jatuh ke home role yang valid.

## Validasi Password

### Registration

- Minimal 12 karakter dan maksimal 72 byte UTF-8.
- Memuat huruf besar ASCII (`A-Z`), huruf kecil ASCII (`a-z`), angka, dan simbol.
- Whitespace dipertahankan tetapi tidak dihitung sebagai simbol.

### Login

Password login hanya harus non-empty dan tidak melebihi 72 byte UTF-8. Login
tidak menerapkan ulang aturan kompleksitas registrasi agar sesuai contract
backend dan mendukung password akun yang sudah ada.

## Integrasi API

Endpoint berikut relatif terhadap `VITE_API_BASE_URL`. Dengan base URL lokal
`http://localhost:4000/api`, full route backend menjadi `/api/...` tanpa
menggandakan prefix.

| Operasi | Method | Endpoint |
| --- | --- | --- |
| Registrasi | `POST` | `/auth/register` |
| Login | `POST` | `/auth/login` |
| Restore identity | `GET` | `/auth/me` |
| Daftar lowongan | `GET` | `/jobs` |
| Detail lowongan | `GET` | `/jobs/:jobId` |
| Buat lowongan | `POST` | `/jobs` |
| Lowongan perusahaan | `GET` | `/company/jobs` |
| Apply | `POST` | `/jobs/:jobId/applications` |
| Lamaran sendiri | `GET` | `/applications/me` |
| Kandidat lowongan | `GET` | `/jobs/:jobId/applications` |
| Update status | `PATCH` | `/applications/:applicationId/status` |

Payload penting:

```json
{
  "email": "user@example.com",
  "password": "password pengguna"
}
```

```json
{
  "title": "Frontend Engineer",
  "location": "Jakarta",
  "salary": 8000000,
  "jobType": "FULL_TIME",
  "description": "Deskripsi pekerjaan"
}
```

```json
{
  "status": "REVIEWING"
}
```

Request apply tidak mengirim field ownership atau status. Frontend juga tidak
menentukan `userId`, `companyId`, `jobSeekerId`, initial application status,
ownership, maupun application history. Backend menetapkan data tersebut dari
identity terautentikasi dan relasi database.

### Job type dan application status

Job type: `FULL_TIME`, `PART_TIME`, `CONTRACT`, dan `INTERNSHIP`, yang ditampilkan
sebagai Penuh Waktu, Paruh Waktu, Kontrak, dan Magang pada UI.

Application status: `APPLIED`, `REVIEWING`, `SHORTLISTED`, `REJECTED`, dan
`ACCEPTED`. Frontend tidak menerapkan linear state machine; Company dapat memilih
status berbeda yang valid sesuai contract backend, tetapi tidak dapat menyimpan
ulang status yang sama.

Jika status berubah secara concurrent, backend dapat mengembalikan `409
Conflict`. Frontend tidak menganggap update berhasil, mengembalikan pilihan ke
status sebelumnya, dan meminta user memuat ulang data.

### Aturan workflow

- Salary pembuatan lowongan harus berupa integer dari `1` sampai `2147483647`.
- Pemeriksaan lamaran frontend hanya membantu UX. Backend tetap authoritative
  dan melindungi duplicate application dengan `409 Conflict`.
- Company meminta kandidat berdasarkan job; backend memverifikasi ownership
  sebelum mengembalikan kandidat atau menerima update status.
- Data kandidat yang digunakan UI terbatas pada nama, email plain text, status
  dan tanggal lamaran, serta ID/judul job. Tidak ada CV, resume, profile detail,
  atau tautan `mailto`.

## Validasi Form

React Hook Form dan Zod digunakan pada login, registrasi, dan pembuatan lowongan
untuk validasi client-side serta pencegahan duplicate submit. Backend tetap
melakukan validasi sendiri; validasi frontend bukan security boundary.

## Penanganan Error

| Status/kondisi | Penanganan umum |
| --- | --- |
| `400 Bad Request` | Data atau pilihan tidak valid ditampilkan tanpa menganggap operasi berhasil |
| `401 Unauthorized` | Login ditolak, atau protected session yang invalid dibersihkan |
| `403 Forbidden` | Akses resource ditolak tanpa otomatis logout |
| `404 Not Found` | Resource ditampilkan sebagai tidak tersedia |
| `409 Conflict` | Duplicate apply, email terdaftar, atau concurrent status update diberi feedback khusus |
| Network/server error | Pesan umum yang aman dan retry bila layar mendukungnya |

Pesan UI tidak mengekspos stack trace atau detail internal backend.

## Komponen Bersama

Komponen reusable utama mencakup `AuthenticatedLayout`,
`ApplicationStatusBadge`, loading/error helpers dalam `AsyncStates`,
`EmptyState`, `PageHeader`, `PasswordField`, dan `TextField`.

## Keamanan Frontend

Frontend menerapkan beberapa pengamanan sesuai scope aplikasi:

- Rendering React standar digunakan dan source tidak memakai
  `dangerouslySetInnerHTML`.
- Hanya access token disimpan di `localStorage`; password, token, dan data
  sensitif tidak dicatat ke console.
- `/auth/me` menjadi sumber identity dan role authoritative setelah restore.
- Deep link divalidasi agar tetap berada dalam namespace role yang sama.
- Frontend tidak membuat atau mengirim ownership ID pada workflow apply/create.
- `401` pada protected request menginvalidasi sesi, sedangkan `403` mempertahankan
  sesi.

Proteksi tersebut tidak menggantikan authorization, ownership validation, dan
validasi input pada backend.

## Quality Check

```bash
npm run build
npm run lint
npm ls
npm audit
git diff --check
```

Repository saat ini menggunakan build, lint, dependency audit, dan manual
browser regression sebagai verifikasi utama. Automated frontend test suite belum
ditambahkan dan tidak ada script `test` pada `package.json`.

## Troubleshooting

### API tidak dapat diakses

Pastikan backend berjalan dan `VITE_API_BASE_URL` menunjuk ke API base yang benar,
termasuk prefix `/api`.

### CORS error

Pastikan `CORS_ORIGIN` pada backend cocok dengan origin frontend. Jangan
menonaktifkan CORS sebagai solusi.

### Session tidak dapat diverifikasi

Gunakan tombol **Coba Lagi** pada recovery UI, lalu periksa koneksi jaringan dan
status backend. Pilih **Masuk Ulang** jika ingin membersihkan sesi lokal.

### Build gagal

```bash
npm ci
npm run build
```

### Environment variable belum berubah

Restart Vite development server setelah mengubah `.env` karena nilai environment
dibaca saat server dimulai.

## Backend

Workflow API penuh memerlukan
[`indokerja-backend`](https://github.com/MohdFarhanS/indokerja-backend). Jalankan
dan konfigurasi backend tersebut sebelum menguji autentikasi, lowongan, lamaran,
atau kandidat.

## Deployment

Konfigurasi dan URL deployment production akan ditambahkan setelah Stage 12
selesai dan integrasi frontend-backend telah diverifikasi pada environment
production. Repository ini belum mendokumentasikan URL production.

## Workflow Pengembangan

1. Buat branch dari `main` untuk perubahan yang terukur.
2. Implementasikan hanya scope yang diminta.
3. Jalankan quality checks yang relevan.
4. Periksa diff agar tidak membawa perubahan di luar scope.
5. Ajukan pull request dan merge setelah review.
