const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function improveMenuPage() {
  try {
    const newContent = `<h1>RestoApp Menu & Prices - Greenland NH's Best Value for Premium Quality</h1>

<h2>Artisan Pizzas - Made Fresh to Order</h2>

<p><strong>Our Signature Pizzas</strong></p>

<p><strong>Margherita Classic</strong> - $16.99 (Large)<br>
Fresh mozzarella, San Marzano tomato sauce, fresh basil, extra virgin olive oil<br>
<em>Our most popular pizza - simple perfection</em></p>

<p><strong>Seacoast Supreme</strong> - $21.99 (Large)<br>
Pepperoni, Italian sausage, bell peppers, red onions, mushrooms, black olives<br>
<em>Loaded with flavor and fresh toppings</em></p>

<p><strong>White Mountain Special</strong> - $19.99 (Large)<br>
Grilled chicken, ricotta, mozzarella, spinach, garlic, herb oil<br>
<em>A New Hampshire favorite with local inspiration</em></p>

<p><strong>Meat Lovers Paradise</strong> - $23.99 (Large)<br>
Pepperoni, sausage, ground beef, ham, bacon<br>
<em>For those who want it all</em></p>

<p><strong>Mediterranean Garden</strong> - $20.99 (Large)<br>
Feta cheese, olives, tomatoes, red onions, spinach, olive oil<br>
<em>Fresh and healthy without sacrificing taste</em></p>

<h2>Build Your Own Pizza</h2>

<p><strong>Small (10")</strong> - $11.99 base + toppings<br>
<strong>Medium (12")</strong> - $13.99 base + toppings<br>
<strong>Large (16")</strong> - $15.99 base + toppings<br>
<strong>Extra Large (18")</strong> - $17.99 base + toppings</p>

<p><strong>Premium Toppings ($2.50 each):</strong> Pepperoni, Italian Sausage, Grilled Chicken, Bacon, Ham<br>
<strong>Fresh Toppings ($1.99 each):</strong> Mushrooms, Bell Peppers, Red Onions, Black Olives, Tomatoes, Spinach<br>
<strong>Specialty Cheeses ($2.99 each):</strong> Fresh Mozzarella, Feta, Ricotta, Parmesan</p>

<h2>Farm-Fresh Salads</h2>

<p><strong>Seacoast Harvest Salad</strong> - $12.99<br>
Mixed greens, cherry tomatoes, cucumber, red onion, carrots, house vinaigrette<br>
<em>Add grilled chicken +$4.99</em></p>

<p><strong>Mediterranean Bowl</strong> - $14.99<br>
Romaine, feta, olives, tomatoes, cucumber, red onion, olive oil dressing<br>
<em>Our signature healthy option</em></p>

<p><strong>Caesar Supreme</strong> - $13.99<br>
Fresh romaine, parmesan, croutons, house-made Caesar dressing<br>
<em>Add grilled chicken +$4.99</em></p>

<p><strong>Italian Antipasto</strong> - $16.99<br>
Mixed greens, salami, pepperoni, mozzarella, olives, peppers, Italian dressing<br>
<em>A complete meal in a salad</em></p>

<h2>Appetizers & Sides</h2>

<p><strong>Garlic Bread</strong> - $6.99<br>
<strong>Mozzarella Sticks</strong> - $8.99<br>
<strong>Buffalo Wings (10 pc)</strong> - $12.99<br>
<strong>Breadsticks with Marinara</strong> - $7.99<br>
<strong>Antipasto Platter</strong> - $14.99</p>

<h2>Beverages</h2>

<p><strong>Soft Drinks</strong> - $2.99<br>
<strong>Fresh Iced Tea</strong> - $2.99<br>
<strong>Coffee</strong> - $2.49<br>
<strong>Bottled Water</strong> - $1.99</p>

<h2>Why Our Prices Offer Exceptional Value</h2>

<p><strong>Premium Ingredients:</strong> While our prices are competitive, we never compromise on quality. Our ingredients cost more because they're fresher, more flavorful, and locally-sourced when possible.</p>

<p><strong>Generous Portions:</strong> Our large pizzas are truly large (16"), and our salads are meal-sized. You get more food for your money.</p>

<p><strong>No Hidden Fees:</strong> Our prices include everything except delivery fee ($2.99) and optional tip. No surprise charges.</p>

<p><strong>Family Deals Available:</strong> Ask about our family meal combos and catering packages for even better value.</p>

<h2>Ordering Options</h2>

<p><strong>Online Ordering:</strong> Quick and easy through our website<br>
<strong>Phone Orders:</strong> Call us directly for personalized service<br>
<strong>Walk-In:</strong> Always welcome for pickup orders<br>
<strong>Delivery:</strong> Fast delivery throughout Greenland, Portsmouth, and surrounding areas</p>

<p><strong>Ready to order? Contact us today and taste the difference quality makes!</strong></p>`;

    await prisma.dynamicPage.update({
      where: { slug: 'menu-and-prices-or-best-pizza-restaurant-greenland-nh' },
      data: {
        title: 'Menu & Prices | RestoApp Greenland NH | Fresh Pizza & Salads',
        excerpt: 'View our complete menu featuring artisan pizzas, farm-fresh salads, and appetizers. Competitive prices with premium quality ingredients. Order online or call now!',
        content: newContent,
        metaTitle: 'Pizza Menu & Prices Greenland NH | RestoApp | Order Online',
        metaDescription: 'RestoApp Greenland NH menu featuring artisan pizzas from $15.99, fresh salads, appetizers. Premium ingredients, generous portions, competitive prices. Order now!',
        metaKeywords: 'pizza menu Greenland NH, pizza prices Portsmouth, pizza delivery menu, Italian restaurant menu, fresh salad menu New Hampshire'
      }
    });
    
    console.log('✅ Menu & Prices page upgraded with detailed offerings!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

improveMenuPage();
