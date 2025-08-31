const fetch = require('node-fetch');

async function testCustomerCreation() {
  console.log('Testing Customer Creation API...\n');
  
  try {
    const newCustomer = {
      email: 'test.customer@example.com',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'Customer',
      phone: '555-1234',
      address: '123 Test Street',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345'
    };

    console.log('Creating customer with data:', newCustomer);
    
    const response = await fetch('http://localhost:3005/api/management-portal/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCustomer),
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Success! Customer created:', result);
    } else {
      const error = await response.json();
      console.log('Error creating customer:', error);
    }

  } catch (error) {
    console.error('Network error:', error.message);
  }
}

testCustomerCreation();
