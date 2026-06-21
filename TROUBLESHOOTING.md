# 🔧 Troubleshooting Guide: Frontend Still Trying localhost:5000

**Jika frontend masih mencoba akses localhost:5000 setelah fix, ikuti guide ini.**

---

## ⚠️ Symptom: Frontend Masih Akses localhost:5000

### Kemungkinan Penyebab & Solusi

---

## 1. 🔴 Browser Cache (PALING SERING)

**Symptom**: 
- Network tab menunjukkan request ke `http://localhost:5000/api/...`
- Padahal sudah deploy production

**Solusi**:

```bash
# A. Hard Refresh Browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)

# Atau clear cache:
# Chrome: Settings → Privacy → Clear Browsing Data → Cached Images

# B. Clear Service Workers
chrome://serviceworker-internals/
# Find your domain → Unregister

# C. Clear LocalStorage
# Buka DevTools → Application → Storage → Local Storage → Delete All

# D. Hard reload dist/
rm -rf dist/
npm run build
```

---

## 2. 🔴 Old Build Artifacts

**Symptom**: 
- `dist/` folder masih ada dari build lama
- Rebuild tapi masih error

**Solusi**:

```bash
# Clean full build
rm -rf dist/ node_modules/.vite/

# Rebuild
npm install
npm run build

# Verify dist/index.html tidak ada reference ke localhost
grep -r "localhost" dist/ 2>/dev/null || echo "✅ No localhost found"
```

---

## 3. 🔴 Environment Variable Tidak Terbaca

**Symptom**:
- Build success tapi tetap localhost
- Console log menunjukkan `API_BASE` masih hardcoded

**Solusi**:

```bash
# A. Check env variable
echo $VITE_API_BASE  # Should output your API URL

# B. Set explicitly sebelum build
VITE_API_BASE=https://coffeeduduk.onrender.com/api npm run build

# C. Create .env.local dengan content:
cat > .env.local << 'EOF'
VITE_API_BASE=https://coffeeduduk.onrender.com/api
EOF

# D. Verify vite.config.ts has define section
grep -A 2 "define:" vite.config.ts
```

---

## 4. 🔴 Vite Config Tidak Reload

**Symptom**:
- Updated vite.config.ts tapi dev server masih old config
- `npm run dev` tetap error

**Solusi**:

```bash
# Kill dev server
Ctrl+C

# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

---

## 5. 🔴 Proxy Config Tidak Bekerja (Development)

**Symptom**:
- `npm run dev` masih direct hit localhost:5000
- Expected: request ke `http://localhost:3000/api` di-proxy ke backend

**Solusi**:

```bash
# Check vite.config.ts has server.proxy:
cat vite.config.ts | grep -A 5 "server:"

# If missing, add to vite.config.ts:
# export default defineConfig({
#   server: {
#     proxy: {
#       '/api': {
#         target: 'http://localhost:5000',
#         changeOrigin: true,
#       },
#     },
#   },
# })

# Restart dev server
npm run dev
```

---

## 6. 🔴 Import Statement Masih Hardcoded

**Symptom**:
- api.ts atau seed.ts tidak menggunakan env variable
- File masih punya: `const API_BASE = 'https://...'`

**Solusi**:

```bash
# Check file status
grep "const API_BASE" src/app/utils/*.ts

# Expected output:
# src/app/utils/api.ts:const API_BASE = import.meta.env.VITE_API_BASE || ...
# src/app/utils/seed.ts:const API_BASE = import.meta.env.VITE_API_BASE || ...

# If not updated, manually fix or run:
# (Already fixed di fix summary, tapi verify)
```

---

## 7. 🔴 Network Request Policy (CORS)

**Symptom**:
- Network error ketika hit localhost
- Error: "CORS policy: Origin not allowed"

**Solusi**:

```bash
# Backend harus allow frontend origin
# Check backend/server.js:

# Should have:
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || 'https://coffeeduduk.onrender.com',
}));

# In development, set:
export FRONTEND_ORIGIN=http://localhost:5173  # Vite dev port
```

---

## 8. 🔴 Vercel/Production Deploy Issue

**Symptom**:
- Frontend build success
- Tapi production masih akses localhost

**Solusi** (Vercel):

