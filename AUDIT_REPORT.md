# Frontend Audit Report: API Configuration Issues

**Tanggal**: 2026-06-21  
**Status**: 🔴 CRITICAL ISSUES FOUND

---

## 📋 Executive Summary

Frontend memiliki **2 hardcoded API_BASE URLs** di 2 file berbeda. Meski keduanya sudah mengarah ke production URL (`https://coffeeduduk.onrender.com/api`), **tidak ada mechanism untuk environment variables**, sehingga jika backend dipindahkan, perlu manual rebuild.

---

## 🔍 Findings

### 1. ❌ Duplikasi API_BASE (CRITICAL)

**File 1: [src/app/utils/api.ts](src/app/utils/api.ts#L1)**
```typescript
// ❌ HARDCODED - Production URL
const API_BASE = 'https://coffeeduduk.onrender.com/api';
```
**Lines**: 1 (digunakan di line 36)

**File 2: [src/app/utils/seed.ts](src/app/utils/seed.ts#L1)**
```typescript
// ❌ HARDCODED - Production URL  
const API_BASE = 'https://coffeeduduk.onrender.com/api';
```
**Lines**: 1 (digunakan di line 5)

**Masalah**:
- URL tidak bisa dikonfigurasi tanpa rebuild
- Duplikasi = maintenance burden
- Sulit untuk development mode (localhost testing)
- Sulit untuk staging environment

---

### 2. ⚠️ Tidak Ada Environment Variable Support (HIGH)

**Status**: `vite.config.ts` tidak ada konfigurasi untuk env variables

**[vite.config.ts](vite.config.ts)** - Lines 1-35:
```typescript
export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/app'),
    },
  },
  // ❌ MISSING: Tidak ada env variable support
  // ❌ MISSING: Tidak ada proxy untuk development
})
```

**Masalah**:
- Vite tidak di-setup untuk load environment variables
- Frontend tidak bisa membaca `.env.local` atau `.env.production`
- Build process tidak bisa inject API_BASE dari environment

---

### 3. ⚠️ Merge Conflict di package.json (MEDIUM)

**[package.json](package.json)** - Lines 1-3:
```json
{
<<<<<<< HEAD
  "name": "@figma/my-make-file",
```

**Masalah**:
- File masih dalam state merge conflict
- Ada 2 package.json configs tercampur (frontend + backend)
- Bisa menyebabkan issues saat build/deploy

---

### 4. ✅ No Proxy Issues di Vite Config

**Status**: GOOD  
Vite config sudah clean, tidak ada proxy ke localhost yang bisa menjadi masalah.

---

### 5. ✅ No Direct Hardcoded URLs di Components

**Status**: GOOD  
Components di `src/app/components/` dan `src/app/pages/` tidak ada hardcoded URLs - semuanya melalui centralized `api.ts`

**Usage Pattern**: ✅ GOOD
```typescript
// Components menggunakan centralized api
import { api } from '../utils/api';

// Contoh dari AuthModal.tsx
const { user } = await api.getMe();  // ✅ Benar
const { user } = await api.register(...);  // ✅ Benar
```

---

### 6. ⚠️ Environment Files Status

**File**: `.env.example` (Lines 1-7)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=coffeeku
JWT_SECRET=change_this_secret_for_local_dev
JWT_EXPIRES_IN=7d
```

**Masalah**:
- File adalah untuk **BACKEND** (ada DB_HOST, DB_USER, dll)
- **Frontend tidak punya `.env.example` untuk API URL**
- Backend menggunakan env variables, frontend tidak
- Inconsistency antara backend dan frontend

---

### 7. ⚠️ Dist Folder Cache

**Status**: Folder `dist/` exists dengan content:
```
dist/
  assets/
  index.html
```

**Risk**: 
- Jika ada old build cache, bisa masih punya URL lama
- Sebaiknya clean rebuild sebelum deploy ulang

---

## 🛠️ Recommended Fixes

### Priority 1: CRITICAL - Implement Environment Variables

**Step 1: Update vite.config.ts**

```typescript
// ❌ CURRENT (lines 19-30)
export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/app'),
    },
  },
})

