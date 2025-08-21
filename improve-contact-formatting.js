const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function improveContactPageFormatting() {
  try {
    const newContent = `<h1>Contact RestoApp - Your Local Greenland NH Pizza Experts</h1>

<p>We'd love to hear from you! Whether you have questions about our menu, want to place a large catering order, or simply want to share feedback about your experience, we're here to help.</p>

<h2>Restaurant Information</h2>

<h3>Location & Address</h3>
<p><strong>RestoApp</strong><br>
123 Main Street<br>
Greenland, NH 03840</p>

<p>Conveniently located in the heart of Greenland, just minutes from Portsmouth, Hampton, and the entire Seacoast region.</p>

<h3>Phone & Email</h3>
<p><strong>Phone:</strong> (603) 555-PIZZA (7492)<br>
<strong>Email:</strong> hello@restoapp.com<br>
<strong>Online Orders:</strong> Available 24/7 through our website</p>

<h2>Hours of Operation</h2>

<h3>Dining & Takeout Hours</h3>
<p><strong>Monday - Thursday:</strong> 11:00 AM - 9:00 PM<br>
<strong>Friday - Saturday:</strong> 11:00 AM - 10:00 PM<br>
<strong>Sunday:</strong> 12:00 PM - 9:00 PM</p>

<h3>Delivery Hours</h3>
<p><strong>Monday - Thursday:</strong> 11:00 AM - 9:00 PM<br>
<strong>Friday - Saturday:</strong> 11:00 AM - 10:00 PM<br>
<strong>Sunday:</strong> 12:00 PM - 9:00 PM</p>

<p><em>Holiday hours may vary. Please call ahead during major holidays.</em></p>

<h2>Easy Ways to Reach Us</h2>

<h3>For Orders & General Questions</h3>
<p><strong>Call Us:</strong> (603) 555-PIZZA (7492)<br>
Our friendly staff is ready to take your order and answer any questions about our menu, ingredients, or delivery options.</p>

<h3>For Catering & Large Orders</h3>
<p><strong>Email:</strong> catering@restoapp.com<br>
<strong>Advance Notice:</strong> Please contact us at least 24 hours in advance for catering orders or large group orders.</p>

<h3>For Feedback & Suggestions</h3>
<p><strong>Email:</strong> feedback@restoapp.com<br>
We value your input and use customer feedback to continuously improve our food and service.</p>

<h2>Catering Services</h2>

<h3>Perfect for Any Event</h3>
<p>From office meetings to birthday parties, RestoApp catering makes your event delicious and stress-free.</p>

<p><strong>Office Lunches:</strong> Keep your team happy and productive<br>
<strong>Birthday Parties:</strong> Let us handle the food while you enjoy the celebration<br>
<strong>School Events:</strong> Popular choices for school fundraisers and events<br>
<strong>Sports Teams:</strong> Fuel your team with fresh, quality food</p>

<h3>Catering Options</h3>
<p><strong>Pizza Packages:</strong> Multiple pizzas with variety for every taste<br>
<strong>Salad Platters:</strong> Fresh, healthy options for any gathering<br>
<strong>Complete Meals:</strong> Pizza, salads, appetizers, and drinks<br>
<strong>Custom Orders:</strong> We'll work with you to create the perfect menu</p>

<h2>Visit Our Restaurant</h2>

<h3>Dine-In Experience</h3>
<p>Enjoy the full RestoApp experience in our comfortable dining room. Perfect for families, date nights, or casual meals with friends.</p>

<h3>Quick Takeout</h3>
<p>Call ahead or order online, then pick up your fresh food at your convenience. Most orders ready in 15-20 minutes.</p>

<h3>Parking & Accessibility</h3>
<p>Free parking available on-site. Our restaurant is wheelchair accessible with easy entry and comfortable seating.</p>

<h2>Connect With Us</h2>

<h3>Stay Updated</h3>
<p>Follow us on social media for special offers, new menu items, and community events:</p>

<p><strong>Facebook:</strong> @RestoAppGreenlandNH<br>
<strong>Instagram:</strong> @RestoAppPizza<br>
<strong>Website:</strong> www.restoapp.com</p>

<h2>Directions & Landmarks</h2>

<h3>From Portsmouth</h3>
<p>Take Route 33 West toward Greenland. We're located on Main Street, just past the town center.</p>

<h3>From Hampton</h3>
<p>Take Route 101 West to Route 33 North. Turn right on Main Street - we'll be on your left.</p>

<h3>From Exeter</h3>
<p>Take Route 108 East to Route 33 North toward Greenland. Turn right on Main Street.</p>

<h2>Questions? We're Here to Help!</h2>

<p>Whether you're a first-time customer or a longtime regular, we're always happy to help. Don't hesitate to reach out with any questions about our food, ingredients, allergens, or services.</p>

<p><strong>Ready to order? Call (603) 555-PIZZA or order online now!</strong></p>

<p><em>Thank you for choosing RestoApp - where every customer is treated like family!</em></p>`;

    await prisma.dynamicPage.update({
      where: { slug: 'contact' },
      data: {
        content: newContent,
        title: 'Contact RestoApp Greenland NH | Phone, Hours & Location Info',
        excerpt: 'Contact RestoApp for orders, catering, or questions. Located in Greenland NH serving Portsmouth & Seacoast. Phone: (603) 555-PIZZA. Open daily with delivery.',
        metaTitle: 'Contact RestoApp Greenland NH | Phone Orders & Location Info',
        metaDescription: 'Contact RestoApp in Greenland NH. Phone: (603) 555-PIZZA. Open daily 11am-9pm. Serving Portsmouth, Hampton, Exeter. Catering available. Visit or call today!',
        metaKeywords: 'contact RestoApp, Greenland NH pizza phone number, pizza restaurant hours, Seacoast pizza catering, Portsmouth area pizza contact'
      }
    });
    
    console.log('✅ Contact page updated with proper formatting and sections!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

improveContactPageFormatting();
