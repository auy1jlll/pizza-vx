const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function improveDeliveryPageFormatting() {
  try {
    const newContent = `<h1>Fast Pizza Delivery in Greenland NH & Seacoast Area</h1>

<p>Craving delicious pizza but don't want to leave home? RestoApp delivers fresh, hot pizza and crisp salads right to your door throughout Greenland, Portsmouth, and the entire Seacoast region.</p>

<h2>Delivery Areas We Serve</h2>

<p>We're proud to bring authentic Italian flavors directly to families and businesses across the Seacoast:</p>

<h3>Primary Delivery Zone (Free Delivery)</h3>
<p><strong>Greenland, NH</strong> - Our home base where it all started</p>
<p><strong>Portsmouth, NH</strong> - Serving the historic downtown and surrounding neighborhoods</p>
<p><strong>Newington, NH</strong> - Quick delivery to our neighbors</p>
<p><strong>Stratham, NH</strong> - Fresh pizza to your family table</p>

<h3>Extended Delivery Area ($2.99 Delivery Fee)</h3>
<p><strong>Hampton, NH</strong> - Beach town favorite for summer and year-round</p>
<p><strong>Exeter, NH</strong> - College town delivery for students and families</p>
<p><strong>Rye, NH</strong> - Coastal community service</p>
<p><strong>North Hampton, NH</strong> - Reliable delivery you can count on</p>

<h2>Why Choose RestoApp Delivery?</h2>

<h3>Lightning-Fast Service</h3>
<p>Most deliveries arrive within <strong>25-35 minutes</strong> of placing your order. We know you're hungry, and we don't keep you waiting!</p>

<h3>Always Fresh & Hot</h3>
<p>Our insulated delivery bags and efficient routing ensure your pizza arrives hot and your salads stay crisp and fresh.</p>

<h3>No Minimum Order</h3>
<p>Whether you're ordering a single pizza for yourself or feeding the whole office, we deliver orders of any size.</p>

<h3>Real-Time Tracking</h3>
<p>Know exactly when your food will arrive with our order tracking system. No more wondering where your delivery is!</p>

<h2>Delivery Hours</h2>

<p><strong>Monday - Thursday:</strong> 11:00 AM - 9:00 PM</p>
<p><strong>Friday - Saturday:</strong> 11:00 AM - 10:00 PM</p>
<p><strong>Sunday:</strong> 12:00 PM - 9:00 PM</p>

<p><em>Holiday hours may vary. Call ahead during major holidays to confirm availability.</em></p>

<h2>Easy Ordering Options</h2>

<h3>Online Ordering (Recommended)</h3>
<p>Our website makes ordering quick and easy. Customize your pizza, add sides, and track your delivery - all from your phone or computer.</p>

<h3>Phone Orders</h3>
<p>Prefer to talk to a real person? Call us directly and our friendly staff will take your order and answer any questions.</p>

<h3>Contactless Delivery Available</h3>
<p>For your safety and convenience, we offer contactless delivery. Just let us know in the order notes, and we'll leave your food at your door with a quick knock.</p>

<h2>Delivery Fees & Payment</h2>

<p><strong>Delivery Fee:</strong> FREE within Greenland, Portsmouth, Newington, and Stratham</p>
<p><strong>Extended Areas:</strong> $2.99 delivery fee</p>
<p><strong>Payment Options:</strong> Cash, credit cards, and digital payments accepted</p>
<p><strong>Tip:</strong> Gratuity for drivers is greatly appreciated but never required</p>

<h2>Perfect for Every Occasion</h2>

<h3>Family Dinner Night</h3>
<p>Skip the cooking and enjoy quality time together with a fresh RestoApp pizza delivered to your table.</p>

<h3>Office Lunch</h3>
<p>Keep your team happy and productive with our office-friendly delivery service. We handle groups of any size.</p>

<h3>Game Day & Parties</h3>
<p>Make your gathering memorable with multiple pizzas, fresh salads, and appetizers delivered right on time.</p>

<h3>Late Night Cravings</h3>
<p>When hunger strikes after a long day, we're here to satisfy those pizza cravings until closing time.</p>

<h2>Quality Guarantee</h2>

<p>We stand behind every delivery. If you're not completely satisfied with your order, contact us immediately and we'll make it right.</p>

<p>Our drivers are trained professionals who represent RestoApp with pride. They know the area well and always strive to provide friendly, efficient service.</p>

<h2>Ready to Order?</h2>

<p>Don't wait - fresh, hot pizza is just a phone call or click away!</p>

<p><strong>Order online now or call us directly for the fastest delivery service in Greenland NH!</strong></p>

<p><em>Serving the Seacoast with pride since day one. When you choose RestoApp delivery, you're choosing quality, speed, and service that cares about your experience.</em></p>`;

    await prisma.dynamicPage.update({
      where: { slug: 'delivery' },
      data: {
        content: newContent,
        title: 'Pizza Delivery Greenland NH | Fast & Fresh | RestoApp',
        excerpt: 'Fast pizza delivery throughout Greenland NH, Portsmouth, and Seacoast area. Free delivery, hot & fresh guaranteed, online ordering available. Order now!',
        metaTitle: 'Pizza Delivery Greenland NH | RestoApp | Free Local Delivery',
        metaDescription: 'Fast pizza delivery in Greenland NH, Portsmouth & Seacoast. Free delivery in local area, 25-35 minute service, online ordering. Fresh, hot pizza guaranteed!',
        metaKeywords: 'pizza delivery Greenland NH, Portsmouth pizza delivery, Seacoast food delivery, fast pizza delivery, online pizza ordering New Hampshire'
      }
    });
    
    console.log('✅ Delivery page updated with proper formatting and sections!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

improveDeliveryPageFormatting();
