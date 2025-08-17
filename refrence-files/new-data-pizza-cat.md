Update Backend Validation (Recommended)
Use the validation schema I provided above, which:

✅ Supports both old pizza structure AND new menu structure
✅ Automatically converts legacy data to new format
✅ Validates category-specific rules
✅ Maintains backward compatibility

Immediate Steps:

Replace your current validation middleware with the validateAndNormalizeOrder function above
Test with both pizza and sub orders to ensure it works
Gradually migrate your frontend to the new structure

The validation schema I provided will handle the data transformation automatically, so you can have:

Pizza orders working immediately (with legacy support)
New menu items working with the unified structure
No breaking changes to existing functionality

Would you like me to help you adapt this validation schema to your specific framework (Express, Fastify, etc.) or show you how to gradually migrate without breaking existing orders?

// UPDATED VALIDATION SCHEMA FOR UNIFIED MENU SYSTEM
// Supports both legacy pizza structure and new menu items

// ============================================================================
// 1. FLEXIBLE VALIDATION SCHEMA
// ============================================================================

const Joi = require('joi'); // or your preferred validation library

// Customer validation (unchanged)
const customerInfoSchema = Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    phone: Joi.string().required().trim().pattern(/^[\d\s\-\(\)\+]+$/),
    email: Joi.string().email().optional().allow(null, ''),
    orderType: Joi.string().valid('pickup', 'delivery').default('pickup'),
    address: Joi.string().optional().allow(null, '').max(500),
    specialInstructions: Joi.string().optional().allow(null, '').max(500)
});

// Flexible customization schema (works for pizza toppings AND sub condiments)
const customizationSchema = Joi.object({
    optionId: Joi.number().integer().positive().required(),
    
    // Pizza-specific fields (optional for non-pizza items)
    pizzaHalf: Joi.string().valid('whole', 'left', 'right').default('whole'),
    
    // General fields
    quantity: Joi.number().integer().min(1).default(1),
    priceModifier: Joi.number().min(0).default(0),
    
    // Legacy support for old pizza structure
    toppingId: Joi.number().integer().positive().optional(), // maps to optionId
    half: Joi.string().valid('whole', 'left', 'right').optional() // maps to pizzaHalf
});

// Flexible order item schema
const orderItemSchema = Joi.object({
    // Required fields for all items
    menuItemId: Joi.number().integer().positive().required(),
    quantity: Joi.number().integer().min(1).required(),
    unitPrice: Joi.number().min(0).required(),
    totalPrice: Joi.number().min(0).required(),
    
    // Optional fields
    sizeId: Joi.number().integer().positive().optional().allow(null),
    specialInstructions: Joi.string().optional().allow(null, '').max(300),
    
    // Pizza-specific fields (optional for other items)
    isHalfHalf: Joi.boolean().default(false),
    
    // Customizations array (works for all item types)
    customizations: Joi.array().items(customizationSchema).default([]),
    
    // Legacy pizza support
    toppings: Joi.array().items(customizationSchema).optional(), // maps to customizations
    pizzaSize: Joi.string().optional(), // maps to sizeId lookup
    
    // Category-specific validation
    category: Joi.string().valid('pizza', 'subs', 'wings', 'dinner_combos', 'salads').optional()
});

// Order totals schema
const orderTotalSchema = Joi.object({
    subtotal: Joi.number().min(0).required(),
    tax: Joi.number().min(0).default(0),
    deliveryFee: Joi.number().min(0).default(0),
    discount: Joi.number().min(0).default(0),
    total: Joi.number().min(0).required()
});

// Main order schema
const orderSchema = Joi.object({
    customerInfo: customerInfoSchema.required(),
    orderItems: Joi.array().items(orderItemSchema).min(1).required(),
    orderTotal: orderTotalSchema.required()
});

// ============================================================================
// 2. VALIDATION MIDDLEWARE WITH LEGACY SUPPORT
// ============================================================================

