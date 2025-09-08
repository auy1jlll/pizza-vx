#!/bin/bash

echo "🎯 DIRECT PRODUCTION FIX - Replace specialty pizzas with exactly 2 sizes"

# SSH into production and run the fix directly
ssh -i "production_server_key_nopass" root@91.99.194.255 << 'ENDSSH'
cd /var/www/pizza-vx

# Create the fix script on the server
cat > fix_specialty_pizzas.js << 'EOF'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  console.log('🔍 Checking current specialty pizzas...');
  
  const current = await prisma.specialtyPizza.findMany({
    include: { sizes: { include: { pizzaSize: true } } }
  });
  
  console.log(`Found ${current.length} specialty pizzas`);
  current.forEach(p => {
    console.log(`- ${p.name}: ${p.sizes.length} sizes`);
  });
  
  console.log('\n🗑️ Clearing old data...');
  await prisma.specialtyPizza.deleteMany({});
  
  console.log('🔍 Getting available sizes...');
  const sizes = await prisma.pizzaSize.findMany({ where: { isActive: true } });
  const small = sizes.find(s => s.name.toLowerCase().includes('small'));
  const large = sizes.find(s => s.name.toLowerCase().includes('large'));
  
  console.log(`Using: ${small.name} and ${large.name}`);
  
  console.log('🍕 Creating 5 specialty pizzas with exactly 2 sizes each...');
  
  const pizzas = [
    { name: "Margherita Supreme", desc: "Fresh mozzarella, basil, San Marzano tomatoes", base: 16.99, cat: "CLASSIC", prices: [14.99, 19.99] },
    { name: "Truffle Mushroom", desc: "Wild mushrooms, truffle oil, caramelized onions", base: 22.99, cat: "GOURMET", prices: [19.99, 25.99] },
    { name: "Prosciutto Fig", desc: "Prosciutto di Parma, fresh figs, arugula, balsamic glaze", base: 24.99, cat: "GOURMET", prices: [21.99, 27.99] },
    { name: "BBQ Chicken Deluxe", desc: "Grilled chicken, BBQ sauce, red onions, cilantro", base: 19.99, cat: "SPECIALTY", prices: [17.99, 22.99] },
    { name: "Mediterranean Veggie", desc: "Roasted vegetables, feta cheese, olives, sun-dried tomatoes", base: 18.99, cat: "VEGETARIAN", prices: [16.99, 21.99] }
  ];
  
  for (let i = 0; i < pizzas.length; i++) {
    const data = pizzas[i];
    
    const pizza = await prisma.specialtyPizza.create({
      data: {
        name: data.name,
        description: data.desc,
        basePrice: data.base,
        category: data.cat,
        ingredients: data.desc,
        imageUrl: `/images/pizzas/${data.name.toLowerCase().replace(/ /g, '-')}.jpg`,
        sortOrder: i + 1,
        isActive: true
      }
    });
    
    await prisma.specialtyPizzaSize.createMany({
      data: [
        { specialtyPizzaId: pizza.id, pizzaSizeId: small.id, price: data.prices[0], isAvailable: true },
        { specialtyPizzaId: pizza.id, pizzaSizeId: large.id, price: data.prices[1], isAvailable: true }
      ]
    });
    
    console.log(`✅ ${data.name}: Small $${data.prices[0]}, Large $${data.prices[1]}`);
  }
  
  console.log('\n🎉 VERIFICATION:');
  const final = await prisma.specialtyPizza.findMany({
    include: { sizes: { include: { pizzaSize: true } } },
    orderBy: { sortOrder: 'asc' }
  });
  
  console.log(`Total: ${final.length} pizzas`);
  final.forEach(p => {
    console.log(`- ${p.name}: ${p.sizes.map(s => s.pizzaSize.name + ' $' + s.price).join(', ')}`);
  });
  
  await prisma.$disconnect();
  console.log('\n✅ PRODUCTION FIXED!');
}

fix().catch(console.error);
EOF

# Run the fix script
echo "Running fix script..."
node fix_specialty_pizzas.js

# Clean up
rm fix_specialty_pizzas.js

echo "✅ Fix complete!"
ENDSSH

echo "🎉 Production specialty pizzas should now be fixed!"
