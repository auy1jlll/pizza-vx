# 🍕 Pizza Ordering System - Technical Handover Documentation

**Version**: 1.0  
**Date**: August 22, 2025  
**System Status**: Production Ready

---

## System Overview

### Technology Stack
- **Frontend**: Next.js 15.4.6 (React 19)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based auth system
- **Styling**: Tailwind CSS
- **Language**: TypeScript

### Architecture
```
Frontend (Next.js) → API Routes → Prisma ORM → PostgreSQL Database
```

---

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API endpoints
│   ├── auth/              # Authentication pages
│   ├── checkout/          # Checkout flow
│   ├── menu/              # Public menu pages
│   └── profile/           # User profile
├── components/            # Reusable React components
├── lib/                   # Utility libraries
├── services/              # Business logic services
└── styles/                # Global styles

prisma/
├── schema.prisma          # Database schema
└── migrations/            # Database migrations

public/                    # Static assets
```

---

## Key Components & Services

### Core Services
1. **OrderService** (`src/services/order.ts`)
   - Order creation and management
   - Pricing calculations
   - Status updates

2. **PromotionService** (`src/lib/promotion-service.ts`)
   - Discount calculations
   - "Buy 2 pizzas get 50% off cheapest" logic

3. **SettingsService** (`src/services/settings.ts`)
   - App configuration management
   - Tax rates, delivery fees

### Important Components
1. **CartContext** (`src/contexts/CartContext.tsx`)
   - Unified cart management
   - Pizza and menu item handling

2. **AuthNav** (`src/components/AuthNav.tsx`)
   - Authentication navigation
   - User account controls

3. **CheckoutPage** (`src/app/checkout/page.tsx`)
   - Order processing
   - Customer info auto-population

---

## Database Schema

### Key Tables
- **users**: Customer and employee accounts
- **customer_profiles**: Extended customer data with spending totals
- **orders**: Order records with pricing
- **order_items**: Individual items in orders
- **pizza_sizes/crusts/sauces/toppings**: Pizza configuration
- **menu_items**: Non-pizza menu items
- **app_settings**: System configuration

### Important Relationships
- User → CustomerProfile (1:1)
- User → Orders (1:Many)
- Order → OrderItems (1:Many)
- OrderItem → Toppings/Customizations (1:Many)

---

## API Endpoints

### Public APIs
- `GET /api/menu` - Public menu data
- `POST /api/checkout` - Order creation
- `GET /api/order-history` - Customer order history

### Admin APIs
- `GET /api/admin/customers` - Customer management
- `GET /api/admin/orders` - Order management
- `PATCH /api/admin/orders` - Update order status
- `GET /api/admin/employees` - Employee management

### User APIs
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `GET /api/user/profile` - User profile data

---

## Authentication System

### JWT Implementation
- **Customer Tokens**: `user-token` cookie
- **Admin Tokens**: `admin-token` cookie
- **Token Validation**: `src/lib/auth.ts`

### User Roles
- **CUSTOMER**: Regular customers
- **EMPLOYEE**: Staff with order management access
- **ADMIN**: Full system access

### Protected Routes
- Admin routes require admin token validation
- User profile routes require customer token
- Guest checkout allowed based on settings

---

## Key Features

### Promotion System
- **Logic**: For every 2 pizzas, discount cheapest by 50%
- **Implementation**: `src/lib/promotion-service.ts`
- **Calculation**: Floor(pizza_count / 2) discounts applied

### Dynamic Pricing
- **Server-side validation**: Prevents client-side price manipulation
- **Real-time calculations**: Prices computed on every cart change
- **Tax integration**: Configurable tax rates from settings

### Customer Profiles
- **Auto-creation**: Profiles created when missing
- **Spending tracking**: Dynamic calculation from order totals
- **Loyalty points**: Integrated rewards system

### Order Management
- **Status workflow**: PENDING → CONFIRMED → PREPARING → READY → COMPLETED
- **Real-time updates**: Admin can update status instantly
- **Kitchen integration**: Detailed order descriptions for preparation

---

## Configuration

### Environment Variables
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your_jwt_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

### App Settings (Database)
- `enable_guest_checkout`: Allow orders without accounts
- `enable_user_accounts`: Show sign-in/sign-up options
- `deliveryEnabled`: Enable delivery orders
- `taxRate`: Tax percentage
- `deliveryFee`: Standard delivery charge

---

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database
- npm or yarn

### Installation
```bash
# Clone repository
git clone [repository-url]
cd pizzab

