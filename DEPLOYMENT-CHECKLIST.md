# Deployment Checklist - Warung Nutrisi

## Current Status
- ✅ Kode siap (commit `e5024c3` - MVP lengkap)
- ✅ Working tree bersih
- ✅ PRD compliant (100% fitur lengkap)
- ✅ Cross-role ready (4 role: Admin, Sekolah, SPPG, Pemerintah)

## Required Actions

### 1. Login Vercel
```bash
vercel login
```

### 2. Set Environment Variables
Setup di dashboard Vercel → Settings → Environment Variables:

**Required Vars:**
- `DATABASE_URL`: `postgresql://neondb_owner:***@ep-dark-cherry-axerxy0u-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require`
- `NEXTAUTH_SECRET`: Generate baru `openssl rand -hex 32`
- `CLOUDINARY_URL`: `cloudinary://216379645962821:$OCI$your_cloudinary_secret`

### 3. Deploy to Vercel
```bash
# Auto deploy dari main branch (recommended)
vercel --prod

# OR manual deploy
cd /d/aplikasi MBG/warung-nutrisi
vercel deploy --prod
```

## Post-Deployment
- ✅ Verify all 4 role functionality
- ✅ Test mobile app API connectivity
- ✅ Update mobile `EXPO_PUBLIC_API_URL` jika deployment URL berbeda
- ✅ Production deployment ready!

## Note
GitHub sudah di-sync, branch `main` up to date dengan remote.