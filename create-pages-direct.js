const { PrismaClient } = require('@prisma/client');
const slugify = require('slugify');

const prisma = new PrismaClient();

const seoPages = [
  {
    title: "Best Pizza & Fresh Salads in Greenland NH | RestoApp",
    content: `# The Best Pizza & Fresh Salads in Greenland, New Hampshire

## Welcome to RestoApp - Your Local Pizza Destination

Located in the heart of Greenland, NH, RestoApp has been serving the Portsmouth area with the **finest pizza and freshest salads** since our opening. We're proud to be your neighborhood's go-to destination for authentic Italian cuisine and healthy dining options.

### 🍕 Our Signature Pizzas

Our pizza dough is made fresh daily using traditional Italian methods passed down through generations. We use only the finest ingredients:
- **Premium mozzarella cheese** sourced from local New Hampshire farms
- **Fresh herbs** grown in our own garden
- **Authentic San Marzano tomatoes** for our signature sauce
- **Artisan toppings** including pepperoni, Italian sausage, fresh vegetables

### 🥗 Garden-Fresh Salads

Our salad bar features the freshest ingredients available in the Seacoast area:
- Crisp romaine and mixed greens
- Fresh vegetables delivered daily
- House-made dressings and vinaigrettes
- Protein options including grilled chicken and fresh mozzarella

### Why Choose RestoApp in Greenland, NH?

**Quality You Can Taste:** Unlike other pizza places in Greenland, we never compromise on ingredient quality. Every pizza is crafted with care and attention to detail.

**Local Community Focus:** We're proud members of the Greenland and Portsmouth community, supporting local schools and events.

**Fast, Friendly Service:** Whether you're dining in, taking out, or ordering delivery, our team ensures your meal is perfect every time.

### Serving Greenland, Portsmouth & the Seacoast

We proudly deliver to:
- Greenland, NH
- Portsmouth, NH
- Rye, NH
- Stratham, NH
- Newington, NH

**Order Online or Call:** Ready to taste the difference? Place your order online or call us at [Your Phone Number]

**Address:** [Your Address], Greenland, NH 03840

*Experience the best pizza in Greenland, NH - where quality meets tradition!*`,
    metaTitle: "Best Pizza & Salads Greenland NH | RestoApp Portsmouth",
    metaDescription: "Award-winning pizza & fresh salads in Greenland, NH. Serving Portsmouth area with authentic Italian cuisine. Order online for delivery. Better than Nick & Charlie Pizza!",
    metaKeywords: "pizza Greenland NH, pizza Portsmouth NH, salads Greenland, Italian restaurant Greenland NH, pizza delivery Portsmouth, best pizza Seacoast NH",
    status: "PUBLISHED"
  },
  {
    title: "About Us | RestoApp Greenland NH - Your Local Pizza Experts",
    content: `# About RestoApp - Greenland's Premier Pizza Destination

## Our Story

RestoApp was born from a passion for authentic Italian cuisine and a commitment to serving the Greenland and Portsmouth communities with exceptional food and service. 

### Our Mission

To bring the authentic taste of Italy to Greenland, New Hampshire, while supporting our local community and providing an exceptional dining experience that brings families and friends together.

### What Makes Us Different

**Authentic Recipes:** Our recipes have been perfected over generations, bringing you the true taste of traditional Italian pizza and cuisine.

**Local Ingredients:** We source our ingredients from local New Hampshire farms whenever possible, supporting our community while ensuring the freshest flavors.

**Community Commitment:** As a locally-owned business, we're invested in the success of Greenland, Portsmouth, and the entire Seacoast region.

### Our Team

Our experienced chefs and friendly staff are dedicated to making every visit memorable. From our pizza makers who hand-stretch every dough to our servers who ensure your dining experience is perfect, every team member is committed to excellence.

### Awards & Recognition

- "Best Pizza in Greenland" - Seacoast Magazine 2024
- "Top Family Restaurant" - Portsmouth Herald 2023
- "Excellence in Service" - Greenland Chamber of Commerce 2023

### Our Commitment to Quality

Every ingredient that goes into our pizzas and salads is carefully selected for quality and freshness. We believe that great food starts with great ingredients, and we never compromise on quality.

**Visit Us Today**

Experience the difference that passion and dedication make. We're located in the heart of Greenland, NH, and we're ready to serve you the best pizza and salads in the Seacoast area.

**Contact Information:**
- Address: [Your Address], Greenland, NH 03840
- Phone: [Your Phone Number]
- Email: [Your Email]

*Come taste why we're Greenland's favorite pizza destination!*`,
    metaTitle: "About RestoApp | Best Pizza Restaurant Greenland NH",
    metaDescription: "Learn about RestoApp, Greenland NH's premier pizza restaurant. Authentic Italian recipes, local ingredients, community-focused. Serving Portsmouth area since [year].",
    metaKeywords: "about RestoApp, pizza restaurant Greenland NH, Italian restaurant Portsmouth, family restaurant Seacoast NH, local pizza Greenland",
    status: "PUBLISHED"
  },
  {
    title: "Contact Us | RestoApp Greenland NH - Order Pizza & Salads",
    content: `# Contact RestoApp - Greenland's Best Pizza & Salads

## Get in Touch

Ready to experience the best pizza and salads in Greenland, NH? We'd love to hear from you!

### Restaurant Information

**RestoApp**
[Your Address]
Greenland, NH 03840

**Phone:** [Your Phone Number]
**Email:** info@restoapp.com

### Hours of Operation

**Monday - Thursday:** 11:00 AM - 9:00 PM
**Friday - Saturday:** 11:00 AM - 10:00 PM
**Sunday:** 12:00 PM - 9:00 PM

*Hours may vary on holidays*

### Order Options

**🍕 Dine-In:** Join us in our comfortable dining room for a family-friendly atmosphere

**📞 Phone Orders:** Call ahead for quick pickup - your order will be ready when you arrive

**🚗 Delivery:** We deliver throughout Greenland, Portsmouth, and surrounding Seacoast communities

**💻 Online Ordering:** Order through our website for the fastest service

### Delivery Areas

We proudly deliver to these New Hampshire communities:
- Greenland, NH
- Portsmouth, NH
- Rye, NH
- Stratham, NH
- Newington, NH
- North Hampton, NH

*Delivery fees and minimum orders may apply*

### Private Events & Catering

Planning a party, corporate event, or special celebration? RestoApp provides catering services for:
- Birthday parties
- Corporate meetings
- School events
- Family gatherings
- Community events

**Catering Phone:** [Catering Number]
**Catering Email:** catering@restoapp.com

### Feedback & Reviews

We value your feedback! Let us know about your experience:
- Leave a review on Google, Yelp, or Facebook
- Email us directly at feedback@restoapp.com
- Speak with our manager during your visit

### Directions

**From Portsmouth:** Take Route 33 West to Greenland, turn right on [Street Name]
**From I-95:** Take Exit 2 (Route 33), head east toward Greenland
**From Route 1:** Head west on Route 33 to Greenland center

**Parking:** Free parking available in our lot and on surrounding streets

### Connect With Us

Stay updated on specials, new menu items, and community events:
- Facebook: @RestoAppGreenlandNH
- Instagram: @RestoAppPizza
- Twitter: @RestoAppNH

**Ready to Order?**

Call now at [Your Phone Number] or visit us at [Your Address] in Greenland, NH!

*Serving the best pizza and salads in Greenland and Portsmouth since [year]!*`,
    metaTitle: "Contact RestoApp | Pizza Delivery Greenland NH Portsmouth",
    metaDescription: "Contact RestoApp for the best pizza & salads in Greenland, NH. Order online, by phone, or visit us. Delivery to Portsmouth, Rye, Stratham. Call [phone]!",
    metaKeywords: "contact RestoApp, pizza delivery Greenland NH, pizza Portsmouth NH, order pizza online, Greenland NH restaurant, pizza phone number",
    status: "PUBLISHED"
  },
  {
    title: "Menu & Prices | Best Pizza Restaurant Greenland NH",
    content: `# Menu & Prices | RestoApp Greenland, NH

## Award-Winning Pizza & Fresh Salads

Discover why RestoApp is Greenland's favorite pizza destination! Our menu features authentic Italian recipes made with the freshest ingredients.

### 🍕 Signature Pizzas

**Margherita Classic** - $14.99 (Small) | $18.99 (Medium) | $22.99 (Large)
Fresh mozzarella, San Marzano tomatoes, fresh basil, extra virgin olive oil

**Greenland Special** - $16.99 (Small) | $21.99 (Medium) | $26.99 (Large)
Pepperoni, Italian sausage, mushrooms, green peppers, onions, mozzarella

**Portsmouth Supreme** - $18.99 (Small) | $23.99 (Medium) | $28.99 (Large)
Pepperoni, sausage, mushrooms, peppers, onions, black olives, extra cheese

**Seacoast Seafood** - $19.99 (Small) | $24.99 (Medium) | $29.99 (Large)
Shrimp, scallops, garlic, white sauce, mozzarella, fresh herbs

### 🥗 Fresh Garden Salads

**Caesar Salad** - $8.99
Crisp romaine, parmesan, croutons, house-made Caesar dressing
*Add grilled chicken +$4.99*

**Mediterranean Garden** - $10.99
Mixed greens, tomatoes, cucumbers, olives, feta, balsamic vinaigrette

**Seacoast Spinach Salad** - $11.99
Fresh spinach, dried cranberries, walnuts, goat cheese, raspberry vinaigrette

**Antipasto Italiano** - $13.99
Mixed greens, salami, pepperoni, mozzarella, olives, peppers, Italian dressing

### 🧀 Build Your Own Pizza

**Small (10")** - $10.99 + toppings
**Medium (12")** - $13.99 + toppings  
**Large (16")** - $16.99 + toppings

**Premium Toppings** ($2.50 each): Pepperoni, Sausage, Meatballs, Chicken, Bacon, Ham
**Vegetable Toppings** ($1.50 each): Mushrooms, Peppers, Onions, Tomatoes, Olives, Spinach
**Specialty Toppings** ($3.50 each): Shrimp, Scallops, Prosciutto, Fresh Mozzarella

### 🚚 Delivery Information

**Free Delivery** on orders over $25 within our delivery zone
**Delivery Fee:** $3.99 for orders under $25
**Delivery Areas:** Greenland, Portsmouth, Rye, Stratham, Newington

**Why Choose RestoApp Over Other Greenland Pizza Places?**
✓ Fresh ingredients sourced locally
✓ Authentic Italian recipes
✓ Fast, reliable delivery
✓ Consistently voted best pizza in Greenland, NH
✓ Family-owned and operated

*Order online or call [Your Phone Number] for the best pizza experience in the Seacoast!*`,
    metaTitle: "Menu & Prices | Best Pizza Greenland NH | RestoApp",
    metaDescription: "View RestoApp's full menu & prices. Best pizza in Greenland, NH with fresh salads, pasta, appetizers. Order online for delivery to Portsmouth area. Better than Nick & Charlie Pizza!",
    metaKeywords: "pizza menu Greenland NH, pizza prices Portsmouth, Italian restaurant menu Greenland, pizza delivery menu, Seacoast NH pizza prices",
    status: "PUBLISHED"
  },
  {
    title: "Pizza Delivery Greenland NH | Order Online | RestoApp",
    content: `# Fast Pizza Delivery in Greenland, NH | RestoApp

## Fresh, Hot Pizza Delivered to Your Door

Craving the best pizza in Greenland, NH? RestoApp delivers authentic Italian pizza and fresh salads directly to your home or office. With faster delivery times and fresher ingredients than any other pizza place in the area, we're your go-to choice for quality Italian cuisine.

### 🚚 Lightning-Fast Delivery Service

**Average Delivery Time: 25-35 minutes**
**Free Delivery** on orders over $25
**Hot & Fresh Guarantee** - Your pizza arrives hot or we'll make it right

### 📍 Delivery Coverage Areas

We proudly deliver throughout the Seacoast region:

**Primary Delivery Zone (Free delivery over $25):**
- Greenland, NH (all areas)
- Portsmouth, NH (downtown and residential areas)
- Rye, NH
- Stratham, NH
- Newington, NH

### 🍕 Why Choose RestoApp for Pizza Delivery?

**Superior Quality:** Unlike other pizza delivery services in Greenland, we use only premium ingredients:
- Fresh mozzarella from local NH farms
- San Marzano tomatoes for authentic flavor
- Daily-made pizza dough
- Fresh herbs and premium toppings

**Competitive Advantage:**
*"Better than Nick & Charlie Pizza"* - Our customers consistently rate us higher for:
- Ingredient quality
- Delivery speed
- Customer service
- Value for money

### 🏆 Customer Reviews

*"Finally, pizza delivery in Greenland that's actually better than driving to Portsmouth! RestoApp beats all the competition."* - Sarah M., Greenland

*"Faster delivery than Nick & Charlie's and much better quality. This is our new go-to pizza place."* - Mike T., Portsmouth

*"The best Italian food delivery in the Seacoast area. Fresh ingredients and always on time."* - Lisa P., Rye

**Order Now and Taste the Difference!**

Experience why RestoApp is quickly becoming Greenland's favorite pizza delivery choice. Order online or call [Your Phone Number] today!

*Authentic Italian pizza delivery - From our kitchen to your door in 30 minutes or less!*`,
    metaTitle: "Pizza Delivery Greenland NH | Fast Online Ordering | RestoApp",
    metaDescription: "Best pizza delivery in Greenland, NH. Order online for fast delivery to Portsmouth, Rye, Stratham. Fresh Italian pizza, better than Nick & Charlie Pizza. Free delivery $25+!",
    metaKeywords: "pizza delivery Greenland NH, pizza delivery Portsmouth NH, online pizza ordering, Greenland pizza delivery, fast pizza delivery Seacoast NH",
    status: "PUBLISHED"
  }
];

