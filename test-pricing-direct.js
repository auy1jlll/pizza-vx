// Direct test of pricing functions without HTTP requests
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDirectPricing() {
  console.log('🧪 Testing Direct Pricing Functions\n');

  try {
    // 1. Test menu item pricing
    console.log('1️⃣ Testing Menu Item Pricing...');
    const menuItems = await prisma.menuItem.findMany({
      include: { category: true },
      take: 3
    });

    if (menuItems.length > 0) {
      console.log(`Found ${menuItems.length} menu items:`);
      for (const item of menuItems) {
        console.log(`   - ${item.name}: $${item.basePrice} (${item.category.name})`);
      }

      // Test pricing function directly
      const { calculateMenuItemPrice } = require('./src/lib/cart-pricing.ts');
      
      console.log('\n🔄 Testing price calculation for menu items:');
      for (const item of menuItems.slice(0, 2)) {
        // Test with item object (name-based lookup)
        const mockMenuItem = {
          id: 'test-' + item.id,
          name: item.name,
          price: item.basePrice + 1.00 // simulate outdated stored price
        };
        
        const currentPrice = await calculateMenuItemPrice(mockMenuItem, []);
        console.log(`   ${item.name}:`);
        console.log(`     Database Price: $${item.basePrice.toFixed(2)}`);
        console.log(`     Simulated Stored Price: $${mockMenuItem.price.toFixed(2)}`);
        console.log(`     🏷️  Calculated Current Price: $${currentPrice.toFixed(2)}`);
        
        if (currentPrice === item.basePrice) {
          console.log(`     ✅ Correctly fetched database price`);
        } else {
          console.log(`     ⚠️  Price mismatch - using fallback?`);
        }
      }
    } else {
      console.log('   No menu items found in database');
    }

    // 2. Test pizza pricing
    console.log('\n2️⃣ Testing Pizza Component Pricing...');
    const [sizes, crusts, sauces, toppings] = await Promise.all([
      prisma.pizzaSize.findMany({ take: 2 }),
      prisma.pizzaCrust.findMany({ take: 2 }),
      prisma.pizzaSauce.findMany({ take: 2 }),
      prisma.pizzaTopping.findMany({ take: 3 })
    ]);

    if (sizes.length > 0 && crusts.length > 0 && sauces.length > 0 && toppings.length > 0) {
      console.log('Pizza Components:');
      console.log(`   Sizes: ${sizes.map(s => `${s.name} ($${s.basePrice})`).join(', ')}`);
      console.log(`   Crusts: ${crusts.map(c => `${c.name} (+$${c.priceModifier})`).join(', ')}`);
      console.log(`   Sauces: ${sauces.map(s => `${s.name} (+$${s.priceModifier})`).join(', ')}`);
      console.log(`   Toppings: ${toppings.map(t => `${t.name} ($${t.price})`).join(', ')}`);

      // Test pizza pricing
      const { calculatePizzaPrice } = require('./src/lib/cart-pricing.ts');
      
      const mockPizza = {
        id: 'test-pizza-1',
        size: { id: sizes[0].id, name: sizes[0].name },
        crust: { id: crusts[0].id, name: crusts[0].name },
        sauce: { id: sauces[0].id, name: sauces[0].name },
        toppings: toppings.slice(0, 2).map(t => ({ id: t.id, name: t.name, quantity: 1 }))
      };

      console.log('\n🔄 Testing pizza price calculation:');
      console.log(`   Pizza Configuration:`);
      console.log(`     Size: ${mockPizza.size.name}`);
      console.log(`     Crust: ${mockPizza.crust.name}`);
      console.log(`     Sauce: ${mockPizza.sauce.name}`);
      console.log(`     Toppings: ${mockPizza.toppings.map(t => t.name).join(', ')}`);

      const pizzaPrice = await calculatePizzaPrice(mockPizza);
      console.log(`   🏷️  Calculated Price:`);
      console.log(`     Base: $${pizzaPrice.basePrice.toFixed(2)}`);
      console.log(`     Toppings: $${pizzaPrice.toppingsPrice.toFixed(2)}`);
      console.log(`     Total: $${pizzaPrice.totalPrice.toFixed(2)}`);

      // Verify calculation
      const expectedBase = sizes[0].basePrice + crusts[0].priceModifier + sauces[0].priceModifier;
      const expectedToppings = toppings.slice(0, 2).reduce((sum, t) => sum + t.price, 0);
      const expectedTotal = expectedBase + expectedToppings;

      console.log(`   📊 Manual Calculation Check:`);
      console.log(`     Expected Base: $${expectedBase.toFixed(2)}`);
      console.log(`     Expected Toppings: $${expectedToppings.toFixed(2)}`);
      console.log(`     Expected Total: $${expectedTotal.toFixed(2)}`);
      
      if (Math.abs(pizzaPrice.totalPrice - expectedTotal) < 0.01) {
        console.log(`     ✅ Pizza pricing calculation is correct!`);
      } else {
        console.log(`     ⚠️  Pizza pricing mismatch`);
      }
    } else {
      console.log('   Missing pizza components in database');
    }

    console.log('\n✅ Direct pricing test completed!');

  } catch (error) {
    console.error('❌ Error testing pricing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDirectPricing();
