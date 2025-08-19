const { PrismaClient } = require('@prisma/client');

async function updateRestaurantName() {
  const prisma = new PrismaClient();

  try {
    const restaurantName = 'Greenland Famous Cosby MP';
    
    console.log('Updating restaurant name to:', restaurantName);
    
    // Check if settings table/model exists and update restaurant names
    // First, let's see what settings we have
    try {
      // Try to find existing settings (assuming you have a Settings model)
      const existingSettings = await prisma.$queryRaw`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'settings';
      `;
      
      console.log('Settings table check:', existingSettings);
      
      if (existingSettings.length > 0) {
        // Update existing settings
        const updateAppName = await prisma.$executeRaw`
          UPDATE settings 
          SET setting_value = ${restaurantName} 
          WHERE setting_key = 'app_name';
        `;
        
        const updateBusinessName = await prisma.$executeRaw`
          UPDATE settings 
          SET setting_value = ${restaurantName} 
          WHERE setting_key = 'business_name';
        `;
        
        console.log('Updated app_name rows:', updateAppName);
        console.log('Updated business_name rows:', updateBusinessName);
        
        // If no rows were updated, insert new ones
        if (updateAppName === 0) {
          await prisma.$executeRaw`
            INSERT INTO settings (setting_key, setting_value) 
            VALUES ('app_name', ${restaurantName});
          `;
          console.log('Inserted app_name setting');
        }
        
        if (updateBusinessName === 0) {
          await prisma.$executeRaw`
            INSERT INTO settings (setting_key, setting_value) 
            VALUES ('business_name', ${restaurantName});
          `;
          console.log('Inserted business_name setting');
        }
        
      } else {
        console.log('Settings table does not exist. Creating it...');
        
        // Create settings table
        await prisma.$executeRaw`
          CREATE TABLE settings (
            id SERIAL PRIMARY KEY,
            setting_key VARCHAR(255) UNIQUE NOT NULL,
            setting_value TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;
        
        // Insert initial settings
        await prisma.$executeRaw`
          INSERT INTO settings (setting_key, setting_value) 
          VALUES ('app_name', ${restaurantName});
        `;
        
        await prisma.$executeRaw`
          INSERT INTO settings (setting_key, setting_value) 
          VALUES ('business_name', ${restaurantName});
        `;
        
        console.log('Settings table created and restaurant name set to:', restaurantName);
      }
      
      // Verify the update
      const updatedSettings = await prisma.$queryRaw`
        SELECT * FROM settings 
        WHERE setting_key IN ('app_name', 'business_name');
      `;
      
      console.log('Updated settings:', updatedSettings);
      
    } catch (error) {
      console.error('Error with settings table operations:', error);
      console.log('This might be normal if you don\'t have a settings table yet.');
      
      // Alternative: If you're using environment variables or a different approach
      console.log('You may need to update your environment variables or app settings configuration.');
      console.log('Restaurant name should be set to: "Greenland Famous Cosby MP"');
    }
    
  } catch (error) {
    console.error('Error updating restaurant name:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRestaurantName();
