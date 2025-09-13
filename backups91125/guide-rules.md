# AI Agent Development Prompts for Pizza PWA

## Context for AI Agent

You are building a Progressive Web App (PWA) for a pizza restaurant using Next.js 14+. The app allows customers to scan QR codes at tables, browse menu, customize pizza orders, and pay online. Focus on mobile-first design, fast performance, and seamless user experience.

**Tech Stack:**
- Next.js 14+ with App Router
- Tailwind CSS for styling
- TypeScript for type safety
- Stripe for payments
- PostgreSQL for database
- next-pwa for PWA features

---

## Development Phase Prompts

### Phase 1: Project Setup
```
Create a new Next.js 14 project with the following requirements:
- Setup with TypeScript and Tailwind CSS
- Configure next-pwa for Progressive Web App features
- Create basic folder structure: /components, /lib, /app, /types
- Setup database schema for: menu items, orders, customers, tables
- Install necessary dependencies: stripe, react-hook-form, zod for validation
- Create basic layout with header, navigation, and responsive design
- Generate QR code functionality for table numbers
```

### Phase 2: Menu System
```
Build a complete menu management system with:
- Menu categories (Pizza, Appetizers, Drinks, Desserts)
- Pizza customization interface (size, crust type, toppings with pricing)
- Image handling for menu items with next/image optimization
- Dietary filters (vegetarian, vegan, gluten-free) with clear indicators
- Search functionality across menu items
- Popular/featured items section
- Mobile-optimized browsing with smooth scrolling and touch gestures
- Loading states and error handling for menu data
```

### Phase 3: Shopping Cart & State Management
```
Implement shopping cart functionality with:
- Global cart state management using Zustand or React Context
- Add to cart with customizations and quantities
- Cart persistence in localStorage
- Real-time cart total calculations including tax
- Edit cart items (modify toppings, quantities)
- Remove items with confirmation
- Clear cart functionality
- Cart summary component showing itemized breakdown
- Smooth animations for cart updates
```

### Phase 4: Order Flow & Customer Info
```
Create the complete ordering process:
- QR code scanning to auto-populate table number
- Order type selection (dine-in, takeout, delivery)
- Customer information form with validation using react-hook-form
- Guest checkout option (no account required)
- Special instructions field for items and overall order
- Order review page with editable summary
- Terms of service and privacy policy acceptance
- Error handling and form validation feedback
```

### Phase 5: Payment Integration
```
Implement Stripe payment processing:
- Secure payment form using Stripe Elements
- Support for credit/debit cards and digital wallets (Apple Pay, Google Pay)
- Tip calculation options (15%, 18%, 20%, custom amount)
- Payment processing with loading states and error handling
- Order confirmation with email/SMS notifications
- Receipt generation and order number assignment
- PCI compliance considerations and security best practices
```

### Phase 6: Order Tracking & Notifications
```
Build real-time order tracking system:
- Order status management (received, preparing, ready, delivered)
- Real-time updates using Server-Sent Events or WebSockets
- Push notifications for order status changes
- Estimated completion time calculation
- Customer notification preferences (browser, SMS, email)
- Order history for returning customers
- Order lookup by phone number or order ID
```

### Phase 7: PWA Features & Performance
```
Optimize the app as a high-quality PWA:
- Service worker for offline caching of menu and app shell
- Add to home screen functionality with custom install prompt
- App manifest with proper icons and theme colors
- Offline browsing support with cached menu data
- Performance optimization: image lazy loading, code splitting, caching strategies
- Lighthouse score optimization (target 90+ for all metrics)
- Error boundaries and graceful degradation
- Loading skeletons and smooth transitions
```

### Phase 8: Admin Dashboard
```
Create an admin interface for restaurant management:
- Menu item management (add, edit, delete, toggle availability)
- Order management dashboard with real-time updates
- Order status updates for kitchen staff
- Daily sales reporting and analytics
- QR code generation and printing for tables
- Customer data and order history views
- Basic inventory tracking for popular items
- Staff authentication and role-based access
```

### Phase 9: Mobile Optimization & UX
```
Fine-tune mobile experience and user interface:
- Touch-optimized interface with proper touch targets (44px minimum)
- Smooth scrolling and gesture navigation
- Haptic feedback for button interactions
- Dark mode support with automatic detection
- Accessibility improvements (WCAG 2.1 AA compliance)
- Screen reader support and keyboard navigation
- Performance testing on low-end devices
- Cross-browser testing (iOS Safari, Android Chrome)
```

### Phase 10: Testing & Deployment
```
Implement comprehensive testing and deployment:
- Unit tests for critical functions (cart, payments, ordering)
- Integration tests for API endpoints
- End-to-end testing with Playwright or Cypress
- Performance testing and load testing
- Security testing for payment processing
- Deployment to Vercel or similar platform
- Environment configuration (development, staging, production)
- Monitoring and error tracking setup
- Analytics implementation (Google Analytics, conversion tracking)
```

---

## Specific Technical Prompts

### Database Schema Prompt
```
Design and implement PostgreSQL database schema with the following tables:
- menu_categories (id, name, description, sort_order, active)
- menu_items (id, category_id, name, description, base_price, image_url, dietary_tags, active)
- pizza_toppings (id, name, price, category, dietary_tags)
- orders (id, table_number, customer_info, items, total, status, created_at)
- order_items (id, order_id, menu_item_id, customizations, quantity, price)

Include proper foreign key relationships, indexes for performance, and TypeScript types.
```

### Payment Security Prompt
```
Implement secure payment processing with Stripe:
- Never store card details on your server
- Use Stripe's secure tokenization
- Implement proper error handling for declined cards
- Add fraud detection and security measures
- Ensure PCI DSS compliance
- Create webhook handling for payment confirmations
- Implement proper logging without exposing sensitive data
```

### Performance Optimization Prompt
```
Optimize the PWA for maximum performance:
- Implement proper image optimization with next/image
- Use dynamic imports for code splitting
- Implement service worker caching strategies
- Optimize bundle size and eliminate unused code
- Add loading skeletons for better perceived performance
- Implement proper error boundaries
- Use React.memo and useMemo for expensive operations
- Optimize database queries and add proper indexing
```

---

## Quality Checklist for AI Agent

Before marking any phase complete, ensure:
- [ ] Code follows TypeScript best practices
- [ ] All forms have proper validation and error handling
- [ ] Mobile-first responsive design implemented
- [ ] Accessibility standards met (WCAG 2.1 AA)
- [ ] Performance optimized (target: <3s load time)
- [ ] Security best practices followed
- [ ] Error boundaries and loading states implemented
- [ ] Code is well-documented with comments
- [ ] Database operations are optimized
- [ ] PWA features working correctly

---

## Sample User Stories for Testing

1. **As a customer, I want to scan a QR code and immediately start ordering so I don't have to wait for a server.**

2. **As a customer, I want to customize my pizza with multiple toppings and see the price update in real-time.**

3. **As a customer, I want to pay securely with my credit card or Apple Pay without creating an account.**

4. **As a restaurant owner, I want to update menu items and prices easily without technical knowledge.**

5. **As a customer, I want to receive notifications when my order is ready for pickup.**

Use these user stories to validate that each feature works as expected from the user's perspective.