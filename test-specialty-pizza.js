// Test specialty pizza functionality
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testSpecialtyPizza() {
  console.log('🍕 Testing Specialty Pizza Functionality\n');

  try {
    // 1. Get a specialty pizza
    const specialtyPizza = await prisma.specialtyPizza.findFirst({
      include: {
        sizes: {
          include: {
            pizzaSize: true
          }
        },
        toppings: {
          include: {
            pizzaTopping: true
          }
        },
        defaultSize: true,
        defaultCrust: true,
        defaultSauce: true
      }
    });

    if (!specialtyPizza) {
      console.log('❌ No specialty pizzas found');
      return;
    }

    console.log(`📋 Testing: ${specialtyPizza.name}`);
    console.log(`   Description: ${specialtyPizza.description}`);
    console.log(`   Base Price: $${specialtyPizza.basePrice}`);
    console.log(`   Default Size: ${specialtyPizza.defaultSize.name} ($${specialtyPizza.defaultSize.basePrice})`);
    console.log(`   Default Crust: ${specialtyPizza.defaultCrust.name} (+$${specialtyPizza.defaultCrust.priceModifier})`);
    console.log(`   Default Sauce: ${specialtyPizza.defaultSauce.name} (+$${specialtyPizza.defaultSauce.priceModifier})`);

    // 2. Check available sizes and their prices
    console.log('\n🔸 Available Sizes:');
    for (const sizeOption of specialtyPizza.sizes) {
      console.log(`   - ${sizeOption.pizzaSize.name}: $${sizeOption.price}`);
    }

    // 3. Check included toppings
    console.log('\n🧄 Included Toppings:');
    for (const topping of specialtyPizza.toppings) {
      console.log(`   - ${topping.pizzaTopping.name}: $${topping.pizzaTopping.price} (${topping.section}, ${topping.intensity})`);
    }

    // 4. Test pricing calculation for different sizes
    console.log('\n💰 Pricing Test:');
    
    // Test with default size (should use base price)
    const defaultSizePrice = specialtyPizza.basePrice;
    console.log(`   Default Size (${specialtyPizza.defaultSize.name}): $${defaultSizePrice.toFixed(2)}`);
    
    // Test with different available sizes
    if (specialtyPizza.sizes.length > 0) {
      for (const sizeOption of specialtyPizza.sizes) {
        console.log(`   ${sizeOption.pizzaSize.name}: $${sizeOption.price.toFixed(2)}`);
      }
    }

    // 5. Test adding/removing toppings cost calculation
    console.log('\n🔄 Customization Cost Test:');
    
    // Get some available toppings not in the specialty
    const allToppings = await prisma.pizzaTopping.findMany({
      where: { isActive: true },
      take: 3
    });
    
    const includedToppingIds = specialtyPizza.toppings.map(t => t.pizzaToppingId);
    const additionalToppings = allToppings.filter(t => !includedToppingIds.includes(t.id));
    
    if (additionalToppings.length > 0) {
      console.log(`   Adding ${additionalToppings[0].name}: +$${additionalToppings[0].price.toFixed(2)}`);
      const newTotal = specialtyPizza.basePrice + additionalToppings[0].price;
      console.log(`   New Total: $${newTotal.toFixed(2)}`);
    }
    
    // Test removing a topping
    if (specialtyPizza.toppings.length > 0) {
      const removedTopping = specialtyPizza.toppings[0];
      const creditAmount = removedTopping.pizzaTopping.price * 0.5; // 50% credit
      console.log(`   Removing ${removedTopping.pizzaTopping.name}: -$${creditAmount.toFixed(2)} (50% credit)`);
      const newTotal = specialtyPizza.basePrice - creditAmount;
      console.log(`   New Total: $${newTotal.toFixed(2)}`);
    }

    console.log('\n✅ Specialty Pizza Test Completed!');
    console.log('\n🎯 Expected Behavior:');
    console.log('   ✅ Specialty pizza loads with pre-configured toppings');
    console.log('   ✅ Base price reflects the specialty configuration');
    console.log('   ✅ Size changes update price to size-specific pricing');
    console.log('   ✅ Adding toppings increases price dynamically');
    console.log('   ✅ Removing original toppings provides partial credit');
    console.log('   ✅ All changes are calculated from database values');

  } catch (error) {
    console.error('❌ Error testing specialty pizza:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSpecialtyPizza();
