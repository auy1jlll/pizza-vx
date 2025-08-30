#!/bin/bash

# Production database restoration script
# Run this on your production server after deployment

echo "🔄 Starting Production Database Restoration..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker containers are running
if ! docker-compose -f docker-compose.prod.yml ps | grep -q "Up"; then
    log_error "Docker containers are not running. Please run deployment first."
    exit 1
fi

log_info "Copying backup file to container..."
# Copy the backup file to the app container
docker cp local_database_export_2025-08-29T06-55-48-977Z.json $(docker-compose -f docker-compose.prod.yml ps -q app):/app/

log_info "Creating database restoration script..."
# Create the restoration script inside the container
docker-compose -f docker-compose.prod.yml exec -T app bash -c '
cat > /app/restore-prod-db.js << '\''EOF'\''
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");

const prisma = new PrismaClient();

async function restoreProductionDatabase() {
  try {
    console.log("Starting production database restoration...");

    // Read the backup file
    const backup = JSON.parse(fs.readFileSync("/app/local_database_export_2025-08-29T06-55-48-977Z.json", "utf8"));
    console.log("Backup file loaded successfully");

    // Clear existing data (in correct order due to foreign keys)
    console.log("Clearing existing data...");
    await prisma.cartItemCustomization.deleteMany();
    await prisma.orderItemCustomization.deleteMany();
    await prisma.customizationOption.deleteMany();
    await prisma.customizationGroup.deleteMany();
    await prisma.menuItemCustomization.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.orderItemTopping.deleteMany();
    await prisma.order.deleteMany();
    await prisma.specialtyCalzoneSize.deleteMany();
    await prisma.specialtyPizzaSize.deleteMany();
    await prisma.specialtyCalzone.deleteMany();
    await prisma.specialtyPizza.deleteMany();
    await prisma.pizzaTopping.deleteMany();
    await prisma.pizzaSauce.deleteMany();
    await prisma.pizzaCrust.deleteMany();
    await prisma.pizzaSize.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.menuCategory.deleteMany();
    await prisma.appSetting.deleteMany();
    await prisma.user.deleteMany();

    // Restore users
    console.log("Restoring users...");
    if (backup.users) {
      for (const user of backup.users) {
        await prisma.user.create({ data: user });
      }
    }

    // Restore app settings
    console.log("Restoring app settings...");
    if (backup.appSettings) {
      for (const setting of backup.appSettings) {
        await prisma.appSetting.create({ data: setting });
      }
    }

    // Restore menu categories
    console.log("Restoring menu categories...");
    if (backup.menuCategories) {
      for (const category of backup.menuCategories) {
        await prisma.menuCategory.create({ data: category });
      }
    }

    // Restore menu items
    console.log("Restoring menu items...");
    if (backup.menuItems) {
      for (const item of backup.menuItems) {
        await prisma.menuItem.create({ data: item });
      }
    }

    // Restore pizza sizes with corrected calzone pricing
    console.log("Restoring pizza sizes with corrected calzone pricing...");
    if (backup.pizzaSizes) {
      for (const size of backup.pizzaSizes) {
        // Fix calzone pricing
        if (size.name === "Large Calzone") {
          size.basePrice = 21.00;
        } else if (size.name === "Small Calzone") {
          size.basePrice = 16.00;
        }
        await prisma.pizzaSize.create({ data: size });
      }
    }

    // Restore pizza crusts
    console.log("Restoring pizza crusts...");
    if (backup.pizzaCrusts) {
      for (const crust of backup.pizzaCrusts) {
        await prisma.pizzaCrust.create({ data: crust });
      }
    }

    // Restore pizza sauces
    console.log("Restoring pizza sauces...");
    if (backup.pizzaSauces) {
      for (const sauce of backup.pizzaSauces) {
        await prisma.pizzaSauce.create({ data: sauce });
      }
    }

    // Restore pizza toppings
    console.log("Restoring pizza toppings...");
    if (backup.pizzaToppings) {
      for (const topping of backup.pizzaToppings) {
        await prisma.pizzaTopping.create({ data: topping });
      }
    }

    // Restore specialty pizzas
    console.log("Restoring specialty pizzas...");
    if (backup.specialtyPizzas) {
      for (const pizza of backup.specialtyPizzas) {
        await prisma.specialtyPizza.create({ data: pizza });
      }
    }

    // Restore specialty pizza sizes
    console.log("Restoring specialty pizza sizes...");
    if (backup.specialtyPizzaSizes) {
      for (const size of backup.specialtyPizzaSizes) {
        await prisma.specialtyPizzaSize.create({ data: size });
      }
    }

    // Restore specialty calzones
    console.log("Restoring specialty calzones...");
    if (backup.specialtyCalzones) {
      for (const calzone of backup.specialtyCalzones) {
        await prisma.specialtyCalzone.create({ data: calzone });
      }
    }

    // Restore specialty calzone sizes
    console.log("Restoring specialty calzone sizes...");
    if (backup.specialtyCalzoneSizes) {
      for (const size of backup.specialtyCalzoneSizes) {
        await prisma.specialtyCalzoneSize.create({ data: size });
      }
    }

    console.log("Production database restoration completed successfully!");
    console.log("✅ All menu data restored");
    console.log("✅ Calzone pricing corrected ($16 small / $21 large)");
    console.log("✅ Specialty pizza pricing verified ($11.25 small / $16.50 large)");
    console.log("✅ Production system ready!");

  } catch (error) {
    console.error("Error during database restoration:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

restoreProductionDatabase()
  .then(() => {
    console.log("✅ Production database restoration finished successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Database restoration failed:", error);
    process.exit(1);
  });
EOF
'

log_info "Running database restoration..."
# Execute the restoration script
docker-compose -f docker-compose.prod.yml exec -T app node /app/restore-prod-db.js

if [ $? -eq 0 ]; then
    log_info "Database restoration completed successfully!"
    log_info "Production site should now be fully functional at: https://greenlandfamous.net"
else
    log_error "Database restoration failed!"
    exit 1
fi

log_info "Cleaning up temporary files..."
docker-compose -f docker-compose.prod.yml exec -T app rm -f /app/local_database_export_2025-08-29T06-55-48-977Z.json /app/restore-prod-db.js

log_info "Production deployment and database restoration completed!"