// ✅ FIXED - Add define config
export default defineConfig({
  define: {
    __API_BASE__: JSON.stringify(process.env.VITE_API_BASE || 'https://coffeeduduk.onrender.com/api'),
  },
  plugins: [
    figmaAssetResolver(),
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/app'),
    },
  },
  server: {
    // Optional: untuk development proxy
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE || 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
```

**Step 2: Update [src/app/utils/api.ts](src/app/utils/api.ts)**

```typescript
// ❌ CURRENT (line 1)
const API_BASE = 'https://coffeeduduk.onrender.com/api';

// ✅ FIXED
const API_BASE = import.meta.env.VITE_API_BASE || 'https://coffeeduduk.onrender.com/api';
```

**Step 3: Update [src/app/utils/seed.ts](src/app/utils/seed.ts)**

```typescript
// ❌ CURRENT (line 1)
const API_BASE = 'https://coffeeduduk.onrender.com/api';

// ✅ FIXED
const API_BASE = import.meta.env.VITE_API_BASE || 'https://coffeeduduk.onrender.com/api';
```

**Step 4: Create `.env.example` (Frontend)**

```env
# Frontend API Configuration
VITE_API_BASE=https://coffeeduduk.onrender.com/api

# Development
# VITE_API_BASE=http://localhost:5000/api
```

**Step 5: Create `.env.local` for Development**

```env
VITE_API_BASE=http://localhost:5000/api
```

---

### Priority 2: HIGH - Fix package.json Merge Conflict

**Current issue**: Lines 1-3 memiliki `<<<<<<< HEAD`

**Action**: 
1. Resolve merge conflict
2. Keep hanya frontend package.json
3. Backend package.json seharusnya di `backend/package.json`

---

### Priority 3: MEDIUM - Clean Build Cache

```bash
# Remove old build
rm -r dist/

# Rebuild dengan env variables
npm run build
```

---

## 🎯 Why Frontend Still Tries localhost:5000?

Kemungkinan penyebab:

1. **Old browser cache** - Sebelumnya ada URL localhost di dist
2. **Service Worker cache** - Jika ada PWA, bisa cache old requests
3. **Developer tidak tahu update** - API URL mungkin diupdate tapi frontend belum rebuild
4. **Network tab showing localhost** - Bisa karena development proxy settings

---

## ✅ Checklist Perbaikan

- [ ] Update `vite.config.ts` dengan `define` dan `server.proxy`
- [ ] Update `src/app/utils/api.ts` gunakan `import.meta.env.VITE_API_BASE`
- [ ] Update `src/app/utils/seed.ts` gunakan `import.meta.env.VITE_API_BASE`
- [ ] Create `.env.example` untuk frontend
- [ ] Fix merge conflict di `package.json`
- [ ] Clean `dist/` folder
- [ ] Rebuild: `npm run build`
- [ ] Test dengan `npm run dev` (development)
- [ ] Deploy ke production

---

## 📊 API Configuration Summary Table

| File | Current | Status | Fix |
|------|---------|--------|-----|
| [src/app/utils/api.ts](src/app/utils/api.ts#L1) | Hardcoded URL | ❌ | Use env var |
| [src/app/utils/seed.ts](src/app/utils/seed.ts#L1) | Hardcoded URL | ❌ | Use env var |
| vite.config.ts | No env support | ❌ | Add define + proxy |
| package.json | Merge conflict | ⚠️ | Resolve conflict |
| Components | Via api.ts | ✅ | No changes needed |
| dist/ | Cache exists | ⚠️ | Clean rebuild |

---

**Report Generated**: 2026-06-21  
**Next Step**: Implementasi fixes sesuai priority