function validateAndNormalizeOrder(req, res, next) {
    try {
        // First, normalize legacy data to new structure
        const normalizedData = normalizeLegacyOrder(req.body);
        
        // Then validate using the flexible schema
        const { error, value } = orderSchema.validate(normalizedData, {
            allowUnknown: false,
            stripUnknown: true,
            abortEarly: false
        });
        
        if (error) {
            console.error('Validation errors:', error.details);
            return res.status(400).json({
                error: 'Validation failed',
                details: error.details.map(detail => ({
                    field: detail.path.join('.'),
                    message: detail.message,
                    value: detail.context?.value
                }))
            });
        }
        
        // Attach validated and normalized data to request
        req.validatedOrder = value;
        next();
        
    } catch (normalizationError) {
        console.error('Order normalization error:', normalizationError);
        res.status(400).json({
            error: 'Invalid order format',
            details: normalizationError.message
        });
    }
}

// ============================================================================
// 3. LEGACY DATA NORMALIZATION
// ============================================================================

function normalizeLegacyOrder(orderData) {
    const normalized = JSON.parse(JSON.stringify(orderData)); // deep clone
    
    // Normalize order items
    if (normalized.orderItems) {
        normalized.orderItems = normalized.orderItems.map(item => {
            const normalizedItem = { ...item };
            
            // Convert legacy pizza toppings to customizations
            if (item.toppings && !item.customizations) {
                normalizedItem.customizations = item.toppings.map(topping => ({
                    optionId: topping.toppingId || topping.optionId,
                    pizzaHalf: topping.half || topping.pizzaHalf || 'whole',
                    quantity: topping.quantity || 1,
                    priceModifier: topping.priceModifier || topping.price || 0
                }));
                delete normalizedItem.toppings;
            }
            
            // Convert legacy pizza size to sizeId (you'll need a lookup)
            if (item.pizzaSize && !item.sizeId) {
                normalizedItem.sizeId = convertPizzaSizeToId(item.pizzaSize);
                delete normalizedItem.pizzaSize;
            }
            
            // Ensure required fields exist
            if (!normalizedItem.unitPrice) {
                normalizedItem.unitPrice = normalizedItem.totalPrice / normalizedItem.quantity;
            }
            
            return normalizedItem;
        });
    }
    
    return normalized;
}

// Helper function to convert legacy pizza sizes
function convertPizzaSizeToId(sizeString) {
    const sizeMap = {
        'small': 1,
        'medium': 2,
        'large': 3,
        'extra-large': 4
    };
    return sizeMap[sizeString.toLowerCase()] || null;
}

// ============================================================================
// 4. CATEGORY-SPECIFIC VALIDATION
// ============================================================================

async function validateCategorySpecificRules(orderItem, connection) {
    // Get menu item details to determine category
    const [menuItem] = await connection.query(
        'SELECT mi.*, mc.name as category FROM menu_items mi JOIN menu_categories mc ON mi.category_id = mc.id WHERE mi.id = ?',
        [orderItem.menuItemId]
    );
    
    if (!menuItem) {
        throw new Error(`Menu item ${orderItem.menuItemId} not found`);
    }
    
    switch (menuItem.category) {
        case 'pizza':
            return validatePizzaRules(orderItem, menuItem);
        case 'subs':
            return validateSubRules(orderItem, menuItem);
        case 'wings':
            return validateWingsRules(orderItem, menuItem);
        case 'dinner_combos':
            return validateDinnerComboRules(orderItem, menuItem, connection);
        default:
            return true;
    }
}

function validatePizzaRules(orderItem, menuItem) {
    // Pizza-specific validations
    if (orderItem.isHalfHalf && !menuItem.allows_half_half) {
        throw new Error(`${menuItem.name} does not support half-and-half toppings`);
    }
    
    // Validate pizza customizations use pizzaHalf correctly
    if (orderItem.customizations) {
        const hasHalfToppings = orderItem.customizations.some(c => c.pizzaHalf !== 'whole');
        if (hasHalfToppings && !orderItem.isHalfHalf) {
            throw new Error('Half toppings require isHalfHalf to be true');
        }
    }
    
    return true;
}

function validateSubRules(orderItem, menuItem) {
    // Sub-specific validations
    if (orderItem.isHalfHalf) {
        throw new Error('Subs do not support half-and-half customizations');
    }
    
    return true;
}

function validateWingsRules(orderItem, menuItem) {
    // Wings-specific validations
    if (!orderItem.sizeId) {
        throw new Error('Wings require a size selection (10, 20, 50 wings)');
    }
    
    return true;
}

