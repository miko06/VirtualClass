# VirtualClass - Project Context

## Project Overview

**VirtualClass** is a web platform for managing virtual classrooms with AI integration. It's a full-stack application built for a university course project ("Сервер Инфраструктуры" - Server Infrastructure, 3rd year, 2nd semester).

### Architecture

```
VirtualClass/
├── backend/          # NestJS API (TypeScript, Port 3001)
├── frontend/         # React + Vite + Material UI (Port 4173)
├── nginx/            # Reverse proxy (Port 80)
├── postgres/         # PostgreSQL 15 initialization scripts
├── prisma/           # Database schema
├── backup/           # Automated backup scripts
├── security/         # Fail2ban + SSH configuration
└── docker-compose.yml
```

### Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | NestJS, TypeScript, Prisma ORM |
| **Frontend** | React 18, Vite, Material UI, Radix UI, Tailwind CSS 4, Framer Motion |
| **Database** | PostgreSQL 15 |
| **AI** | Ollama integration (configurable models) |
| **Infrastructure** | Docker, Docker Compose, Nginx, Fail2ban |

### Key Features

- User management (Admin, Teacher, Student roles)
- Virtual classroom management
- AI assistant integration via Ollama
- Automated daily database backups
- Security: Fail2ban brute-force protection, SSH access by key
- File uploads support

---

## Building and Running

### Quick Start (Docker)

```bash
# 1. Setup environment
cp .env.docker.example .env

# 2. Start all services
docker compose up -d

# 3. Initialize database (first time only)
cd backend
docker exec -it vc-backend npx prisma migrate deploy
docker exec -it vc-backend npx prisma db seed

# 4. Access application
# Web: http://localhost
# API: http://localhost/api
```

### Development Mode

```bash
# Root level commands (from package.json)
npm run dev              # Start Docker + Frontend dev server
npm run dev:frontend     # Frontend dev only
npm run dev:backend      # Backend logs
npm run up               # Start Docker only
npm run prisma:studio    # Open Prisma Studio (port 5555)
```

### Backend Development

```bash
cd backend
npm install
npm run start:dev        # NestJS dev server (port 3001)
```

### Frontend Development

```bash
cd frontend
npm install
npm run dev              # Vite dev server (port 5173)
```

### Testing

```bash
cd backend
npm run test             # Unit tests
npm run test:e2e         # E2E tests
npm run test:cov         # Coverage report
```

---

## Database Management

### Connection Details

- **Host**: localhost:5432
- **Database**: vc
- **User**: vc
- **Password**: vc (change in `.env` for production)

### Prisma Commands

```bash
cd backend

# Apply migrations
npx prisma migrate deploy

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio
```

### Default Users (after seed)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@enu.kz | Admin123! |
| Teacher | zheglisov.k@enu.kz | Teacher123! |
| Student | student{N}@enu.kz | Student123! |

---

## Docker Services

| Service | Container | Port | Memory Limit |
|---------|-----------|------|--------------|
| PostgreSQL | vc-postgres | 5432 | 512m |
| Backend | vc-backend | 3001 | 768m |
| Frontend | vc-frontend | 4173 | 512m |
| Nginx | vc-nginx | 80 | 256m |
| Backup | vc-backup | - | 256m |
| Fail2ban* | vc-fail2ban | host | 256m |
| SSH* | vc-ssh | 2222 | 128m |

*Security profile services

### Security Profile

```bash
# Start with security services (Fail2ban + SSH)
docker compose --profile security up -d
```

---

## Development Conventions

### Code Style

- **Backend**: ESLint + Prettier (TypeScript)
- **Frontend**: TypeScript, Tailwind CSS 4, Material UI components

### Project Structure

**Backend** (`backend/src/`):
- `admin/` - Admin user management
- `ai/` - AI chat endpoints (Ollama integration)
- `classes/` - Classroom management
- `materials/` - Course materials
- `users/` - User authentication/authorization
- `prisma/` - Prisma service wrapper

**Frontend** (`frontend/src/`):
- React components with Material UI
- Radix UI primitives
- Framer Motion for animations
- React Router for navigation

### Environment Variables

**Root `.env`**:
```env
POSTGRES_DB=vc
POSTGRES_USER=vc
POSTGRES_PASSWORD=vc
OLLAMA_BASE_URL=http://host.docker.internal:11434
OLLAMA_MODEL=minimax-m2.5
BACKUP_RETENTION_DAYS=7
TZ=Asia/Almaty
```

**Backend `backend/.env`**:
```env
DATABASE_URL=postgresql://vc:vc@localhost:5432/vc
```

**Frontend `frontend/.env`**:
```env
VITE_API_URL=/api
```

---

## Common Operations

### View Logs

```bash
docker compose logs -f              # All services
docker compose logs -f backend      # Backend only
docker exec vc-nginx tail -f /var/log/nginx/access.log
```

### Database Access

```bash
# PostgreSQL CLI
docker exec -it vc-postgres psql -U vc -d vc

# Reset admin password
cd backend
docker exec -it vc-backend npx ts-node reset-admin-pwd.ts
```

### Backup Management

```bash
# Location: backup/data/
# Auto-created every 24 hours (configurable)
# Retention: 7 days (configurable)
```

### SSH Access (security profile)

```bash
ssh -p 2222 vcadmin@localhost
# Key: security/ssh/config/keys/authorized_keys
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Port 80 busy | Change nginx port in `docker-compose.yml` |
| DB connection error | Check PostgreSQL health: `docker compose ps postgres` |
| AI not working | Verify Ollama running: `curl http://localhost:11434/api/tags` |
| Migrations fail | Reset DB: `npx prisma migrate reset` |
| Low memory | Adjust limits in `.env` or Docker Desktop settings |

---

## Important Files

- `README.md` - Full user documentation (Russian)
- `INFRASTRUCTURE.md` - Infrastructure details
- `docker-compose.yml` - Service orchestration
- `prisma/schema.prisma` - Database schema
- `backend/src/main.ts` - Backend entry point
- `frontend/src/main.tsx` - Frontend entry point
