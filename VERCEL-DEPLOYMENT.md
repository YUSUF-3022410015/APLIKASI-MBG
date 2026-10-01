# DEPLOYMENT VERCEL

## Setup Environment
- **DATABASE_URL**: postgresql://neondb_owner:***@ep-dark-cherry-axerxy0u-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
- **NEXTAUTH_SECRET**: $(openssl rand -hex 32)
- **CLOUDINARY_URL**: cloudinary://216379645962821:$OCI$your_cloudinary_secret
- **VERCEL_ENV**: production

## Manual Deployment Steps
1. Login ke Vercel: `vercel login`
2. Push changes: `git push origin main`
3. Vercel akan auto deploy dari branch `main`
4. Tunggu build selesai (Next.js 14 + Prisma + Cloudinary)
5. Dapatkan deployment URL baru

## Current Status
- Branch `main` up to date
- Repository: https://github.com/YUSUF-3022410015/APLIKASI-MBG.git
- Vercel existing project: https://vercel.com/bro-yusuf/aplikasi-mbg/deployments

## Checklist
- [ ] `vercel login` (jika belum login)
- [ ] `vercel deploy --prod` (jika manual)
- [ ] Setup environment variables di dashboard Vercel
- [ ] Test semua role di deployment baru