# Install dependencies
npm install

# Setup database
npx prisma migrate dev
npx prisma db seed

# Start development
npm run dev
```

### Development Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

---

## Deployment

### Production Build
```bash
npm run build
npm start
```

### Database Migrations
```bash
npx prisma migrate deploy
```

### Environment Setup
- Configure production DATABASE_URL
- Set secure JWT_SECRET
- Configure any external services

---

## Recent Updates & Fixes

### Promotion System (August 2025)
- ✅ Fixed "buy 2 pizzas get 50% off cheapest" logic
- ✅ Handles multiple pizza pairs correctly
- ✅ Server-side price validation

### User Experience Improvements
- ✅ Auto-populate checkout info from user profiles
- ✅ Fixed missing Sign In/Sign Up navigation
- ✅ Resolved customer profile creation issues

### Admin Panel Enhancements
- ✅ Fixed totalSpent calculation in customer management
- ✅ Dynamic spending totals from order data
- ✅ Comprehensive order management workflow

---

## Known Issues & Limitations

### Current Limitations
1. **Inventory Management**: No stock tracking system
2. **Real-time Notifications**: No push notifications for order updates
3. **Advanced Analytics**: Basic reporting only
4. **Multi-location**: Single location support only

### Future Enhancements
1. **Inventory System**: Track ingredient availability
2. **Mobile App**: Native iOS/Android applications
3. **Advanced Reporting**: Detailed analytics dashboard
4. **Integration APIs**: Third-party delivery services

---

## Monitoring & Maintenance

### Health Checks
- Monitor database connections
- Check API response times
- Verify order creation flow
- Test payment processing

### Regular Maintenance
- **Database**: Regular backups and cleanup
- **Logs**: Monitor application logs for errors
- **Performance**: Check for slow queries
- **Security**: Update dependencies regularly

### Backup Strategy
- **Database Backups**: Automated daily backups
- **Code Repository**: Git-based version control
- **Configuration**: Document all settings changes

---

## Support & Documentation

### Code Documentation
- **API Docs**: JSDoc comments in code
- **Component Docs**: PropTypes and TypeScript interfaces
- **Database Schema**: Prisma schema comments

### User Documentation
- **Admin Guide**: `ADMIN_USER_GUIDE.md`
- **Quick Reference**: `QUICK_REFERENCE.md`
- **API Reference**: Generated from OpenAPI specs

### Support Contacts
- **Technical Issues**: Development team
- **Business Logic**: Product owner
- **Infrastructure**: DevOps team

---

## Testing

### Test Coverage
- **Unit Tests**: Core business logic
- **Integration Tests**: API endpoints
- **E2E Tests**: Critical user flows

### Test Commands
```bash
npm run test          # Run unit tests
npm run test:e2e      # Run end-to-end tests
npm run test:coverage # Generate coverage report
```

---

## Security Considerations

### Data Protection
- **PII Encryption**: Customer data protection
- **Payment Security**: No stored card details
- **Session Management**: Secure JWT implementation
- **Input Validation**: Comprehensive API validation

### Access Control
- **Role-based permissions**: Admin/Employee/Customer roles
- **Route protection**: Authentication middleware
- **CORS Configuration**: Appropriate cross-origin settings

---

## Performance Optimization

### Database Optimization
- **Indexes**: Optimized queries for orders and customers
- **Connection Pooling**: Efficient database connections
- **Query Optimization**: Minimized N+1 queries

### Frontend Optimization
- **Code Splitting**: Lazy-loaded components
- **Image Optimization**: Next.js image optimization
- **Caching Strategy**: Appropriate cache headers

---

**System Status**: ✅ Production Ready  
**Last Updated**: August 22, 2025  
**Next Review**: September 2025

---

*This system is ready for production use with comprehensive user documentation and technical support resources.*
