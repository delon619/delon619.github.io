# Virtual Try-On - AI Outfit Generator

Website lengkap untuk virtual try-on menggunakan AI. Upload foto diri dan foto outfit, lalu AI akan menggabungkannya menjadi hasil foto virtual try-on.

## Fitur

✅ Upload foto user (wajah/full body)  
✅ Upload foto outfit (baju, hoodie, jaket, dress, dll)  
✅ Generate hasil dengan AI  
✅ Preview gambar sebelum generate  
✅ Loading indicator  
✅ Error handling  
✅ Download hasil  
✅ Responsive design  

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **AI Model**: Replicate (IDM-VTON model)
- **Styling**: CSS

## Cara Install

### 1. Install Dependencies

```bash
cd project/outfit
npm install
```

### 2. Setup Environment Variables

Buat file `.env.local` di root folder `project/outfit`:

```bash
cp .env.local.example .env.local
```

Edit file `.env.local` dan tambahkan API token Replicate:

```
REPLICATE_API_TOKEN=your_actual_token_here
```

**Cara Mendapatkan Token Replicate:**
1. Daftar di https://replicate.com/
2. Buka https://replicate.com/account/api-tokens
3. Copy API token
4. Paste ke file `.env.local`

## Cara Menjalankan

### Development Mode

```bash
npm run dev
```

Buka browser ke: **http://localhost:3000**

### Production Build

```bash
npm run build
npm start
```

## Cara Pakai

1. **Upload Foto User**
   - Klik area "Your Photo"
   - Pilih foto diri (wajah atau full body)
   - Preview akan muncul

2. **Upload Foto Outfit**
   - Klik area "Outfit Photo"
   - Pilih foto outfit (baju, hoodie, jaket, dll)
   - Preview akan muncul

3. **Generate Result**
   - Klik tombol "Generate Result"
   - Tunggu 30-60 detik (loading indicator akan muncul)
   - Hasil akan ditampilkan di bawah

4. **Download**
   - Klik tombol "Download Image" untuk simpan hasil

5. **Reset**
   - Klik tombol "Reset" untuk upload foto baru

## Alur Kerja (Flow)

```
User Upload 2 Gambar
    ↓
Frontend (Next.js Page)
    ↓
POST /api/generate
    ↓
Backend API Route
    ↓
Convert ke Base64
    ↓
Kirim ke Replicate AI (IDM-VTON Model)
    ↓
AI Generate Virtual Try-On (30-60 detik)
    ↓
Return Image URL
    ↓
Frontend Display Result
    ↓
User Download (optional)
```

## Struktur Folder

```
project/outfit/
├── app/
│   ├── api/
│   │   └── generate/
│   │       └── route.ts          # API endpoint untuk AI generation
│   ├── globals.css               # Global CSS reset
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main page (frontend)
│   └── styles.css                # Component styles
├── .env.local                    # Environment variables (BUAT MANUAL)
├── .env.local.example            # Example env file
├── .gitignore                    # Git ignore
├── next.config.js                # Next.js config
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
└── README.md                     # Dokumentasi ini
```

## API Endpoint

### POST /api/generate

Request:
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body:
  - `userPhoto`: File (image/jpeg, image/png, image/webp)
  - `outfitPhoto`: File (image/jpeg, image/png, image/webp)

Response Success:
```json
{
  "success": true,
  "resultUrl": "https://replicate.delivery/...",
  "message": "Virtual try-on generated successfully"
}
```

Response Error:
```json
{
  "error": "Error message",
  "details": "Detailed error info"
}
```

## Model AI yang Digunakan

**IDM-VTON** (Image-based Virtual Try-On Network)
- Model: `cuuupid/idm-vton`
- Provider: Replicate
- Waktu generate: 30-60 detik
- Input: Human photo + Garment photo
- Output: Virtual try-on result

Model ini khusus dirancang untuk virtual try-on dan menghasilkan hasil yang realistis dengan mempertahankan identitas wajah dan pose user.

## Troubleshooting

### Error: "REPLICATE_API_TOKEN is not set"
- Pastikan file `.env.local` sudah dibuat
- Pastikan token sudah benar
- Restart development server (`npm run dev`)

### Error: "Invalid file type"
- Gunakan format: JPEG, PNG, atau WebP
- File tidak boleh corrupt

### Generate terlalu lama / timeout
- Model AI butuh 30-60 detik
- Cek koneksi internet
- Coba lagi jika gagal

### Port 3000 sudah digunakan
```bash
npm run dev -- -p 3001
```

## Notes

- Hasil AI tidak selalu sempurna, tergantung kualitas input
- Foto user sebaiknya full body atau setengah badan
- Foto outfit sebaiknya clear dan background simpel
- Model free tier Replicate memiliki limit usage
- Generate pertama kali bisa lebih lama (cold start)

## License

MIT

---

**Dibuat dengan Next.js & AI** 🚀
