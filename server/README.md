# Vault Pulse Center - Backend API

Backend API for Vault Club Technical Operations Dashboard

## Tech Stack

- **Node.js** with TypeScript
- **Express.js** - REST API framework
- **Prisma** - Database ORM
- **PostgreSQL** - Database

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Setup Database

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL connection:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/vault_pulse?schema=public"
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Run Database Migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

### 4. Start Development Server

```bash
npm run dev
```

Server akan running di `http://localhost:3001`

## API Endpoints

### Equipment
- `GET /api/equipment` - Get all equipment (optional: ?city=jakarta)
- `GET /api/equipment/:id` - Get single equipment
- `POST /api/equipment` - Create equipment
- `PATCH /api/equipment/:id` - Update equipment
- `DELETE /api/equipment/:id` - Delete equipment

### Event Briefs
- `GET /api/event-briefs` - Get all event briefs
- `GET /api/event-briefs/:id` - Get single brief
- `POST /api/event-briefs` - Create brief
- `PATCH /api/event-briefs/:id` - Update brief
- `DELETE /api/event-briefs/:id` - Delete brief

### Crew
- `GET /api/crew` - Get all crew (optional: ?city=jakarta&shift=night)
- `GET /api/crew/:id` - Get single crew member
- `POST /api/crew` - Create crew member
- `PATCH /api/crew/:id` - Update crew member
- `DELETE /api/crew/:id` - Delete crew member

### Maintenance Logs
- `GET /api/maintenance` - Get all maintenance logs
- `GET /api/maintenance/:id` - Get single log
- `POST /api/maintenance` - Create log
- `PATCH /api/maintenance/:id` - Update log
- `DELETE /api/maintenance/:id` - Delete log

### Incidents
- `GET /api/incidents` - Get all incidents
- `GET /api/incidents/:id` - Get single incident
- `POST /api/incidents` - Create incident
- `PATCH /api/incidents/:id` - Update incident
- `DELETE /api/incidents/:id` - Delete incident

### Proposals
- `GET /api/proposals` - Get all proposals
- `GET /api/proposals/:id` - Get single proposal
- `POST /api/proposals` - Create proposal
- `PATCH /api/proposals/:id` - Update proposal
- `DELETE /api/proposals/:id` - Delete proposal

### R&D Projects
- `GET /api/rnd` - Get all R&D projects
- `GET /api/rnd/:id` - Get single project
- `POST /api/rnd` - Create project
- `PATCH /api/rnd/:id` - Update project
- `DELETE /api/rnd/:id` - Delete project

### Consumables
- `GET /api/consumables` - Get all consumables
- `GET /api/consumables/:id` - Get single consumable
- `POST /api/consumables` - Create consumable
- `PATCH /api/consumables/:id` - Update consumable
- `DELETE /api/consumables/:id` - Delete consumable

### Alerts
- `GET /api/alerts` - Get all alerts (optional: ?city=jakarta&acknowledged=false)
- `GET /api/alerts/:id` - Get single alert
- `POST /api/alerts` - Create alert
- `PATCH /api/alerts/:id` - Update alert (acknowledge)
- `DELETE /api/alerts/:id` - Delete alert

### KPI Metrics
- `GET /api/kpi` - Get all KPI metrics
- `GET /api/kpi/:city/current` - Get current KPI for city
- `POST /api/kpi` - Create KPI metrics
- `PATCH /api/kpi/:city` - Update KPI metrics

## Deployment

### Railway.app (Recommended)

1. Create account di [railway.app](https://railway.app)
2. Connect GitHub repository
3. Add PostgreSQL database
4. Set environment variables
5. Deploy!

### Render.com

1. Create account di [render.com](https://render.com)
2. Create PostgreSQL database
3. Create Web Service from GitHub
4. Set build command: `cd server && npm install && npm run build && npm run prisma:generate`
5. Set start command: `cd server && npm start`
6. Deploy!

## Production Build

```bash
npm run build
npm start
```