```bash
# A. Set Environment Variable di Vercel Dashboard
# Go to: Settings → Environment Variables
# Add: VITE_API_BASE=https://coffeeduduk.onrender.com/api
# Redeploy

# B. Or update vercel.json
cat > vercel.json << 'EOF'
{
  "buildCommand": "VITE_API_BASE=https://coffeeduduk.onrender.com/api npm run build",
  "env": {
    "VITE_API_BASE": "https://coffeeduduk.onrender.com/api"
  }
}
EOF

git add vercel.json && git commit -m "Fix API base URL"
git push
```

---

## 🎯 Quick Diagnostic Script

```bash
#!/bin/bash
echo "🔍 Frontend Configuration Audit"
echo "================================"

echo -e "\n1. Check vite.config.ts has define:"
grep -q "define:" vite.config.ts && echo "✅ Found" || echo "❌ Missing"

echo -e "\n2. Check vite.config.ts has server.proxy:"
grep -q "server:" vite.config.ts && echo "✅ Found" || echo "❌ Missing"

echo -e "\n3. Check api.ts uses env variable:"
grep -q "import.meta.env.VITE_API_BASE" src/app/utils/api.ts && echo "✅ Found" || echo "❌ Missing"

echo -e "\n4. Check env files:"
ls -la .env* 2>/dev/null | head -5 || echo "❌ No .env files"

echo -e "\n5. Check current VITE_API_BASE:"
echo "Value: ${VITE_API_BASE:-'NOT SET (will use default)'}"

echo -e "\n6. Check dist for hardcoded localhost:"
if [ -d dist ]; then
  grep -r "localhost:5000" dist/ 2>/dev/null && echo "❌ Found localhost in build!" || echo "✅ No localhost in build"
else
  echo "⚠️  dist/ folder not found"
fi

echo -e "\n================================"
echo "Audit complete!"
```

---

## 📋 Step-by-Step Resolution

### Scenario 1: Development Mode Still Using localhost

```bash
# Step 1: Verify env file exists
ls -la .env.local

# Step 2: Check content
cat .env.local
# Should have: VITE_API_BASE=http://localhost:5000/api

# Step 3: Kill and restart dev server
# Ctrl+C (kill current)
npm run dev

# Step 4: Check Network tab
# DevTools → Network → API calls
# Should proxy to: http://localhost:5000/api

# Step 5: If still direct localhost:
# Clear cache: Ctrl+Shift+R
# Check DevTools console for errors
```

### Scenario 2: Production Build Still Using localhost

```bash
# Step 1: Clean build
rm -rf dist/

# Step 2: Set env variable explicitly
VITE_API_BASE=https://coffeeduduk.onrender.com/api npm run build

# Step 3: Verify build
grep -r "localhost" dist/assets/ 2>/dev/null || echo "✅ No localhost"
grep "coffeeduduk.onrender.com" dist/assets/* | head -1 || echo "⚠️  Check URLs"

# Step 4: Test built version
# Open dist/index.html in browser
# Check Network tab
```

### Scenario 3: API Requests Failing After Fix

```bash
# Step 1: Check browser console for errors
# DevTools → Console tab
# Look for: "Failed to fetch", "CORS", etc.

# Step 2: Check backend is running
curl -i https://coffeeduduk.onrender.com/api/products

# Step 3: Check CORS headers
# Backend should allow frontend origin
curl -i -H "Origin: https://your-frontend-url" \
  https://coffeeduduk.onrender.com/api/products

# Step 4: If CORS error, update backend CORS config
# Check backend/server.js line 15 for FRONTEND_ORIGIN
```

---

## 🆘 Still Not Working?

### Checklist:

- [ ] Hard refresh browser (Ctrl+Shift+R)
- [ ] Clear cache dan localStorage
- [ ] Verify .env.local or build environment variable set
- [ ] Check vite.config.ts updated
- [ ] Check api.ts uses import.meta.env.VITE_API_BASE
- [ ] Kill and restart dev server
- [ ] Rebuild dist/
- [ ] Check Network tab for actual URLs
- [ ] Check backend CORS allow frontend URL
- [ ] Verify backend is actually running at the URL

### Debug Output:

```bash
# Run this untuk debugging:
npm run build 2>&1 | grep -i "vite\|api\|error"

# Check bundle:
npm run build
ls -lh dist/assets/*.js | head -5

# Inspect built files:
strings dist/assets/*.js | grep -i "coffeeduduk\|localhost" | head -10
```

---

**Last Updated**: 2026-06-21  
**Version**: 1.0

For more help, check [FIX_SUMMARY.md](FIX_SUMMARY.md) or [AUDIT_REPORT.md](AUDIT_REPORT.md)
