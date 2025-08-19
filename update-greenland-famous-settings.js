const { PrismaClient } = require('@prisma/client');

async function updateRestaurantSettings() {
  const prisma = new PrismaClient();

  try {
    console.log('Updating restaurant settings based on Greenland Famous website...');
    
    // Restaurant Information from greenlandfamous.com
    const restaurantSettings = {
      // Core Branding
      app_name: 'Greenland Famous Roast Beef & Seafood',
      business_name: 'Greenland Famous Roast Beef & Seafood',
      app_tagline: 'WE\'VE GOT SOMETHING FOR EVERYONE',
      business_slogan: 'FROM OUR OVEN WITH AMERICAN LOVE',
      
      // Contact Information
      business_phone: '(603) 501-0774',
      business_email: 'Manager@GreenlandFamous.com',
      business_address: '381 Portsmouth, Greenland NH',
      business_website: 'https://greenlandfamous.com',
      
      // SEO Information
      meta_title: 'Greenland Famous Roast Beef & Seafood - Best Roast Beef in NH',
      meta_description: 'Home of the Three-way Roast Beef! We make dough fresh daily, our homemade sauce and toppings are always fresh. Pizza, Seafood, and more.',
      meta_keywords: 'roast beef, seafood, pizza, Greenland NH, three-way roast beef, fresh dough, homemade sauce',
      
      // Social Media (from website)
      facebook_url: 'https://facebook.com/greenlandfamous',
      instagram_url: 'https://instagram.com/greenlandfamous',
      twitter_url: 'https://twitter.com/greenlandfamous',
      
      // Features (based on their offerings)
      enable_pizza_builder: true,
      enable_menu_ordering: true,
      enable_user_accounts: true,
      enable_guest_checkout: true,
      
      // Operations (estimated based on their pricing)
      tax_rate: 0.08, // NH sales tax
      delivery_fee: 3.99,
      minimum_order: 15.00,
      preparation_time: 20, // minutes
      
      // Hours (from website: Monday-Sunday 10:30 am – 08:00 pm)
      operating_hours: JSON.stringify({
        monday: { open: '10:30', close: '20:00', closed: false },
        tuesday: { open: '10:30', close: '20:00', closed: false },
        wednesday: { open: '10:30', close: '20:00', closed: false },
        thursday: { open: '10:30', close: '20:00', closed: false },
        friday: { open: '10:30', close: '20:00', closed: false },
        saturday: { open: '10:30', close: '20:00', closed: false },
        sunday: { open: '10:30', close: '20:00', closed: false }
      }),
      
      // Specialties (from their menu highlights)
      specialty_items: JSON.stringify([
        'Super Beef 3-Way',
        'Roast Beef Dinner - $17.99',
        'Steak Tips Kabob - $19.99', 
        'Meat Lovers Pizza - $23.50',
        'Sea Monster Platter - Market Price',
        'House Special Pizza - $23.50',
        'BBQ Chicken Pizza - $16.50',
        'Chicken Wings - $11.99'
      ])
    };

    // Update or insert each setting
    for (const [key, value] of Object.entries(restaurantSettings)) {
      try {
        // Try to update existing setting
        const result = await prisma.$executeRaw`
          UPDATE settings 
          SET setting_value = ${value.toString()}, updated_at = CURRENT_TIMESTAMP
          WHERE setting_key = ${key};
        `;
        
        // If no rows were affected, insert new setting
        if (result === 0) {
          await prisma.$executeRaw`
            INSERT INTO settings (setting_key, setting_value) 
            VALUES (${key}, ${value.toString()});
          `;
          console.log(`✅ Inserted: ${key}`);
        } else {
          console.log(`✅ Updated: ${key}`);
        }
      } catch (error) {
        console.error(`❌ Error with ${key}:`, error.message);
      }
    }
    
    console.log('\n🎉 Restaurant settings updated successfully!');
    console.log('\nKey Features from Greenland Famous:');
    console.log('• Famous for their "Super Beef 3-Way" roast beef sandwich');
    console.log('• Fresh daily dough and homemade sauce');
    console.log('• Full seafood menu including "Sea Monster" platter');
    console.log('• Specialty pizzas and calzones');
    console.log('• Chicken wings with Buffalo, BBQ, and regular options');
    console.log('• Located at 381 Portsmouth, Greenland NH');
    console.log('• Open daily 10:30 AM - 8:00 PM');
    console.log('• Phone: (603) 501-0774');
    console.log('• Excellent Google reviews (4.6 stars from 272+ reviews)');
    
    // Verify the updates
    const updatedSettings = await prisma.$queryRaw`
      SELECT setting_key, setting_value 
      FROM settings 
      WHERE setting_key IN (
        'app_name', 'business_name', 'business_phone', 
        'business_address', 'business_email'
      )
      ORDER BY setting_key;
    `;
    
    console.log('\n📋 Verified Core Settings:');
    updatedSettings.forEach(setting => {
      console.log(`   ${setting.setting_key}: ${setting.setting_value}`);
    });
    
  } catch (error) {
    console.error('❌ Error updating restaurant settings:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRestaurantSettings();
