/*
  Warnings:

  - You are about to drop the `menu_item_order_customizations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `menu_item_orders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."menu_item_order_customizations" DROP CONSTRAINT "menu_item_order_customizations_customizationOptionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."menu_item_order_customizations" DROP CONSTRAINT "menu_item_order_customizations_menuItemOrderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."menu_item_orders" DROP CONSTRAINT "menu_item_orders_menuItemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."menu_item_orders" DROP CONSTRAINT "menu_item_orders_orderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_pizzaCrustId_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_pizzaSauceId_fkey";

-- DropForeignKey
ALTER TABLE "public"."order_items" DROP CONSTRAINT "order_items_pizzaSizeId_fkey";

-- AlterTable
ALTER TABLE "public"."order_items" ADD COLUMN     "menuItemId" TEXT,
ALTER COLUMN "pizzaSizeId" DROP NOT NULL,
ALTER COLUMN "pizzaCrustId" DROP NOT NULL,
ALTER COLUMN "pizzaSauceId" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."menu_item_order_customizations";

-- DropTable
DROP TABLE "public"."menu_item_orders";

-- CreateTable
CREATE TABLE "public"."order_item_customizations" (
    "id" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "customizationOptionId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "price" DOUBLE PRECISION NOT NULL,
    "pizzaHalf" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "order_item_customizations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_pizzaSizeId_fkey" FOREIGN KEY ("pizzaSizeId") REFERENCES "public"."pizza_sizes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_pizzaCrustId_fkey" FOREIGN KEY ("pizzaCrustId") REFERENCES "public"."pizza_crusts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_pizzaSauceId_fkey" FOREIGN KEY ("pizzaSauceId") REFERENCES "public"."pizza_sauces"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_items" ADD CONSTRAINT "order_items_menuItemId_fkey" FOREIGN KEY ("menuItemId") REFERENCES "public"."menu_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_item_customizations" ADD CONSTRAINT "order_item_customizations_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "public"."order_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."order_item_customizations" ADD CONSTRAINT "order_item_customizations_customizationOptionId_fkey" FOREIGN KEY ("customizationOptionId") REFERENCES "public"."customization_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