async function validateDinnerComboRules(orderItem, menuItem, connection) {
    // Get sides customization group for this dinner combo
    const [sidesGroup] = await connection.query(
        'SELECT max_selections FROM customization_groups WHERE menu_item_id = ? AND group_type = "sides"',
        [orderItem.menuItemId]
    );
    
    if (sidesGroup) {
        const selectedSides = orderItem.customizations.filter(c => 
            // Check if customization is a side (you'd need to join with customization_options)
            true // Simplified for example
        );
        
        if (selectedSides.length !== sidesGroup.max_selections) {
            throw new Error(`Must select exactly ${sidesGroup.max_selections} sides`);
        }
    }
    
    return true;
}

// ============================================================================
// 5. UPDATED CHECKOUT ENDPOINT
// ============================================================================

app.post('/api/checkout', validateAndNormalizeOrder, async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { customerInfo, orderItems, orderTotal } = req.validatedOrder;
        
        // Insert order
        const [orderResult] = await connection.query(`
            INSERT INTO orders (
                customer_name, customer_phone, customer_email,
                order_total, tax_amount, delivery_fee, order_type,
                customer_address, special_instructions, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
        `, [
            customerInfo.name,
            customerInfo.phone,
            customerInfo.email,
            orderTotal.total,
            orderTotal.tax,
            orderTotal.deliveryFee,
            customerInfo.orderType,
            customerInfo.address,
            customerInfo.specialInstructions
        ]);
        
        const orderId = orderResult.insertId;
        
        // Insert order items with category-specific validation
        for (const item of orderItems) {
            // Validate category-specific rules
            await validateCategorySpecificRules(item, connection);
            
            const [itemResult] = await connection.query(`
                INSERT INTO order_items (
                    order_id, menu_item_id, size_id, quantity,
                    unit_price, total_price, is_half_half, special_instructions
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                orderId, item.menuItemId, item.sizeId, item.quantity,
                item.unitPrice, item.totalPrice, item.isHalfHalf, item.specialInstructions
            ]);
            
            const orderItemId = itemResult.insertId;
            
            // Insert customizations
            for (const customization of item.customizations || []) {
                await connection.query(`
                    INSERT INTO order_item_customizations (
                        order_item_id, customization_option_id,
                        pizza_half, quantity, price_modifier
                    ) VALUES (?, ?, ?, ?, ?)
                `, [
                    orderItemId, customization.optionId,
                    customization.pizzaHalf, customization.quantity, customization.priceModifier
                ]);
            }
        }
        
        await connection.commit();
        
        res.json({
            success: true,
            orderId: orderId,
            message: 'Order saved successfully'
        });
        
    } catch (error) {
        await connection.rollback();
        console.error('Checkout error:', error);
        
        res.status(500).json({
            error: 'Failed to save order',
            details: error.message
        });
    } finally {
        connection.release();
    }
});

// ============================================================================
// 6. TESTING THE NEW VALIDATION
// ============================================================================

// Test data that should work with new validation
const testMixedOrder = {
    customerInfo: {
        name: "John Doe",
        phone: "555-1234",
        orderType: "pickup"
    },
    orderItems: [
        {
            // Pizza item (legacy structure support)
            menuItemId: 1,
            quantity: 1,
            unitPrice: 15.99,
            totalPrice: 18.99,
            isHalfHalf: true,
            customizations: [
                { optionId: 1, pizzaHalf: 'left', quantity: 1, priceModifier: 1.50 },
                { optionId: 2, pizzaHalf: 'right', quantity: 1, priceModifier: 1.50 }
            ]
        },
        {
            // Sub item (new structure)
            menuItemId: 5,
            sizeId: 2,
            quantity: 1,
            unitPrice: 9.99,
            totalPrice: 12.49,
            customizations: [
                { optionId: 15, quantity: 1, priceModifier: 0 }, // Mayo
                { optionId: 16, quantity: 1, priceModifier: 2.50 } // Extra Salami
            ]
        }
    ],
    orderTotal: {
        subtotal: 28.98,
        tax: 2.32,
        total: 31.30
    }
};

module.exports = {
    validateAndNormalizeOrder,
    orderSchema,
    testMixedOrder
};