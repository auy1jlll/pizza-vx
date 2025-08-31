const fetch = require('node-fetch');

async function testAPIs() {
  console.log('Testing Management Portal APIs...\n');
  
  try {
    // Test customers API
    console.log('1. Testing GET /api/management-portal/customers');
    const customersResponse = await fetch('http://localhost:3005/api/management-portal/customers');
    const customersData = await customersResponse.json();
    console.log('Status:', customersResponse.status);
    console.log('Customers found:', customersData.customers?.length || 0);
    if (customersData.customers) {
      customersData.customers.forEach((customer, index) => {
        console.log(`  ${index + 1}. ${customer.email} (${customer.customerProfile?.firstName || 'No name'})`);
      });
    }
    console.log('');

    // Test employees API
    console.log('2. Testing GET /api/management-portal/employees');
    const employeesResponse = await fetch('http://localhost:3005/api/management-portal/employees');
    const employeesData = await employeesResponse.json();
    console.log('Status:', employeesResponse.status);
    console.log('Employees found:', employeesData.employees?.length || 0);
    if (employeesData.employees) {
      employeesData.employees.forEach((employee, index) => {
        console.log(`  ${index + 1}. ${employee.email} (${employee.employeeProfile?.firstName || 'No name'}) - ${employee.role}`);
      });
    }
    console.log('');

    // Test customer creation
    console.log('3. Testing POST /api/management-portal/customers (Create Customer)');
    const newCustomer = {
      email: 'test-customer@example.com',
      password: 'testpassword123',
      firstName: 'Test',
      lastName: 'Customer',
      phone: '555-1234',
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345'
    };

    const createCustomerResponse = await fetch('http://localhost:3005/api/management-portal/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCustomer),
    });

    const createCustomerData = await createCustomerResponse.json();
    console.log('Status:', createCustomerResponse.status);
    console.log('Response:', createCustomerData);

  } catch (error) {
    console.error('Error testing APIs:', error.message);
  }
}

testAPIs();
