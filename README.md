# Vault Pulse Center

**Technical Operations Dashboard for Vault Club**

A comprehensive control center for managing technical operations across Jakarta and Bali venues.

## 🎯 Features

- **Real-time Equipment Monitoring** - Track status of CDJs, speakers, LED walls, lighting
- **Event Management** - Brief management for artists with technical riders
- **Crew Scheduling** - Day/night shift management across both cities
- **Maintenance Tracking** - Preventive & corrective maintenance logs
- **KPI Dashboard** - Equipment uptime, issues tracking, power incidents
- **Proposals & R&D** - CapEx/OpEx proposals and innovation projects
- **Inventory Management** - Consumables tracking with reorder points
- **Alert System** - Critical notifications for SPL violations, maintenance due
- **📱 PWA Support** - Install as native app, works offline, push notifications
- **🔐 Authentication & RBAC** - JWT-based auth with role-based permissions
- **👥 User Management** - Admin interface for managing users and roles

## 🚀 Tech Stack

### Frontend
- React + TypeScript
- Vite (build tool)
- Bun (package manager)
- Zustand (state management)
- Shadcn/ui + Tailwind CSS
- React Query (API integration)
- Recharts (data visualization)

### Backend
- Node.js + TypeScript
- Express.js (REST API)
- Prisma ORM
- PostgreSQL database

## 📦 Project Structure

```
vault-pulse-center/
├── src/                    # Frontend source
│   ├── components/        # UI components
│   │   ├── dashboard/    # Dashboard widgets
│   │   ├── ui/           # Reusable UI components (shadcn)
│   │   └── vault/        # Vault-specific components
│   ├── pages/            # Page components
│   ├── store/            # Zustand state management
│   ├── lib/              # Utilities & API client
│   └── hooks/            # Custom React hooks
├── server/                # Backend API
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── prisma.ts     # Database client
│   │   └── index.ts      # Server entry
│   └── prisma/
│       └── schema.prisma # Database schema
└── public/               # Static assets
```

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ or Bun
- PostgreSQL database
- Git

### Frontend Setup

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build
```

### Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your database credentials

# Run database migrations
npm run prisma:generate
npm run prisma:migrate

# Start development server
npm run dev
```

### Environment Variables

**Frontend (.env)**
```
VITE_API_URL=http://localhost:3001
```

**Backend (server/.env)**
```
DATABASE_URL="postgresql://user:password@localhost:5432/vault_pulse?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

## 🚢 Deployment

### Frontend (Vercel/Netlify)
1. Push to GitHub
2. Connect repository to Vercel/Netlify
3. Set environment variable: `VITE_API_URL` to your backend URL
4. Deploy!

### Backend (Railway/Render)
1. Create PostgreSQL database
2. Connect GitHub repository
3. Set environment variables
4. Deploy!

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## 📊 API Documentation

Full API documentation available in [server/README.md](server/README.md)

Base URL: `http://localhost:3001/api`

### Main Endpoints
- `/equipment` - Equipment management
- `/event-briefs` - Event briefings
- `/crew` - Crew scheduling
- `/maintenance` - Maintenance logs
- `/incidents` - Incident tracking
- `/proposals` - Proposals management
- `/rnd` - R&D projects
- `/consumables` - Inventory
- `/alerts` - Alert system
- `/kpi` - KPI metrics

## 🔐 Authentication ✅
- JWT-based authentication with refresh tokens
- Role-based access control (Admin/Manager/Operator)
- User management interface
- Protected routes
- See [TESTING_GUIDE.md](TESTING_GUIDE.md) for test accounts

## 📱 Progressive Web App (PWA) ✅
- **Install as native app** on mobile and desktop
- **Works offline** with cached data
- **Instant loading** from cache (< 500ms)
- **Auto-updates** with user notification
- **Network-aware** with status indicators
- See [PWA_DOCUMENTATION.md](PWA_DOCUMENTATION.md) for details

### Install PWA:
**Desktop**: Click install icon in address bar
**Mobile**: Menu → "Install app" or "Add to Home Screen"

## 🎨 UI Components
Built with [shadcn/ui](https://ui.shadcn.com/) - High-quality, accessible components

## 📱 Mobile Support
Responsive design optimized for tablets and mobile devices, PWA for offline access

## 🤝 Contributing

This is a private project for Vault Club operations.

## 📝 License

Proprietary - All rights reserved

## 🆘 Support

For technical support, contact the development team.

---

**Built with ❤️ for Vault Club Technical Operations Team**
