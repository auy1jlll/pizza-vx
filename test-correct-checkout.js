/**
 * Test checkout with properly formatted data
 */

async function testCorrectCheckout() {
    console.log('=== TESTING CHECKOUT WITH COMPLETE DATA ===');

    const orderData = {
        orderType: 'PICKUP',
        customer: {
            name: 'Test Customer',
            email: 'test@example.com',
            phone: '555-123-4567',
            address: '',
            city: '',
            zip: ''
        },
        delivery: null,
        items: [
            {
                type: 'pizza',
                id: 'test-pizza-1',
                quantity: 1,
                basePrice: 15.99,
                totalPrice: 17.99,
                size: { 
                    id: '2', 
                    name: 'Medium',
                    diameter: '12"',
                    basePrice: 15.99,
                    isActive: true,
                    sortOrder: 2
                },
                crust: { 
                    id: '1', 
                    name: 'Thin Crust',
                    priceModifier: 0,
                    isActive: true,
                    sortOrder: 1
                },
                sauce: { 
                    id: '1', 
                    name: 'Marinara',
                    spiceLevel: 1,
                    priceModifier: 0,
                    isActive: true,
                    sortOrder: 1
                },
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
            console.log('✅ Checkout Success!');
            console.log('Order ID:', result.data?.orderId);
            console.log('Order Number:', result.data?.orderNumber);
        } else {
            const error = await response.json();
            console.log('❌ Checkout Error:', error);
        }
    } catch (error) {
        console.log('Network error:', error.message);
    }
}

testCorrectCheckout();
