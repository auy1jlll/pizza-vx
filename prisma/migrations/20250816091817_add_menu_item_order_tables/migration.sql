-- CreateTable
CREATE TABLE "public"."menu_item_orders" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "menuItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "totalPrice" DOUBLE PRECISION NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "menu_item_orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."menu_item_order_customizations" (
    "id" TEXT NOT NULL,
    "menuItemOrderId" TEXT NOT NULL,
    "customizationOptionId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "menu_item_order_customizations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."menu_item_orders" ADD CONSTRAINT "menu_item_orders_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_item_orders" ADD CONSTRAINT "menu_item_orders_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "public"."menu_items"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_item_order_customizations" ADD CONSTRAINT "menu_item_order_customizations_menuItemOrderId_fkey" FOREIGN KEY ("menuItemOrderId") REFERENCES "public"."menu_item_orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."menu_item_order_customizations" ADD CONSTRAINT "menu_item_order_customizations_customizationOptionId_fkey" FOREIGN KEY ("customizationOptionId") REFERENCES "public"."customization_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
