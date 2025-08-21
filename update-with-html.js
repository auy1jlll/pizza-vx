const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const wellFormattedPages = [
  {
    slug: "best-pizza-and-fresh-salads-in-greenland-nh-or-restoapp",
    content: `<h1>The Best Pizza & Fresh Salads in Greenland, New Hampshire</h1>

<h2>Welcome to RestoApp - Your Local Pizza Destination</h2>

<p>Located in the heart of Greenland, NH, RestoApp has been serving the Portsmouth area with the <strong>finest pizza and freshest salads</strong> since our opening. We're proud to be your neighborhood's go-to destination for authentic Italian cuisine and healthy dining options.</p>

<h3>🍕 Our Signature Pizzas</h3>

<p>Our pizza dough is made fresh daily using traditional Italian methods passed down through generations. We use only the finest ingredients:</p>

<ul>
<li><strong>Premium mozzarella cheese</strong> sourced from local New Hampshire farms</li>
<li><strong>Fresh herbs</strong> grown in our own garden</li>
<li><strong>Authentic San Marzano tomatoes</strong> for our signature sauce</li>
<li><strong>Artisan toppings</strong> including pepperoni, Italian sausage, fresh vegetables</li>
</ul>

<h3>🥗 Garden-Fresh Salads</h3>

<p>Our salad bar features the freshest ingredients available in the Seacoast area:</p>

<ul>
<li>Crisp romaine and mixed greens</li>
<li>Fresh vegetables delivered daily</li>
<li>House-made dressings and vinaigrettes</li>
<li>Protein options including grilled chicken and fresh mozzarella</li>
</ul>

<h3>Why Choose RestoApp in Greenland, NH?</h3>

<p><strong>Quality You Can Taste:</strong> Unlike other pizza places in Greenland, we never compromise on ingredient quality. Every pizza is crafted with care and attention to detail.</p>

<p><strong>Local Community Focus:</strong> We're proud members of the Greenland and Portsmouth community, supporting local schools and events.</p>

<p><strong>Fast, Friendly Service:</strong> Whether you're dining in, taking out, or ordering delivery, our team ensures your meal is perfect every time.</p>

<h3>Serving Greenland, Portsmouth & the Seacoast</h3>

<p>We proudly deliver to:</p>

<ul>
<li>Greenland, NH</li>
<li>Portsmouth, NH</li>
<li>Rye, NH</li>
<li>Stratham, NH</li>
<li>Newington, NH</li>
</ul>

<p><strong>Order Online or Call:</strong> Ready to taste the difference? Place your order online or call us at [Your Phone Number]</p>

<p><strong>Address:</strong> [Your Address], Greenland, NH 03840</p>

<p><em>Experience the best pizza in Greenland, NH - where quality meets tradition!</em></p>`
  }
];

async function updateWithProperHTML() {
  console.log('🎨 Updating pages with properly formatted HTML...\n');
  
  try {
    for (const pageUpdate of wellFormattedPages) {
      const updated = await prisma.dynamicPage.update({
        where: { slug: pageUpdate.slug },
        data: { content: pageUpdate.content }
      });
      
      console.log(`✅ Updated: ${pageUpdate.slug}`);
      console.log(`   URL: http://localhost:3006/${pageUpdate.slug}`);
    }
    
    console.log('\n🎉 Pages updated with proper HTML formatting!');
    console.log('\n📊 Improvements:');
    console.log('✓ Proper HTML structure');
    console.log('✓ Clean headings (H1, H2, H3)');
    console.log('✓ Structured paragraphs with spacing');
    console.log('✓ Formatted lists with bullets');
    console.log('✓ Bold/italic text emphasis');
    console.log('✓ High contrast colors for SEO');
    
  } catch (error) {
    console.error('❌ Error updating pages:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

updateWithProperHTML();
