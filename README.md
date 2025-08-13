# Pizza Builder Pro - Standalone Application

A complete pizza builder application built with Next.js, TypeScript, Prisma, and Tailwind CSS. This is a fully isolated application that runs independently from any other systems.

## 🚀 Features

### Customer Experience
- **Interactive Pizza Builder**: Customize size, crust, sauce, and toppings
- **Real-time Pricing**: See price updates as you build your pizza
- **Responsive Design**: Works perfectly on desktop and mobile
- **Intuitive Interface**: Easy-to-use step-by-step builder

### Admin Management
- **Dashboard Overview**: Quick stats and navigation
- **Component Management**: Manage sizes, crusts, sauces, and toppings
- **Order Management**: View and track pizza orders
- **User Management**: Handle customer accounts

### Technical Features
- **Complete Isolation**: No dependencies on external systems
- **Database Ready**: Prisma ORM with PostgreSQL support
- **Type Safety**: Full TypeScript implementation
- **Modern Stack**: Next.js 15 with App Router

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma ORM (PostgreSQL ready)
- **Authentication**: NextAuth (configured)
- **State Management**: React hooks

## 📦 Installation

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (optional - runs with mock data)

### Setup Steps

1. **Install Dependencies**
   `ash
   npm install
   `

2. **Environment Configuration**
   Update .env file with your settings:
   `nv
   DATABASE_URL="postgresql://username:password@localhost:5432/pizza_builder_db"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key"
   `

3. **Database Setup** (Optional)
   `ash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations (if using database)
   npx prisma migrate dev
   
   # Seed database (if using database)
   node prisma/seed.js
   `

4. **Start Development Server**
   `ash
   npm run dev
   `

5. **Access Application**
   - **Home Page**: http://localhost:3000
   - **Pizza Builder**: http://localhost:3000/pizza-builder
   - **Admin Dashboard**: http://localhost:3000/admin

## 🏗️ Project Structure

`
pizza-builder-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── pizza-builder/     # Pizza builder API
│   │   ├── admin/                 # Admin interface
│   │   ├── pizza-builder/         # Customer pizza builder
│   │   ├── layout.tsx             # App layout with navigation
│   │   └── page.tsx               # Home page
│   └── ...
├── prisma/
│   ├── schema.prisma              # Database schema
│   └── seed.js                    # Development seed data
├── public/                        # Static assets
└── package.json                   # Dependencies
`

## 🎯 Usage

### For Customers
1. Visit the home page
2. Click "Start Building Your Pizza"
3. Choose size, crust, sauce, and toppings
4. Review your order and submit

### For Administrators
1. Navigate to /admin
2. Use the dashboard to manage:
   - Pizza sizes and pricing
   - Crust types and modifiers
   - Sauce varieties and spice levels
   - Toppings and categories
   - Orders and customers

## 🔧 Configuration

### Database Modes
- **Mock Data Mode**: Runs without database (current setup)
- **Database Mode**: Connect to PostgreSQL for persistence

### Customization
- **Styling**: Modify Tailwind classes in components
- **Data**: Update mock data in API route or connect database
- **Features**: Add new components and functionality

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub repository
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically

### Docker
`ash
# Build image
docker build -t pizza-builder-app .

# Run container
docker run -p 3000:3000 pizza-builder-app
`

### Traditional Hosting
`ash
# Build for production
npm run build

# Start production server
npm start
`

## 📝 API Endpoints

### Pizza Builder API
- GET /api/pizza-builder - Get all pizza components
- POST /api/pizza-builder - Create pizza order

### Future Admin APIs
- GET/POST/PUT/DELETE /api/admin/sizes - Manage pizza sizes
- GET/POST/PUT/DELETE /api/admin/crusts - Manage crusts
- GET/POST/PUT/DELETE /api/admin/sauces - Manage sauces
- GET/POST/PUT/DELETE /api/admin/toppings - Manage toppings

## 🎨 Features Overview

### Pizza Customization
- **4 Pizza Sizes**: Small (10"), Medium (12"), Large (14"), Extra Large (16")
- **4 Crust Types**: Thin, Regular, Thick, Stuffed
- **4 Sauce Options**: Marinara, White, BBQ, Spicy Marinara
- **11+ Toppings**: Meats, vegetables, and premium cheeses

### Admin Management
- Component management for all pizza options
- Real-time pricing configuration
- Order tracking and management
- User account administration

## 🔄 Development Status

- ✅ **Core Pizza Builder**: Fully functional
- ✅ **Real-time Pricing**: Working
- ✅ **Responsive Design**: Complete
- ✅ **Order Creation**: Mock implementation
- ✅ **Admin Dashboard**: Navigation ready
- 🔄 **Database Integration**: Ready for connection
- 🔄 **Admin CRUD Operations**: Framework ready
- 🔄 **Authentication**: Configured, needs implementation

## 🤝 Contributing

This is a standalone application designed for easy customization and extension. Feel free to:
- Add new pizza components
- Enhance the admin interface
- Integrate payment processing
- Add customer accounts
- Implement real-time order tracking

## 📄 License

This project is a standalone pizza builder application created for demonstration and development purposes.

---

**Pizza Builder Pro** - Build your perfect pizza! 🍕
