'use client';

import { useState } from 'react';
import { validateSchema, CreateOrderSchema, LoginSchema } from '@/lib/schemas';

export default function SchemaTestPage() {
  const [testResults, setTestResults] = useState<string[]>([]);

  const runTests = () => {
    const results: string[] = [];

    // Test 1: Valid Login Schema
    const validLogin = { email: 'test@example.com', password: 'password123' };
    const loginResult = validateSchema(LoginSchema, validLogin);
    results.push(`✅ Valid Login: ${loginResult.success ? 'PASSED' : 'FAILED - ' + loginResult.error}`);

    // Test 2: Invalid Login Schema
    const invalidLogin = { email: 'invalid-email', password: '' };
    const invalidLoginResult = validateSchema(LoginSchema, invalidLogin);
    results.push(`❌ Invalid Login: ${!invalidLoginResult.success ? 'PASSED (correctly rejected)' : 'FAILED (should have been rejected)'}`);

    // Test 3: Valid Order Schema
    const validOrder = {
      items: [
        {
          size: { id: "test-size", name: "Medium", diameter: "12 inches", basePrice: 12.99, isActive: true, sortOrder: 1 },
          crust: { id: "test-crust", name: "Thin", priceModifier: 0, isActive: true, sortOrder: 1 },
          sauce: { id: "test-sauce", name: "Marinara", spiceLevel: 2, priceModifier: 0, isActive: true, sortOrder: 1 },
          toppings: [
            { id: "test-topping", name: "Pepperoni", price: 2.99, quantity: 1, section: "WHOLE", intensity: "REGULAR" }
          ],
          quantity: 1,
          basePrice: 12.99,
          totalPrice: 15.98
        }
      ],
      customer: {
        name: "John Doe",
        email: "john@example.com",
        phone: "555-123-4567"
      },
      delivery: {
        address: "123 Main St",
        city: "Anytown",
        zip: "12345"
      },
      orderType: "DELIVERY",
      subtotal: 15.98,
      deliveryFee: 3.99,
      tax: 1.28,
      total: 21.25
    };

    const orderResult = validateSchema(CreateOrderSchema, validOrder);
    results.push(`✅ Valid Order: ${orderResult.success ? 'PASSED' : 'FAILED - ' + orderResult.error}`);

    // Test 4: Invalid Order Schema
    const invalidOrder = { items: [], customer: { name: "", email: "invalid", phone: "123" } };
    const invalidOrderResult = validateSchema(CreateOrderSchema, invalidOrder);
    results.push(`❌ Invalid Order: ${!invalidOrderResult.success ? 'PASSED (correctly rejected)' : 'FAILED (should have been rejected)'}`);

    setTestResults(results);
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">🔴 Zod Schema Validation Test</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <button 
          onClick={runTests}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Run Schema Tests
        </button>
      </div>

      {testResults.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div 
                key={index} 
                className={`p-3 rounded ${result.includes('PASSED') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
              >
                {result}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Schema Validation Status</h3>
        <p className="text-gray-700">
          ✅ Zod schemas implemented<br/>
          ✅ Validation helpers created<br/>
          ✅ Checkout API updated with validation<br/>
          ✅ Type-safe error handling<br/>
          ✅ Comprehensive schema coverage
        </p>
      </div>
    </div>
  );
}
