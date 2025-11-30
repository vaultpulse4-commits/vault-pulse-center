# Deployment Guide

## Quick Deploy Options

### Option 1: Railway.app (Recommended - Free Tier Available)

#### Backend + Database on Railway

1. **Create Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Deploy Backend**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `vault-pulse-center` repository
   - Railway will auto-detect the Node.js backend

3. **Add PostgreSQL**
   - In your project, click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will create database and set `DATABASE_URL` automatically

4. **Configure Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy!**
   - Railway will auto-deploy on every push to main branch
   - Get your backend URL (e.g., `https://your-app.railway.app`)

#### Frontend on Vercel

1. **Create Account**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Import `vault-pulse-center`
   - Vercel auto-detects Vite configuration

3. **Configure**
   - Root Directory: `./` (leave as is)
   - Build Command: `bun run build`
   - Output Directory: `dist`
   
4. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

5. **Deploy!**
   - Auto-deploys on every push

### Option 2: All-in-One on Render.com

#### Backend + Database

1. **Create PostgreSQL Database**
   - Go to [render.com](https://render.com)
   - New → PostgreSQL
   - Choose free tier
   - Note the Internal Database URL

2. **Deploy Backend**
   - New → Web Service
   - Connect GitHub repository
   - Name: `vault-pulse-backend`
   - Root Directory: `server`
   - Build Command: `npm install && npm run build && npm run prisma:generate`
   - Start Command: `npm start`
   
3. **Environment Variables**
   ```
   DATABASE_URL=<from PostgreSQL step>
   NODE_ENV=production
   PORT=3001
   FRONTEND_URL=<will add after frontend deploy>
   ```

#### Frontend

1. **Deploy Frontend**
   - New → Static Site
   - Connect GitHub repository
   - Build Command: `bun install && bun run build`
   - Publish Directory: `dist`

2. **Environment Variables**
   ```
   VITE_API_URL=https://vault-pulse-backend.onrender.com
   ```

3. **Update Backend FRONTEND_URL**
   - Go back to backend settings
   - Update `FRONTEND_URL` with frontend URL

### Option 3: Netlify + Railway

#### Backend on Railway (same as Option 1)

#### Frontend on Netlify

1. **Import Project**
   - Go to [netlify.com](https://netlify.com)
   - New site from Git
   - Choose repository

2. **Build Settings**
   - Build command: `bun run build`
   - Publish directory: `dist`

3. **Environment Variables**
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

## GitHub Actions Auto-Deploy (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun run build
      # Vercel/Netlify CLI deploy commands here

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd server && npm install
      - run: cd server && npm run build
      # Railway/Render deploy commands here
```

## Environment Variables Summary

### Frontend
| Variable | Example | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `https://api.vault.com` | Backend API URL |

### Backend
| Variable | Example | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql://...` | PostgreSQL connection |
| `PORT` | `3001` | Server port |
| `NODE_ENV` | `production` | Environment |
| `FRONTEND_URL` | `https://vault.com` | Frontend URL (CORS) |

## Post-Deployment Checklist

- [ ] Frontend loads successfully
- [ ] Backend health check: `https://your-api.com/health`
- [ ] Database connected (check backend logs)
- [ ] API endpoints responding
- [ ] CORS configured correctly
- [ ] Environment variables set
- [ ] Custom domain configured (optional)
- [ ] SSL/HTTPS enabled
- [ ] Monitor backend logs for errors

## Custom Domain Setup

### Vercel
1. Project Settings → Domains
2. Add your domain
3. Configure DNS records as instructed

### Railway
1. Project Settings → Domains
2. Add custom domain
3. Update DNS CNAME record

### Netlify
1. Domain settings → Add domain
2. Configure DNS

## Monitoring & Logs

- **Railway**: View logs in dashboard
- **Render**: Logs tab in service
- **Vercel**: Deployments → View logs
- **Netlify**: Deploys → View logs

## Database Migrations

After deployment, run migrations:

```bash
# Railway CLI
railway run npm run prisma:migrate

# Render (via shell)
npm run prisma:migrate
```

## Cost Estimation

### Free Tier (Suitable for MVP)
- **Railway**: $5 credit/month (backend + DB)
- **Vercel**: Unlimited (frontend)
- **Total**: ~FREE for development/testing

### Production (Low Traffic)
- **Railway**: ~$10-20/month
- **Vercel**: Free or Pro $20/month
- **Total**: ~$10-40/month

## Troubleshooting

### Frontend can't connect to backend
- Check `VITE_API_URL` is correct
- Verify CORS settings in backend
- Check backend is running

### Database connection failed
- Verify `DATABASE_URL` format
- Check database is running
- Run migrations

### Build failed
- Check Node.js version compatibility
- Verify all dependencies installed
- Check environment variables

## Support

Contact development team for deployment assistance.
