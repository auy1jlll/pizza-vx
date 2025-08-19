/**
 * Simple checkout API test
 */

async function testCheckoutAPI() {
    console.log('=== TESTING CHECKOUT API ===');

    const orderData = {
        orderType: 'PICKUP',
        customer: {
            name: 'Test Customer',
            email: 'test@example.com',
            phone: '555-123-4567'
        },
        items: [
            {
                type: 'pizza',
                id: 'test-pizza-1',
                quantity: 1,
                basePrice: 15.99,
                totalPrice: 17.99,
                size: { id: '2', name: 'Medium' },
                crust: { id: '1', name: 'Thin Crust' },
                sauce: { id: '1', name: 'Marinara' },
                toppings: []
            }
        ],
        subtotal: 15.99,
        deliveryFee: 0,
        tax: 2.00,
        total: 17.99
    };

    try {
        const response = await fetch('http://localhost:3005/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });

        console.log('Status:', response.status);
        
        if (response.ok) {
            const result = await response.json();
            console.log('✅ Success:', result);
        } else {
            const error = await response.json();
            console.log('❌ Error:', error);
        }
    } catch (error) {
        console.log('Network error:', error.message);
    }
}

testCheckoutAPI();
