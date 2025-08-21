const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function improveAboutPage() {
  try {
    const newContent = `<h1>About RestoApp - Your Trusted Greenland NH Pizza & Fresh Food Experts</h1>

<h2>Our Story: From Passion to Excellence</h2>

<p>RestoApp was born from a simple belief: every family in Greenland, New Hampshire deserves access to exceptional pizza and fresh, healthy food options. What started as a passion project has grown into the Seacoast's most trusted name for quality Italian cuisine and farm-fresh dining.</p>

<p>Founded by local food enthusiasts who were tired of settling for mediocre options, we set out to create something special - a restaurant that combines traditional Italian recipes with the freshest New Hampshire ingredients, all while maintaining the warm, welcoming atmosphere that makes dining out truly memorable.</p>

<h2>Our Commitment to Quality</h2>

<p><strong>Authentic Italian Techniques:</strong> Our pizza makers trained with master chefs to perfect the art of hand-stretched dough and traditional sauce preparation. Every pizza reflects generations of Italian culinary wisdom.</p>

<p><strong>Local Sourcing:</strong> We partner with New Hampshire farms to source the freshest vegetables, herbs, and dairy products. When you taste our salads, you're tasting the best the Seacoast has to offer.</p>

<p><strong>Made Fresh Daily:</strong> No shortcuts, no preservatives, no frozen ingredients. Our dough is made fresh every morning, our sauces are prepared in small batches, and our salads are assembled to order.</p>

<h2>Serving the Seacoast Community</h2>

<p>As a locally-owned business, we're deeply committed to the Greenland, Portsmouth, and greater Seacoast community. We sponsor local youth sports teams, participate in school fundraisers, and support charitable causes that matter to our neighbors.</p>

<p>Our team includes local residents who take pride in serving their community. When you visit RestoApp, you're not just getting a meal - you're supporting local jobs and contributing to the economic vitality of our region.</p>

<h2>What Our Customers Say</h2>

<p><em>"Finally, a pizza place that doesn't cut corners! The quality is outstanding and the staff always remembers our family's preferences."</em> - The Johnson Family, Greenland</p>

<p><em>"RestoApp has become our go-to for office catering. The food is consistently excellent and they always deliver on time."</em> - Portsmouth Business Center</p>

<p><em>"The Mediterranean salad is the best I've had anywhere in New Hampshire. Fresh, flavorful, and the perfect lunch option."</em> - Sarah M., Hampton</p>

<h2>Looking Forward</h2>

<p>We're constantly evolving to better serve our community. Whether it's introducing new seasonal menu items featuring local ingredients, expanding our catering services, or finding new ways to give back to our neighbors, we're always working to exceed your expectations.</p>

<p>Our goal isn't just to be another restaurant - we want to be an integral part of what makes the Seacoast such a special place to live, work, and dine.</p>

<h2>Visit Us Today</h2>

<p>We invite you to experience the RestoApp difference for yourself. Whether you're a longtime resident or new to the area, we're confident you'll taste the care and quality that goes into every dish we serve.</p>

<p><strong>Come see why families throughout Greenland NH choose RestoApp for their favorite meals!</strong></p>`;

    await prisma.dynamicPage.update({
      where: { slug: 'about-us-or-restoapp-greenland-nh-your-local-pizza-experts' },
      data: {
        title: 'About RestoApp | Family-Owned Pizza Restaurant | Greenland NH',
        excerpt: 'Learn about RestoApp, Greenland NH\'s premier family-owned pizza restaurant. Authentic Italian techniques, local ingredients, and community commitment since day one.',
        content: newContent,
        metaTitle: 'About RestoApp Greenland NH | Local Family Restaurant | Our Story',
        metaDescription: 'Discover the story behind Greenland NH\'s favorite pizza restaurant. Family-owned, locally-sourced ingredients, authentic Italian recipes, and community commitment.',
        metaKeywords: 'about RestoApp, Greenland NH restaurant, family owned pizza, local restaurant Portsmouth area, Italian restaurant New Hampshire'
      }
    });
    
    console.log('✅ About Us page upgraded with compelling content!');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

improveAboutPage();
