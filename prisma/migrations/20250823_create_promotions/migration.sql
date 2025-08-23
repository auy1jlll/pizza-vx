-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "discountType" TEXT NOT NULL,
    "discountValue" DECIMAL(10,2) NOT NULL,
    "minimumOrderAmount" DECIMAL(10,2),
    "maximumDiscountAmount" DECIMAL(10,2),
    "minimumQuantity" INTEGER,
    "applicableCategories" TEXT[],
    "applicableItems" TEXT[],
    "requiresLogin" BOOLEAN NOT NULL DEFAULT false,
    "userGroupRestrictions" TEXT[],
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "usageLimit" INTEGER,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "perUserLimit" INTEGER,
    "stackable" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "terms" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Promotion_type_idx" ON "Promotion"("type");
CREATE INDEX "Promotion_isActive_idx" ON "Promotion"("isActive");
CREATE INDEX "Promotion_startDate_endDate_idx" ON "Promotion"("startDate", "endDate");
CREATE INDEX "Promotion_priority_idx" ON "Promotion"("priority");
