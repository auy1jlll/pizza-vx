# RestoApp - Multi-Category Restaurant Ordering System

A comprehensive restaurant ordering system that supports multiple menu categories including Pizza, Sandwiches, Salads, Seafood, and Dinner Plates.

## 🚀 Quick Start (Development)

```bash
# Install dependencies
npm install

# Start development environment (runs on port 3001)
docker-compose -f docker-compose.dev.yml up -d
npm run dev
```

Access the application:
- **Web App**: http://localhost:3001
- **Admin Panel**: http://localhost:3001/admin/login  
- **API Health**: http://localhost:3001/api/health

## 🍽️ Menu Categories

### Pizza
- Custom sizes and toppings
- Specialty pizzas
- Build-your-own options

### Sandwiches  
- Subs and sandwiches
- Condiments and toppings
- Size variations

### Salads
- Fresh salads with proteins
- Dressing options
- Customizable toppings

### Seafood
- Various preparation styles
- Side dish options
- Seasonal selections

### Dinner Plates
- Main dishes with sides
- "2 of 3" side selection logic
- Premium entrees

## 🛠️ Development vs Production

**RestoApp (Development)**: Port 3001, Database: restodb
**Pizza-Builder-App (Production)**: Port 3000, Database: pizzadb

Both can run simultaneously without conflicts.

## 📋 Implementation Roadmap

1. **Data Model Refactoring** - Multi-category support
2. **Generic Customization Engine** - Category-agnostic logic  
3. **Multi-Category UI Framework** - Flexible components
4. **Enhanced Cart System** - Mixed category orders
5. **Menu Management System** - Admin interface
6. **Testing & QA** - Comprehensive test suite
7. **Migration Strategy** - Zero-downtime deployment

## 🔧 Technology Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL 14
- **Authentication**: NextAuth.js with JWT
- **Containerization**: Docker & Docker Compose
- **Development**: Hot reload with volume mounts

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API endpoints
│   ├── admin/             # Admin interface
│   ├── (categories)/      # Menu category pages
│   └── components/        # Shared components
├── lib/                   # Utilities and services
├── types/                 # TypeScript definitions
└── styles/               # Global styles

prisma/
├── schema.prisma         # Database schema
├── migrations/           # Database migrations
└── seed.ts              # Initial data seeding
```

## 🚀 Deployment

See `DEPLOYMENT_GUIDE.md` for comprehensive deployment instructions including VPS, cloud platforms, and container orchestration.
