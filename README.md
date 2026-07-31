# Area Hasan — Dashboard Web (2025 vs 2026)

Versi web dari aplikasi Android **Area Hasan** (Kotlin/Jetpack Compose).
Dibangun murni dengan HTML/CSS/JS (tanpa build step), sehingga bisa langsung
di-deploy lewat **GitHub Pages**.

Tampilan, warna, dan alur data direplikasi persis dari aplikasi asli:
- Header navy dengan banner, badge "LIVE DASHBOARD AREA HASAN"
- 3 tab: **📉 Sales 25 vs 26**, **🧑‍🤝‍🧑 KPI Personil**, **🎯 IKT Bauran**
- Data awal 18 toko Area Hasan Basri (sales, KPI personil, IKT) sama seperti di app
- Dialog **Tambah Toko** dan **Konfigurasi Google Sheets**

## Struktur file

```
index.html        → markup halaman
style.css         → tema warna & layout (identik dengan tema Material3 di app)
script.js         → data awal + logika (mirror dari ViewModel/Repository Kotlin)
assets/           → banner.jpg & icon.jpg (aset asli dari app)
apps-script/
  Code.gs         → backend jembatan sync 3 sheet (deploy terpisah di script.google.com)
```

## 🔗 Sinkron 3 Link Google Sheets

Sama seperti di aplikasi Android, dashboard ini punya **3 link Google Sheets**
yang bisa diatur lewat ikon *cloud-sync* di header (dialog "Konfigurasi Google
Sheets Real-Time"):

1. **Link Sales & Stok**
2. **Link KPI Personil**
3. **Link IKT 2026**

Ada **2 mode sinkron**:

### Mode A — Lewat Google Apps Script (disarankan, sinkron ketiga link sekaligus)

File `apps-script/Code.gs` di folder ini adalah "jembatan" yang jalan di server
Google, jadi **tidak kena batasan CORS** dan bisa membaca ketiga link
sekaligus (Sales, KPI, IKT).

**Cara pakai:**
1. Buka https://script.google.com/create
2. Hapus isi default, tempel seluruh isi `apps-script/Code.gs`.
3. **Deploy → New deployment → Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Klik **Deploy**, izinkan (Authorize) akses ke akun Google Anda, lalu copy
   **Web app URL** (bentuknya `https://script.google.com/macros/s/xxxxx/exec`).
5. Di dashboard, buka dialog konfigurasi (ikon cloud-sync), isi kolom
   **"Link Web App Apps Script"** dengan URL tadi, lalu isi/tetapkan 3 link
   sheet seperti biasa → klik **Simpan & Sync Now**.

Akun Google yang deploy script ini harus punya akses baca ke ketiga
spreadsheet (baik sebagai pemilik, atau sheet-nya di-share ke akun tsb /
"Anyone with the link").

Format kolom yang dibaca (nama header fleksibel, tidak harus persis — dicocokkan
dengan pencarian kata kunci):
- **Sheet Sales**: `KODE_TOKO`, `NAMA_TOKO`, `PLU`, `DESCP`, `QTY`, `NET_SALES`
  (opsional: `BULAN`, `TAHUN`)
- **Sheet KPI**: `NIK`, `NAMA`, `JABATAN`, `KODE_TOKO`, `NAMA_TOKO`, `PWP`, `PSM`,
  `SERBA_GRATIS`, `MEMBER`, `KONTRIBUSI`, `BOBOT`, `STATUS`
- **Sheet IKT**: `KODE_TOKO`, `NAMA_TOKO`, `JHK`, `TARGET_NET_SALES`,
  `ACTUAL_NET_SALES`, `APC`, `PWP`, `PSM`, `SERTIS`, `MEMBER`

Sync memakai **upsert** (update kalau datanya sudah ada, tambah kalau baru) —
jadi klik "Sync Now" berkali-kali tidak akan menumpuk data duplikat.

### Mode B — Langsung dari browser (fallback, hanya Sales)

Kalau kolom "Link Web App Apps Script" dikosongkan, dashboard akan coba fetch
CSV langsung dari link **Sales & Stok** (`.../export?format=csv&gid=...`) —
persis seperti fungsi `GoogleSheetsFetcher.kt` di app Android aslinya.

> **Catatan CORS Mode B:** karena fetch dilakukan langsung dari browser, sheet
> harus dibagikan sebagai **"Anyone with the link"**. Kalau sync gagal karena
> CORS/network, dashboard otomatis tetap memakai data cache (localStorage).

## 🚀 Cara deploy ke GitHub Pages

1. Buat repository baru di GitHub, misal `area-hasan-web`.
2. Upload semua file di folder ini (`index.html`, `style.css`, `script.js`,
   folder `assets/`) ke root repository tersebut (bisa lewat web upload atau git):
   ```bash
   git init
   git add .
   git commit -m "Area Hasan dashboard web"
   git branch -M main
   git remote add origin https://github.com/USERNAME/area-hasan-web.git
   git push -u origin main
   ```
3. Di repo GitHub → **Settings → Pages**.
4. Pada **Source**, pilih branch `main` dan folder `/ (root)`, lalu **Save**.
5. Tunggu 1–2 menit, link akan aktif di:
   ```
   https://USERNAME.github.io/area-hasan-web/
   ```

Tidak perlu build tool, npm, atau server — semua murni file statis.

## Penyimpanan data

Data (toko, sales, KPI, IKT, dan 3 link sheet) disimpan di **localStorage**
browser pengguna (menggantikan Room Database di Android). Artinya data
tersimpan per-browser/per-device — cocok untuk demo/monitoring pribadi.
Tombol **"Reset Standar"** di dialog konfigurasi akan mengembalikan semua
data ke nilai awal Area Hasan Basri.
