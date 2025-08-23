const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('🚀 Creating promotions table...');
    
    // Create the promotions table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "promotions" (
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
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT "promotions_pkey" PRIMARY KEY ("id")
      )
    `;

    // Create indexes
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotions_type_idx" ON "promotions"("type")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotions_isActive_idx" ON "promotions"("isActive")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotions_startDate_endDate_idx" ON "promotions"("startDate", "endDate")`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "promotions_priority_idx" ON "promotions"("priority")`;

    console.log('✅ Promotions table created successfully!');

    // Insert sample promotions
    const samplePromotions = [
      {
        id: 'sample-bogo-50',
        name: 'Buy One Get Second 50% Off',
        description: 'Buy any pizza and get the second pizza at 50% off',
        type: 'BOGO_HALF_OFF',
        discountType: 'PERCENTAGE',
        discountValue: 50,
        applicableCategories: ['pizza'],
        requiresLogin: false,
        isActive: true,
        priority: 1,
        terms: 'Valid on regular menu price pizzas. Cannot be combined with other offers.'
      },
      {
        id: 'sample-weekend-20',
        name: 'Weekend Special 20% Off',
        description: 'Get 20% off your entire order on weekends',
        type: 'PERCENTAGE_DISCOUNT',
        discountType: 'PERCENTAGE',
        discountValue: 20,
        minimumOrderAmount: 25,
        maximumDiscountAmount: 15,
        applicableCategories: [],
        requiresLogin: false,
        isActive: true,
        priority: 2,
        terms: 'Valid on Saturdays and Sundays only. Minimum order $25.'
      },
      {
        id: 'sample-vip-delivery',
        name: 'VIP Free Delivery',
        description: 'Free delivery for VIP customers',
        type: 'FREE_DELIVERY',
        discountType: 'FIXED_AMOUNT',
        discountValue: 3.99,
        minimumOrderAmount: 15,
        applicableCategories: [],
        requiresLogin: true,
        userGroupRestrictions: ['VIP'],
        isActive: true,
        priority: 3,
        terms: 'Available to VIP customers only. Minimum order $15.'
      }
    ];

    for (const promotion of samplePromotions) {
      await prisma.$executeRaw`
        INSERT INTO "promotions" (
          "id", "name", "description", "type", "discountType", "discountValue",
          "minimumOrderAmount", "maximumDiscountAmount", "applicableCategories",
          "requiresLogin", "userGroupRestrictions", "isActive", "priority", "terms",
          "createdAt", "updatedAt", "usageCount", "stackable"
        ) VALUES (
          ${promotion.id}, ${promotion.name}, ${promotion.description}, ${promotion.type},
          ${promotion.discountType}, ${promotion.discountValue}, ${promotion.minimumOrderAmount || null},
          ${promotion.maximumDiscountAmount || null}, ${promotion.applicableCategories}::text[],
          ${promotion.requiresLogin}, ${promotion.userGroupRestrictions || []}::text[],
          ${promotion.isActive}, ${promotion.priority}, ${promotion.terms},
          CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0, false
        ) ON CONFLICT ("id") DO NOTHING
      `;
    }

    console.log('✅ Sample promotions inserted!');
    console.log('🎉 Promotion system setup complete!');

  } catch (error) {
    console.error('❌ Error setting up promotions:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();
