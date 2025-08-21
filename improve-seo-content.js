const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function improveMainPage() {
  try {
    const newContent = `<h1>Welcome to RestoApp - Greenland NH's Premier Pizza & Fresh Food Destination</h1>

<h2>Authentic Italian Flavors Meet Fresh Local Ingredients</h2>

<p>Discover why families throughout Greenland, Portsmouth, and the Seacoast region choose RestoApp for their dining experience. Our commitment to quality, freshness, and exceptional service has made us the go-to destination for pizza lovers who refuse to compromise on taste.</p>

<h2>What Makes RestoApp Special</h2>

<p><strong>Hand-Crafted Artisan Pizzas:</strong> Every pizza starts with our signature dough, made fresh daily using traditional Italian techniques. We use only the finest imported San Marzano tomatoes, premium mozzarella, and locally-sourced toppings whenever possible.</p>

<p><strong>Farm-Fresh Salads & Healthy Options:</strong> Our crisp, vibrant salads feature organic greens from local New Hampshire farms. From our popular Mediterranean Bowl to our signature Seacoast Harvest Salad, we prove that healthy can be absolutely delicious.</p>

<p><strong>Family-Owned Excellence:</strong> As a locally-owned restaurant, we treat every customer like family. Our team takes pride in creating memorable dining experiences that keep our community coming back.</p>

<h2>Convenient Location & Fast Service</h2>

<p>Perfectly located to serve Greenland, Portsmouth, Hampton, Exeter, and surrounding Seacoast communities. Whether you're dining in, taking out, or need delivery, we make it easy to enjoy exceptional food on your schedule.</p>

<p><strong>Quick Service:</strong> Most orders ready in 15-20 minutes</p>
<p><strong>Fresh Delivery:</strong> Hot food delivered to your door</p>
<p><strong>Catering Available:</strong> Perfect for events, offices, and special occasions</p>

<h2>Customer Favorites</h2>

<p><strong>Signature Margherita:</strong> Fresh basil, premium mozzarella, and our house-made sauce on hand-stretched dough</p>
<p><strong>Seacoast Supreme:</strong> Loaded with pepperoni, sausage, peppers, mushrooms, and onions</p>
<p><strong>Mediterranean Salad:</strong> Mixed greens, olives, feta, cucumber, and house-made vinaigrette</p>
<p><strong>Build Your Own:</strong> Unlimited creativity with our extensive selection of fresh toppings</p>

<h2>Why Choose RestoApp Over Other Options?</h2>

<p>While other restaurants may cut corners, we believe your family deserves better. That's why we:</p>

<p>✓ Use only premium, fresh ingredients - never frozen<br>
✓ Make our dough and sauces from scratch daily<br>
✓ Support local farms and suppliers<br>
✓ Maintain the highest food safety standards<br>
✓ Offer competitive prices without sacrificing quality<br>
✓ Provide friendly, reliable service every time</p>

<h2>Join the RestoApp Family Today</h2>

<p>Ready to taste the difference that quality and care make? Visit us today or order online for pickup or delivery. Once you experience RestoApp, you'll understand why we're quickly becoming Greenland NH's favorite pizza destination.</p>

<p><strong>Order now and taste the RestoApp difference!</strong></p>`;

    await prisma.dynamicPage.update({
      where: { slug: 'best-pizza-and-fresh-salads-in-greenland-nh-or-restoapp' },
      data: {
        title: 'RestoApp Greenland NH | Premium Pizza & Fresh Salads | Better Than The Rest',
        excerpt: 'Discover why Greenland NH families choose RestoApp for authentic Italian pizza, farm-fresh salads, and exceptional service. Locally owned, premium ingredients, fast delivery.',
        content: newContent,
        metaTitle: 'Best Pizza Greenland NH | RestoApp | Fresh Ingredients & Fast Delivery',
        metaDescription: 'Greenland NH\'s premier pizza restaurant featuring hand-crafted Italian pizzas, farm-fresh salads, and fast delivery. Family-owned with premium ingredients. Order online now!',
        metaKeywords: 'pizza Greenland NH, best pizza Portsmouth area, fresh salads Greenland, Italian restaurant NH, pizza delivery Greenland, family restaurant Seacoast'
      }
    });
    
    console.log('✅ Main landing page upgraded with professional content!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

improveMainPage();
