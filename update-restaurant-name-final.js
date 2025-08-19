const mysql = require('mysql2/promise');

async function updateRestaurantName() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'GoPackGo',
    database: 'pizza_builder'
  });

  try {
    // Check if settings table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'settings'"
    );
    
    console.log('Settings table check:', tables);
    
    const restaurantName = 'Greenland Famous Cosby MP';
    
    if (tables.length > 0) {
      // Check current settings
      const [rows] = await connection.execute('SELECT * FROM settings');
      console.log('Current settings:', rows);
      
      // Try updating existing settings
      const [appNameResult] = await connection.execute(
        "UPDATE settings SET setting_value = ? WHERE setting_key = 'app_name'",
        [restaurantName]
      );
      
      const [businessNameResult] = await connection.execute(
        "UPDATE settings SET setting_value = ? WHERE setting_key = 'business_name'",
        [restaurantName]
      );
      
      // If no rows were affected, insert new ones
      if (appNameResult.affectedRows === 0) {
        await connection.execute(
          "INSERT INTO settings (setting_key, setting_value) VALUES ('app_name', ?)",
          [restaurantName]
        );
        console.log('Inserted app_name setting');
      } else {
        console.log('Updated app_name setting');
      }
      
      if (businessNameResult.affectedRows === 0) {
        await connection.execute(
          "INSERT INTO settings (setting_key, setting_value) VALUES ('business_name', ?)",
          [restaurantName]
        );
        console.log('Inserted business_name setting');
      } else {
        console.log('Updated business_name setting');
      }
      
    } else {
      console.log('Settings table does not exist. Creating it...');
      
      // Create settings table
      await connection.execute(`
        CREATE TABLE settings (
          id INT AUTO_INCREMENT PRIMARY KEY,
          setting_key VARCHAR(255) UNIQUE NOT NULL,
          setting_value TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      
      // Insert initial settings
      await connection.execute(
        "INSERT INTO settings (setting_key, setting_value) VALUES ('app_name', ?)",
        [restaurantName]
      );
      
      await connection.execute(
        "INSERT INTO settings (setting_key, setting_value) VALUES ('business_name', ?)",
        [restaurantName]
      );
      
      console.log('Settings table created and restaurant name set to:', restaurantName);
    }
    
    console.log('Restaurant name updated to:', restaurantName);
    
    // Verify the update
    const [updatedRows] = await connection.execute(
      "SELECT * FROM settings WHERE setting_key IN ('app_name', 'business_name')"
    );
    console.log('Updated settings:', updatedRows);
    
  } catch (error) {
    console.error('Error updating restaurant name:', error);
  } finally {
    await connection.end();
  }
}

updateRestaurantName();