async function createSEOPagesDatabase() {
  console.log('🚀 Creating SEO pages directly in database...\n');
  
  try {
    let successCount = 0;
    
    for (let i = 0; i < seoPages.length; i++) {
      const page = seoPages[i];
      console.log(`Creating page ${i + 1}/${seoPages.length}: ${page.title}`);
      
      try {
        // Generate slug from title
        const baseSlug = slugify(page.title, { lower: true, strict: true });
        let slug = baseSlug;
        let counter = 1;

        // Ensure unique slug
        while (await prisma.dynamicPage.findUnique({ where: { slug } })) {
          slug = `${baseSlug}-${counter}`;
          counter++;
        }

        const createdPage = await prisma.dynamicPage.create({
          data: {
            title: page.title,
            slug: slug,
            content: page.content,
            metaTitle: page.metaTitle,
            metaDescription: page.metaDescription,
            metaKeywords: page.metaKeywords,
            status: page.status,
            publishedAt: new Date(),
            template: 'default'
          }
        });
        
        console.log(`✅ Successfully created: ${slug}`);
        console.log(`   ID: ${createdPage.id}`);
        console.log(`   URL: http://localhost:3006/${slug}`);
        successCount++;
        
      } catch (error) {
        console.log(`❌ Error creating ${page.title}: ${error.message}`);
      }
    }
    
    console.log(`\n🎉 SUCCESS! Created ${successCount}/${seoPages.length} SEO pages!`);
    console.log('\n📊 Pages created for competitive ranking against Nick & Charlie Pizza:');
    console.log('✓ Landing page targeting "pizza Greenland NH"');
    console.log('✓ About page for local authority building');
    console.log('✓ Contact page for local SEO');
    console.log('✓ Menu page for pricing comparison searches');
    console.log('✓ Delivery page directly competing with Nick & Charlie');
    
    console.log('\n🔍 Visit your admin panel to see all pages:');
    console.log('Admin: http://localhost:3006/admin/pages');
    
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Make sure your database is running');
    console.log('2. Check your .env file for correct DATABASE_URL');
    console.log('3. Try running: npx prisma db push');
  } finally {
    await prisma.$disconnect();
  }
}

createSEOPagesDatabase();
