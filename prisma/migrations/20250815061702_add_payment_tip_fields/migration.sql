-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "role" TEXT NOT NULL DEFAULT 'CUSTOMER',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pizza_sizes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "diameter" TEXT NOT NULL,
    "basePrice" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pizza_crusts" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceModifier" REAL NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pizza_sauces" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "spiceLevel" INTEGER NOT NULL DEFAULT 0,
    "priceModifier" REAL NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pizza_toppings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isVegetarian" BOOLEAN NOT NULL DEFAULT false,
    "isVegan" BOOLEAN NOT NULL DEFAULT false,
    "isGlutenFree" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "specialty_pizzas" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "basePrice" REAL NOT NULL,
    "category" TEXT NOT NULL,
    "imageUrl" TEXT,
    "ingredients" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "specialty_pizza_sizes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "specialtyPizzaId" TEXT NOT NULL,
    "pizzaSizeId" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "specialty_pizza_sizes_specialtyPizzaId_fkey" FOREIGN KEY ("specialtyPizzaId") REFERENCES "specialty_pizzas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "specialty_pizza_sizes_pizzaSizeId_fkey" FOREIGN KEY ("pizzaSizeId") REFERENCES "pizza_sizes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderNumber" TEXT NOT NULL,
    "userId" TEXT,
    "customerName" TEXT,
    "customerEmail" TEXT,
    "customerPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "orderType" TEXT NOT NULL DEFAULT 'PICKUP',
    "paymentMethod" TEXT,
    "deliveryAddress" TEXT,
    "deliveryCity" TEXT,
    "deliveryZip" TEXT,
    "deliveryInstructions" TEXT,
    "scheduledTime" DATETIME,
    "subtotal" REAL NOT NULL,
    "deliveryFee" REAL NOT NULL DEFAULT 0,
    "tipAmount" REAL,
    "tipPercentage" REAL,
    "customTipAmount" REAL,
    "tax" REAL NOT NULL,
    "total" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "pizzaSizeId" TEXT NOT NULL,
    "pizzaCrustId" TEXT NOT NULL,
    "pizzaSauceId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "basePrice" REAL NOT NULL,
    "totalPrice" REAL NOT NULL,
    "notes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_items_pizzaSizeId_fkey" FOREIGN KEY ("pizzaSizeId") REFERENCES "pizza_sizes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "order_items_pizzaCrustId_fkey" FOREIGN KEY ("pizzaCrustId") REFERENCES "pizza_crusts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "order_items_pizzaSauceId_fkey" FOREIGN KEY ("pizzaSauceId") REFERENCES "pizza_sauces" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "order_item_toppings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderItemId" TEXT NOT NULL,
    "pizzaToppingId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "section" TEXT NOT NULL DEFAULT 'WHOLE',
    "intensity" TEXT NOT NULL DEFAULT 'REGULAR',
    "price" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "order_item_toppings_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_items" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "order_item_toppings_pizzaToppingId_fkey" FOREIGN KEY ("pizzaToppingId") REFERENCES "pizza_toppings" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "app_settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'STRING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "price_snapshots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "componentType" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "componentName" TEXT NOT NULL,
    "snapshotPrice" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "price_snapshots_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pricing_history" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "componentType" TEXT NOT NULL,
    "componentId" TEXT NOT NULL,
    "componentName" TEXT NOT NULL,
    "oldPrice" REAL,
    "newPrice" REAL NOT NULL,
    "changeReason" TEXT,
    "changedBy" TEXT,
    "changedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pizza_sizes_name_key" ON "pizza_sizes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pizza_crusts_name_key" ON "pizza_crusts"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pizza_sauces_name_key" ON "pizza_sauces"("name");

-- CreateIndex
CREATE UNIQUE INDEX "pizza_toppings_name_key" ON "pizza_toppings"("name");

-- CreateIndex
CREATE UNIQUE INDEX "specialty_pizzas_name_key" ON "specialty_pizzas"("name");

-- CreateIndex
CREATE UNIQUE INDEX "specialty_pizza_sizes_specialtyPizzaId_pizzaSizeId_key" ON "specialty_pizza_sizes"("specialtyPizzaId", "pizzaSizeId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_orderNumber_key" ON "orders"("orderNumber");

-- CreateIndex
CREATE UNIQUE INDEX "order_item_toppings_orderItemId_pizzaToppingId_section_key" ON "order_item_toppings"("orderItemId", "pizzaToppingId", "section");

-- CreateIndex
CREATE UNIQUE INDEX "app_settings_key_key" ON "app_settings"("key");
