# Eburon Home - Property Management System

A modern, full-stack property management system with separate portals for administrators and clients.

## 🏗️ Architecture

### Domains
- **Management Portal**: `adminhome.eburon.ai` (Admin, Contractor, Owner, Broker)
- **Client Portal**: `homiesearch.eburon.ai` (Tenants, Prospective Buyers)
- **API**: `api.eburon.ai`

### Tech Stack
- **Backend**: Node.js, TypeScript, Express, Prisma ORM
- **Frontend**: React, TypeScript, Vite
- **Database**: PostgreSQL
- **Infrastructure**: Docker, Docker Compose
- **Monorepo**: pnpm workspaces, Turborepo

## 📁 Project Structure

```
eburon-home/
├── apps/
│   ├── api/              # Node.js backend API
│   ├── admin-portal/     # Admin management SPA
│   └── client-portal/    # Client search SPA
├── packages/
│   ├── db/               # Prisma schema & database client
│   ├── ui/               # Shared UI components
│   └── config/           # Shared configs
├── infra/
│   ├── docker/           # Docker & Docker Compose
│   └── terraform/        # Infrastructure as Code
└── tasks.md              # Development task log
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18
- pnpm >= 8
- Docker & Docker Compose

### Installation

1. **Clone the repository**
```bash
cd eburon-home
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
cp .env ./packages/db/.env
# Edit .env with your configuration
```

4. **Start database**
```bash
docker compose -f infra/docker/docker-compose.yml up postgres -d
```

5. **Run database migrations**
```bash
pnpm db:migrate
```

6. **Seed database with sample data**
```bash
pnpm db:seed
```

7. **Start development servers**
```bash
pnpm dev
```

### Access Points
- **API**: http://localhost:3000
- **Admin Portal**: http://localhost:3001
- **Client Portal**: http://localhost:3002
- **Database UI (Adminer)**: http://localhost:8080

### Default Login Credentials
After seeding, use these credentials:
- **Admin**: `admin@eburon.ai` / `Admin123!`
- **Contractor**: `contractor@eburon.ai` / `Contractor123!`
- **Owner**: `owner@eburon.ai` / `Owner123!`
- **Tenant**: `tenant@eburon.ai` / `Tenant123!`

## 🔧 Development

### Available Scripts

```bash
pnpm dev          # Start all apps in development mode
pnpm dev:api      # Start api in development mode
pnpm dev:client   # Start only client app in development mode
pnpm dev:admin    # Start only admin app in development mode
pnpm build        # Build all apps for production
pnpm test         # Run tests
pnpm lint         # Lint all code
pnpm format       # Format code with Prettier
pnpm db:migrate   # Run database migrations
pnpm db:seed      # Seed database with sample data
pnpm db:studio    # Open Prisma Studio
```

### Working with Docker

```bash
# Start all services
docker compose -f infra/docker/docker-compose.yml up

# Start specific service
docker compose -f infra/docker/docker-compose.yml up postgres

# Stop all services
docker compose -f infra/docker/docker-compose.yml down

# View logs
docker compose -f infra/docker/docker-compose.yml logs -f api
```

## 📊 Database

### Models
- **User**: Base user model with roles
- **ContractorProfile**: Contractor-specific data
- **OwnerProfile**: Property owner data
- **BrokerProfile**: Broker/agent data
- **TenantProfile**: Tenant data
- **Property**: Property listings
- **Lease**: Rental agreements
- **MaintenanceRequest**: Maintenance tickets

### User Roles
- `ADMIN`: System administrator
- `CONTRACTOR`: Maintenance workers
- `OWNER`: Property owners
- `BROKER`: Real estate brokers
- `TENANT`: Property renters

## 🎯 Key Features

### Admin Portal
- Dashboard with statistics
- User management (create, edit, assign roles)
- Property management (create, edit listings)
- Maintenance request oversight
- Contractor assignment

### Client Portal
- Property search (text + voice)
- Map view with property pins
- Advanced filters (price, bedrooms, amenities)
- Listing details with image galleries
- Reservation requests
- Tenant maintenance requests
- Maintenance request tracking

## 🔐 Security

See [SECURITY.md](./SECURITY.md) for detailed security documentation including:
- Authentication & authorization
- Input validation
- SQL injection prevention
- Rate limiting
- Security headers
- Environment variable management

## 👥 Team & Task Assignment

See [tasks.md](./tasks.md) for detailed task breakdown and assignments:
- **Emil**: Main Infrastructure & Backend API
- **Alex**: Database, Dockerization & Security Layer
- **Jamjam**: Design & Frontend Development

## 📝 API Documentation

Once the API is running, visit:
- **Swagger UI**: http://localhost:3000/docs
- **API Health**: http://localhost:3000/health

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
pnpm --filter @eburon/api test
```

## 🚢 Deployment

### Production Build

```bash
# Build all apps
pnpm build

# Build Docker images
docker compose -f infra/docker/docker-compose.yml build
```

### Environment Variables

Ensure all production environment variables are set:
- `DATABASE_URL`: Production PostgreSQL connection
- `JWT_SECRET`: Strong, random secret
- `SMTP_*`: Email provider credentials
- `GOOGLE_MAPS_API_KEY`: Maps integration
- `AWS_*`: Cloud storage credentials (optional)

## 📚 Documentation

- [Walkthrough](./walkhtrough.md): Detailed system architecture and workflows
- [Tasks](./tasks.md): Development task log and assignments
- [Security](./SECURITY.md): Security policies and best practices

## 🤝 Contributing

1. Read the task assignment in `tasks.md`
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Follow the coding standards (ESLint + Prettier)
4. Write clean code with no unnecessary annotations
5. Test your changes
6. Update task log with start/end entries
7. Submit pull request

## 📄 License

Private - Eburon Development © 2025
